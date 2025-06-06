# Database Migrations with Alembic

This project uses Alembic for database migrations. This document explains how to use the migration system.

## Overview

Alembic is used to:

- Track changes to database schema
- Create migration scripts
- Apply migrations
- Rollback migrations if needed

## Prerequisites

Make sure you have all required dependencies installed:

```bash
pip install alembic sqlalchemy psycopg2-binary
```

## Management Scripts

Our script structure:

- Main management script: `run.py` (in root api directory)
- Utility scripts: `scripts/create_migration.py`, `scripts/init_db.py`, etc.

You can use the main script directly:

```powershell
python run.py server  # Run the API server
```

Or use the convenient wrapper script:

```powershell
python run_script.py run server  # Run the API server
```

## Using the Migration System

### Creating a New Migration

To create a new migration after making changes to models:

```powershell
python run.py migrate -m "Description of the changes"
```

This will create a new migration file in the `alembic/versions` directory.

### Applying Migrations

To apply all pending migrations:

```powershell
python run.py upgrade
```

To upgrade to a specific revision:

```powershell
python run.py upgrade <revision_id>
```

### Rolling Back Migrations

To rollback the most recent migration:

```powershell
python run.py downgrade
```

To rollback to a specific revision:

```powershell
python run.py downgrade <revision_id>
```

### Migration History

To view migration history:

```powershell
python run.py history
```

### Current Migration

To view the current migration:

```powershell
python run.py current
```

### Setup Database

To initialize the database and apply all migrations:

```powershell
python run.py setup
```

## Making Schema Changes

1. Modify the models in `database/models.py`
2. Create a migration: `python run.py migrate -m "Description"`
3. Review the generated migration script in `alembic/versions/`
4. Apply the migration: `python run.py upgrade`

## Running the Server

To run the API server:

```powershell
python run.py server
```

Server options:

- `--host`: Host to bind (default: 0.0.0.0)
- `--port`: Port to bind (default: 8000)
- `--no-reload`: Disable auto-reload

## Common Issues and Solutions

### "Target database is not up to date"

Run `python run.py upgrade` to apply all pending migrations.

### "Can't locate revision identified by..."

Ensure you're using the correct revision ID. Use `python run.py history` to see all revisions.

### "Table already exists" during migration

This can happen if you've already created tables manually. You can:

1. Drop the tables and re-run migrations
2. Or create a new migration that skips creating existing tables

## Best Practices

1. Always run migrations in development before deploying to production
2. Back up your database before applying migrations in production
3. Keep migrations small and focused on specific changes
4. Test both upgrade and downgrade paths
5. Add clear descriptions to migrations using the `-m` option
