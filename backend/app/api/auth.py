from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, PasswordReset, PasswordResetConfirm, UserResponse
from app.services.auth_service import AuthService
from app.core.security import security_manager
from app.utils.device_fingerprint import generate_device_fingerprint
from app.core.auth import get_current_user
from app.models.user import User
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, request: Request, db: Session = Depends(get_db)):
    """Register new user"""
    try:
        auth_service = AuthService(db)
        
        # Generate device fingerprint
        device_info_dict = generate_device_fingerprint(request)
        from app.schemas.auth import DeviceInfo
        device_info = DeviceInfo(**device_info_dict)
        
        # Create user
        user = auth_service.create_user(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            company=user_data.company
        )
        
        # Create session
        token, session_id = auth_service.create_session(
            user, 
            device_info, 
            request.client.host
        )
        
        return TokenResponse(
            access_token=token,
            expires_in=24 * 60 * 60,  # 24 hours
            user={
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Login user"""
    try:
        auth_service = AuthService(db)
        
        # Authenticate user
        user = auth_service.authenticate_user(login_data.email, login_data.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if user is locked
        if user.locked_until and user.locked_until > datetime.utcnow():
            raise HTTPException(
                status_code=423, 
                detail=f"Account locked until {user.locked_until}"
            )
        
        # Generate device fingerprint
        device_info_dict = generate_device_fingerprint(request)
        from app.schemas.auth import DeviceInfo
        device_info = DeviceInfo(**device_info_dict)
        
        # Create session
        token, session_id = auth_service.create_session(
            user, 
            device_info, 
            request.client.host
        )
        
        return TokenResponse(
            access_token=token,
            expires_in=24 * 60 * 60,  # 24 hours
            user={
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Logout user"""
    try:
        # Verify token
        payload = security_manager.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Invalidate session
        auth_service = AuthService(db)
        auth_service.invalidate_session(payload.get("session_id"))
        
        return {"message": "Logged out successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/logout-all")
async def logout_all(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Logout from all devices"""
    try:
        payload = security_manager.verify_token(credentials.credentials)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        auth_service = AuthService(db)
        auth_service.invalidate_all_sessions(payload.get("user_id"))
        
        return {"message": "Logged out from all devices"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.post("/password-reset")
async def request_password_reset(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Request password reset"""
    # TODO: Implement email sending for password reset
    return {"message": "Password reset email sent"}

@router.post("/password-reset-confirm")
async def confirm_password_reset(reset_data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Confirm password reset"""
    # TODO: Implement password reset confirmation
    return {"message": "Password reset successfully"}
