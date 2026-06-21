from pydantic import BaseModel
from typing import List, Dict, Any

class ChatRequest(BaseModel):
    message: str

class MentorInsights(BaseModel):
    emotion: str
    emotion_confidence: float
    risk_score: int
    goal_alignment_score: int
    diversification_score: int
    goal_forecast: Dict[str, str]
    recommended_topics: List[str]

class ChatResponse(BaseModel):
    answer: str
    intent: str
    sources: List[str]
    risk_profile: str
    literacy_level: str
    goal_count: int
    provider: str
    insights: MentorInsights

class ProviderStatusResponse(BaseModel):
    primary: str
    fallback: str
    openrouter_available: bool
    grok_available: bool

class ReindexResponse(BaseModel):
    success: bool
    message: str
