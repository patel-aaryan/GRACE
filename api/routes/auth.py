from fastapi import APIRouter, Depends, HTTPException
from core.auth import require_user, get_current_user_id, JWTTokenPayload
from schemas.auth import UserProfile

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserProfile)
async def get_current_user(current_user: JWTTokenPayload = Depends(require_user)):
    """Get current user profile from JWT token"""
    return UserProfile(
        id=current_user.sub,
        email=current_user.email,
        role=current_user.role
    )


@router.get("/protected")
async def protected_route(user_id: str = Depends(get_current_user_id)):
    """Example protected route that requires authentication"""
    return {
        "message": "This is a protected route",
        "user_id": user_id
    }


@router.get("/verify")
async def verify_token(current_user: JWTTokenPayload = Depends(require_user)):
    """Verify if the token is valid"""
    return {
        "valid": True,
        "user_id": current_user.sub,
        "email": current_user.email
    }
