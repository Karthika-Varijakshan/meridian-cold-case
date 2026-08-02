from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from services.db_service import db_service
from schemas.case import CaseListResponse

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.get("", response_model=CaseListResponse)
def get_cases(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    cases = db_service.get_all_cases()

    filtered = cases
    if status:
        filtered = [c for c in filtered if c["status"].lower() == status.lower()]
    if priority:
        filtered = [c for c in filtered if c["priority"].lower() == priority.lower()]
    if search:
        s = search.lower()
        filtered = [
            c for c in filtered
            if s in c["title"].lower() or s in c["id"].lower()
            or s in c["location"].lower() or s in c["crime_type"].lower()
        ]

    return CaseListResponse(total=len(filtered), cases=filtered)


@router.get("/{case_id}")
def get_case_detail(case_id: str):
    case = db_service.get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case
