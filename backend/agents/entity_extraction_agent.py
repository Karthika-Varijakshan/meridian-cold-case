from typing import Any, Dict

from utils.retry import with_retries, make_log_entry
from utils.nlp_extract import extract_entities


@with_retries("Entity Extraction Agent")
def entity_extraction_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    raw_text = state.get("raw_text", "")
    extracted = extract_entities(raw_text)

    logs = state.get("logs", [])
    source = extracted[0]["source"] if extracted else "n/a"
    logs.append(make_log_entry(
        "Entity Extraction Agent", "completed",
        f"Extracted {len(extracted)} entities from case text (method: {source}).",
    ))

    return {
        "extracted_entities": extracted,
        "logs": logs,
        "current_step": "timeline",
    }
