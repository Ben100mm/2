from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String, default="user")  # user, admin, premium
    
    # Profile information
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    specialties = Column(JSON, nullable=True)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Security fields
    last_login = Column(DateTime, nullable=True)
    login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime, nullable=True)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    deals = relationship("SavedDeal", back_populates="user", cascade="all, delete-orphan")
    property_analyses = relationship("PropertyAnalysis", back_populates="user", cascade="all, delete-orphan")
    security_events = relationship("SecurityEvent", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, unique=True, nullable=False)
    device_fingerprint = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    user_agent = Column(Text, nullable=False)
    device_info = Column(JSON, nullable=True)
    
    # Session management
    is_active = Column(Boolean, default=True)
    last_activity = Column(DateTime, default=func.now())
    expires_at = Column(DateTime, nullable=False)
    
    # Security tracking
    suspicious_activity = Column(Boolean, default=False)
    location_country = Column(String, nullable=True)
    location_city = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sessions")

class SecurityEvent(Base):
    __tablename__ = "security_events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    event_type = Column(String, nullable=False)  # login, logout, suspicious_login, account_sharing_detected
    session_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    device_fingerprint = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    severity = Column(String, default="low")  # low, medium, high, critical
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="security_events")
