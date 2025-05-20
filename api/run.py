#!/usr/bin/env python
import os
import sys
import subprocess
import platform


def print_colored(text, color):
    """Print colored text in terminal"""
    colors = {
        "blue": "\033[94m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "cyan": "\033[96m",
        "reset": "\033[0m",
    }
    print(f"{colors.get(color, '')}{text}{colors['reset']}")


def run_server(host="127.0.0.1", port="8000", reload=True):
    """Run the FastAPI server using uvicorn"""
    print_colored("Starting server...", "green")
    reload_flag = "--reload" if reload else ""
    command = f"uvicorn main:app --host {host} --port {port} {reload_flag}"
    print_colored(f"Running: {command}", "blue")
    subprocess.run(command, shell=True)


def run_migration(message):
    """Run database migrations using the appropriate script"""
    if not message:
        print_colored("Error: Migration message is required", "red")
        print("Usage: python run.py migrate \"Your migration message\"")
        sys.exit(1)

    print_colored(f"Running migration: {message}", "cyan")

    # Use the appropriate script based on the operating system
    if platform.system() == "Windows":
        script_path = os.path.join("scripts", "migrate.ps1")
        command = f"powershell -ExecutionPolicy Bypass -File {script_path} -Message \"{message}\""
    else:
        script_path = os.path.join("scripts", "migrate.sh")
        # Ensure the script is executable
        os.chmod(script_path, 0o755)
        command = f"{script_path} \"{message}\""

    print_colored(f"Running: {command}", "blue")
    subprocess.run(command, shell=True)


def show_help():
    """Display help information"""
    help_text = """
    GRACE API Command Runner
    ========================
    
    Available commands:
    
    python run.py server [--host HOST] [--port PORT] [--no-reload]
        Start the FastAPI server
        Options:
            --host HOST     Specify the host (default: 127.0.0.1)
            --port PORT     Specify the port (default: 8000)
            --no-reload     Disable auto-reload
    
    python run.py migrate "Migration message"
        Run database migrations
        
    python run.py help
        Show this help message
    """
    print(help_text)


def main():
    # Check if arguments were provided
    if len(sys.argv) < 2:
        show_help()
        sys.exit(1)

    command = sys.argv[1].lower()

    if command == "server":
        # Parse server arguments
        host = "127.0.0.1"
        port = "8000"
        reload = True

        i = 2
        while i < len(sys.argv):
            if sys.argv[i] == "--host" and i + 1 < len(sys.argv):
                host = sys.argv[i + 1]
                i += 2
            elif sys.argv[i] == "--port" and i + 1 < len(sys.argv):
                port = sys.argv[i + 1]
                i += 2
            elif sys.argv[i] == "--no-reload":
                reload = False
                i += 1
            else:
                i += 1

        run_server(host, port, reload)

    elif command == "migrate":
        # Get migration message (combine remaining arguments)
        if len(sys.argv) < 3:
            print_colored("Error: Migration message is required", "red")
            print("Usage: python run.py migrate \"Your migration message\"")
            sys.exit(1)

        message = " ".join(sys.argv[2:])
        run_migration(message)

    elif command in ["help", "--help", "-h"]:
        show_help()

    else:
        print_colored(f"Unknown command: {command}", "red")
        show_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
