from typing import Any, Dict

from utils.retry import with_retries, make_log_entry


@with_retries("Recommendation Agent")
def recommendation_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    similar_cases = state.get("similar_cases", [])
    patterns = state.get("discovered_patterns", [])
    extracted_entities = state.get("extracted_entities", [])

    base_score = case.get("reopen_score", 50.0)

    # Real adjustment: strong similarity matches and pattern membership raise
    # confidence in reopening, derived from what earlier agents actually found
    strong_matches = [m for m in similar_cases if m["similarity_score"] >= 60]
    case_in_pattern = any(case["id"] in p["case_ids"] for p in patterns)

    adjusted_score = base_score
    if strong_matches:
        adjusted_score = min(adjusted_score + 2 * len(strong_matches), 99.0)
    if case_in_pattern:
        adjusted_score = min(adjusted_score + 5.0, 99.0)
    adjusted_score = round(adjusted_score, 1)

    priority = "HIGH PRIORITY REOPEN" if adjusted_score > 85 else (
        "MEDIUM PRIORITY REOPEN" if adjusted_score > 60 else "LOW PRIORITY — MONITOR"
    )

    justification_parts = []
    if strong_matches:
        top = strong_matches[0]
        justification_parts.append(
            f"{len(strong_matches)} historically similar case(s) identified, "
            f"strongest match {top['title']} ({top['similarity_score']}% similarity)."
        )
    if case_in_pattern:
        matching_pattern = next(p for p in patterns if case["id"] in p["case_ids"])
        justification_parts.append(
            f"Case belongs to a {matching_pattern['case_count']}-case MO cluster "
            f"sharing keywords: {', '.join(matching_pattern['shared_keywords'][:5])}."
        )
    if extracted_entities:
        justification_parts.append(f"{len(extracted_entities)} entities extracted from case evidence and testimony.")
    if not justification_parts:
        justification_parts.append("Base case metadata reviewed; no strong cross-case correlations found.")

    key_levers = []
    for m in strong_matches[:3]:
        key_levers.append(f"Similarity to {m['case_id']} ({m['similarity_score']}%)")
    if case_in_pattern:
        key_levers.append("Membership in a discovered MO cluster")
    for e in extracted_entities[:3]:
        key_levers.append(f"{e['type']} entity: {e['name']}")

    recommendation = {
        "reopen_priority": priority,
        "score": adjusted_score,
        "confidence_rating": f"{round(adjusted_score)}% ({'High' if adjusted_score > 80 else 'Moderate' if adjusted_score > 55 else 'Low'} Confidence)",
        "justification": " ".join(justification_parts),
        "key_levers": key_levers or ["No strong correlation signals found in current evidence."],
    }

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Recommendation Agent", "completed",
        f"Recommendation score calculated: {adjusted_score}/100. Status: {priority}.",
    ))

    return {
        "recommendation": recommendation,
        "logs": logs,
        "current_step": "report",
    }
