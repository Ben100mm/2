from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    company: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        # Truncate password to 72 bytes to avoid bcrypt limitation
        if len(v.encode('utf-8')) > 72:
            v = v.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    device_info: Dict[str, Any]

class DeviceInfo(BaseModel):
    fingerprint: str
    user_agent: str
    browser: str
    os: str
    screen_resolution: str
    timezone: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    session_id: str
    user: Dict[str, Any]

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    is_verified: bool
    phone: Optional[str] = None
    company: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
