from typing import Any, Dict

from services.db_service import db_service
from utils.retry import with_retries, make_log_entry
from utils.similarity import cluster_by_mo


@with_retries("Crime Pattern Agent")
def crime_pattern_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    all_cases = db_service.get_all_cases()
    clusters = cluster_by_mo(all_cases, min_jaccard=0.11)

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Crime Pattern Agent", "completed",
        f"Scanned {len(all_cases)} cases and discovered {len(clusters)} MO-based clusters "
        f"via shared keyword overlap.",
    ))

    return {
        "discovered_patterns": clusters,
        "logs": logs,
        "current_step": "recommendation",
    }
