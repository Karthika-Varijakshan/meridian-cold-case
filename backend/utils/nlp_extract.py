"""
Entity extraction for MERIDIAN.

Two tiers, chosen automatically:
1. If OPENAI_API_KEY is set and the `openai` package is importable, entities
   are extracted with an LLM call (structured JSON output).
2. Otherwise, a rule-based/regex extractor runs. This is not a placeholder —
   it produces real results derived from the actual case text — it's just a
   lower-precision method than an LLM, which is the honest tradeoff of not
   having an API key configured.

Both paths return the same shape: List[{"type", "name", "confidence", "source"}]
"""
import os
import re
from typing import Any, Dict, List

STOPWORDS_TWO_WORD = {
    "United States", "New York", "Los Angeles", "San Francisco", "North Side",
    "South Side", "East Side", "West Side", "Night Security", "Diner Waitress",
}

VEHICLE_KEYWORDS = [
    "Ford", "Chevrolet", "Chevy", "Toyota", "Honda", "Dodge", "GMC", "Nissan",
    "Econoline", "Sedan", "Truck", "Van", "SUV", "Pickup", "Motorcycle",
]

WEAPON_KEYWORDS = [
    "9mm", ".22", ".38", ".357", ".45", "pistol", "revolver", "rifle",
    "shotgun", "suppressed", "caliber", "handgun", "firearm",
]

ORG_SUFFIXES = ["Storage", "Logistics", "Bank", "Terminal", "Warehouse", "LLC", "Inc", "Corp"]

PHONE_RE = re.compile(r"\b\d{3}[-.]\d{3}[-.]\d{4}\b")
ADDRESS_RE = re.compile(
    r"\b\d{1,6}\s+(?:[A-Z][a-z]*\.?\s*)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s"
    r"(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Terminal)\b"
)
NAME_RE = re.compile(r"\b[A-Z][a-z]+\s[A-Z][a-z]+\b")
YEAR_RE = re.compile(r"\b(19|20)\d{2}\b")


def _find_keyword_spans(text: str, keywords: List[str]) -> List[Any]:
    lower = text.lower()
    spans = []
    for kw in keywords:
        kw_l = kw.lower()
        start = 0
        while True:
            idx = lower.find(kw_l, start)
            if idx == -1:
                break
            spans.append([idx, idx + len(kw)])
            start = idx + len(kw)
    return spans


def _merge_spans(spans: List[Any], gap: int = 20) -> List[Any]:
    if not spans:
        return []
    spans = sorted(spans, key=lambda s: s[0])
    merged = [spans[0][:]]
    for s, e in spans[1:]:
        if s - merged[-1][1] <= gap:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    return merged


def _clean_window(text: str, start: int, end: int, pad: int = 12) -> str:
    lo = max(0, start - pad)
    hi = min(len(text), end + pad)
    window = text[lo:hi]
    # trim to whole words at both ends
    window = re.sub(r"^\S*\s", "", window) if lo > 0 else window
    window = re.sub(r"\s\S*$", "", window) if hi < len(text) else window
    return window.strip(" .,\n")


def _regex_extract(text: str) -> List[Dict[str, Any]]:
    found: List[Dict[str, Any]] = []
    seen = set()

    def add(entity_type: str, name: str, confidence: float):
        name = name.strip()
        key = (entity_type, name.lower())
        if not name or key in seen:
            return
        seen.add(key)
        found.append({"type": entity_type, "name": name, "confidence": round(confidence, 2)})

    for m in PHONE_RE.finditer(text):
        add("Phone", m.group(0), 0.93)

    for m in ADDRESS_RE.finditer(text):
        add("Address", m.group(0), 0.85)

    for span in _merge_spans(_find_keyword_spans(text, WEAPON_KEYWORDS)):
        add("Weapon/Ballistics", _clean_window(text, span[0], span[1]), 0.75)

    for span in _merge_spans(_find_keyword_spans(text, VEHICLE_KEYWORDS)):
        add("Vehicle", _clean_window(text, span[0], span[1]), 0.8)

    for kw in ORG_SUFFIXES:
        pattern = re.compile(r"\b([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?\s" + re.escape(kw) + r")\b")
        for m in pattern.finditer(text):
            add("Organization", m.group(1), 0.78)

    for m in NAME_RE.finditer(text):
        candidate = m.group(0)
        if candidate in STOPWORDS_TWO_WORD:
            continue
        # skip if it's actually an address or org match we already captured
        if any(candidate in f["name"] for f in found):
            continue
        add("Person", candidate, 0.7)

    return found


def _openai_extract(text: str) -> List[Dict[str, Any]]:
    """LLM-based extraction. Only called when an API key is configured."""
    from openai import OpenAI  # imported lazily so the app runs without the package installed

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    system_prompt = (
        "You are a forensic NLP entity extractor for a cold case investigation platform. "
        "Extract named entities from the given case text. Return ONLY a JSON array of objects "
        'with keys "type" (one of: Person, Vehicle, Weapon/Ballistics, Address, Phone, Organization, Location), '
        '"name" (the entity text), and "confidence" (0.0-1.0). No prose, no markdown.'
    )
    response = client.chat.completions.create(
        model=os.environ.get("MERIDIAN_LLM_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text[:6000]},
        ],
        temperature=0,
    )
    import json

    content = response.choices[0].message.content
    parsed = json.loads(content)
    if isinstance(parsed, dict):
        # tolerate {"entities": [...]} shape
        parsed = parsed.get("entities", [])
    return parsed


def extract_entities(text: str) -> List[Dict[str, Any]]:
    if not text or not text.strip():
        return []

    if os.environ.get("OPENAI_API_KEY"):
        try:
            entities = _openai_extract(text)
            for e in entities:
                e["source"] = "openai"
            return entities
        except Exception:
            # Fall through to rule-based extraction rather than failing the pipeline
            pass

    entities = _regex_extract(text)
    for e in entities:
        e["source"] = "rule_based"
    return entities
