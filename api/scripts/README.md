# Database Scripts

This directory contains utility scripts for database operations and other project tasks.

## Migration Scripts

### PowerShell (Windows)

Run migrations using:

```powershell
.\scripts\migrate.ps1 -Message "Your migration description"
```

Example:

```powershell
.\scripts\migrate.ps1 -Message "Add phone number to User"
```

### Bash (Linux/macOS)

First, make the script executable:

```bash
chmod +x scripts/migrate.sh
```

Then run migrations using:

```bash
./scripts/migrate.sh "Your migration description"
```

Example:

```bash
./scripts/migrate.sh "Add phone number to User"
```

## What the Migration Scripts Do

The migration scripts automate the Alembic workflow by:

1. Creating a migration file based on changes to your models
2. Applying the migration to your database
3. Showing the current migration status

All commands are executed from the project root directory where `alembic.ini` is located.
