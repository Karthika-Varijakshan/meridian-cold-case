from fastapi import APIRouter

from services.graph_service import graph_service

router = APIRouter(tags=["Relationship Graph"])


@router.get("/graph")
def get_graph():
    return graph_service.get_react_flow_graph()
