from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class InvestmentHorizon(str, Enum):
    LESS_THAN_1_YEAR = "Less than 1 year"
    YEARS_1_3 = "1-3 years"
    YEARS_3_7 = "3-7 years"
    YEARS_7_15 = "7-15 years"
    YEARS_15_PLUS = "15+ years"

class RiskTolerance(str, Enum):
    AVOID_LOSSES = "Avoid losses completely"
    SMALL_LOSSES = "Small losses acceptable"
    MODERATE_FLUCTUATIONS = "Moderate fluctuations acceptable"
    LARGE_FLUCTUATIONS = "Large fluctuations acceptable"
    HIGH_RISK = "High risk for high returns"

class IncomeStability(str, Enum):
    VERY_UNSTABLE = "Very unstable"
    SOMEWHAT_UNSTABLE = "Somewhat unstable"
    AVERAGE = "Average"
    STABLE = "Stable"
    VERY_STABLE = "Very stable"

class EmergencyFund(str, Enum):
    NONE = "None"
    LESS_THAN_3_MONTHS = "Less than 3 months"
    MONTHS_3_6 = "3-6 months"
    MONTHS_6_12 = "6-12 months"
    MORE_THAN_12_MONTHS = "More than 12 months"

class MarketExperience(str, Enum):
    NO_EXPERIENCE = "No experience"
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    PROFESSIONAL = "Professional"

class RiskAssessmentCreate(BaseModel):
    investment_horizon: InvestmentHorizon
    risk_tolerance: RiskTolerance
    income_stability: IncomeStability
    emergency_fund: EmergencyFund
    market_experience: MarketExperience

class RiskAssessmentResponse(RiskAssessmentCreate):
    id: str
    user_id: str
    score: int
    risk_profile: str
    risk_explanation: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RiskProfileResponse(BaseModel):
    score: int
    risk_profile: str
    risk_explanation: Optional[str] = None
    last_updated: Optional[datetime] = None
