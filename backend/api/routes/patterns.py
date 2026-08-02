from fastapi import APIRouter

from services.db_service import db_service
from schemas.case import PatternsResponse

router = APIRouter(tags=["Pattern Discovery"])


@router.get("/patterns", response_model=PatternsResponse)
def get_patterns():
    patterns = db_service.get_patterns()
    return PatternsResponse(total=len(patterns), patterns=patterns)
