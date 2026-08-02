from typing import Any, Dict

from utils.retry import with_retries, make_log_entry


@with_retries("Upload Agent")
def upload_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    if not case or not case.get("id"):
        raise ValueError("Case input is missing an id — cannot proceed")

    evidence = case.get("evidence", [])
    witness_statements = case.get("witness_statements", [])

    # Aggregate everything OCR-able into one raw text blob for downstream agents
    raw_parts = [case.get("summary", ""), case.get("mo_description", "")]
    raw_parts += [w.get("statement", "") for w in witness_statements]
    raw_parts += [e.get("ocr_text", "") for e in evidence]
    raw_text = "\n".join(p for p in raw_parts if p)

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Upload Agent", "completed",
        f"Ingested case '{case.get('title')}' — {len(evidence)} evidence items, "
        f"{len(witness_statements)} witness statements.",
    ))

    return {
        "raw_text": raw_text,
        "logs": logs,
        "current_step": "ocr",
    }
