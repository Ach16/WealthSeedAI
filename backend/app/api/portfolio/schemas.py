from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AssetType(str, Enum):
    STOCK = "Stock"
    ETF = "ETF"
    MUTUAL_FUND = "Mutual Fund"
    BOND = "Bond"
    CRYPTO = "Crypto"
    CASH = "Cash"

class TransactionType(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    DEPOSIT = "DEPOSIT"
    WITHDRAW = "WITHDRAW"

class TransactionStatus(str, Enum):
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class BuyAssetRequest(BaseModel):
    symbol: str = Field(..., min_length=1)
    asset_name: str = Field(..., min_length=1)
    asset_type: AssetType
    quantity: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    notes: Optional[str] = None

class SellAssetRequest(BaseModel):
    holding_id: str
    quantity: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    notes: Optional[str] = None

class PortfolioResponse(BaseModel):
    id: str
    user_id: str
    name: str
    starting_balance: float
    cash_balance: float
    total_value: float
    portfolio_return: float
    portfolio_return_percentage: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class HoldingResponse(BaseModel):
    id: str
    portfolio_id: str
    symbol: str
    asset_name: str
    asset_type: str
    quantity: float
    average_cost: float
    current_price: float
    market_value: float
    allocation_percentage: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TransactionResponse(BaseModel):
    id: str
    portfolio_id: str
    holding_id: Optional[str] = None
    transaction_type: str
    status: str
    symbol: Optional[str] = None
    quantity: Optional[float] = None
    price: Optional[float] = None
    amount: float
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PortfolioSummaryResponse(BaseModel):
    portfolio_value: float
    cash_balance: float
    invested_amount: float
    holdings_count: int
    portfolio_return: float
    portfolio_return_percentage: float

class PortfolioHealthResponse(BaseModel):
    health_score: int
    risk_score: int
    diversification_score: int
    goal_alignment_score: int
    largest_holding: Optional[str] = None
    largest_holding_percent: float

class SimulationRequest(BaseModel):
    symbol: str
    asset_name: str
    asset_type: AssetType
    quantity: float
    price: float
    transaction_type: TransactionType

class SimulationResponse(BaseModel):
    risk_score: int
    diversification_score: int
    message: str

class UpdateBalanceRequest(BaseModel):
    new_balance: float = Field(..., gt=0)
