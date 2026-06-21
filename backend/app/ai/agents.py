import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage
from typing_extensions import TypedDict
import json
from app.ai.llm_provider import llm_provider
from app.rag.retriever import retrieve_top_k

logger = logging.getLogger(__name__)

class MentorState(TypedDict):
    # Inputs
    user_id: str
    messages: List[BaseMessage]
    
    # User Profile
    user_profile: Dict[str, Any]
    goals: List[Dict[str, Any]]
    portfolio: Dict[str, Any]
    virtual_balance: float
    
    # Intent
    intent: str
    
    # Intermediate Outputs
    goal_analysis: str
    goal_forecast: Dict[str, str]
    portfolio_analysis: str
    diversification_score: int
    goal_alignment_score: int
    educational_recommendations: str
    recommended_topics: List[str]
    behavioral_analysis: str
    emotion: str
    emotion_confidence: float
    rag_context: str
    rag_sources: List[str]
    risk_score: int
    
    # Final Output
    final_response: str
    provider_used: str

class IntentSchema(BaseModel):
    intent: str = Field(description="Must be one of: education, decision, goal_planning, portfolio_analysis, risk_management, behavioral, market_event, general")

class BehavioralSchema(BaseModel):
    behavior: str = Field(description="One of: 'Fear', 'Greed', 'Panic', 'Overconfidence', or 'Neutral'")
    confidence: float = Field(description="Confidence in this classification, from 0.0 to 1.0")
    reasoning: str = Field(description="Explanation of why this behavior was detected.")

def _get_last_user_message(state: MentorState) -> str:
    for message in reversed(state.get("messages", [])):
        if isinstance(message, HumanMessage):
            return message.content
    return ""

def intent_classification_agent(state: MentorState) -> Dict[str, Any]:
    """Analyzes user query and classifies the intent."""
    user_message = _get_last_user_message(state)
    sys_msg = SystemMessage(content="""Classify the user's intent into one of the following:
- education (e.g. What is SIP?, Explain diversification)
- decision (e.g. Should I buy crypto?, Should I sell stocks?)
- goal_planning (e.g. How can I reach my home goal faster?)
- portfolio_analysis (e.g. Analyze my portfolio, Am I diversified?)
- risk_management (e.g. How do I reduce risk?)
- behavioral (e.g. I am scared, I missed out)
- market_event (e.g. Market crashed)
- general (anything else)
""")
    usr_msg = HumanMessage(content=user_message)
    
    try:
        result = llm_provider.invoke_structured([sys_msg, usr_msg], IntentSchema)
        if result and result.intent in ["education", "decision", "goal_planning", "portfolio_analysis", "risk_management", "behavioral", "market_event", "general"]:
            return {"intent": result.intent}
    except Exception as e:
        logger.error(f"Intent classification error: {e}")
        
    return {"intent": "general"}

def goal_intelligence_agent(state: MentorState) -> Dict[str, Any]:
    """Analyzes user goals and projects completion timelines."""
    goals = state.get("goals", [])
    if not goals:
        return {"goal_analysis": "No active goals to analyze.", "goal_forecast": {}}
    
    goal_text = ""
    goal_forecast = {}
    
    for g in goals:
        remaining = g["target"] - g["current"]
        if remaining <= 0:
            goal_text += f"- Goal '{g['title']}' is completed!\n"
            continue
            
        goal_text += f"Goal: {g['title']}\n"
        # Dynamic projection based on remaining amount
        # Options: 1% of remaining, 2% of remaining, 5% of remaining, rounded to nice numbers
        base_rate = max(500, int(remaining * 0.01 / 500) * 500)
        rates = [base_rate, base_rate * 2, base_rate * 5]
        
        # Ensure rates are somewhat sensible
        rates = [max(1000, r) for r in rates]
        
        for rate in rates:
            months = remaining / rate
            goal_text += f"  - At ${rate}/month: {months:.1f} months to completion.\n"
            
            # Save forecast for the first active goal for the insights API
            if not goal_forecast:
                goal_forecast[f"{rate}_per_month"] = f"{months:.1f} months"
                
    # Calculate a rough goal alignment score based on progress
    alignment_score = 0
    if goals:
        avg_progress = sum(g.get("progress", 0) for g in goals) / len(goals)
        alignment_score = int(min(100, max(0, avg_progress * 1.5))) # Arbitrary scaling for illustration

    return {
        "goal_analysis": goal_text,
        "goal_forecast": goal_forecast,
        "goal_alignment_score": alignment_score
    }

def portfolio_intelligence_agent(state: MentorState) -> Dict[str, Any]:
    """Analyzes portfolio allocation and risk."""
    portfolio = state.get("portfolio", {})
    if not portfolio or portfolio.get("value", 0) == 0:
        return {
            "portfolio_analysis": "Portfolio is empty or not yet funded.",
            "diversification_score": 0,
            "risk_score": 0
        }
        
    value = portfolio.get("value", 0)
    analysis = f"Current portfolio value is ${value:,.2f}."
    
    # Mocking scores for now
    div_score = 70
    risk_score = 40
    if state['user_profile'].get('risk_profile') == 'Aggressive':
        risk_score = 80
        
    return {
        "portfolio_analysis": analysis,
        "diversification_score": div_score,
        "risk_score": risk_score
    }

def educational_agent(state: MentorState) -> Dict[str, Any]:
    """Recommends educational content based on literacy score."""
    profile = state.get("user_profile", {})
    score = profile.get("literacy_score", 0)
    
    topics = []
    if score <= 25:
        topics = ["Investing Fundamentals", "SIP Basics", "Risk Management"]
    elif score <= 50:
        topics = ["Portfolio Construction", "ETFs", "Asset Allocation"]
    elif score <= 75:
        topics = ["Valuation Metrics", "Advanced Diversification"]
    else:
        topics = ["Options Basics", "Portfolio Optimization"]
        
    return {
        "educational_recommendations": f"Recommended Topics: {', '.join(topics)}.",
        "recommended_topics": topics
    }

def behavioral_coaching_agent(state: MentorState) -> Dict[str, Any]:
    """Detects fear, greed, panic, overconfidence."""
    user_message = _get_last_user_message(state)
    if not user_message:
        return {"behavioral_analysis": "Neutral", "emotion": "Neutral", "emotion_confidence": 0.0}

    sys_msg = SystemMessage(content="You are a behavioral finance analyst. Analyze the user's message for emotional investing behaviors: Fear, Greed, Panic, Overconfidence, or Neutral.")
    usr_msg = HumanMessage(content=user_message)
    
    try:
        result = llm_provider.invoke_structured([sys_msg, usr_msg], BehavioralSchema)
        if result:
            return {
                "behavioral_analysis": f"Detected Behavior: {result.behavior}. Reasoning: {result.reasoning}",
                "emotion": result.behavior.lower(),
                "emotion_confidence": result.confidence
            }
    except Exception as e:
        logger.error(f"Behavioral agent error: {e}")
        
    return {"behavioral_analysis": "Neutral", "emotion": "neutral", "emotion_confidence": 0.0}

def rag_knowledge_agent(state: MentorState) -> Dict[str, Any]:
    """Retrieves relevant financial knowledge."""
    user_message = _get_last_user_message(state)
    if not user_message:
        return {"rag_context": "", "rag_sources": []}
        
    docs = retrieve_top_k(user_message, k=5)
    
    knowledge_text = "\n\n".join([d.page_content for d in docs])
    
    sources = []
    seen = set()
    for d in docs:
        src = d.metadata.get("source", "Unknown")
        if src not in seen:
            seen.add(src)
            sources.append(src)
            
    return {"rag_context": knowledge_text, "rag_sources": sources}

def mentor_response_agent(state: MentorState) -> Dict[str, Any]:
    """Combines all context and generates the final personalized response based on intent."""
    user_message = _get_last_user_message(state)
    profile = state.get("user_profile", {})
    intent = state.get("intent", "general")
    
    base_sys_prompt = f"""You are WealthSeed AI, an intelligent financial education mentor.
Your role is NOT to act as a generic chatbot or PDF summarizer.
You must act as a personalized wealth mentor by analyzing the provided context.

USER PROFILE:
- Risk Profile: {profile.get("risk_profile")}
- Literacy Score: {profile.get("literacy_score")} (Level: {profile.get("literacy_level")})
- Virtual Balance: ${state.get("virtual_balance", 0):,.2f}

GOAL ANALYSIS:
{state.get("goal_analysis", "")}

PORTFOLIO ANALYSIS:
{state.get("portfolio_analysis", "")}

LEARNING ROADMAP:
{state.get("educational_recommendations", "")}

BEHAVIORAL COACHING:
{state.get("behavioral_analysis", "")}

RELEVANT KNOWLEDGE (RAG):
{state.get("rag_context", "No specific knowledge found.")}

IMPORTANT RULES:
1. Never provide generic textbook answers when user profile data exists.
2. Always personalize responses using the user's actual profile.
3. Never guarantee returns.
4. Never predict future stock prices or market movements.
5. Never provide direct financial advice.
6. Focus on education, planning, risk awareness, and decision support.
7. Explain WHY recommendations match the user's profile.
8. If the user expresses panic, fear, greed, overconfidence, or impulsive behavior, explicitly identify the behavioral bias and provide coaching.
"""

    format_instruction = ""

    if intent == "education":
        format_instruction = """
RESPONSE FORMAT:

### Personalized Explanation
Provide beginner-friendly explanation.

### Why It Matters To You
Connect explanation to Risk profile, Literacy level, and Current goals.

### Next Learning Step
Recommend next concept.
"""
    elif intent == "decision" or intent == "risk_management":
        format_instruction = """
RESPONSE FORMAT:

### Personalized Assessment
Briefly explain how the user's profile affects the situation.

### Behavioral Insight
Analyze emotional signals.

### Goal Impact Analysis
Explain how the user's decision may affect their financial goals.

### Educational Perspective
Use RAG knowledge and educational content.

### Recommended Actions
Provide 3-5 educational next steps.

### Key Takeaway
Provide a concise mentor-style conclusion.
"""
    elif intent == "goal_planning":
        format_instruction = """
RESPONSE FORMAT:

### Goal Overview

### Current Progress

### Completion Forecast
Scenario A (₹2,000/month)
Scenario B (₹5,000/month)
Scenario C (₹10,000/month)

### Recommended Actions

### Key Takeaway
"""
    elif intent == "portfolio_analysis":
        format_instruction = """
RESPONSE FORMAT:

### Portfolio Summary

### Diversification Analysis

### Risk Analysis

### Goal Alignment

### Suggested Improvements
"""
    elif intent == "behavioral":
        format_instruction = """
RESPONSE FORMAT:

### Emotion Detected

### Why Investors Feel This

### Impact On Decisions

### Coaching Guidance

### Recommended Actions
"""
    elif intent == "market_event":
        format_instruction = """
RESPONSE FORMAT:

### Situation Assessment

### Emotional Bias Analysis

### Goal Impact

### Educational Context

### Recommended Actions

### Key Takeaway
"""
    else:
        format_instruction = """
RESPONSE FORMAT:
Provide a helpful, educational response tailored to the user's profile and query.
"""

    sys_prompt = base_sys_prompt + "\n" + format_instruction

    messages = [SystemMessage(content=sys_prompt)]
    
    history = state.get("messages", [])[:-1]
    for msg in history[-5:]:
        messages.append(msg)
        
    messages.append(HumanMessage(content=user_message))
    
    try:
        response = llm_provider.generate_response(system_prompt=sys_prompt, user_prompt=user_message)
        return {"final_response": response.get("answer", ""), "provider_used": response.get("provider_used", "unknown")}
    except Exception as e:
        logger.error(f"Mentor response error: {e}")
        return {"final_response": "I apologize, but I encountered an error while formulating my response. Please try again.", "provider_used": "error"}
