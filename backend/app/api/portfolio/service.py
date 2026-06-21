from sqlalchemy.orm import Session
from datetime import datetime, timezone
import json
from fastapi import HTTPException
from app.models.portfolio import Portfolio, Holding, Transaction, PortfolioMetrics, DailyPortfolioHistory
from app.api.portfolio.schemas import BuyAssetRequest, SellAssetRequest, TransactionType, TransactionStatus, SimulationRequest, SimulationResponse, UpdateBalanceRequest
from app.models.risk import RiskAssessment
import logging

logger = logging.getLogger(__name__)
from langchain_core.messages import SystemMessage, HumanMessage
from app.ai.llm_provider import llm_provider

# ==========================================
# FUTURE-PROOF PRICING ARCHITECTURE
# Phase 3 AI/External Data integration point
# ==========================================
def fetch_live_market_price(symbol: str) -> float | None:
    """
    STUB: This function is structured to seamlessly plug into external
    market data providers (Yahoo Finance, Polygon, Alpha Vantage) in Phase 3
    without breaking any API contracts below.
    Returns None if offline or unsupported.
    """
    return None

def get_current_price(symbol: str, fallback_price: float) -> float:
    """Gets the live price if available, otherwise uses the fallback."""
    live_price = fetch_live_market_price(symbol)
    return live_price if live_price is not None else fallback_price

# ==========================================
# PORTFOLIO LOGIC
# ==========================================

def create_default_portfolio(db: Session, user_id: str) -> Portfolio:
    """Creates a default virtual portfolio with 100k cash."""
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = Portfolio(
            user_id=user_id,
            name="Virtual Portfolio",
            starting_balance=100000.0,
            cash_balance=100000.0,
            total_value=100000.0,
            portfolio_return=0.0,
            portfolio_return_percentage=0.0
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    return portfolio

def get_portfolio(db: Session, user_id: str) -> Portfolio:
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    if not portfolio:
        portfolio = create_default_portfolio(db, user_id)
    return portfolio

def recalculate_portfolio(db: Session, portfolio_id: str):
    """
    Recalculates current prices, market values, allocations, and total portfolio return.
    Also updates mathematical metrics and daily history.
    Called after every transaction.
    """
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        return

    holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
    
    invested_value = 0.0
    
    # First pass: update market values
    for holding in holdings:
        holding.current_price = get_current_price(holding.symbol, holding.average_cost)
        holding.market_value = holding.quantity * holding.current_price
        invested_value += holding.market_value
        
    portfolio.total_value = portfolio.cash_balance + invested_value
    portfolio.portfolio_return = portfolio.total_value - portfolio.starting_balance
    portfolio.portfolio_return_percentage = (portfolio.portfolio_return / portfolio.starting_balance) * 100 if portfolio.starting_balance > 0 else 0
    
    # Second pass: update allocations
    for holding in holdings:
        holding.allocation_percentage = (holding.market_value / portfolio.total_value) * 100 if portfolio.total_value > 0 else 0
        
    # Metrics Calculation
    metrics = db.query(PortfolioMetrics).filter(PortfolioMetrics.portfolio_id == portfolio_id).first()
    if not metrics:
        metrics = PortfolioMetrics(portfolio_id=portfolio_id)
        db.add(metrics)
        
    if invested_value == 0:
        metrics.health_score = 100
        metrics.risk_score = 0
        metrics.diversification_score = 0
        metrics.goal_alignment_score = 0
        metrics.largest_holding_percent = 0
        metrics.sector_concentration = "Cash"
        metrics.asset_allocation_json = json.dumps({"Cash": 100})
    else:
        # Largest holding
        largest_holding = max(holdings, key=lambda h: h.market_value) if holdings else None
        largest_pct = (largest_holding.market_value / portfolio.total_value) * 100 if largest_holding else 0
        metrics.largest_holding_percent = largest_pct
        
        # Asset allocation (simple count by type for now)
        allocations = {"Cash": (portfolio.cash_balance / portfolio.total_value) * 100}
        for h in holdings:
            atype = h.asset_type
            allocations[atype] = allocations.get(atype, 0) + ((h.market_value / portfolio.total_value) * 100)
            
        metrics.asset_allocation_json = json.dumps(allocations)
        
        # Deterministic Diversification Score (100 - largest holding penalty)
        div_score = 100 - (largest_pct * 0.5)
        metrics.diversification_score = max(0, min(100, int(div_score)))
        
        # Risk score based on asset types
        risk_weights = {
            "Stock": 1.0,
            "ETF": 0.6,
            "Mutual Fund": 0.5,
            "Bond": 0.2,
            "Crypto": 2.0,
            "Cash": 0.0
        }
        risk_val = sum(allocations.get(atype, 0) * weight for atype, weight in risk_weights.items())
        metrics.risk_score = max(0, min(100, int(risk_val)))
        
        metrics.health_score = int((metrics.diversification_score + (100 - metrics.risk_score)) / 2)
        metrics.sector_concentration = largest_holding.symbol if largest_holding else "None"
        
        # Get risk profile to compute goal alignment
        risk_assessment = db.query(RiskAssessment).filter(RiskAssessment.user_id == portfolio.user_id).first()
        user_risk = risk_assessment.risk_profile if risk_assessment else "Moderate"
        
        if user_risk == "Conservative" and metrics.risk_score > 40:
            metrics.goal_alignment_score = max(0, 100 - (metrics.risk_score - 40))
        elif user_risk == "Aggressive" and metrics.risk_score < 60:
            metrics.goal_alignment_score = max(0, 100 - (60 - metrics.risk_score))
        else:
            metrics.goal_alignment_score = 100
        
    # Update daily history
    today = datetime.now(timezone.utc).date()
    # For a real system we'd check if today's entry exists. Let's just create one per recalculation for simplicity, 
    # or better: update the current day's record if it exists.
    history_entry = db.query(DailyPortfolioHistory).filter(DailyPortfolioHistory.portfolio_id == portfolio_id).order_by(DailyPortfolioHistory.date.desc()).first()
    if history_entry and history_entry.date.date() == today:
        history_entry.total_value = portfolio.total_value
    else:
        new_history = DailyPortfolioHistory(portfolio_id=portfolio_id, total_value=portfolio.total_value)
        db.add(new_history)

    db.commit()
    db.refresh(portfolio)
    return portfolio

def buy_asset(db: Session, user_id: str, request: BuyAssetRequest):
    portfolio = get_portfolio(db, user_id)
    
    total_cost = request.quantity * request.price
    if portfolio.cash_balance < total_cost:
        logger.warning(f"User {user_id} attempted to buy {request.quantity} of {request.symbol} but had insufficient balance ({portfolio.cash_balance} < {total_cost})")
        raise HTTPException(status_code=400, detail="Insufficient cash balance")
        
    holding = db.query(Holding).filter(Holding.portfolio_id == portfolio.id, Holding.symbol == request.symbol).first()
    
    if holding:
        old_total_cost = holding.quantity * holding.average_cost
        new_total_cost = old_total_cost + total_cost
        new_quantity = holding.quantity + request.quantity
        
        holding.average_cost = new_total_cost / new_quantity
        holding.quantity = new_quantity
        holding.current_price = request.price
        if request.notes:
            holding.notes = request.notes
    else:
        holding = Holding(
            portfolio_id=portfolio.id,
            symbol=request.symbol,
            asset_name=request.asset_name,
            asset_type=request.asset_type.value,
            quantity=request.quantity,
            average_cost=request.price,
            current_price=request.price,
            market_value=total_cost,
            allocation_percentage=0.0,
            notes=request.notes
        )
        db.add(holding)
        db.flush()
        
    portfolio.cash_balance -= total_cost
    
    transaction = Transaction(
        portfolio_id=portfolio.id,
        holding_id=holding.id,
        transaction_type=TransactionType.BUY.value,
        status=TransactionStatus.COMPLETED.value,
        symbol=request.symbol,
        quantity=request.quantity,
        price=request.price,
        amount=total_cost,
        notes=request.notes
    )
    db.add(transaction)
    db.commit()
    
    logger.info(f"User {user_id} successfully bought {request.quantity} {request.symbol} for a total of {total_cost}.")
    
    recalculate_portfolio(db, portfolio.id)
    db.refresh(holding)
    return holding

def sell_asset(db: Session, user_id: str, request: SellAssetRequest):
    portfolio = get_portfolio(db, user_id)
    
    holding = db.query(Holding).filter(Holding.id == request.holding_id, Holding.portfolio_id == portfolio.id).first()
    if not holding:
        logger.warning(f"User {user_id} attempted to sell a holding that doesn't exist: {request.holding_id}")
        raise HTTPException(status_code=404, detail="Holding not found")
        
    if holding.quantity < request.quantity:
        logger.warning(f"User {user_id} attempted to sell {request.quantity} of {holding.symbol} but only owns {holding.quantity}")
        raise HTTPException(status_code=400, detail="Cannot sell more than you own")
        
    total_proceeds = request.quantity * request.price
    
    holding.quantity -= request.quantity
    holding.current_price = request.price
    
    portfolio.cash_balance += total_proceeds
    
    transaction = Transaction(
        portfolio_id=portfolio.id,
        holding_id=holding.id if holding.quantity > 0 else None,
        transaction_type=TransactionType.SELL.value,
        status=TransactionStatus.COMPLETED.value,
        symbol=holding.symbol,
        quantity=request.quantity,
        price=request.price,
        amount=total_proceeds,
        notes=request.notes
    )
    db.add(transaction)
    
    if holding.quantity <= 0:
        db.delete(holding)
        
    db.commit()
    
    logger.info(f"User {user_id} successfully sold {request.quantity} {holding.symbol} for {total_proceeds}.")
    
    recalculate_portfolio(db, portfolio.id)
    
    if holding.quantity > 0:
        db.refresh(holding)
        return holding
    return None

def get_portfolio_health(db: Session, user_id: str):
    portfolio = get_portfolio(db, user_id)
    metrics = db.query(PortfolioMetrics).filter(PortfolioMetrics.portfolio_id == portfolio.id).first()
    if not metrics:
        # Recalculate to generate metrics if missing
        recalculate_portfolio(db, portfolio.id)
        metrics = db.query(PortfolioMetrics).filter(PortfolioMetrics.portfolio_id == portfolio.id).first()
        
    return metrics

def update_balance(db: Session, user_id: str, request: UpdateBalanceRequest):
    portfolio = get_portfolio(db, user_id)
    
    # Calculate currently invested amount
    holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio.id).all()
    invested_value = sum(h.market_value for h in holdings)
    
    if request.new_balance < invested_value:
        logger.warning(f"User {user_id} attempted to set balance to {request.new_balance} which is below invested value {invested_value}")
        raise HTTPException(status_code=400, detail="New balance cannot be less than current invested amount.")
        
    portfolio.starting_balance = request.new_balance
    portfolio.cash_balance = request.new_balance - invested_value
    
    db.commit()
    logger.info(f"User {user_id} updated virtual balance to {request.new_balance}. Cash remaining: {portfolio.cash_balance}")
    recalculate_portfolio(db, portfolio.id)
    db.refresh(portfolio)
    return portfolio

def simulate_transaction(db: Session, user_id: str, request: SimulationRequest) -> SimulationResponse:
    portfolio = get_portfolio(db, user_id)
    risk_assessment = db.query(RiskAssessment).filter(RiskAssessment.user_id == user_id).first()
    user_risk = risk_assessment.risk_profile if risk_assessment else "Moderate"
    
    # We could do a full mathematical simulation by creating a mock portfolio state, 
    # but since this is an educational insight, we can estimate the impact or rely on the LLM
    # coupled with some basic heuristic risk scores.
    
    risk_score = 50
    diversification_score = 50
    
    if request.asset_type.value == "Crypto":
        risk_score = 90
        diversification_score = 20
    elif request.asset_type.value == "Stock":
        risk_score = 70
        diversification_score = 40
    elif request.asset_type.value == "ETF" or request.asset_type.value == "Mutual Fund":
        risk_score = 40
        diversification_score = 80
        
    sys_prompt = f"""You are WealthSeed AI, acting as a SimulationAgent.
The user is simulating a {request.transaction_type.value} transaction for {request.quantity} shares of {request.asset_name} ({request.symbol}) at ${request.price}.
Their risk profile is {user_risk}.
The estimated new risk score is {risk_score} and diversification score is {diversification_score}.

Provide a brief, 1-2 sentence "Educational Insight" explaining how this specific transaction impacts concentration risk and whether it aligns with their profile.
Do not provide financial advice. Focus on risk and diversification concepts."""

    messages = [
        SystemMessage(content=sys_prompt),
        HumanMessage(content=f"I want to {request.transaction_type.value} {request.symbol}.")
    ]
    
    insight_msg = "This transaction alters your portfolio composition. Consider how it impacts your overall risk."
    try:
        response = llm_provider.generate_response(system_prompt=sys_prompt, user_prompt=f"I want to {request.transaction_type.value} {request.symbol}.")
        insight_msg = response.get("answer", insight_msg)
    except Exception as e:
        logger.error(f"Simulation Agent error: {e}")
        
    return SimulationResponse(
        risk_score=risk_score,
        diversification_score=diversification_score,
        message=insight_msg
    )
