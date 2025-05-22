from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from uuid import UUID, uuid4


# Base models for create/update operations
class UserBase(BaseModel):
    name: str
    email: EmailStr
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    preferred_speech_speed: float = 1.0
    preferred_avatar_type: str = "3D"
    accessibility_preferences: Dict[str, Any] = Field(default_factory=dict)


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    preferred_speech_speed: Optional[float] = None
    preferred_avatar_type: Optional[str] = None
    accessibility_preferences: Optional[Dict[str, Any]] = None
    caregiver_id: Optional[UUID] = None


class User(UserBase):
    id: UUID
    caregiver_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class CaregiverBase(BaseModel):
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    relationship: Optional[str] = None
    receive_alerts: bool = True


class CaregiverCreate(CaregiverBase):
    pass


class CaregiverUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    relationship: Optional[str] = None
    receive_alerts: Optional[bool] = None


class Caregiver(CaregiverBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SessionBase(BaseModel):
    user_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # in minutes
    mood_score: Optional[int] = None
    mood_notes: Optional[str] = None
    time_of_day: Optional[str] = None
    summary: Optional[str] = None
    has_activity: bool = False
    activity_type: Optional[str] = None
    activity_id: Optional[UUID] = None

    @validator('mood_score')
    def validate_mood_score(cls, v):
        if v is not None and (v < 1 or v > 10):
            raise ValueError('Mood score must be between 1 and 10')
        return v


class SessionCreate(SessionBase):
    pass


class SessionUpdate(BaseModel):
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    mood_score: Optional[int] = None
    mood_notes: Optional[str] = None
    summary: Optional[str] = None
    has_activity: Optional[bool] = None
    activity_type: Optional[str] = None
    activity_id: Optional[UUID] = None

    @validator('mood_score')
    def validate_mood_score(cls, v):
        if v is not None and (v < 1 or v > 10):
            raise ValueError('Mood score must be between 1 and 10')
        return v


class Session(SessionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ChatTurnBase(BaseModel):
    session_id: UUID
    timestamp: datetime
    speaker: str
    message: str
    audio_url: Optional[str] = None


class ChatTurnCreate(ChatTurnBase):
    pass


class ChatTurn(ChatTurnBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True


class TopicBase(BaseModel):
    name: str


class TopicCreate(TopicBase):
    pass


class Topic(TopicBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True


class NoteBase(BaseModel):
    session_id: UUID
    title: Optional[str] = None
    content: str
    is_important: bool = False


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_important: Optional[bool] = None


class Note(NoteBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ActivityBase(BaseModel):
    type: str
    name: str
    description: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class Activity(ActivityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class SessionActivityBase(BaseModel):
    session_id: UUID
    activity_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    score: Optional[int] = None
    results: Dict[str, Any] = Field(default_factory=dict)


class SessionActivityCreate(SessionActivityBase):
    pass


class SessionActivityUpdate(BaseModel):
    end_time: Optional[datetime] = None
    score: Optional[int] = None
    results: Optional[Dict[str, Any]] = None


class SessionActivity(SessionActivityBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True


class MedicationBase(BaseModel):
    user_id: UUID
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    time_of_day: List[str]
    instructions: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    time_of_day: Optional[List[str]] = None
    instructions: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class Medication(MedicationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class MedicationReminderBase(BaseModel):
    medication_id: UUID
    scheduled_time: datetime
    taken_time: Optional[datetime] = None
    skipped: bool = False


class MedicationReminderCreate(MedicationReminderBase):
    pass


class MedicationReminderUpdate(BaseModel):
    taken_time: Optional[datetime] = None
    skipped: Optional[bool] = None


class MedicationReminder(MedicationReminderBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
