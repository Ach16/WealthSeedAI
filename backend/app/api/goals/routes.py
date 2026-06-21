from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timezone

from app.core.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.api.auth.routes import get_current_user
from app.api.goals.schemas import GoalCreate, GoalUpdate, GoalResponse, GoalsSummary, StatusValue

router = APIRouter()

@router.get("/summary", response_model=GoalsSummary)
def get_goals_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id, Goal.is_archived == False).all()
    
    total_goals = len(goals)
    completed_goals = sum(1 for g in goals if g.status == StatusValue.COMPLETED)
    in_progress_goals = sum(1 for g in goals if g.status == StatusValue.IN_PROGRESS)
    
    total_progress = sum(g.progress_percentage for g in goals)
    average_progress = total_progress / total_goals if total_goals > 0 else 0.0
    
    # Upcoming deadline
    upcoming_goals = [g for g in goals if g.status != StatusValue.COMPLETED and g.target_date >= datetime.now(timezone.utc).date()]
    upcoming_goals.sort(key=lambda g: g.target_date)
    upcoming_deadline = upcoming_goals[0].target_date if upcoming_goals else None
    
    return GoalsSummary(
        total_goals=total_goals,
        completed_goals=completed_goals,
        in_progress_goals=in_progress_goals,
        average_progress=round(average_progress, 1),
        upcoming_deadline=upcoming_deadline
    )

@router.get("", response_model=List[GoalResponse])
def get_goals(
    limit: int = 100,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id, Goal.is_archived == False).order_by(Goal.created_at.desc()).limit(limit).all()
    return goals

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_goal = Goal(
        **goal_in.model_dump(),
        user_id=current_user.id
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: str,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
        
    goal.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    db.delete(goal)
    db.commit()
    return None
