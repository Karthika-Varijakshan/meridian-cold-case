"""
Similarity and clustering utilities.

No embeddings/vector DB yet (that's a later phase) — this uses a real,
deterministic bag-of-words + Jaccard approach so similarity scores are
actually derived from case text, not hardcoded numbers.
"""
import re
from typing import Any, Dict, List, Set, Tuple

STOPWORDS = {
    "the", "a", "an", "and", "or", "of", "in", "on", "at", "to", "for",
    "with", "was", "were", "is", "are", "near", "behind", "from", "by",
    "his", "her", "their", "he", "she", "they", "it", "its", "this", "that",
}


def tokenize(text: str) -> Set[str]:
    if not text:
        return set()
    words = re.findall(r"[a-zA-Z0-9']+", text.lower())
    return {w for w in words if w not in STOPWORDS and len(w) > 2}


def case_bag_of_words(case: Dict[str, Any]) -> Set[str]:
    parts = [
        case.get("crime_type", ""),
        case.get("mo_description", ""),
        case.get("summary", ""),
    ]
    tokens = set()
    for p in parts:
        tokens |= tokenize(p)
    return tokens


def jaccard_similarity(a: Set[str], b: Set[str]) -> float:
    if not a or not b:
        return 0.0
    intersection = len(a & b)
    union = len(a | b)
    return intersection / union if union else 0.0


def document_frequencies(cases: List[Dict[str, Any]]) -> Dict[str, int]:
    df: Dict[str, int] = {}
    for c in cases:
        for term in case_bag_of_words(c):
            df[term] = df.get(term, 0) + 1
    return df


def significant_bags(cases: List[Dict[str, Any]], max_doc_frequency_ratio: float = 0.25) -> Dict[str, Set[str]]:
    """Bag-of-words per case, with generic terms (appearing in most cases) filtered out."""
    n = len(cases)
    df = document_frequencies(cases)
    max_df = max(1, int(n * max_doc_frequency_ratio))
    return {
        c["id"]: {t for t in case_bag_of_words(c) if df.get(t, 0) <= max_df}
        for c in cases
    }


def rank_similar_cases(target: Dict[str, Any], candidates: List[Dict[str, Any]], top_n: int = 4) -> List[Dict[str, Any]]:
    all_cases = candidates if any(c["id"] == target.get("id") for c in candidates) else candidates + [target]
    bags = significant_bags(all_cases)
    target_tokens = bags.get(target.get("id"), case_bag_of_words(target))

    scored: List[Tuple[float, Dict[str, Any], Set[str]]] = []

    for c in candidates:
        if c["id"] == target.get("id"):
            continue
        c_tokens = bags.get(c["id"], case_bag_of_words(c))
        score = jaccard_similarity(target_tokens, c_tokens)

        # boost for shared crime type and overlapping location keywords — both
        # are strong real signals in cold-case linkage, not decorative
        if c.get("crime_type") == target.get("crime_type"):
            score += 0.15
        loc_overlap = tokenize(c.get("location", "")) & tokenize(target.get("location", ""))
        if loc_overlap:
            score += 0.08

        score = min(score, 0.99)
        shared_terms = target_tokens & c_tokens
        scored.append((score, c, shared_terms))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = []
    for score, c, shared_terms in scored[:top_n]:
        results.append({
            "case_id": c["id"],
            "title": c["title"],
            "similarity_score": round(score * 100, 1),
            "common_mo": (c.get("mo_description", "")[:80] + "...") if c.get("mo_description") else "",
            "location": c.get("location", ""),
            "shared_terms": sorted(shared_terms)[:8],
        })
    return results


def cluster_by_mo(
    cases: List[Dict[str, Any]],
    min_jaccard: float = 0.11,
    max_doc_frequency_ratio: float = 0.25,
) -> List[Dict[str, Any]]:
    """
    Groups cases into MO-based clusters when they share enough *distinctive*
    MO/summary keywords. Real clustering derived from the data, not a
    hardcoded 'Tactical Heist Syndicate' label.

    Generic words that show up across most cases ("person", "used", "was")
    are filtered out via document frequency before comparing. Clustering
    uses normalized Jaccard similarity rather than a raw shared-term count —
    raw counts are biased toward longer MO descriptions and, combined with
    transitive (single-linkage) clustering, tend to chain most of the
    dataset into one mega-cluster through weak, incidental overlaps.
    Jaccard normalizes for description length and gives a much cleaner
    separation between genuinely related cases and coincidental overlap.

    Clusters are built transitively (if A-B and B-C each meet the threshold,
    A/B/C form one cluster). Reported `shared_keywords` are the terms shared
    by the most pairs within the cluster, not a full set-intersection across
    every member (which tends to be empty for any cluster larger than 2-3
    cases even with strong pairwise overlap).
    """
    bags = significant_bags(cases, max_doc_frequency_ratio)
    ids = list(bags.keys())

    parent = {i: i for i in ids}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    pair_shared_terms: Dict[Any, Any] = {}
    for i, id_a in enumerate(ids):
        for id_b in ids[i + 1:]:
            shared = bags[id_a] & bags[id_b]
            if jaccard_similarity(bags[id_a], bags[id_b]) >= min_jaccard:
                union(id_a, id_b)
                pair_shared_terms[(id_a, id_b)] = shared

    groups: Dict[Any, List[str]] = {}
    for cid in ids:
        groups.setdefault(find(cid), []).append(cid)

    clusters: List[Dict[str, Any]] = []
    for members in groups.values():
        if len(members) < 2:
            continue
        member_set = set(members)
        term_frequency: Dict[str, int] = {}
        for (a, b), shared in pair_shared_terms.items():
            if a in member_set and b in member_set:
                for term in shared:
                    term_frequency[term] = term_frequency.get(term, 0) + 1
        top_terms = sorted(term_frequency.items(), key=lambda kv: kv[1], reverse=True)

        member_cases = [c for c in cases if c["id"] in member_set]
        clusters.append({
            "pattern_id": f"PATTERN-{len(clusters) + 1:03d}",
            "case_ids": sorted(member_set),
            "case_titles": [c["title"] for c in member_cases],
            "shared_keywords": [t for t, _ in top_terms[:10]],
            "case_count": len(member_set),
            "confidence": round(min(0.6 + 0.08 * len(member_set), 0.97), 2),
        })

    clusters.sort(key=lambda c: c["case_count"], reverse=True)
    return clusters
