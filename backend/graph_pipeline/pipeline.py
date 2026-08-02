"""
MERIDIAN's real LangGraph pipeline.

Graph shape (matches the platform spec):

    Upload -> OCR -> Entity Extraction -> Timeline Reconstruction
           -> Relationship Graph -> Case Similarity -> Crime Pattern
           -> Recommendation -> Investigation Report -> END

Each node is a plain function(state) -> partial_state_dict, wrapped with
`with_retries` (see utils/retry.py) for retry + logging. This module wires
them into an actual `langgraph.graph.StateGraph`, not a manually-chained
sequence of function calls.
"""
import logging
from typing import Any, Dict, Iterator

from langgraph.graph import StateGraph, END

from graph_pipeline.state import CaseAnalysisState
from agents.upload_agent import upload_agent
from agents.ocr_agent import ocr_agent
from agents.entity_extraction_agent import entity_extraction_agent
from agents.timeline_agent import timeline_reconstruction_agent
from agents.relationship_graph_agent import relationship_graph_agent
from agents.similarity_agent import case_similarity_agent
from agents.pattern_agent import crime_pattern_agent
from agents.recommendation_agent import recommendation_agent
from agents.report_agent import investigation_report_agent

logger = logging.getLogger("meridian.pipeline")


def _build_graph() -> StateGraph:
    graph = StateGraph(CaseAnalysisState)

    graph.add_node("upload", upload_agent)
    graph.add_node("ocr", ocr_agent)
    graph.add_node("entity_extraction", entity_extraction_agent)
    graph.add_node("timeline", timeline_reconstruction_agent)
    graph.add_node("relationship_graph", relationship_graph_agent)
    graph.add_node("similarity", case_similarity_agent)
    graph.add_node("pattern", crime_pattern_agent)
    graph.add_node("recommendation", recommendation_agent)
    graph.add_node("report", investigation_report_agent)

    graph.set_entry_point("upload")
    graph.add_edge("upload", "ocr")
    graph.add_edge("ocr", "entity_extraction")
    graph.add_edge("entity_extraction", "timeline")
    graph.add_edge("timeline", "relationship_graph")
    graph.add_edge("relationship_graph", "similarity")
    graph.add_edge("similarity", "pattern")
    graph.add_edge("pattern", "recommendation")
    graph.add_edge("recommendation", "report")
    graph.add_edge("report", END)

    return graph


_compiled_graph = _build_graph().compile()


def _initial_state(case_data: Dict[str, Any]) -> CaseAnalysisState:
    return {
        "case_input": case_data,
        "current_step": "upload",
        "logs": [],
        "extracted_entities": [],
        "similar_cases": [],
        "correlated_graph": {},
        "timeline": [],
        "discovered_patterns": [],
        "recommendation": {},
        "summary_report": {},
        "completed": False,
    }


def run_full_langgraph_pipeline(case_data: Dict[str, Any]) -> CaseAnalysisState:
    """
    Runs the full 9-agent pipeline synchronously via LangGraph's `.invoke()`
    and returns the final merged state. Preserves the same output keys the
    old hardcoded pipeline used (extracted_entities, similar_cases,
    correlated_graph, timeline, discovered_patterns, recommendation,
    summary_report), so the API layer and frontend need no changes.
    """
    logger.info("Starting LangGraph pipeline for case %s", case_data.get("id"))
    final_state = _compiled_graph.invoke(_initial_state(case_data))
    logger.info("LangGraph pipeline completed for case %s", case_data.get("id"))
    return final_state


def stream_full_langgraph_pipeline(case_data: Dict[str, Any]) -> Iterator[Dict[str, Any]]:
    """
    Generator version for live progress streaming (consumed by the
    WebSocket layer in a later phase). Yields one event per completed node:
        {"node": "upload", "state_delta": {...}}
    """
    for event in _compiled_graph.stream(_initial_state(case_data)):
        for node_name, state_delta in event.items():
            yield {"node": node_name, "state_delta": state_delta}
