from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.api.auth.routes import get_current_user
from app.api.risk.schemas import RiskAssessmentCreate, RiskAssessmentResponse, RiskProfileResponse
from app.api.risk.service import save_assessment, get_assessment

router = APIRouter()

@router.post("/assessment", response_model=RiskAssessmentResponse)
def submit_risk_assessment(
    assessment_in: RiskAssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return save_assessment(db, current_user.id, assessment_in)

@router.get("/assessment", response_model=RiskAssessmentResponse)
def get_risk_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = get_assessment(db, current_user.id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return assessment

@router.get("/profile", response_model=RiskProfileResponse)
def get_risk_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = get_assessment(db, current_user.id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    return RiskProfileResponse(
        score=assessment.score,
        risk_profile=assessment.risk_profile,
        risk_explanation=assessment.risk_explanation,
        last_updated=assessment.updated_at
    )
