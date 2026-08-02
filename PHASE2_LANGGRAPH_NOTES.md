# Phase 2: Real LangGraph Multi-Agent Pipeline

## What changed
The 7-agent hardcoded pipeline is replaced with a real 9-agent LangGraph
`StateGraph`, matching your spec's chain:

```
Upload -> OCR -> Entity Extraction -> Timeline Reconstruction
       -> Relationship Graph -> Case Similarity -> Crime Pattern
       -> Recommendation -> Investigation Report -> END
```

- `backend/graph_pipeline/` — the actual `StateGraph` wiring
  (`pipeline.py`) and shared state schema (`state.py`).
  **Not named `langgraph/`** even though the spec's folder list says so —
  a local package with that exact name would shadow the real installed
  `langgraph` library on Python's import path and break every
  `from langgraph.graph import StateGraph` import in the app. Renaming
  it was necessary to avoid a real bug.
- `backend/agents/` — one file per agent (`upload_agent.py`,
  `ocr_agent.py`, `entity_extraction_agent.py`, `timeline_agent.py`,
  `relationship_graph_agent.py`, `similarity_agent.py`, `pattern_agent.py`,
  `recommendation_agent.py`, `report_agent.py`). Each is wrapped with a
  retry decorator (`utils/retry.py`) — 3 attempts with backoff, logged at
  every attempt, raises after exhausting retries rather than silently
  continuing with bad state.
- `backend/utils/nlp_extract.py` — real entity extraction. Uses OpenAI
  (structured JSON, function-call style prompt) if `OPENAI_API_KEY` is set
  in the environment; otherwise falls back to a regex/heuristic extractor
  (phones, addresses, vehicles, weapons, organizations, person names) that
  runs on the actual case text — not a hardcoded entity list.
- `backend/utils/similarity.py` — real case similarity (Jaccard over
  significant terms, with document-frequency filtering so generic words
  like "person" or "used" don't get treated as real signal) and real MO
  pattern clustering (union-find over cases whose keyword overlap clears a
  similarity threshold — not the old hardcoded "Tactical Heist Syndicate /
  Victor Vance" strings).
- `agents/graph_workflow.py` is now a 3-line compatibility shim
  re-exporting from `graph_pipeline/pipeline.py`, so
  `api/routes/analysis.py` and `api/routes/reports.py` needed **zero
  changes** — same import path, same function name, same output keys.
- The old hardcoded pipeline is preserved untouched at
  `agents/graph_workflow_legacy.py`.

## Verified without network access
This sandbox has no internet, so I couldn't `pip install` and run the real
`langgraph`/`networkx`/`pydantic` packages here. What I did verify:
- All new/changed files parse with no syntax errors.
- Ran the entity extraction, similarity ranking, and pattern clustering
  functions directly against your real `mock_data/database.json` — outputs
  are genuinely derived from case text (confirmed real, non-hardcoded
  results — e.g. a 4-case cluster sharing "Ford Econoline / 9mm / wire
  cutters" keywords, and a separate 2-case cluster sharing "offshore shell
  storage" keywords).
- Ran 8 of the 9 agent functions in a manual sequential chain end-to-end
  (skipped only the `relationship_graph` node, since it needs `networkx`,
  which isn't installed in this sandbox) — full run completed, produced a
  coherent recommendation and report from real upstream data.
- Verified the retry decorator actually retries on transient failure and
  raises cleanly after exhausting attempts.
- **Could not test:** the actual `langgraph.graph.StateGraph` wiring in
  `graph_pipeline/pipeline.py` itself, and the `relationship_graph_agent`
  (needs `networkx`). Both use straightforward, well-established APIs, but
  please run `python main.py` and hit "RUN LANGGRAPH AI" in the UI as your
  first real test — if either surfaces an import/runtime error, send it to
  me and I'll fix it immediately.

## Known limitation (not a bug, just a heads-up)
The regex-based entity extractor can produce near-duplicate entities for
the same real-world thing when it's phrased differently in different
places — e.g. "4400 South Pulaski Rd" (from the case summary) and
"4400 S Pulaski Rd" (from a witness statement) show up as two separate
Address entities instead of one. Fixing this properly needs fuzzy
matching/normalization, which fits better in the vector DB phase
(embeddings naturally cluster near-duplicate mentions).

## What's still not real (unchanged from Phase 1)
- No PostgreSQL — still JSON file storage
- No auth/JWT/RBAC
- No WebSockets (though `stream_full_langgraph_pipeline()` in
  `graph_pipeline/pipeline.py` is ready to be wired to one — it yields a
  progress event after each agent node completes)
- No vector DB/embeddings — similarity is keyword-based, not semantic
- No PDF/DOCX report export
- Missing pages: Evidence Upload (distinct from Evidence), Crime Map,
  User Management, Audit Logs, Notifications, Authentication

## requirements.txt
Added `openai>=1.40.0` for the optional LLM-enhanced entity extraction path
(only activates if you set `OPENAI_API_KEY`).
