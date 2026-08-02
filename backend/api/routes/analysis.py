from fastapi import APIRouter

from services.db_service import db_service
from agents.graph_workflow import run_full_langgraph_pipeline
from schemas.case import AnalyzeRequest

router = APIRouter(tags=["AI Analysis"])


@router.post("/analyze")
def analyze_case(payload: AnalyzeRequest):
    case_id = payload.case_id or "CASE-1994-082"
    case = db_service.get_case_by_id(case_id)
    if not case:
        case = db_service.get_all_cases()[0]

    results = run_full_langgraph_pipeline(case)
    return results
