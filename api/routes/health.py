from fastapi import APIRouter
from controllers.health_controller import get_health_status
from validators.health_validator import HealthResponse

router = APIRouter()


@router.get("/health", tags=["Health"], response_model=HealthResponse)
def health_check():
    data, code = get_health_status()
    return data
