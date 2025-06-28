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

# GRACE API

## Row Level Security (RLS) Implementation

This API implements comprehensive Row Level Security using Supabase and PostgreSQL to ensure users can only access their own data and caregivers can access data for profiles they manage.

### Running the RLS Migration

To enable RLS on your database, run the migration:

```bash
python -m alembic upgrade head
```

This will:

- Enable RLS on all tables
- Create policies ensuring users only see their own data
- Allow caregivers to access data for profiles they manage
- Allow service role to bypass RLS for admin operations

### RLS Policy Overview

#### Profiles Table

- Users can view/update their own profile
- Caregivers can view profiles they manage
- Service role can access all profiles

#### Sessions, Chat Turns, Notes, etc.

- Users can only access data from their own sessions
- Caregivers can access data from sessions of profiles they manage

#### Medications

- Users can manage their own medications
- Caregivers can view medications for profiles they manage

#### Activities & Topics

- Public read access for authenticated users
- These are shared resources

### Using RLS in Your FastAPI Routes

#### Basic Authentication

```python
from fastapi import Depends
from core.auth import get_current_user_id
from database.db import get_db

@app.get("/profile")
def get_profile(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Set auth context for RLS
    db.execute(text("SELECT set_config('request.jwt.claims', :claims, true)"),
               {"claims": f'{{"sub": "{user_id}", "role": "authenticated"}}'})

    # Now queries will automatically filter by RLS policies
    profile = db.query(Profile).filter(Profile.id == user_id).first()
    return profile
```

#### Service Role Operations (Admin)

```python
@app.get("/admin/all-profiles")
def get_all_profiles(db: Session = Depends(get_db)):
    # Set service role to bypass RLS
    db.execute(text("SELECT set_config('role', 'service_role', true)"))

    # This will return all profiles regardless of user
    profiles = db.query(Profile).all()
    return profiles
```

#### Manual Context Setting

```python
from sqlalchemy import text

def some_operation_with_auth(user_id: str):
    db = SessionLocal()
    try:
        # Set auth context
        db.execute(text("SELECT set_config('request.jwt.claims', :claims, true)"),
                   {"claims": f'{{"sub": "{user_id}", "role": "authenticated"}}'})

        # Your queries here will respect RLS
        sessions = db.query(Session).all()  # Only user's sessions
        return sessions
    finally:
        db.close()
```

### Environment Variables Required

Make sure you have these environment variables set:

```bash
DATABASE_URL=postgresql://postgres:[password]@[host]/[database]
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_URL=https://your-project.supabase.co
```

### Testing RLS

You can test RLS policies directly in your database:

```sql
-- Test as regular user
SELECT set_config('request.jwt.claims', '{"sub": "user-uuid-here", "role": "authenticated"}', true);
SELECT * FROM profiles; -- Should only return user's profile

-- Test as service role
SELECT set_config('role', 'service_role', true);
SELECT * FROM profiles; -- Should return all profiles
```

### Security Considerations

1. **Always set auth context**: Every database operation should set the appropriate auth context
2. **Use service role sparingly**: Only use service role for admin operations
3. **Validate JWT tokens**: Always verify tokens before setting auth context
4. **Test policies**: Regularly test your RLS policies to ensure they work as expected

### Disabling RLS (Emergency)

If you need to disable RLS temporarily:

```bash
python -m alembic downgrade -1
```

This will remove all RLS policies and disable RLS on all tables.
