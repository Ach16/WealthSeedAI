from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.portfolio import Holding, Transaction
from app.api.auth.routes import get_current_user
from app.api.portfolio.schemas import (
    BuyAssetRequest, SellAssetRequest, PortfolioResponse,
    HoldingResponse, TransactionResponse, PortfolioSummaryResponse,
    PortfolioHealthResponse, SimulationRequest, SimulationResponse,
    UpdateBalanceRequest
)
from app.api.portfolio.service import (
    get_portfolio, buy_asset, sell_asset, recalculate_portfolio,
    get_portfolio_health, simulate_transaction, update_balance
)

router = APIRouter()

@router.get("", response_model=PortfolioResponse)
def get_user_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure portfolio exists and is calculated
    portfolio = get_portfolio(db, current_user.id)
    recalculate_portfolio(db, portfolio.id)
    return portfolio

@router.get("/summary", response_model=PortfolioSummaryResponse)
def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = get_portfolio(db, current_user.id)
    recalculate_portfolio(db, portfolio.id)
    
    holdings_count = db.query(Holding).filter(Holding.portfolio_id == portfolio.id).count()
    invested_amount = portfolio.total_value - portfolio.cash_balance
    
    return PortfolioSummaryResponse(
        portfolio_value=portfolio.total_value,
        cash_balance=portfolio.cash_balance,
        invested_amount=invested_amount,
        holdings_count=holdings_count,
        portfolio_return=portfolio.portfolio_return,
        portfolio_return_percentage=portfolio.portfolio_return_percentage
    )

@router.get("/holdings", response_model=List[HoldingResponse])
def get_portfolio_holdings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = get_portfolio(db, current_user.id)
    return db.query(Holding).filter(Holding.portfolio_id == portfolio.id).all()

@router.get("/holdings/{holding_id}", response_model=HoldingResponse)
def get_single_holding(
    holding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = get_portfolio(db, current_user.id)
    holding = db.query(Holding).filter(Holding.id == holding_id, Holding.portfolio_id == portfolio.id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    return holding

@router.get("/transactions", response_model=List[TransactionResponse])
def get_portfolio_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = get_portfolio(db, current_user.id)
    return db.query(Transaction).filter(Transaction.portfolio_id == portfolio.id).order_by(Transaction.created_at.desc()).all()

@router.post("/buy")
def buy_asset_endpoint(
    request: BuyAssetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return buy_asset(db, current_user.id, request)

@router.post("/sell")
def sell_asset_endpoint(
    request: SellAssetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return sell_asset(db, current_user.id, request)

@router.post("/balance", response_model=PortfolioResponse)
def update_balance_endpoint(
    request: UpdateBalanceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_balance(db, current_user.id, request)

@router.get("/health", response_model=PortfolioHealthResponse)
def get_health_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    metrics = get_portfolio_health(db, current_user.id)
    if not metrics:
        return PortfolioHealthResponse(
            health_score=0,
            risk_score=0,
            diversification_score=0,
            goal_alignment_score=0,
            largest_holding=None,
            largest_holding_percent=0.0
        )
    return PortfolioHealthResponse(
        health_score=metrics.health_score,
        risk_score=metrics.risk_score,
        diversification_score=metrics.diversification_score,
        goal_alignment_score=metrics.goal_alignment_score,
        largest_holding=metrics.sector_concentration if metrics.sector_concentration != "None" else None,
        largest_holding_percent=metrics.largest_holding_percent
    )

@router.post("/simulate", response_model=SimulationResponse)
def simulate_endpoint(
    request: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return simulate_transaction(db, current_user.id, request)
