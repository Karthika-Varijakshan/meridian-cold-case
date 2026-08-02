from fastapi import APIRouter

from services.db_service import db_service
from schemas.case import TimelineResponse

router = APIRouter(tags=["Timeline"])


@router.get("/timeline", response_model=TimelineResponse)
def get_timeline():
    timeline = db_service.get_timeline_events()
    return TimelineResponse(total=len(timeline), timeline=timeline)
