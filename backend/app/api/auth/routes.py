from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, UserProfile, UserSession
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_DAYS
from app.api.auth.schemas import UserCreate, UserLogin, TokenResponse, UserResponse, UserProfileResponse
from app.api.portfolio.service import create_default_portfolio
from datetime import datetime, timezone, timedelta

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    email = payload.get("sub")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    session = (
        db.query(UserSession)
        .filter(
            UserSession.jwt_token == token,
            UserSession.user_id == user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )

    if session.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )

    return user

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_profile = UserProfile(user_id=new_user.id)
    db.add(new_profile)
    db.commit()

    create_default_portfolio(db, new_user.id)

    access_token = create_access_token(data={"sub": new_user.email})
    expires_at = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    user_session = UserSession(user_id=new_user.id, jwt_token=access_token, expires_at=expires_at)
    db.add(user_session)
    db.commit()

    return {"access_token": access_token, "user_id": new_user.id}

@router.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.last_login = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    expires_at = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    user_session = UserSession(user_id=user.id, jwt_token=access_token, expires_at=expires_at)
    db.add(user_session)
    db.commit()

    return {"access_token": access_token, "user_id": user.id}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    profile_data = None
    if current_user.profile:
        profile_data = UserProfileResponse(
            literacy_score=current_user.profile.literacy_score,
            risk_profile=current_user.profile.risk_profile,
            virtual_balance=current_user.profile.virtual_balance
        )
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        profile=profile_data
    )

@router.get("/session")
def check_session(current_user: User = Depends(get_current_user)):
    return {"status": "active", "user_id": current_user.id}

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    session = db.query(UserSession).filter(UserSession.jwt_token == token).first()
    if session:
        db.delete(session)
        db.commit()
    return {"status": "success", "message": "Logged out successfully"}
