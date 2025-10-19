from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://dreamery_user:dreamery_password@localhost:5432/dreamery_db"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:7001"]
    
    # Email (optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # Redis (optional)
    REDIS_URL: Optional[str] = "redis://localhost:6379"
    
    # Security settings
    MAX_CONCURRENT_SESSIONS: int = 3
    SESSION_DURATION_HOURS: int = 24
    PASSWORD_MIN_LENGTH: int = 8
    MAX_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
