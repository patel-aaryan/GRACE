"""Create a new migration"""
from alembic import command
from alembic.config import Config
import sys
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Get migration message from command line arguments
message = "New migration"
if len(sys.argv) > 1:
    message = sys.argv[1]

# Create a migration
try:
    config = Config(os.path.join(os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))), "alembic.ini"))
    command.revision(config, message=message, autogenerate=True)
    print(f"Migration '{message}' created successfully!")
except Exception as e:
    print(f"Error creating migration: {e}")
