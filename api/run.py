#!/usr/bin/env python
"""
GRACE API Runner - Central entry point for all utility scripts.
Usage: python run.py <command> [options]
"""

import sys
import os
import subprocess
import argparse
from pathlib import Path
from typing import List, Dict, Optional


class ScriptRunner:
    def __init__(self):
        self.scripts_dir = Path("scripts")
        self.available_scripts = self._discover_scripts()

    def _discover_scripts(self) -> Dict[str, Dict]:
        """Discover available scripts in the scripts directory."""
        scripts = {}

        if not self.scripts_dir.exists():
            return scripts

        # Define known scripts and their metadata
        known_scripts = {
            'migrate': {
                'file': 'migrate.py',
                'description': 'Run database migrations (generate and apply)',
                'examples': [
                    'python run.py migrate "add user table"',
                    'python run.py migrate --skip-upgrade "complex changes"'
                ]
            },
            'server': {
                'file': 'server.py',
                'description': 'Start the FastAPI backend server',
                'examples': [
                    'python run.py server',
                    'python run.py server --prod'
                ]
            }
        }

        # Verify scripts exist
        for name, info in known_scripts.items():
            script_path = self.scripts_dir / info['file']
            if script_path.exists():
                info['path'] = script_path
                scripts[name] = info

        return scripts

    def run_script(self, command: str, args: List[str]) -> int:
        """Run a specific script with given arguments."""
        if command not in self.available_scripts:
            print(f"❌ Unknown command: '{command}'")
            print(
                f"   Available commands: {', '.join(self.available_scripts.keys())}")
            return 1

        script_info = self.available_scripts[command]
        script_path = script_info['path']

        # Build the command
        cmd = [sys.executable, str(script_path)] + args

        print(f"🚀 Running: {command}")
        print(f"   Script: {script_path}")
        if args:
            print(f"   Arguments: {' '.join(args)}")
        print("")

        # Run the script
        try:
            result = subprocess.run(cmd)
            return result.returncode
        except KeyboardInterrupt:
            print("\n⚠️  Interrupted by user")
            return 130  # Standard exit code for Ctrl+C
        except Exception as e:
            print(f"❌ Error running script: {e}")
            return 1

    def show_help(self, command: Optional[str] = None):
        """Show help information."""
        if command:
            if command not in self.available_scripts:
                print(f"❌ Unknown command: '{command}'")
                return

            script = self.available_scripts[command]
            print(f"📋 Command: {command}")
            print(f"   Description: {script['description']}")
            print(f"   Script: {script['path']}")
            print("\n   Examples:")
            for example in script.get('examples', []):
                print(f"     {example}")
            print("\n   For more options, run:")
            print(f"     python run.py {command} --help")
        else:
            print("🌟 GRACE API Runner")
            print("   Central entry point for all utility scripts\n")
            print("   Usage: python run.py <command> [options]\n")
            print("📋 Available commands:")

            for name, info in self.available_scripts.items():
                print(f"\n   {name:<12} - {info['description']}")
                if 'examples' in info and info['examples']:
                    print(f"   {'':12}   Example: {info['examples'][0]}")

            print("\n💡 Tips:")
            print("   - Use 'python run.py help <command>' for command-specific help")
            print("   - Use 'python run.py <command> --help' for detailed options")
            print("   - All commands must be run from the 'api' directory")


def main():
    # Check if we're in the correct directory
    if not os.path.exists("main.py") and not os.path.exists("scripts"):
        print("❌ This script must be run from the 'api' directory!")
        print(f"   Current directory: {os.getcwd()}")
        sys.exit(1)

    runner = ScriptRunner()

    # Parse arguments
    if len(sys.argv) < 2:
        runner.show_help()
        sys.exit(0)

    command = sys.argv[1].lower()
    args = sys.argv[2:]

    # Handle help command
    if command in ['help', '-h', '--help']:
        if args:
            runner.show_help(args[0])
        else:
            runner.show_help()
        sys.exit(0)

    # Handle list command (shortcut)
    if command == 'list':
        print("📋 Available commands:")
        for name in runner.available_scripts.keys():
            print(f"   - {name}")
        sys.exit(0)

    # Run the requested script
    exit_code = runner.run_script(command, args)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
