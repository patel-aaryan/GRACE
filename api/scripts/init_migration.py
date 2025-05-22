"""Initialize database and create initial migration"""
from dotenv import load_dotenv
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Create a migration
config = Config(os.path.join(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))), "alembic.ini"))

# First, stamp the database with the 'base' revision (empty database)
try:
    command.stamp(config, "base")
    print("Database stamped with base revision")
except Exception as e:
    print(f"Error stamping database: {e}")

# Then create the initial revision
try:
    command.revision(
        config, message="Initial database schema", autogenerate=True)
    print("Initial migration created successfully!")
except Exception as e:
    print(f"Error creating initial migration: {e}")

print("Done!")
