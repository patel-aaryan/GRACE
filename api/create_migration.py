"""Create a new migration"""
from alembic.config import Config
from alembic import command
import sys

# Get migration message from command line arguments
message = "New migration"
if len(sys.argv) > 1:
    message = sys.argv[1]

# Create a migration
try:
    config = Config("alembic.ini")
    command.revision(config, message=message, autogenerate=True)
    print(f"Migration '{message}' created successfully!")
except Exception as e:
    print(f"Error creating migration: {e}")
