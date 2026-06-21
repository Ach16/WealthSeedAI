from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=18)
    country: Optional[str] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = Field(None, ge=0.0)
    investment_experience: Optional[str] = None
    financial_goal: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    literacy_score: float
    risk_profile: str
    virtual_balance: float
    full_name: Optional[str] = None
    age: Optional[int] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    annual_income: Optional[float] = None
    investment_experience: Optional[str] = None
    financial_goal: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True
