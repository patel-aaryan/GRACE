# G.R.A.C.E.

### Guided Responsive Assistant for Companionship & Engagement

## Overview

GRACE reduces loneliness for older adults, socially-isolated people, and their caregivers by providing a real-time voice companion with an on-screen avatar, wellness add-ons, and caregiver insights.

## Project Structure

- `/api` - Backend API (FastAPI)
- `/web` - Frontend application (Next.js)

## Database Management

This project uses Alembic for database migrations. For detailed instructions on database management, see [DB_MIGRATIONS.md](api/DB_MIGRATIONS.md).

### Quick Database Commands

```powershell
# Initialize database and apply migrations
cd api
python manage.py setup

# Create a new migration
python manage.py migrate -m "Description of changes"

# Apply migrations
python manage.py upgrade

# Run the server
python manage.py server
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   - Backend: `cd api && pip install -r requirements.txt`
   - Frontend: `cd web && npm install`
3. Setup the database: `cd api && python manage.py setup`
4. Start the development servers:
   - Backend: `cd api && python manage.py server`
   - Frontend: `cd web && npm run dev`

## License

See the [LICENSE](LICENSE) file for details.
