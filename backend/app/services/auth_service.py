from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from app.models.user import User, UserSession, SecurityEvent
from app.core.security import security_manager
from app.schemas.auth import DeviceInfo
from app.config import settings
import uuid

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.max_concurrent_sessions = settings.MAX_CONCURRENT_SESSIONS
        self.session_duration = timedelta(hours=settings.SESSION_DURATION_HOURS)
    
    def create_user(self, email: str, password: str, full_name: str, **kwargs) -> User:
        """Create new user account"""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create user
        user = User(
            email=email,
            password_hash=security_manager.hash_password(password),
            full_name=full_name,
            **kwargs
        )
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not security_manager.verify_password(password, user.password_hash):
            # Increment login attempts
            user.login_attempts += 1
            if user.login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                user.locked_until = datetime.utcnow() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
            self.db.commit()
            return None
        
        # Reset login attempts on successful login
        user.login_attempts = 0
        user.locked_until = None
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        return user
    
    def create_session(self, user: User, device_info: DeviceInfo, ip_address: str) -> Tuple[str, str]:
        """Create new user session with anti-sharing measures"""
        
        # Check for existing active sessions
        existing_sessions = self.get_active_sessions(user.id)
        
        # Anti-account-sharing measures
        if len(existing_sessions) >= self.max_concurrent_sessions:
            # Invalidate oldest session
            self.invalidate_oldest_session(user.id)
        
        # Check for suspicious activity
        self.detect_suspicious_activity(user, device_info, ip_address, existing_sessions)
        
        # Create new session
        session_id = str(uuid.uuid4())
        expires_at = datetime.utcnow() + self.session_duration
        
        session = UserSession(
            user_id=user.id,
            session_id=session_id,
            device_fingerprint=device_info.fingerprint,
            ip_address=ip_address,
            user_agent=device_info.user_agent,
            device_info=device_info.dict(),
            expires_at=expires_at
        )
        
        self.db.add(session)
        self.db.commit()
        
        # Generate JWT token
        token_data = {
            "user_id": user.id,
            "session_id": session_id,
            "device_fingerprint": device_info.fingerprint,
            "role": user.role
        }
        
        token = security_manager.create_access_token(token_data)
        return token, session_id
    
    def validate_session(self, session_id: str) -> Optional[User]:
        """Validate session and return user"""
        session = self.db.query(UserSession).filter(
            UserSession.session_id == session_id,
            UserSession.is_active == True
        ).first()
        
        if not session:
            return None
        
        # Check if session is expired
        if datetime.utcnow() > session.expires_at:
            session.is_active = False
            self.db.commit()
            return None
        
        # Update last activity
        session.last_activity = datetime.utcnow()
        self.db.commit()
        
        return session.user
    
    def detect_suspicious_activity(self, user: User, device_info: DeviceInfo, 
                                 ip_address: str, existing_sessions: list):
        """Detect potential account sharing"""
        
        # Check for multiple devices
        device_fingerprints = [s.device_fingerprint for s in existing_sessions]
        if device_info.fingerprint not in device_fingerprints and len(device_fingerprints) > 0:
            self.log_security_event(
                user.id, 
                "multiple_devices_detected", 
                {
                    "new_device": device_info.fingerprint,
                    "existing_devices": device_fingerprints,
                    "ip_address": ip_address
                }
            )
        
        # Check for IP changes
        existing_ips = [s.ip_address for s in existing_sessions]
        if ip_address not in existing_ips and len(existing_ips) > 0:
            self.log_security_event(
                user.id, 
                "ip_address_change", 
                {
                    "new_ip": ip_address,
                    "existing_ips": existing_ips,
                    "device_fingerprint": device_info.fingerprint
                }
            )
    
    def get_active_sessions(self, user_id: str) -> list:
        """Get all active sessions for a user"""
        return self.db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == True,
            UserSession.expires_at > datetime.utcnow()
        ).all()
    
    def invalidate_session(self, session_id: str):
        """Invalidate specific session"""
        session = self.db.query(UserSession).filter(UserSession.session_id == session_id).first()
        if session:
            session.is_active = False
            self.db.commit()
    
    def invalidate_all_sessions(self, user_id: str):
        """Invalidate all sessions for a user"""
        sessions = self.db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == True
        ).all()
        
        for session in sessions:
            session.is_active = False
        
        self.db.commit()
    
    def invalidate_oldest_session(self, user_id: str):
        """Invalidate oldest session for a user"""
        oldest_session = self.db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == True
        ).order_by(UserSession.created_at.asc()).first()
        
        if oldest_session:
            oldest_session.is_active = False
            self.db.commit()
    
    def log_security_event(self, user_id: str, event_type: str, details: Dict[str, Any]):
        """Log security events for monitoring"""
        event = SecurityEvent(
            user_id=user_id,
            event_type=event_type,
            details=details
        )
        self.db.add(event)
        self.db.commit()
