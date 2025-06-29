from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv
import logging
from typing import Optional, Generator
from contextlib import contextmanager

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Get database URL from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost/grace_db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=True,
    poolclass=NullPool,
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependencies


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_with_auth(user_id: Optional[str] = None, role: str = "authenticated") -> Generator[Session, None, None]:
    """
    Get a database session with Supabase auth context set for RLS.

    Args:
        user_id: The authenticated user's UUID (from Supabase auth.uid())
        role: The role to set ('authenticated', 'service_role', etc.)
    """
    db = SessionLocal()
    try:
        # Set the auth context for RLS policies
        if user_id:
            # Set the user ID for auth.uid() function
            db.execute(text("SELECT set_config('request.jwt.claims', :claims, true)"),
                       {"claims": f'{{"sub": "{user_id}", "role": "{role}"}}'})

        # Set the role for auth.role() function
        db.execute(text("SELECT set_config('role', :role, true)"),
                   {"role": role})

        yield db
    finally:
        db.close()


@contextmanager
def get_service_db() -> Generator[Session, None, None]:
    """
    Get a database session with service role privileges (bypasses RLS).
    Use this for admin operations or when you need to access all data.
    """
    db = SessionLocal()
    try:
        # Set service role to bypass RLS
        db.execute(text("SELECT set_config('role', 'service_role', true)"))
        yield db
    finally:
        db.close()


# Initialize database


def init_db():
    from sqlalchemy import text

    # Import all models here to ensure they're registered with Base.metadata
    from .models import Profile, Caregiver, Session, ChatTurn, Topic, SessionTopic, Note, Activity, SessionActivity, Medication, MedicationReminder

    # Try to create pgvector extension if available
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
            logger.info("Successfully created pgvector extension")
    except Exception as e:
        logger.warning(
            f"Could not create pgvector extension: {e}. Continuing without vector support.")

    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Successfully created database tables")
