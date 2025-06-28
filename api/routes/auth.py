from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from core.auth import require_user, get_current_user_id, JWTTokenPayload
from controllers.auth_controller import AuthController
from schemas.auth import UserProfile

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserProfile)
async def get_current_user(
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get current user profile from JWT token"""
    controller = AuthController(db)
    return await controller.get_current_user(current_user)


@router.get("/protected")
async def protected_route(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Example protected route that requires authentication"""
    controller = AuthController(db)
    return await controller.get_protected_route_data(user_id)


@router.get("/verify")
async def verify_token(
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Verify if the token is valid"""
    controller = AuthController(db)
    return await controller.verify_token(current_user)
