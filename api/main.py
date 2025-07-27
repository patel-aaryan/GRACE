from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import profile_route
from core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(profile_route.router)


@app.get("/")
async def root():
    return {"message": "Welcome to GRACE API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
