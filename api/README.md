# G.R.A.C.E API

## Setup

### 1. Environment Setup

```powershell
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate  # Linux/macOS

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Configuration

Create a `.env` file in the root directory with your database connection details:

```
DATABASE_URL=postgresql://username:password@localhost/dbname
```

### 3. Run Database Migrations

```powershell
python run.py migrate "Initial migration"
```

## Running the Application

### Start the API Server

```powershell
python run.py server
```

Options:

- `--host HOST` - Specify host (default: 127.0.0.1)
- `--port PORT` - Specify port (default: 8000)
- `--no-reload` - Disable auto-reload

Example:

```powershell
python run.py server --host 0.0.0.0 --port 5000
```

### Apply Database Migrations

When you make changes to your database models:

```powershell
python run.py migrate "Description of your changes"
```

### Help

Display available commands:

```powershell
python run.py help
```

## Development Workflow

1. Update models in `datastores/models.py`
2. Run migration: `python run.py migrate "Description of changes"`
3. Implement new endpoints in `routes/` directory
4. Register routes in `main.py`
5. Run server: `python run.py server`

## Project Structure

```
api/
├── alembic/                # Database migration scripts
├── controllers/            # Business logic controllers
├── datastores/             # Database models and connection
├── routes/                 # API endpoints
├── scripts/                # Utility scripts
├── services/               # Service layer
├── validators/             # Input validation
├── .env                    # Environment variables (not in git)
├── alembic.ini             # Alembic configuration
├── main.py                 # FastAPI application
├── run.py                  # Command runner script
└── README.md               # This file
```
