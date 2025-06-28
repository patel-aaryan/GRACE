from sqlalchemy.orm import Session
from datastores.auth_datastore import AuthDatastore
from database.models import Profile
from typing import Optional
from uuid import UUID


class AuthService:
    """Service layer for Authentication - handles business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.auth_datastore = AuthDatastore(db)

    async def update_last_login(self, user_id: UUID) -> bool:
        """Update user's last login timestamp"""
        return self.auth_datastore.update_last_login(user_id)

    def get_user_profile(self, user_id: UUID) -> Optional[Profile]:
        """Get user profile for authentication purposes"""
        return self.auth_datastore.get_user_profile(user_id)
