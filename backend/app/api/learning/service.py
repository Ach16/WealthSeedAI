from sqlalchemy.orm import Session
from datetime import datetime, timezone
from fastapi import HTTPException
from app.models.learning import LearningModule, Quiz, QuizQuestion, UserLearningProgress
from app.models.user import UserProfile
from app.api.learning.schemas import QuizSubmissionRequest, QuizSubmissionResponse, QuestionResult, ModuleCompleteRequest, LiteracyScoreResponse

def calculate_literacy_score(db: Session, user_id: str) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        return None

    progress_records = db.query(UserLearningProgress).filter(UserLearningProgress.user_id == user_id).all()
    
    # Simple scoring: 10 points per completed module, plus accumulated quiz scores
    score = 0
    modules_completed = 0
    quizzes_passed = 0

    for p in progress_records:
        if p.completed:
            score += 10
            modules_completed += 1
        score += p.score # Assuming quiz scores are out of 10
        if p.score > 0:
            quizzes_passed += 1
            
    # Cap at 100
    score = min(score, 100)
    
    # Assign Level
    if score <= 30:
        level = "Beginner"
    elif score <= 70:
        level = "Intermediate"
    else:
        level = "Advanced"

    profile.literacy_score = score
    profile.literacy_level = level
    db.commit()
    db.refresh(profile)
    return profile

def get_recommendation(db: Session, user_id: str) -> LearningModule:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    score = profile.literacy_score if profile else 0
    
    target_title = "Investing Basics"
    if score < 30:
        target_title = "Investing Basics"
    elif score < 50:
        target_title = "ETFs Explained"
    else:
        target_title = "Building Wealth"
        
    module = db.query(LearningModule).filter(LearningModule.title == target_title).first()
    if not module:
        module = db.query(LearningModule).order_by(LearningModule.order_index).first()
    return module

def complete_module(db: Session, user_id: str, module_id: str, req: ModuleCompleteRequest):
    module = db.query(LearningModule).filter(LearningModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    progress = db.query(UserLearningProgress).filter(
        UserLearningProgress.user_id == user_id, 
        UserLearningProgress.module_id == module_id
    ).first()

    if not progress:
        progress = UserLearningProgress(
            user_id=user_id,
            module_id=module_id,
            completed=True,
            time_spent_minutes=req.time_spent_minutes,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(progress)
    else:
        progress.completed = True
        progress.time_spent_minutes += req.time_spent_minutes
        progress.last_accessed_at = datetime.now(timezone.utc)
        if not progress.completed_at:
            progress.completed_at = datetime.now(timezone.utc)
            
    db.commit()
    calculate_literacy_score(db, user_id)
    return progress

def submit_quiz(db: Session, user_id: str, quiz_id: str, req: QuizSubmissionRequest):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    
    correct_count = 0
    results = {}
    
    for q in questions:
        user_answer = req.answers.get(q.id)
        is_correct = (user_answer == q.correct_answer)
        if is_correct:
            correct_count += 1
            
        results[q.id] = QuestionResult(
            is_correct=is_correct,
            correct_answer=q.correct_answer,
            explanation=q.explanation
        )

    # Calculate points (e.g., 5 points per question)
    points_earned = correct_count * 5
    max_points = len(questions) * 5
    passed = correct_count == len(questions) # All correct to pass

    # Update progress
    progress = db.query(UserLearningProgress).filter(
        UserLearningProgress.user_id == user_id, 
        UserLearningProgress.module_id == quiz.module_id
    ).first()

    if not progress:
        progress = UserLearningProgress(
            user_id=user_id,
            module_id=quiz.module_id,
            attempts=1,
            score=points_earned,
            time_spent_minutes=req.time_spent_minutes
        )
        db.add(progress)
    else:
        progress.attempts += 1
        progress.time_spent_minutes += req.time_spent_minutes
        progress.last_accessed_at = datetime.now(timezone.utc)
        # Keep highest score
        if points_earned > progress.score:
            progress.score = points_earned

    db.commit()
    calculate_literacy_score(db, user_id)

    return QuizSubmissionResponse(
        score=points_earned,
        max_score=max_points,
        passed=passed,
        results=results
    )
