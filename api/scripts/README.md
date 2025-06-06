# Scripts Directory

This directory contains utility scripts for the GRACE API.

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
