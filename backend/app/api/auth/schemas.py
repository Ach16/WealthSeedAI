from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str

class UserProfileResponse(BaseModel):
    literacy_score: float
    risk_profile: str
    virtual_balance: float

class UserResponse(BaseModel):
    id: str
    email: str
    is_active: bool
    profile: UserProfileResponse | None = None
