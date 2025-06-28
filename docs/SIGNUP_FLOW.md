# Sign-up Flow Documentation

## Overview

The GRACE application implements a two-step sign-up process:

1. **Email verification** - User provides email and password
2. **Profile completion** - User fills in additional profile information

## Flow Details

### Step 1: Initial Sign-up

- User visits `/auth/signup`
- Enters email and password
- Receives verification email from Supabase
- Email contains link to `/auth/callback?code=...`

### Step 2: Email Verification & Profile Check

- User clicks verification link
- Auth callback (`/auth/callback`) processes the verification
- Backend checks if user has completed their profile via `/profile/check`
- **If profile is complete:** Redirect to `/chat`
- **If profile is incomplete:** Redirect to `/auth/complete-profile`

### Step 3: Profile Completion

- User fills out the profile form at `/auth/complete-profile`
- Form includes:
  - Date of birth (required)
  - Preferred speech speed (slider: 0.5x - 2.0x)
  - Avatar type (3D, Realistic, Simple)
  - Accessibility preferences (toggles for large text, high contrast, etc.)
- On submit, profile data is sent to `/api/profile` (POST)
- Backend creates/updates the profile record
- User is redirected to `/chat`

## Technical Implementation

### Frontend Routes

- `/auth/signup` - Initial sign-up form
- `/auth/complete-profile` - Profile completion form
- `/auth/callback` - Handles email verification

### API Endpoints

- `GET /profile/check` - Check if profile exists and is complete
- `POST /profile` - Create new profile
- `PUT /profile` - Update existing profile
- `GET /profile` - Get current user's profile

### Database

- Supabase handles user authentication
- Profiles table stores user preferences and profile data
- Trigger automatically creates basic profile on auth.users insert
- Profile completion updates the existing record

### Key Features

- Automatic profile creation via database trigger
- Seamless integration with Supabase auth
- Accessibility-first design with customizable preferences
- Mobile-responsive UI with Shadcn components

## Environment Variables

Make sure these are set for the backend:

```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_JWT_SECRET=...
SUPABASE_SERVICE_ROLE_KEY=...
```

And for the frontend:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
```

## Development Setup

1. Start the FastAPI backend: `cd api && python run.py`
2. Start the Next.js frontend: `cd web && npm run dev`
3. Ensure database migrations are applied: `cd api && alembic upgrade head`
