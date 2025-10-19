from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserResponse
from app.core.auth import get_current_user, get_admin_user
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.get("/sessions")
async def get_user_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's active sessions"""
    from app.services.auth_service import AuthService
    auth_service = AuthService(db)
    sessions = auth_service.get_active_sessions(current_user.id)
    
    return {
        "sessions": [
            {
                "id": session.id,
                "device_fingerprint": session.device_fingerprint,
                "ip_address": session.ip_address,
                "user_agent": session.user_agent,
                "last_activity": session.last_activity,
                "created_at": session.created_at,
                "is_active": session.is_active
            }
            for session in sessions
        ]
    }

@router.post("/sessions/{session_id}/invalidate")
async def invalidate_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invalidate specific session"""
    from app.services.auth_service import AuthService
    auth_service = AuthService(db)
    auth_service.invalidate_session(session_id)
    
    return {"message": "Session invalidated successfully"}

@router.post("/sessions/invalidate-all")
async def invalidate_all_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invalidate all user sessions"""
    from app.services.auth_service import AuthService
    auth_service = AuthService(db)
    auth_service.invalidate_all_sessions(current_user.id)
    
    return {"message": "All sessions invalidated successfully"}
