#!/usr/bin/env python
import os
import sys
import argparse
import subprocess
import uvicorn
from dotenv import load_dotenv
from alembic.config import Config
from alembic import command

# Load environment variables
load_dotenv()


def run_server(host="localhost", port=8000, reload=True):
    """Run the FastAPI server"""
    print(f"Starting server on {host}:{port} (reload={reload})")
    uvicorn.run("main:app", host=host, port=port, reload=reload)


def run_migrations(args):
    """Run Alembic database migrations"""
    alembic_cfg = Config("alembic.ini")

    if args.command == "migrate":
        # Create a new migration
        message = args.message or "New migration"
        command.revision(alembic_cfg, message=message, autogenerate=True)
        print(f"Created new migration: {message}")

    elif args.command == "upgrade":
        # Upgrade to the latest revision
        revision = args.revision or "head"
        command.upgrade(alembic_cfg, revision)
        print(f"Upgraded database to {revision}")

    elif args.command == "downgrade":
        # Downgrade to a specific revision
        revision = args.revision or "-1"
        command.downgrade(alembic_cfg, revision)
        print(f"Downgraded database to {revision}")

    elif args.command == "history":
        # Show migration history
        command.history(alembic_cfg)

    elif args.command == "current":
        # Show current revision
        command.current(alembic_cfg)

    elif args.command == "show":
        # Show migration details
        if not args.revision:
            print("Error: revision is required for show command")
            sys.exit(1)
        command.show(alembic_cfg, args.revision)


def setup_database():
    """Initialize database and apply all migrations"""
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Database initialized and migrations applied")


def main():
    parser = argparse.ArgumentParser(description="GRACE API Management Tool")
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # Server command
    server_parser = subparsers.add_parser("server", help="Run the API server")
    server_parser.add_argument(
        "--host", default="localhost", help="Host to bind the server to")
    server_parser.add_argument(
        "--port", type=int, default=8000, help="Port to bind the server to")
    server_parser.add_argument(
        "--no-reload", action="store_true", help="Disable auto-reload")

    # Migrations commands
    migrate_parser = subparsers.add_parser(
        "migrate", help="Create a new migration")
    migrate_parser.add_argument("-m", "--message", help="Migration message")

    upgrade_parser = subparsers.add_parser(
        "upgrade", help="Upgrade database schema")
    upgrade_parser.add_argument(
        "revision", nargs="?", default="head", help="Revision to upgrade to (default: head)")

    downgrade_parser = subparsers.add_parser(
        "downgrade", help="Downgrade database schema")
    downgrade_parser.add_argument(
        "revision", nargs="?", default="-1", help="Revision to downgrade to (default: -1)")

    subparsers.add_parser("history", help="Show migration history")
    subparsers.add_parser("current", help="Show current migration version")

    show_parser = subparsers.add_parser(
        "show", help="Show a specific migration")
    show_parser.add_argument("revision", help="Revision to show")

    # Setup command
    subparsers.add_parser(
        "setup", help="Initialize database and apply all migrations")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Execute the appropriate command
    if args.command == "server":
        run_server(host=args.host, port=args.port, reload=not args.no_reload)
    elif args.command == "setup":
        setup_database()
    else:
        run_migrations(args)


if __name__ == "__main__":
    main()
