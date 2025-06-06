#!/usr/bin/env python
"""
Utility script to run Alembic migration commands sequentially.
Usage: 
    python migrate.py "migration message"
    python migrate.py --help
"""

import subprocess
import sys
import os
from datetime import datetime
import argparse


def run_command(command, description):
    """Run a command and handle output."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print('='*60)

    try:
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True
        )

        # Print stdout if any
        if result.stdout:
            print(result.stdout)

        print(f"✓ {description} completed successfully!")
        return True

    except subprocess.CalledProcessError as e:
        print(f"✗ Error running {description}:")
        print(f"Exit code: {e.returncode}")
        if e.stdout:
            print("Output:", e.stdout)
        if e.stderr:
            print("Error:", e.stderr)
        return False


def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Run Alembic migration generation and upgrade sequentially.',
        epilog='Example: python migrate.py "add user preferences table"'
    )
    parser.add_argument(
        'message',
        nargs='?',
        help='Migration message describing the changes'
    )
    parser.add_argument(
        '--skip-upgrade',
        action='store_true',
        help='Only generate migration, skip the upgrade step'
    )

    # Parse arguments
    args = parser.parse_args()

    # Get migration message
    migration_message = args.message
    if not migration_message:
        migration_message = input("Enter migration message: ").strip()

    if not migration_message:
        print("Error: Migration message cannot be empty!")
        sys.exit(1)

    # Ensure we're in the api directory
    if not os.path.exists("alembic.ini"):
        print("Error: This script must be run from the 'api' directory!")
        print("Current directory:", os.getcwd())
        sys.exit(1)

    print(f"\nMigration message: '{migration_message}'")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Step 1: Generate migration
    generate_cmd = ["alembic", "revision",
                    "--autogenerate", "-m", migration_message]
    if not run_command(generate_cmd, "Generate migration"):
        print("\nMigration generation failed. Aborting.")
        sys.exit(1)

    # Step 2: Apply migration (unless skipped)
    if not args.skip_upgrade:
        upgrade_cmd = ["alembic", "upgrade", "head"]
        if not run_command(upgrade_cmd, "Apply migration"):
            print("\nMigration application failed.")
            print("You may need to manually review and fix the generated migration.")
            print("To apply manually later, run: alembic upgrade head")
            sys.exit(1)

        print("\n✓ Migration completed successfully!")
        print("Both migration generation and database upgrade have been completed.")
    else:
        print("\n✓ Migration generated successfully!")
        print("Skipped upgrade step. To apply the migration, run: alembic upgrade head")


if __name__ == "__main__":
    main()
