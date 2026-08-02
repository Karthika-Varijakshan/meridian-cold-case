import time
from fastapi import APIRouter

from services.db_service import db_service
from schemas.case import CaseCreateRequest

router = APIRouter(tags=["Cases"])


@router.post("/upload", status_code=201)
def upload_case(payload: CaseCreateRequest):
    new_id = f"CASE-{time.strftime('%Y')}-{str(int(time.time()))[-3:]}"
    new_case = {
        "id": new_id,
        "title": payload.title,
        "status": payload.status,
        "priority": payload.priority,
        "crime_type": payload.crime_type,
        "location": payload.location,
        "date": payload.date or time.strftime("%Y-%m-%d"),
        "lead_investigator": payload.lead_investigator,
        "summary": payload.summary,
        "mo_description": payload.mo_description,
        "reopen_score": round(payload.reopen_score, 1),
        "confidence": 0.88,
        "evidence_count": len(payload.evidence),
        "witness_count": len(payload.witness_statements),
        "linked_cases": [],
        "witness_statements": payload.witness_statements,
        "evidence": payload.evidence,
    }

    created = db_service.add_case(new_case)
    return {"message": "Case uploaded successfully", "case": created}
