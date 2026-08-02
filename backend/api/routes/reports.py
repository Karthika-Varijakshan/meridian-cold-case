from fastapi import APIRouter, Query

from services.db_service import db_service
from agents.graph_workflow import run_full_langgraph_pipeline

router = APIRouter(tags=["Reports"])


@router.get("/report")
def get_report(case_id: str = Query("CASE-1994-082")):
    case = db_service.get_case_by_id(case_id)
    if not case:
        case = db_service.get_all_cases()[0]

    pipeline_results = run_full_langgraph_pipeline(case)
    return {
        "case": case,
        "report": pipeline_results["summary_report"],
        "recommendation": pipeline_results["recommendation"],
        "patterns": pipeline_results["discovered_patterns"],
        "extracted_entities": pipeline_results["extracted_entities"],
    }
