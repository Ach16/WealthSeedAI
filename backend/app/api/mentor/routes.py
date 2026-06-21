from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.auth.routes import get_current_user
from app.models.user import User
from .schemas import ChatRequest, ChatResponse, ProviderStatusResponse, ReindexResponse
from app.ai.llm_provider import llm_provider
from app.ai.mentor_service import handle_chat_request, gather_user_context
from app.rag.service import initialize_knowledge_base
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_with_mentor(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        response_data = handle_chat_request(db, current_user.id, request.message)
        return response_data
    except Exception as e:
        logger.error(f"Mentor chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/context")
def get_user_context(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    context = gather_user_context(db, current_user.id)
    # Convert goals objects to dicts for JSON response
    context["goals"] = [
        {"title": g.title, "target_amount": g.target_amount, "current_amount": g.current_amount}
        for g in context["goals"]
    ]
    return context

@router.get("/provider-status", response_model=ProviderStatusResponse)
def get_provider_status():
    return llm_provider.get_status()

@router.post("/reindex", response_model=ReindexResponse)
def reindex_knowledge_base(
    current_user: User = Depends(get_current_user) # Require authentication at least
):
    success = initialize_knowledge_base(force_reindex=True)
    if success:
        return {"success": True, "message": "Knowledge base successfully reindexed."}
    else:
        raise HTTPException(status_code=500, detail="Failed to reindex knowledge base. Check server logs.")
