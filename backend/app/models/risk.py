from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    # Raw Answers
    investment_horizon = Column(String, nullable=False)
    risk_tolerance = Column(String, nullable=False)
    income_stability = Column(String, nullable=False)
    emergency_fund = Column(String, nullable=False)
    market_experience = Column(String, nullable=False)
    
    # Scoring and Results
    score = Column(Integer, nullable=False)
    risk_profile = Column(String, nullable=False)
    risk_explanation = Column(Text, nullable=True)
    
    # Metadata
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="risk_assessment")
