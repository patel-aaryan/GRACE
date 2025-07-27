from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import date
from uuid import UUID


class AccessibilityPreferences(BaseModel):
    large_text: bool = False
    high_contrast: bool = False
    voice_instructions: bool = False
    simplified_interface: bool = False


class ProfileUpdate(BaseModel):
    dob: Optional[date] = None
    preferred_speech_speed: Optional[float] = Field(None, ge=0.5, le=2.0)
    preferred_avatar_type: Optional[str] = None
    accessibility_preferences: Optional[AccessibilityPreferences] = None


class ProfileResponse(BaseModel):
    id: UUID
    dob: Optional[date]
    preferred_speech_speed: float
    preferred_avatar_type: str
    accessibility_preferences: Dict[str, Any]
    caregiver_id: Optional[UUID]

    class Config:
        from_attributes = True


class ProfileStatusResponse(BaseModel):
    profile_complete: bool
    profile_exists: bool
