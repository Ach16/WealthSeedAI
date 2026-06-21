from langgraph.graph import StateGraph, END
from app.ai.agents import (
    MentorState,
    intent_classification_agent,
    goal_intelligence_agent,
    portfolio_intelligence_agent,
    educational_agent,
    behavioral_coaching_agent,
    rag_knowledge_agent,
    mentor_response_agent
)

def build_mentor_graph() -> StateGraph:
    workflow = StateGraph(MentorState)
    
    # Add nodes
    workflow.add_node("intent_agent", intent_classification_agent)
    workflow.add_node("goal_agent", goal_intelligence_agent)
    workflow.add_node("portfolio_agent", portfolio_intelligence_agent)
    workflow.add_node("education_agent", educational_agent)
    workflow.add_node("behavioral_agent", behavioral_coaching_agent)
    workflow.add_node("rag_agent", rag_knowledge_agent)
    workflow.add_node("mentor_response", mentor_response_agent)
    
    # Define execution sequence
    workflow.set_entry_point("intent_agent")
    
    workflow.add_edge("intent_agent", "goal_agent")
    workflow.add_edge("goal_agent", "portfolio_agent")
    workflow.add_edge("portfolio_agent", "education_agent")
    workflow.add_edge("education_agent", "behavioral_agent")
    workflow.add_edge("behavioral_agent", "rag_agent")
    workflow.add_edge("rag_agent", "mentor_response")
    
    # End node
    workflow.add_edge("mentor_response", END)
    
    return workflow.compile()

mentor_graph = build_mentor_graph()
