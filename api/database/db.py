from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv
import logging

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
