from typing import Any, Dict

from services.db_service import db_service
from utils.retry import with_retries, make_log_entry


@with_retries("Timeline Reconstruction Agent")
def timeline_reconstruction_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]

    events = [{
        "date": case.get("date", ""),
        "label": f"{case.get('crime_type', 'Incident')} occurred",
        "detail": case.get("summary", ""),
        "source": "case_record",
    }]

    for w in case.get("witness_statements", []):
        if w.get("date"):
            events.append({
                "date": w["date"],
                "label": f"Witness statement — {w.get('witness_name', 'Unknown')}",
                "detail": w.get("statement", ""),
                "source": "witness_statement",
            })

    events.sort(key=lambda e: e["date"])

    # Cross-case timeline (used by the standalone Timeline page) still comes
    # from db_service, which already sorts chronologically across all cases
    cross_case_timeline = db_service.get_timeline_events()

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Timeline Reconstruction Agent", "completed",
        f"Reconstructed {len(events)} chronological events for this case "
        f"(within a {len(cross_case_timeline)}-event cross-case database).",
    ))

    return {
        "case_timeline": events,
        "timeline": cross_case_timeline,
        "logs": logs,
        "current_step": "relationship_graph",
    }
