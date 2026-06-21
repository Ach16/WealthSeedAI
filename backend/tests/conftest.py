import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.user import User, UserProfile
from app.core.security import get_password_hash, create_access_token

# Setup in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_engine():
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

@pytest.fixture(scope="function")
def test_user(db_session):
    user = User(
        email="test@wealthseed.ai",
        password_hash=get_password_hash("Test@123")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    profile = UserProfile(user_id=user.id)
    db_session.add(profile)
    db_session.commit()
    
    return user

@pytest.fixture(scope="function")
def auth_headers(test_user, db_session):
    from datetime import datetime, timedelta
    from app.models.user import UserSession
    from app.core.security import ACCESS_TOKEN_EXPIRE_DAYS
    
    token = create_access_token(data={"sub": test_user.email})
    expires_at = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    user_session = UserSession(user_id=test_user.id, jwt_token=token, expires_at=expires_at)
    db_session.add(user_session)
    db_session.commit()
    
    return {"Authorization": f"Bearer {token}"}
