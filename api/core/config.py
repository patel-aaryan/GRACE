import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # JWT settings
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "your-secret-key")  # CHANGE IN PRODUCTION!
    REFRESH_SECRET_KEY: str = os.getenv(
        "REFRESH_SECRET_KEY", "your-refresh-secret-key")  # CHANGE IN PRODUCTION!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql://user:password@localhost/grace_db")


settings = Settings()
