from typing import Any, Dict, List, TypedDict


class CaseAnalysisState(TypedDict, total=False):
    case_input: Dict[str, Any]
    current_step: str
    logs: List[Dict[str, Any]]

    raw_text: str
    ocr_results: List[Dict[str, Any]]
    extracted_entities: List[Dict[str, Any]]

    case_timeline: List[Dict[str, Any]]
    timeline: List[Dict[str, Any]]

    local_graph_summary: Dict[str, Any]
    correlated_graph: Dict[str, Any]

    similar_cases: List[Dict[str, Any]]
    discovered_patterns: List[Dict[str, Any]]

    recommendation: Dict[str, Any]
    summary_report: Dict[str, Any]

    completed: bool
