"""Initialize database and create initial migration"""
import os
from dotenv import load_dotenv
from database.db import init_db, Base, engine
from alembic.config import Config
from alembic import command

# Load environment variables
load_dotenv()

print("Creating database tables...")
# Create tables
init_db()
print("Database tables created successfully!")

# Now set up Alembic
print("Setting up Alembic...")
config = Config("alembic.ini")

# Stamp the database with the current state
try:
    command.stamp(config, "head")
    print("Database stamped with current state")
except Exception as e:
    print(f"Error stamping database: {e}")

print("Database initialization complete!")
