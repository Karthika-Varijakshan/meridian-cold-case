import time
from typing import Any, Dict

from utils.retry import with_retries, make_log_entry


@with_retries("Investigation Report Agent")
def investigation_report_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    recommendation = state.get("recommendation", {})
    similar_cases = state.get("similar_cases", [])
    patterns = state.get("discovered_patterns", [])
    extracted_entities = state.get("extracted_entities", [])

    key_findings = []
    for e in extracted_entities[:5]:
        key_findings.append(f"{e['type']} identified: {e['name']} (confidence {int(e.get('confidence', 0.5) * 100)}%).")
    for m in similar_cases[:3]:
        key_findings.append(f"Cross-case correlation with {m['title']} ({m['case_id']}) at {m['similarity_score']}% similarity.")
    if not key_findings:
        key_findings.append("No significant cross-referenced findings surfaced from current evidence.")

    recommended_next_steps = []
    matching_pattern = next((p for p in patterns if case["id"] in p["case_ids"]), None)
    if matching_pattern:
        other_cases = [cid for cid in matching_pattern["case_ids"] if cid != case["id"]]
        if other_cases:
            recommended_next_steps.append(
                f"Cross-reference active investigation with linked cases: {', '.join(other_cases)}."
            )
    for m in similar_cases[:2]:
        recommended_next_steps.append(f"Review evidence overlap with {m['case_id']} — {m['title']}.")
    if recommendation.get("score", 0) > 85:
        recommended_next_steps.append("Escalate for formal case reopening review by command staff.")
    if not recommended_next_steps:
        recommended_next_steps.append("Continue standard evidence review; no immediate escalation indicated.")

    summary = {
        "case_title": case.get("title", "Cold Case Analysis"),
        "case_id": case.get("id", "CASE-NEW"),
        "classification": "LAW ENFORCEMENT SENSITIVE // COLD CASE INTELLIGENCE",
        "executive_summary": (
            f"Multi-agent AI analysis of {case.get('title')} identified "
            f"{len(extracted_entities)} entities and {len(similar_cases)} related historical cases. "
            f"Current reopening recommendation: {recommendation.get('reopen_priority', 'UNDER REVIEW')} "
            f"at a confidence score of {recommendation.get('score', 'N/A')}."
        ),
        "key_findings": key_findings,
        "recommended_next_steps": recommended_next_steps,
        "confidence_score": (recommendation.get("score", 50) or 50) / 100,
        "date_generated": time.strftime("%Y-%m-%d %H:%M:%S"),
    }

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Investigation Report Agent", "completed",
        "Final intelligence report generated from live agent pipeline output.",
    ))

    return {
        "summary_report": summary,
        "logs": logs,
        "current_step": "completed",
        "completed": True,
    }
