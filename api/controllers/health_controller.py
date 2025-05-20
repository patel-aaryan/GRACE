from fastapi import status
from datastores.db import engine
from sqlalchemy.exc import OperationalError
from sqlalchemy import text


def get_health_status():
    db_status = "ok"
    try:
        # Try a simple DB connection
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except OperationalError:
        db_status = "unavailable"

    overall_status = "ok" if db_status == "ok" else "degraded"
    return {"status": overall_status, "db": db_status}, status.HTTP_200_OK
