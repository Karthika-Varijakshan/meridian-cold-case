from typing import Any, Dict

import networkx as nx

from services.graph_service import graph_service
from utils.retry import with_retries, make_log_entry


@with_retries("Relationship Graph Agent")
def relationship_graph_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    case = state["case_input"]
    extracted_entities = state.get("extracted_entities", [])

    # Local co-occurrence graph: entities that appear together within the
    # same witness statement are linked — a real (if simple) relationship
    # signal derived from this specific case's text, not the global mock DB.
    local_graph = nx.Graph()
    local_graph.add_node(case["id"], node_type="Case", label=case.get("title"))

    for entity in extracted_entities:
        local_graph.add_node(entity["name"], node_type=entity["type"], confidence=entity.get("confidence", 0.5))
        local_graph.add_edge(case["id"], entity["name"], relation="mentioned_in_case")

    for statement in case.get("witness_statements", []):
        text = statement.get("statement", "")
        mentioned = [e["name"] for e in extracted_entities if e["name"] in text]
        for i in range(len(mentioned)):
            for j in range(i + 1, len(mentioned)):
                if local_graph.has_edge(mentioned[i], mentioned[j]):
                    local_graph[mentioned[i]][mentioned[j]]["weight"] = local_graph[mentioned[i]][mentioned[j]].get("weight", 1) + 1
                else:
                    local_graph.add_edge(mentioned[i], mentioned[j], relation="co_mentioned", weight=1)

    local_graph_summary = {
        "nodes": local_graph.number_of_nodes(),
        "edges": local_graph.number_of_edges(),
        "co_occurrence_pairs": [
            {"a": u, "b": v, "weight": d.get("weight", 1)}
            for u, v, d in local_graph.edges(data=True)
            if d.get("relation") == "co_mentioned"
        ],
    }

    # Global correlation graph (feeds the Relationship Graph page) — real,
    # already NetworkX-backed via graph_service, unchanged in this phase
    global_graph = graph_service.get_react_flow_graph()

    logs = state.get("logs", [])
    logs.append(make_log_entry(
        "Relationship Graph Agent", "completed",
        f"Built local co-occurrence graph ({local_graph_summary['nodes']} nodes, "
        f"{local_graph_summary['edges']} edges) and cross-referenced global network "
        f"({global_graph['stats']['total_nodes']} nodes, {global_graph['stats']['total_edges']} edges).",
    ))

    return {
        "local_graph_summary": local_graph_summary,
        "correlated_graph": global_graph,
        "logs": logs,
        "current_step": "similarity",
    }
