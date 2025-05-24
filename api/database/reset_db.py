from sqlalchemy import text
from .db import engine, Base
from .models import User, Caregiver, Session, ChatTurn, Topic, SessionTopic, Note, Activity, SessionActivity, Medication, MedicationReminder
import logging

logger = logging.getLogger(__name__)


def reset_database():
    try:
        # Drop all tables
        with engine.connect() as conn:
            conn.execute(text("DROP SCHEMA public CASCADE"))
            conn.execute(text("CREATE SCHEMA public"))
            conn.commit()
            logger.info("Successfully dropped all tables")

        # Create pgvector extension
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            conn.commit()
            logger.info("Successfully created pgvector extension")

        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Successfully recreated all tables")

    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        raise


if __name__ == "__main__":
    reset_database()
