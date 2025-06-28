from sqlalchemy.orm import Session
from database.models import Profile
from typing import Optional
from uuid import UUID


class AuthDatastore:
    """Datastore layer for Authentication - handles auth-related database operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_user_profile(self, user_id: UUID) -> Optional[Profile]:
        """Get user profile for authentication purposes"""
        return self.db.query(Profile).filter(Profile.id == user_id).first()

    def update_last_login(self, user_id: UUID) -> bool:
        """Update user's last login timestamp"""
        try:
            from datetime import datetime, timezone
            result = (
                self.db.query(Profile)
                .filter(Profile.id == user_id)
                .update({Profile.last_login: datetime.now(timezone.utc)})
            )
            self.db.commit()
            return result > 0
        except Exception:
            self.db.rollback()
            return False
