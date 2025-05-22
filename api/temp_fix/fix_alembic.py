import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

# Ensure we can import from the parent directory
parent_dir = str(Path(__file__).parent.parent.absolute())
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Load environment variables
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

print(f"Connecting to database...")

# Connect to database
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    # Check current alembic version
    print("Checking current alembic version...")
    cursor.execute("SELECT version_num FROM alembic_version")
    versions = cursor.fetchall()

    if versions:
        print(f"Current alembic version: {versions[0][0]}")

        # Ask for confirmation before resetting
        confirm = input(
            "Do you want to reset the alembic version table? (y/n): ")
        if confirm.lower() == 'y':
            cursor.execute("DELETE FROM alembic_version")
            print("Alembic version table cleared.")

            # Now create a new version entry with the correct ID
            bab_id = "bab36d0b43de"  # This is the ID from your __pycache__ file
            cursor.execute(
                f"INSERT INTO alembic_version (version_num) VALUES ('{bab_id}')")
            print(f"Set alembic version to: {bab_id}")
    else:
        print("No alembic version found in the database.")

        # Add the correct version
        bab_id = "bab36d0b43de"  # This is the ID from your __pycache__ file
        cursor.execute(
            f"INSERT INTO alembic_version (version_num) VALUES ('{bab_id}')")
        print(f"Set alembic version to: {bab_id}")

    cursor.close()
    conn.close()
    print("Database operation completed.")
except Exception as e:
    print(f"Error connecting to database: {e}")
    sys.exit(1)
