#!/usr/bin/env python
"""
Backend server management script for GRACE API.
Handles starting the FastAPI server with proper signal handling.
"""

import subprocess
import sys
import os
import signal
import time
import argparse
from datetime import datetime
from typing import Optional


class ServerManager:
    def __init__(self):
        self.process: Optional[subprocess.Popen] = None
        self.server_config = {
            'command': ['uvicorn', 'main:app', '--reload', '--host', 'localhost', '--port', '8000'],
            'description': 'FastAPI Gateway Server',
            'env_file': '.env'
        }

    def signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully."""
        print(f"\n🛑 Received signal {signum}. Shutting down server...")
        self.stop_server()
        sys.exit(0)

    def setup_signal_handlers(self):
        """Set up signal handlers for graceful shutdown."""
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

    def check_requirements(self) -> bool:
        """Check if service requirements are met."""
        # Check if environment file exists
        if not os.path.exists(self.server_config['env_file']):
            print(
                f"⚠️  Environment file not found: {self.server_config['env_file']}")
            print("   Server may not start correctly without proper configuration")

        return True

    def run_server(self, dev: bool = True) -> Optional[subprocess.Popen]:
        """Start the FastAPI server."""
        if not self.check_requirements():
            return None

        # Modify command based on dev mode
        command = self.server_config['command'].copy()
        if not dev:
            # Remove --reload flag for production
            command = [cmd for cmd in command if cmd != '--reload']

        print(f"\n🚀 Starting {self.server_config['description']}...")
        print(f"   Command: {' '.join(command)}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   Mode: {'Development' if dev else 'Production'}")

        try:
            # Set up environment
            env = os.environ.copy()

            # Start the process
            self.process = subprocess.Popen(
                command,
                env=env,
                text=True
            )

            print(f"✅ {self.server_config['description']} running...")
            print(f"   Access at: http://localhost:8000")
            print(f"   API docs: http://localhost:8000/docs")
            print("\n   Press Ctrl+C to stop the server")

            # Wait for the process to complete
            self.process.wait()

            return self.process

        except FileNotFoundError:
            print(f"❌ Command not found: {command[0]}")
            print("   Make sure uvicorn is installed: pipenv install uvicorn")
            return None
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            return None

    def stop_server(self):
        """Stop the server process."""
        if self.process and self.process.poll() is None:
            print(f"🛑 Stopping server...")
            self.process.terminate()

            # Wait for graceful shutdown
            try:
                self.process.wait(timeout=5)
                print(f"✅ Server stopped gracefully")
            except subprocess.TimeoutExpired:
                print(f"⚠️  Force killing server...")
                self.process.kill()
                self.process.wait()
                print(f"✅ Server force stopped")


def main():
    parser = argparse.ArgumentParser(
        description='GRACE Backend Server Manager',
        epilog='Examples:\n'
               '  python scripts/server.py          # Start in development mode\n'
               '  python scripts/server.py --prod   # Start in production mode',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        '--prod',
        action='store_true',
        help='Run in production mode (no auto-reload)'
    )

    args = parser.parse_args()

    # Ensure we're in the correct directory
    if not os.path.exists("main.py") and not os.path.exists("app.py"):
        print("❌ This script should be run from the 'api' directory!")
        print(f"   Current directory: {os.getcwd()}")
        sys.exit(1)

    manager = ServerManager()
    manager.setup_signal_handlers()

    # Start the server
    manager.run_server(dev=not args.prod)


if __name__ == "__main__":
    main()
