from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User, UserProfile
from app.models.learning import LearningModule, Quiz, UserLearningProgress
from app.api.auth.routes import get_current_user
from app.api.learning.schemas import (
    LearningModuleResponse, UserLearningProgressResponse, 
    QuizSubmissionRequest, QuizSubmissionResponse, 
    ModuleCompleteRequest, LiteracyScoreResponse
)
from app.api.learning.service import (
    calculate_literacy_score, complete_module, submit_quiz, get_recommendation
)

router = APIRouter()

@router.get("/modules", response_model=List[LearningModuleResponse])
def get_all_modules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(LearningModule).order_by(LearningModule.order_index).all()

@router.get("/modules/{module_id}", response_model=LearningModuleResponse)
def get_single_module(
    module_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    module = db.query(LearningModule).filter(LearningModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.post("/modules/{module_id}/complete", response_model=UserLearningProgressResponse)
def mark_module_complete(
    module_id: str,
    request: ModuleCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return complete_module(db, current_user.id, module_id, request)

@router.post("/quizzes/{quiz_id}/submit", response_model=QuizSubmissionResponse)
def submit_quiz_endpoint(
    quiz_id: str,
    request: QuizSubmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return submit_quiz(db, current_user.id, quiz_id, request)

@router.get("/progress", response_model=List[UserLearningProgressResponse])
def get_user_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(UserLearningProgress).filter(UserLearningProgress.user_id == current_user.id).all()

@router.get("/literacy-score", response_model=LiteracyScoreResponse)
def get_literacy_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = calculate_literacy_score(db, current_user.id)
    progress = db.query(UserLearningProgress).filter(UserLearningProgress.user_id == current_user.id).all()
    
    total_completed = sum(1 for p in progress if p.completed)
    total_passed = sum(1 for p in progress if p.score > 0)
    
    return LiteracyScoreResponse(
        score=profile.literacy_score if profile else 0,
        level=profile.literacy_level if profile else "Beginner",
        total_modules_completed=total_completed,
        total_quizzes_passed=total_passed
    )

@router.get("/recommendation", response_model=LearningModuleResponse)
def get_recommended_module(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_recommendation(db, current_user.id)
