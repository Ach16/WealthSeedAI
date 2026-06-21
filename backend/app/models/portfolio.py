from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    name = Column(String, default="Virtual Portfolio")
    
    starting_balance = Column(Float, default=100000.0)
    cash_balance = Column(Float, default=100000.0)
    total_value = Column(Float, default=100000.0)
    
    portfolio_return = Column(Float, default=0.0)
    portfolio_return_percentage = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="portfolio")
    holdings = relationship("Holding", back_populates="portfolio", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="portfolio", cascade="all, delete-orphan")
    metrics = relationship("PortfolioMetrics", back_populates="portfolio", uselist=False, cascade="all, delete-orphan")
    daily_history = relationship("DailyPortfolioHistory", back_populates="portfolio", cascade="all, delete-orphan")

class Holding(Base):
    __tablename__ = "holdings"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False, index=True)
    
    symbol = Column(String, nullable=False, index=True)
    asset_name = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)
    
    quantity = Column(Float, nullable=False)
    average_cost = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    market_value = Column(Float, nullable=False)
    allocation_percentage = Column(Float, nullable=False, default=0.0)
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    portfolio = relationship("Portfolio", back_populates="holdings")
    transactions = relationship("Transaction", back_populates="holding")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False, index=True)
    holding_id = Column(String, ForeignKey("holdings.id"), nullable=True)
    
    transaction_type = Column(String, nullable=False) # BUY, SELL, DEPOSIT, WITHDRAW
    status = Column(String, default="COMPLETED") # COMPLETED, CANCELLED
    
    symbol = Column(String, nullable=True)
    quantity = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    portfolio = relationship("Portfolio", back_populates="transactions")
    holding = relationship("Holding", back_populates="transactions")

class PortfolioMetrics(Base):
    __tablename__ = "portfolio_metrics"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), unique=True, nullable=False, index=True)
    
    health_score = Column(Integer, default=0)
    risk_score = Column(Integer, default=0)
    diversification_score = Column(Integer, default=0)
    goal_alignment_score = Column(Integer, default=0)
    
    sector_concentration = Column(String, nullable=True) # e.g. "Technology"
    largest_holding_percent = Column(Float, default=0.0)
    asset_allocation_json = Column(Text, nullable=True) # JSON string

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    portfolio = relationship("Portfolio", back_populates="metrics")

class DailyPortfolioHistory(Base):
    __tablename__ = "daily_portfolio_history"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    portfolio_id = Column(String, ForeignKey("portfolios.id"), nullable=False, index=True)
    
    date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    total_value = Column(Float, nullable=False)

    portfolio = relationship("Portfolio", back_populates="daily_history")
