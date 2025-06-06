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

A server management script for running the GRACE FastAPI backend with proper signal handling and graceful shutdown.

### Features

- **Graceful Shutdown**: Proper signal handling for clean service termination
- **Development Mode**: Auto-reload for development (default)
- **Production Mode**: Run without auto-reload for production
- **Environment Validation**: Checks for required configuration files
- **Clear Status Messages**: Shows server URLs and status

### Requirements

- Python 3.x
- uvicorn (for FastAPI service)
- All project dependencies installed
- Must be run from the `api` directory

### Usage

#### Start in Development Mode (default)

Start the FastAPI server with auto-reload enabled:

```bash
cd api
python scripts/server.py
```

#### Start in Production Mode

Start the server without auto-reload:

```bash
cd api
python scripts/server.py --prod
```

#### Show Help

Display usage information:

```bash
cd api
python scripts/server.py --help
```

### Command Line Options

| Option         | Description                             |
| -------------- | --------------------------------------- |
| `--prod`       | Run in production mode (no auto-reload) |
| `--help`, `-h` | Show help message and exit              |

### Server Details

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| Default Port | 8000                                                   |
| Default Host | 0.0.0.0 (accessible from any network interface)        |
| API Docs     | http://localhost:8000/docs                             |
| Command      | `uvicorn main:app --reload --host 0.0.0.0 --port 8000` |

### Examples

1. **Development workflow**:

   ```bash
   # Start server with auto-reload for development
   python scripts/server.py
   ```

2. **Production deployment**:
   ```bash
   # Start server without auto-reload
   python scripts/server.py --prod
   ```

### How It Works

1. **Validation**: Checks that you're in the correct directory and .env file exists
2. **Process Management**: Starts uvicorn with proper environment setup
3. **Signal Handling**: Registers handlers for graceful shutdown (Ctrl+C, SIGTERM)
4. **Status Display**: Shows server URLs and running status

### Process Management

- **Graceful Shutdown**: Server receives SIGTERM first, then SIGKILL if needed
- **Clean Exit**: Process is properly terminated when script exits
- **Status Messages**: Clear feedback about server state

### Environment Setup

The script automatically:

- Loads environment variables from `.env` file
- Validates required files exist before starting
- Provides warnings for missing configuration files

### Troubleshooting

**"This script should be run from the 'api' directory!"**

- Make sure you're in the `api` directory before running the script
- The script looks for `main.py` or `app.py` to confirm location

**"Command not found: uvicorn"**

- Install FastAPI dependencies: `pipenv install uvicorn`
- Or install all project dependencies: `pipenv install`

**Server crashes on startup**

- Check that all dependencies are installed
- Verify environment variables are properly set in `.env`
- Check server logs for specific error messages
- Ensure port 8000 is not already in use
