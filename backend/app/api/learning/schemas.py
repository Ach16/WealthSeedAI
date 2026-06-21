from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class QuizQuestionResponse(BaseModel):
    id: str
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True

class QuizResponse(BaseModel):
    id: str
    title: str
    questions: List[QuizQuestionResponse]

    class Config:
        from_attributes = True

class LearningModuleResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    estimated_minutes: int
    content: str
    order_index: int
    is_featured: bool
    quiz: Optional[QuizResponse] = None

    class Config:
        from_attributes = True

class UserLearningProgressResponse(BaseModel):
    id: str
    module_id: str
    completed: bool
    score: int
    attempts: int
    last_accessed_at: datetime
    time_spent_minutes: int
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuizSubmissionRequest(BaseModel):
    answers: Dict[str, str] # question_id -> selected_option ('A', 'B', 'C', 'D')
    time_spent_minutes: int = 0

class QuestionResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str

class QuizSubmissionResponse(BaseModel):
    score: int
    max_score: int
    passed: bool
    results: Dict[str, QuestionResult]

class ModuleCompleteRequest(BaseModel):
    time_spent_minutes: int = 0

class LiteracyScoreResponse(BaseModel):
    score: int
    level: str
    total_modules_completed: int
    total_quizzes_passed: int
