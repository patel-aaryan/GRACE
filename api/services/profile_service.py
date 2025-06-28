from sqlalchemy.orm import Session
from database.models import Profile
from datastores.profile_datastore import ProfileDatastore
from schemas.profile import ProfileCreate, ProfileUpdate
from typing import Optional
from uuid import UUID
import uuid


class ProfileService:
    """Service layer for Profile - handles business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.profile_datastore = ProfileDatastore(db)

    def get_profile(self, user_id: UUID) -> Optional[Profile]:
        """Get a profile by user ID"""
        return self.profile_datastore.get_by_id(user_id)

    def create_profile(self, user_id: UUID, profile_data: ProfileCreate) -> Profile:
        """Create a new profile"""
        # Convert accessibility preferences to dict
        accessibility_prefs = profile_data.accessibility_preferences.dict()

        db_profile = Profile(
            id=user_id,
            dob=profile_data.dob,
            preferred_speech_speed=profile_data.preferred_speech_speed,
            preferred_avatar_type=profile_data.preferred_avatar_type,
            accessibility_preferences=accessibility_prefs
        )

        return self.profile_datastore.create(db_profile)

    def update_profile(self, user_id: UUID, profile_data: ProfileUpdate) -> Optional[Profile]:
        """Update an existing profile"""
        db_profile = self.get_profile(user_id)
        if not db_profile:
            return None

        update_data = profile_data.dict(exclude_unset=True)

        # Handle accessibility preferences separately
        if 'accessibility_preferences' in update_data:
            update_data['accessibility_preferences'] = update_data['accessibility_preferences'].dict()

        for field, value in update_data.items():
            setattr(db_profile, field, value)

        return self.profile_datastore.update(db_profile)

    def profile_exists(self, user_id: UUID) -> bool:
        """Check if a profile exists for the user"""
        return self.profile_datastore.exists(user_id)

    def is_profile_complete(self, user_id: UUID) -> bool:
        """Check if a profile is complete (has all required fields)"""
        profile = self.get_profile(user_id)
        if not profile:
            return False

        # Check if required fields are present
        required_fields = ['dob']
        for field in required_fields:
            if getattr(profile, field) is None:
                return False

        return True

    def delete_profile(self, user_id: UUID) -> bool:
        """Delete a profile"""
        db_profile = self.get_profile(user_id)
        if not db_profile:
            return False

        return self.profile_datastore.delete(db_profile)
