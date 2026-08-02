from fastapi import APIRouter

from api.routes import health, cases, upload, analysis, graph, timeline, patterns, reports

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router)
api_router.include_router(cases.router)
api_router.include_router(upload.router)
api_router.include_router(analysis.router)
api_router.include_router(graph.router)
api_router.include_router(timeline.router)
api_router.include_router(patterns.router)
api_router.include_router(reports.router)
