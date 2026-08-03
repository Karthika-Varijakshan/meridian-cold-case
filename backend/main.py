"""
MERIDIAN Cold Case Intelligence Platform — Backend Entrypoint

Migrated from Flask to FastAPI. The original working Flask implementation
is preserved unmodified in backend/_legacy_flask/ for reference and easy
rollback; nothing was deleted.

Run:
    uvicorn main:app --reload --host 0.0.0.0 --port 5000

Docs (auto-generated, new with this migration):
    http://localhost:5000/docs      (Swagger UI)
    http://localhost:5000/redoc     (ReDoc)
"""
import sys
import os
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend folder is importable the same way the Flask app relied on
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.router import api_router  # noqa: E402

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("meridian")


def create_app() -> FastAPI:
    app = FastAPI(
        title="MERIDIAN Cold Case Intelligence Platform",
        description="Multi-agent AI system for correlating evidence across cold case investigations.",
        version="1.0.0",
    )

    # Local dev: defaults to allowing any origin. In production, set the
    # ALLOWED_ORIGINS env var to your deployed frontend's URL (comma-separated
    # for multiple), e.g. ALLOWED_ORIGINS=https://meridian.vercel.app
    allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
    allowed_origins = (
        ["*"] if allowed_origins_env == "*" else [o.strip() for o in allowed_origins_env.split(",")]
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(status_code=404, content={"error": "Resource not found"})

    @app.exception_handler(500)
    async def server_error_handler(request: Request, exc):
        logger.exception("Unhandled server error")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "details": str(exc)},
        )

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting MERIDIAN Cold Case Intelligence Platform Backend Server (FastAPI)...")
    print("📍 API Base: http://localhost:5000/api")
    print("📘 Swagger:  http://localhost:5000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
