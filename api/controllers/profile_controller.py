from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from services.profile_service import ProfileService
from schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
    ProfileStatusResponse
)
from uuid import UUID
from typing import Optional


class ProfileController:
    """Controller layer for Profile - handles HTTP logic and coordinates with services"""

    def __init__(self, db: Session):
        self.db = db
        self.profile_service = ProfileService(db)

    async def check_profile_status(self, user_id: UUID) -> ProfileStatusResponse:
        """Check if user's profile exists and is complete"""
        try:
            profile_exists = self.profile_service.profile_exists(user_id)
            profile_complete = self.profile_service.is_profile_complete(
                user_id) if profile_exists else False

            return ProfileStatusResponse(
                profile_exists=profile_exists,
                profile_complete=profile_complete
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to check profile status: {str(e)}"
            )

    async def get_profile(self, user_id: UUID) -> ProfileResponse:
        """Get current user's profile"""
        try:
            profile = self.profile_service.get_profile(user_id)
            if not profile:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profile not found"
                )
            return profile
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get profile: {str(e)}"
            )

    async def create_profile(self, user_id: UUID, profile_data: ProfileCreate) -> ProfileResponse:
        """Create a new profile for the current user"""
        try:
            # Check if profile already exists
            if self.profile_service.profile_exists(user_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Profile already exists"
                )

            profile = self.profile_service.create_profile(
                user_id, profile_data)
            return profile
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create profile: {str(e)}"
            )

    async def update_profile(self, user_id: UUID, profile_data: ProfileUpdate) -> ProfileResponse:
        """Update current user's profile"""
        try:
            profile = self.profile_service.update_profile(
                user_id, profile_data)
            if not profile:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profile not found"
                )
            return profile
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile: {str(e)}"
            )

    async def delete_profile(self, user_id: UUID) -> dict:
        """Delete current user's profile"""
        try:
            if not self.profile_service.delete_profile(user_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profile not found"
                )
            return {"message": "Profile deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete profile: {str(e)}"
            )
