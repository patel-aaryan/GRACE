from sqlalchemy.orm import Session
from database.models import Profile
from typing import Optional
from uuid import UUID


class ProfileDatastore:
    """Datastore layer for Profile entity - handles all database operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: UUID) -> Optional[Profile]:
        """Get a profile by user ID"""
        return self.db.query(Profile).filter(Profile.id == user_id).first()

    def update(self, profile: Profile) -> Profile:
        """Update existing profile"""
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete(self, profile: Profile) -> bool:
        """Delete a profile"""
        try:
            self.db.delete(profile)
            self.db.commit()
            return True
        except Exception:
            self.db.rollback()
            return False

    def exists(self, user_id: UUID) -> bool:
        """Check if profile exists"""
        return self.db.query(Profile).filter(Profile.id == user_id).first() is not None


