from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.user import User, UserProfile
from app.core.security import get_password_hash
from app.models.goal import Goal
from app.models.risk import RiskAssessment
from app.api.auth.routes import router as auth_router
from app.api.profile.routes import router as profile_router
from app.api.goals.routes import router as goals_router
from app.api.risk.routes import router as risk_router
from app.api.portfolio.routes import router as portfolio_router
from app.api.learning.routes import router as learning_router
from app.api.mentor.routes import router as mentor_router
from app.api.learning.seed import seed_initial_modules
from app.models.learning import *
import logging

# Configure global logging format and level
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_dev_account():
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == "demo@wealthseed.ai").first()
        if not existing_user:
            demo_user = User(
                email="demo@wealthseed.ai",
                password_hash=get_password_hash("Demo@123")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            
            demo_profile = UserProfile(user_id=demo_user.id)
            db.add(demo_profile)
            db.commit()
            logger.info("Created development seed account: demo@wealthseed.ai")
    finally:
        db.close()

# Auto-seed on startup (only if no users exist or specifically the demo user doesn't exist)
seed_dev_account()

# Initialize AI Knowledge Base
try:
    from app.rag.service import initialize_knowledge_base
    initialize_knowledge_base()
except Exception as e:
    logger.error(f"Error initializing RAG knowledge base: {e}")

# Seed Learning Modules
with SessionLocal() as db:
    seed_initial_modules(db)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(goals_router, prefix="/api/goals", tags=["Goals"])
app.include_router(risk_router, prefix="/api/risk", tags=["Risk Assessment"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(learning_router, prefix="/api/learning", tags=["Learning Engine"])
app.include_router(mentor_router, prefix="/api/mentor", tags=["AI Mentor"])

@app.get("/health")
def health_check():
    logger.info("Health check endpoint accessed.")
    return {
        "status": "healthy",
        "service": "wealthseed-ai-backend"
    }
