from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey, Text, ARRAY, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
import uuid
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True, nullable=True)
    dob = Column(Date)
    phone_number = Column(String)
    preferred_speech_speed = Column(Float, default=1.0)
    preferred_avatar_type = Column(String, default="3D")
    accessibility_preferences = Column(JSONB, default={})
    caregiver_id = Column(UUID(as_uuid=True), ForeignKey(
        "caregivers.id"), nullable=True)
    last_login = Column(TIMESTAMP(timezone=True))

    # Relationships
    caregiver = relationship("Caregiver", back_populates="users_managed")
    sessions = relationship("Session", back_populates="user")
    medications = relationship("Medication", back_populates="user")


class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String)
    relationship_type = Column(String)
    receive_alerts = Column(Boolean, default=True)

    # Relationships
    users_managed = relationship("User", back_populates="caregiver")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id"), nullable=False)
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True))
    duration = Column(Integer)  # in minutes
    mood_score = Column(Integer)  # 1-10
    mood_notes = Column(Text)
    time_of_day = Column(String)  # Morning/Afternoon/Evening
    summary = Column(Text)
    has_activity = Column(Boolean, default=False)
    activity_type = Column(String)
    activity_id = Column(UUID(as_uuid=True), ForeignKey(
        "activities.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")
    chat_turns = relationship("ChatTurn", back_populates="session")
    topics = relationship(
        "Topic", secondary="session_topics", back_populates="sessions")
    notes = relationship("Note", back_populates="session")
    activity = relationship("Activity", back_populates="sessions")
    session_activities = relationship(
        "SessionActivity", back_populates="session")


class ChatTurn(Base):
    __tablename__ = "chat_turns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey(
        "sessions.id"), nullable=False)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False)
    speaker = Column(String, nullable=False)  # User/Assistant
    message = Column(Text, nullable=False)
    audio_url = Column(String)
    embedding = Column(Vector(1536))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("Session", back_populates="chat_turns")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)

    # Relationships
    sessions = relationship(
        "Session", secondary="session_topics", back_populates="topics")


class SessionTopic(Base):
    __tablename__ = "session_topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey(
        "sessions.id"), nullable=False)
    topic_id = Column(UUID(as_uuid=True), ForeignKey(
        "topics.id"), nullable=False)


class Note(Base):
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey(
        "sessions.id"), nullable=False)
    title = Column(String)
    content = Column(Text)
    is_important = Column(Boolean, default=False)

    # Relationships
    session = relationship("Session", back_populates="notes")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)  # Trivia, Breathing, Music, etc.
    name = Column(String, nullable=False)
    description = Column(Text)
    data = Column(JSONB, default={})

    # Relationships
    sessions = relationship("Session", back_populates="activity")
    session_activities = relationship(
        "SessionActivity", back_populates="activity")


class SessionActivity(Base):
    __tablename__ = "session_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey(
        "sessions.id"), nullable=False)
    activity_id = Column(UUID(as_uuid=True), ForeignKey(
        "activities.id"), nullable=False)
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True))
    score = Column(Integer)
    results = Column(JSONB, default={})

    # Relationships
    session = relationship("Session", back_populates="session_activities")
    activity = relationship("Activity", back_populates="session_activities")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        "users.id"), nullable=False)
    name = Column(String, nullable=False)
    dosage = Column(String)
    frequency = Column(String)
    time_of_day = Column(ARRAY(String), nullable=False)
    instructions = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="medications")
    reminders = relationship("MedicationReminder", back_populates="medication")


class MedicationReminder(Base):
    __tablename__ = "medication_reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medication_id = Column(UUID(as_uuid=True), ForeignKey(
        "medications.id"), nullable=False)
    scheduled_time = Column(TIMESTAMP(timezone=True), nullable=False)
    taken_time = Column(TIMESTAMP(timezone=True))
    skipped = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True),
                        server_default=func.now(), onupdate=func.now())

    # Relationships
    medication = relationship("Medication", back_populates="reminders")
