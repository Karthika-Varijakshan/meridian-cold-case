"""
Backward-compatibility shim.

api/routes/analysis.py and api/routes/reports.py import
`run_full_langgraph_pipeline` from this module path. The real 9-agent
LangGraph implementation now lives in graph_pipeline/pipeline.py — this
file just re-exports it so no route code had to change.

The old hardcoded 7-agent version is preserved, untouched, at
agents/graph_workflow_legacy.py for reference.
"""
from graph_pipeline.pipeline import run_full_langgraph_pipeline, stream_full_langgraph_pipeline  # noqa: F401
