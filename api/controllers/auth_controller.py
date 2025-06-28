from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from services.auth_service import AuthService
from core.auth import JWTTokenPayload
from schemas.auth import UserProfile
from uuid import UUID


class AuthController:
    """Controller layer for Authentication - handles HTTP logic and coordinates with services"""

    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService(db)

    async def get_current_user(self, current_user: JWTTokenPayload) -> UserProfile:
        """Get current user profile from JWT token"""
        try:
            return UserProfile(
                id=current_user.sub,
                email=current_user.email,
                role=current_user.role
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get current user: {str(e)}"
            )

    async def get_protected_route_data(self, user_id: str) -> dict:
        """Handle protected route logic"""
        try:
            # Update last login
            await self.auth_service.update_last_login(UUID(user_id))

            return {
                "message": "This is a protected route",
                "user_id": user_id
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to access protected route: {str(e)}"
            )

    async def verify_token(self, current_user: JWTTokenPayload) -> dict:
        """Verify if the token is valid"""
        try:
            return {
                "valid": True,
                "user_id": current_user.sub,
                "email": current_user.email
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to verify token: {str(e)}"
            )
