# GRACE API Scripts

This directory contains utility scripts for managing the GRACE API.

## Scripts Overview

- **create_migration.py**: Utility to create a new database migration
- **init_db.py**: Initialize the database and create the initial tables
- **init_migration.py**: Initialize Alembic migrations for an existing database schema

Note: The main management script **run.py** has been moved to the root API directory.

## Usage

### Running the API Server

```
cd api
python run.py server [--host HOST] [--port PORT] [--no-reload]
```

Or using the wrapper script:

```
cd api
python run_script.py run server [--host HOST] [--port PORT] [--no-reload]
```

### Managing Migrations

Create a new migration:

```
cd api
python run.py migrate [-m MESSAGE]
```

Apply migrations:

```
cd api
python run.py upgrade [REVISION]
```

Downgrade migrations:

```
cd api
python run.py downgrade [REVISION]
```

View migration history:

```
cd api
python run.py history
```

### Database Setup

Initialize the database and apply all migrations:

```
cd api
python run.py setup
```

## Note

All scripts should be run from the `api` directory, not from within the `scripts` directory.
