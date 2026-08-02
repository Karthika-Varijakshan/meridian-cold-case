from typing import Any, Dict

from services.db_service import db_service
from utils.retry import with_retries, make_log_entry
from utils.similarity import rank_similar_cases


@with_retries("Case Similarity Agent")
def case_similarity_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    all_cases = db_service.get_all_cases()

    top_matches = rank_similar_cases(case, all_cases, top_n=4)

    logs = state.get("logs", [])
    max_score = top_matches[0]["similarity_score"] if top_matches else 0.0
    logs.append(make_log_entry(
        "Case Similarity Agent", "completed",
        f"Compared against {len(all_cases) - 1} historical cases. "
        f"Top {len(top_matches)} matches identified, max similarity {max_score}%.",
    ))

    return {
        "similar_cases": top_matches,
        "logs": logs,
        "current_step": "pattern",
    }
