"""Initialize database and create initial migration"""
from alembic import command
from alembic.config import Config
from database.db import init_db, Base, engine
from dotenv import load_dotenv
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

print("Creating database tables...")
# Create tables
init_db()
print("Database tables created successfully!")

# Now set up Alembic
print("Setting up Alembic...")
config = Config(os.path.join(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))), "alembic.ini"))

# Stamp the database with the current state
try:
    command.stamp(config, "head")
    print("Database stamped with current state")
except Exception as e:
    print(f"Error stamping database: {e}")

print("Database initialization complete!")
