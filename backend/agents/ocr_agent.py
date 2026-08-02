from typing import Any, Dict

from utils.retry import with_retries, make_log_entry


@with_retries("OCR Agent")
def ocr_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    evidence = case.get("evidence", [])

    ocr_results = []
    for e in evidence:
        text = (e.get("ocr_text") or "").strip()
        ocr_results.append({
            "evidence_id": e.get("id"),
            "evidence_name": e.get("name"),
            "extracted_text": text,
            "char_count": len(text),
            "has_text": bool(text),
        })

    total_chars = sum(r["char_count"] for r in ocr_results)
    items_with_text = sum(1 for r in ocr_results if r["has_text"])

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "OCR Agent", "completed",
        f"Normalized OCR output for {len(evidence)} evidence items "
        f"({items_with_text} contained extractable text, {total_chars} total characters).",
    ))

    return {
        "ocr_results": ocr_results,
        "logs": logs,
        "current_step": "entity_extraction",
    }
