import logging
import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage, AIMessage

from app.models.user import UserProfile, ChatSession, ChatMessage
from app.models.goal import Goal
from app.models.risk import RiskAssessment
from app.models.portfolio import Portfolio
from app.ai.graph import mentor_graph

logger = logging.getLogger(__name__)

def gather_user_context(db: Session, user_id: str) -> Dict[str, Any]:
    """Fetch all relevant user data to build the context profile."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    risk = db.query(RiskAssessment).filter(RiskAssessment.user_id == user_id).first()
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    
    goal_list = []
    for g in goals:
        goal_list.append({
            "title": g.title,
            "target": g.target_amount,
            "current": g.current_amount,
            "progress": g.progress_percentage
        })
        
    return {
        "user_profile": {
            "literacy_level": profile.literacy_level if profile else "Beginner",
            "literacy_score": profile.literacy_score if profile else 0,
            "risk_profile": risk.risk_profile if risk else "Unknown",
            "risk_score": risk.score if risk else 0,
        },
        "virtual_balance": profile.virtual_balance if profile else 0.0,
        "portfolio": {
            "value": portfolio.total_value if portfolio else 0.0
        },
        "goals": goal_list,
        "goal_count": len(goal_list)
    }

def get_or_create_session(db: Session, user_id: str) -> ChatSession:
    # Use the most recent session or create a new one
    session = db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc()).first()
    if not session:
        session = ChatSession(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
    return session

def handle_chat_request(db: Session, user_id: str, message: str) -> Dict[str, Any]:
    """Main orchestration for generating a mentor response using LangGraph."""
    # 0. Get Chat Session
    chat_session = get_or_create_session(db, user_id)
    history_messages = db.query(ChatMessage).filter(ChatMessage.session_id == chat_session.id).order_by(ChatMessage.created_at.asc()).all()

    # 1. Gather User Context
    context = gather_user_context(db, user_id)
    
    # 2. Build Messages
    messages = []
    for m in history_messages[-5:]:
        if m.role == "user":
            messages.append(HumanMessage(content=m.content))
        elif m.role == "ai":
            messages.append(AIMessage(content=m.content))
            
    # Add current message
    messages.append(HumanMessage(content=message))
    
    # Save user message to DB
    user_msg_db = ChatMessage(session_id=chat_session.id, role="user", content=message)
    db.add(user_msg_db)
    db.commit()

    # 3. Execute LangGraph
    initial_state = {
        "user_id": user_id,
        "messages": messages,
        "user_profile": context["user_profile"],
        "goals": context["goals"],
        "portfolio": context["portfolio"],
        "virtual_balance": context["virtual_balance"],
        "intent": "",
        "goal_analysis": "",
        "goal_forecast": {},
        "portfolio_analysis": "",
        "diversification_score": 0,
        "goal_alignment_score": 0,
        "educational_recommendations": "",
        "recommended_topics": [],
        "behavioral_analysis": "",
        "emotion": "neutral",
        "emotion_confidence": 0.0,
        "rag_context": "",
        "rag_sources": [],
        "risk_score": context["user_profile"].get("risk_score", 0),
        "final_response": "",
        "provider_used": ""
    }
    
    # Run graph
    logger.info(f"User {user_id}: Executing LangGraph Mentor Flow for prompt: {message[:50]}...")
    try:
        result_state = mentor_graph.invoke(initial_state)
        logger.info("LangGraph execution completed successfully.")
    except Exception as e:
        logger.error(f"LangGraph execution failed: {e}", exc_info=True)
        result_state = initial_state
        result_state["final_response"] = "I'm sorry, I'm having trouble processing your request right now. Could you try again in a moment?"
        result_state["provider_used"] = "fallback"
    
    final_answer = result_state.get("final_response", "Sorry, an error occurred.")
    provider_used = result_state.get("provider_used", "unknown")
    sources = result_state.get("rag_sources", [])
    intent = result_state.get("intent", "general")

    # 4. Save AI message
    ai_msg_db = ChatMessage(
        session_id=chat_session.id, 
        role="ai", 
        content=final_answer,
        sources=json.dumps(sources),
        provider=provider_used
    )
    db.add(ai_msg_db)
    db.commit()

    # 5. Construct final output
    return {
        "answer": final_answer,
        "intent": intent,
        "sources": sources,
        "provider": provider_used,
        "risk_profile": context["user_profile"]["risk_profile"],
        "literacy_level": context["user_profile"]["literacy_level"],
        "goal_count": context["goal_count"],
        
        "insights": {
            "emotion": result_state.get("emotion", "neutral"),
            "emotion_confidence": result_state.get("emotion_confidence", 0.0),
            "risk_score": result_state.get("risk_score", 0),
            "goal_alignment_score": result_state.get("goal_alignment_score", 0),
            "diversification_score": result_state.get("diversification_score", 0),
            "goal_forecast": result_state.get("goal_forecast", {}),
            "recommended_topics": result_state.get("recommended_topics", [])
        }
    }
