from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from core.auth import require_user, JWTTokenPayload
from controllers.profile_controller import ProfileController
from schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
    ProfileStatusResponse
)
from uuid import UUID

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/check", response_model=ProfileStatusResponse)
async def check_profile_status(
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Check if user's profile exists and is complete"""
    controller = ProfileController(db)
    user_id = UUID(current_user.sub)
    return await controller.check_profile_status(user_id)


@router.get("/", response_model=ProfileResponse)
async def get_profile(
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile"""
    controller = ProfileController(db)
    user_id = UUID(current_user.sub)
    return await controller.get_profile(user_id)


@router.post("/", response_model=ProfileResponse)
async def create_profile(
    profile_data: ProfileCreate,
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Create a new profile for the current user"""
    controller = ProfileController(db)
    user_id = UUID(current_user.sub)
    return await controller.create_profile(user_id, profile_data)


@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    controller = ProfileController(db)
    user_id = UUID(current_user.sub)
    return await controller.update_profile(user_id, profile_data)


@router.delete("/")
async def delete_profile(
    current_user: JWTTokenPayload = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Delete current user's profile"""
    controller = ProfileController(db)
    user_id = UUID(current_user.sub)
    return await controller.delete_profile(user_id)
