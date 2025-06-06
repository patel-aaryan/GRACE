import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/grace")

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
REFRESH_SECRET_KEY = os.getenv(
    "REFRESH_SECRET_KEY", "your-refresh-secret-key-here")

# Supabase
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# API Settings
API_V1_STR = "/api/v1"
PROJECT_NAME = "GRACE API"
ALGORITHM = "HS256"


class Settings:
    # Database
    DATABASE_URL: str = DATABASE_URL

    # Security
    SECRET_KEY: str = SECRET_KEY
    REFRESH_SECRET_KEY: str = REFRESH_SECRET_KEY

    # Supabase
    SUPABASE_JWT_SECRET: str = SUPABASE_JWT_SECRET
    SUPABASE_SERVICE_ROLE_KEY: str = SUPABASE_SERVICE_ROLE_KEY
    SUPABASE_URL: str = SUPABASE_URL

    # API Settings
    API_V1_STR: str = API_V1_STR
    PROJECT_NAME: str = PROJECT_NAME
    ALGORITHM: str = ALGORITHM


settings = Settings()
