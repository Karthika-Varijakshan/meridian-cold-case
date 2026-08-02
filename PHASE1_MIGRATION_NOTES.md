# Phase 1: Flask → FastAPI Migration Notes

## What changed
- `backend/main.py` is now a FastAPI app (was Flask). Same host/port (5000), same
  `/api` prefix, same route paths and response shapes as before — the frontend
  in `frontend/src/services/api.js` needs **zero changes**.
- Routes were split out of one big blueprint into `backend/api/routes/`
  (one file per resource: health, cases, upload, analysis, graph, timeline,
  patterns, reports), aggregated in `backend/api/router.py`.
- Added `backend/schemas/case.py` — Pydantic request/response models, which
  is also what gives you free request validation and the new auto-generated
  API docs at `/docs` and `/redoc` (Flask didn't have this).
- `backend/services/db_service.py` and `backend/services/graph_service.py`
  are **unchanged** — they were already plain Python with no Flask
  dependency, so they carried over as-is.
- `backend/agents/graph_workflow.py` is **unchanged** in this phase — it's
  still 7 sequential Python functions with hardcoded results, not a real
  LangGraph `StateGraph`. That rewrite is Phase 2, kept separate on purpose
  so this migration stays reviewable on its own.
- `requirements.txt` swapped `flask` / `flask-cors` / `gunicorn` for
  `fastapi` / `uvicorn[standard]` / `python-multipart`.
- `.vscode/launch.json` and `.vscode/tasks.json` updated to run
  `uvicorn main:app --reload` instead of `python main.py`.

## Nothing was deleted
The original working Flask code is preserved at
`backend/_legacy_flask/main_flask.py` and
`backend/_legacy_flask/routes/api_routes.py`, plus the old
`requirements_flask.txt`, in case you need to compare or roll back.

## How to run it
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```
Or via the VS Code task: `Ctrl+Shift+B` → "Start Full MERIDIAN Platform".

New: visit http://localhost:5000/docs for interactive Swagger docs.

## What's still not real (unchanged from before this phase)
These were mocked before FastAPI too — the framework swap didn't touch them:
- No real LangGraph `StateGraph`, no LLM calls, no streaming/retries
- No OCR, embeddings, vector DB, or NLP — entity extraction is hardcoded
- JSON file storage, not PostgreSQL
- No auth/JWT/RBAC, no WebSockets, no PDF/DOCX report export
- Missing pages: Evidence Upload (separate from Evidence), Crime Map,
  User Management, Audit Logs, Notifications, Authentication

## Suggested next phases
1. Real LangGraph `StateGraph` with actual entity/similarity logic driven
   by the case data instead of hardcoded strings
2. SQLAlchemy + PostgreSQL models replacing the JSON store
3. JWT auth + RBAC (Admin / Supervisor / Investigator / Forensic Analyst)
4. WebSocket channel streaming live agent progress to the AI Analysis page
5. Vector DB (FAISS or ChromaDB) + embeddings for semantic search
6. Remaining pages + PDF/DOCX report generation
