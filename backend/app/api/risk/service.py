from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.risk import RiskAssessment
from app.models.user import UserProfile
from app.api.risk.schemas import RiskAssessmentCreate
from typing import Tuple, Optional

def get_points_for_horizon(value: str) -> int:
    mapping = {
        "Less than 1 year": 1,
        "1-3 years": 2,
        "3-7 years": 3,
        "7-15 years": 4,
        "15+ years": 5
    }
    return mapping.get(value, 3)

def get_points_for_tolerance(value: str) -> int:
    mapping = {
        "Avoid losses completely": 1,
        "Small losses acceptable": 2,
        "Moderate fluctuations acceptable": 3,
        "Large fluctuations acceptable": 4,
        "High risk for high returns": 5
    }
    return mapping.get(value, 3)

def get_points_for_income(value: str) -> int:
    mapping = {
        "Very unstable": 1,
        "Somewhat unstable": 2,
        "Average": 3,
        "Stable": 4,
        "Very stable": 5
    }
    return mapping.get(value, 3)

def get_points_for_emergency(value: str) -> int:
    mapping = {
        "None": 1,
        "Less than 3 months": 2,
        "3-6 months": 3,
        "6-12 months": 4,
        "More than 12 months": 5
    }
    return mapping.get(value, 3)

def get_points_for_experience(value: str) -> int:
    mapping = {
        "No experience": 1,
        "Beginner": 2,
        "Intermediate": 3,
        "Advanced": 4,
        "Professional": 5
    }
    return mapping.get(value, 3)

def calculate_risk_score(assessment: RiskAssessmentCreate, user_age: Optional[int]) -> int:
    score = 0
    score += get_points_for_horizon(assessment.investment_horizon.value)
    score += get_points_for_tolerance(assessment.risk_tolerance.value)
    score += get_points_for_income(assessment.income_stability.value)
    score += get_points_for_emergency(assessment.emergency_fund.value)
    score += get_points_for_experience(assessment.market_experience.value)
    
    # Age-aware scoring
    if user_age is not None:
        if 18 <= user_age <= 30:
            score += 2
        elif 31 <= user_age <= 45:
            score += 1
        elif 46 <= user_age <= 60:
            score += 0
        elif user_age > 60:
            score -= 1
            
    # Clamp score
    return max(1, min(30, score))

def determine_risk_profile(score: int) -> Tuple[str, str]:
    if score <= 11:
        profile = "Conservative"
        explanation = "You prioritize capital preservation and prefer stable investments."
    elif score <= 18:
        profile = "Moderate"
        explanation = "You seek a balance between growth and stability."
    else:
        profile = "Aggressive"
        explanation = "You are comfortable with volatility in pursuit of higher returns."
        
    return profile, explanation

def get_assessment(db: Session, user_id: str) -> Optional[RiskAssessment]:
    return db.query(RiskAssessment).filter(RiskAssessment.user_id == user_id).first()

def save_assessment(db: Session, user_id: str, assessment_in: RiskAssessmentCreate) -> RiskAssessment:
    # Get user profile to check age
    user_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    user_age = user_profile.age if user_profile else None
    
    # Calculate score and determine profile
    score = calculate_risk_score(assessment_in, user_age)
    profile, explanation = determine_risk_profile(score)
    
    # Check if assessment exists
    assessment = get_assessment(db, user_id)
    
    if assessment:
        # Update existing
        assessment.investment_horizon = assessment_in.investment_horizon.value
        assessment.risk_tolerance = assessment_in.risk_tolerance.value
        assessment.income_stability = assessment_in.income_stability.value
        assessment.emergency_fund = assessment_in.emergency_fund.value
        assessment.market_experience = assessment_in.market_experience.value
        assessment.score = score
        assessment.risk_profile = profile
        assessment.risk_explanation = explanation
        assessment.completed_at = datetime.now(timezone.utc)
    else:
        # Create new
        assessment = RiskAssessment(
            user_id=user_id,
            investment_horizon=assessment_in.investment_horizon.value,
            risk_tolerance=assessment_in.risk_tolerance.value,
            income_stability=assessment_in.income_stability.value,
            emergency_fund=assessment_in.emergency_fund.value,
            market_experience=assessment_in.market_experience.value,
            score=score,
            risk_profile=profile,
            risk_explanation=explanation,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(assessment)
        
    # Update User Profile
    if user_profile:
        user_profile.risk_profile = profile
        
    db.commit()
    db.refresh(assessment)
    return assessment
