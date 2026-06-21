from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False) # Beginner, Intermediate, Advanced
    estimated_minutes = Column(Integer, default=5)
    content = Column(Text, nullable=False)
    
    order_index = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    quiz = relationship("Quiz", back_populates="module", uselist=False, cascade="all, delete-orphan")
    progress = relationship("UserLearningProgress", back_populates="module", cascade="all, delete-orphan")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    module_id = Column(String, ForeignKey("learning_modules.id"), unique=True, nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    module = relationship("LearningModule", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    quiz_id = Column(String, ForeignKey("quizzes.id"), nullable=False)
    question = Column(String, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False) # 'A', 'B', 'C', or 'D'
    explanation = Column(Text, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")

class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    module_id = Column(String, ForeignKey("learning_modules.id"), nullable=False, index=True)
    
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    
    last_accessed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    time_spent_minutes = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)

    module = relationship("LearningModule", back_populates="progress")
