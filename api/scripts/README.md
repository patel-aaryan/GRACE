# Scripts Directory

This directory contains utility scripts for the GRACE API.

## Quick Start - Using run.py

The easiest way to run any script is through the `run.py` entry point in the api directory:

```bash
cd api
python run.py <command> [options]
```

### Available Commands

| Command   | Description                                  |
| --------- | -------------------------------------------- |
| `migrate` | Run database migrations (generate and apply) |
| `server`  | Start the FastAPI backend server             |
| `help`    | Show help information                        |
| `list`    | List all available commands                  |

### Examples

```bash
# Show all available commands
python run.py

# Get help for a specific command
python run.py help migrate

# Run a migration
python run.py migrate "add user preferences"

# Start the server
python run.py server

# List available commands
python run.py list
```

### Benefits of using run.py

- **Single entry point**: No need to remember script locations
- **Consistent interface**: All scripts accessed the same way
- **Built-in help**: Easy discovery of available commands
- **Pass-through arguments**: All script options still available

---

## Individual Scripts

You can also run scripts directly from the scripts directory:

## migrate.py

A utility script that automates the Alembic migration workflow by running migration generation and database upgrade commands sequentially.

### Features

- **Sequential Execution**: Automatically runs `alembic revision --autogenerate -m` followed by `alembic upgrade head`
- **Flexible Input**: Accepts migration message via command line or interactive prompt
- **Skip Upgrade Option**: Can generate migrations without applying them
- **Error Handling**: Provides clear error messages and appropriate exit codes
- **Visual Feedback**: Shows progress with separators and success/failure indicators

### Requirements

- Python 3.x
- Alembic installed (part of the project dependencies)
- Must be run from the `api` directory (where `alembic.ini` is located)

### Usage

#### Basic Usage

Generate and apply a migration in one command:

```bash
cd api
python scripts/migrate.py "add user preferences table"
```

#### Interactive Mode

Run without arguments to be prompted for the migration message:

```bash
cd api
python scripts/migrate.py
```

#### Generate Only (Skip Upgrade)

Generate a migration without applying it to the database:

```bash
cd api
python scripts/migrate.py "update session schema" --skip-upgrade
```

#### Show Help

Display usage information:

```bash
cd api
python scripts/migrate.py --help
```

### Command Line Options

| Option           | Description                                                                       |
| ---------------- | --------------------------------------------------------------------------------- |
| `message`        | Migration message describing the changes (optional - will prompt if not provided) |
| `--skip-upgrade` | Only generate the migration file, skip the database upgrade step                  |
| `--help`, `-h`   | Show help message and exit                                                        |

### Examples

1. **Add a new table**:

   ```bash
   python scripts/migrate.py "add notifications table"
   ```

2. **Update existing schema**:

   ```bash
   python scripts/migrate.py "add email_verified column to users"
   ```

3. **Review before applying**:
   ```bash
   python scripts/migrate.py "complex schema changes" --skip-upgrade
   # Review the generated migration file
   alembic upgrade head  # Apply when ready
   ```

### How It Works

1. **Validation**: Checks that you're in the correct directory (must contain `alembic.ini`)
2. **Generation**: Runs `alembic revision --autogenerate -m <message>` to create a new migration file
3. **Application**: Runs `alembic upgrade head` to apply all pending migrations (unless skipped)
4. **Feedback**: Provides clear status messages throughout the process

### Error Handling

- If migration generation fails, the script exits without attempting to upgrade
- If upgrade fails, you'll get instructions to review and manually fix the migration
- All Alembic output is preserved and displayed for debugging

### Tips

- Always review generated migrations before applying them in production
- Use descriptive migration messages that explain what changes are being made
- Consider using `--skip-upgrade` for complex migrations that need manual review
- Keep migration messages consistent with your team's naming conventions

### Troubleshooting

**"This script must be run from the 'api' directory!"**

- Make sure you're in the `api` directory before running the script
- The script looks for `alembic.ini` to confirm it's in the right location

**"Migration generation failed"**

- Check that your database models are properly imported in `alembic/env.py`
- Ensure your database connection is working
- Review the error output for specific issues

**"Migration application failed"**

- The generated migration might have issues
- Review the migration file in `migrations/versions/`
- You may need to manually edit the migration before applying it

---

## server.py

A comprehensive server management script for running GRACE backend services. Handles starting, stopping, and monitoring the FastAPI gateway service.

### Features

- **Multi-Service Management**: Start individual services or all services at once
- **Graceful Shutdown**: Proper signal handling for clean service termination
- **Process Monitoring**: Detects when services crash and provides feedback
- **Environment Validation**: Checks for required files and directories
- **Background Mode**: Run services in background with process management
- **Development Support**: Built-in reload and development mode options

### Requirements

- Python 3.x
- uvicorn (for FastAPI service)
- All project dependencies installed
- Must be run from the `api` directory

### Usage

#### Start Default API Service

Start the FastAPI gateway service:

```bash
cd api
python scripts/server.py
```

#### Start Specific Service

Start a particular service:

```bash
cd api
python scripts/server.py --service api
```

#### Start All Services

Start all GRACE backend services:

```bash
cd api
python scripts/server.py --all
```

#### List Available Services

Show all available services and their configurations:

```bash
cd api
python scripts/server.py --list
```

#### Show Help

Display usage information:

```bash
cd api
python scripts/server.py --help
```

### Command Line Options

| Option            | Description                                |
| ----------------- | ------------------------------------------ |
| `--service`, `-s` | Start a specific service (api)             |
| `--all`, `-a`     | Start all services in background           |
| `--list`, `-l`    | List available services and their commands |
| `--dev`           | Run in development mode (with reload)      |
| `--help`, `-h`    | Show help message and exit                 |

### Available Services

| Service | Description            | Default Port | Command                     |
| ------- | ---------------------- | ------------ | --------------------------- |
| `api`   | FastAPI Gateway Server | 8000         | `uvicorn main:app --reload` |

### Examples

1. **Development workflow**:

   ```bash
   # Start API service with auto-reload
   python scripts/server.py --service api
   ```

2. **Check service configuration**:

   ```bash
   # List available services
   python scripts/server.py --list
   ```

### How It Works

1. **Validation**: Checks that you're in the correct directory and required files exist
2. **Service Configuration**: Loads predefined service configurations
3. **Process Management**: Starts processes with proper environment setup
4. **Signal Handling**: Registers handlers for graceful shutdown (Ctrl+C, SIGTERM)
5. **Monitoring**: Watches running processes and reports status changes

### Process Management

- **Graceful Shutdown**: Services receive SIGTERM first, then SIGKILL if needed
- **Background Mode**: When using `--all`, services run in background with output capture
- **Process Monitoring**: Detects crashed services and reports exit codes
- **Clean Exit**: All processes are properly terminated when script exits

### Environment Setup

The script automatically:

- Sets up proper working directories for each service
- Loads environment variables from `.env` files
- Validates required files exist before starting services
- Provides warnings for missing configuration files

### Troubleshooting

**"This script should be run from the 'api' directory!"**

- Make sure you're in the `api` directory before running the script
- The script looks for `main.py` or `app.py` to confirm location

**"Command not found: uvicorn"**

- Install FastAPI dependencies: `pip install uvicorn fastapi`
- Or install all project dependencies: `pipenv install`

**"Service directory not found"**

- Check that all service directories exist as configured
- Adjust service paths in the script if your project structure differs

**Services crash on startup**

- Check that all dependencies are installed
- Verify environment variables are properly set
- Check service logs for specific error messages

### Customization

To add or modify services, edit the `services` dictionary in the `ServerManager` class:

```python
self.services = {
    'your_service': {
        'command': ['your', 'command', 'here'],
        'description': 'Your Service Description',
        'cwd': './path/to/service',
        'env_file': '.env'
    }
}
```
