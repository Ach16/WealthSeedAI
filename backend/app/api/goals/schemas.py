from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from enum import Enum

class GoalType(str, Enum):
    EMERGENCY_FUND = "Emergency Fund"
    RETIREMENT = "Retirement"
    HOUSE_PURCHASE = "House Purchase"
    EDUCATION = "Education"
    WEALTH_GROWTH = "Wealth Growth"
    VACATION = "Vacation"
    VEHICLE_PURCHASE = "Vehicle Purchase"

class PriorityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class StatusValue(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    PAUSED = "Paused"

class GoalBase(BaseModel):
    title: str = Field(..., min_length=1)
    goal_type: GoalType
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0.0, ge=0)
    target_date: date
    priority: PriorityLevel = PriorityLevel.MEDIUM
    status: StatusValue = StatusValue.NOT_STARTED
    notes: Optional[str] = None
    is_archived: bool = False
    category_icon: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    goal_type: Optional[GoalType] = None
    target_amount: Optional[float] = Field(None, gt=0)
    current_amount: Optional[float] = Field(None, ge=0)
    target_date: Optional[date] = None
    priority: Optional[PriorityLevel] = None
    status: Optional[StatusValue] = None
    notes: Optional[str] = None
    is_archived: Optional[bool] = None
    category_icon: Optional[str] = None

class GoalResponse(GoalBase):
    id: str
    user_id: str
    progress_percentage: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GoalsSummary(BaseModel):
    total_goals: int
    completed_goals: int
    in_progress_goals: int
    average_progress: float
    upcoming_deadline: Optional[date] = None
