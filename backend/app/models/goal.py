from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    goal_type = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    target_date = Column(Date, nullable=False)
    priority = Column(String, nullable=False, default="Medium")
    status = Column(String, nullable=False, default="Not Started")
    notes = Column(String, nullable=True)
    is_archived = Column(Boolean, default=False)
    category_icon = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="goals")

    @property
    def progress_percentage(self) -> float:
        if self.target_amount <= 0:
            return 0.0
        val = (self.current_amount / self.target_amount) * 100
        return max(0.0, min(100.0, val))
