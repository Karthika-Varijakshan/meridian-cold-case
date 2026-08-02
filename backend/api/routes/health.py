import time
from fastapi import APIRouter
from schemas.case import HealthResponse

router = APIRouter(tags=["System"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="online",
        system="MERIDIAN Cold Case Intelligence Platform",
        version="1.0.0",
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S"),
    )
