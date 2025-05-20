from fastapi import FastAPI
from routes.health import router as health_router


# Import routers here (example: from .routes import user_router)

app = FastAPI(title="G.R.A.C.E. API")

# Include routers here (example: app.include_router(user_router))

app.include_router(health_router)
