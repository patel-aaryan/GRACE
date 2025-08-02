import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/grace")

# Supabase
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# API Settings
PROJECT_NAME = "GRACE API"
ALGORITHM = "HS256"


class Settings:
    # Database
    DATABASE_URL: str = DATABASE_URL

    # Supabase
    SUPABASE_JWT_SECRET: str = SUPABASE_JWT_SECRET
    SUPABASE_SERVICE_ROLE_KEY: str = SUPABASE_SERVICE_ROLE_KEY

    # API Settings
    PROJECT_NAME: str = PROJECT_NAME
    ALGORITHM: str = ALGORITHM


settings = Settings()
