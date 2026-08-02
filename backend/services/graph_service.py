import networkx as nx
from typing import Dict, Any, List
from services.db_service import db_service

class GraphService:
    """
    NetworkX Graph Intelligence Service.
    Builds entity-case relationships, calculates degree centrality,
    and returns formatted graph data for React Flow UI.
    """
    
    def build_networkx_graph(self) -> nx.Graph:
        G = nx.Graph()
        cases = db_service.get_all_cases()
        entities = db_service.get_all_entities()
        edges = db_service.get_graph_edges()

        # Add case nodes
        for c in cases:
            G.add_node(
                c["id"],
                label=c["title"],
                node_type="Case",
                status=c["status"],
                priority=c["priority"],
                reopen_score=c.get("reopen_score", 50.0),
                category="Case"
            )

        # Add entity nodes
        for e in entities:
            G.add_node(
                e["id"],
                label=e["name"],
                node_type=e["type"],
                category=e["category"],
                details=e.get("details", "")
            )

        # Add edges
        for edge in edges:
            G.add_edge(
                edge["source"],
                edge["target"],
                label=edge["label"],
                weight=edge.get("weight", 1.0)
            )

        return G

    def get_react_flow_graph(self) -> Dict[str, Any]:
        G = self.build_networkx_graph()
        cases = db_service.get_all_cases()
        entities = db_service.get_all_entities()
        edges = db_service.get_graph_edges()

        # Compute degree centrality for sizing and layout ranking
        centrality = nx.degree_centrality(G) if len(G) > 0 else {}

        react_nodes = []
        
        # Position calculation grid layout
        col_width = 280
        row_height = 140
        
        # Layout cases on top/left side
        for i, c in enumerate(cases):
            row = i % 5
            col = i // 5
            c_id = c["id"]
            node_centrality = round(centrality.get(c_id, 0.1), 3)
            react_nodes.append({
                "id": c_id,
                "type": "custom",
                "position": {"x": 50 + col * (col_width + 120), "y": 80 + row * row_height},
                "data": {
                    "label": c["title"],
                    "nodeType": "Case",
                    "subtitle": f"{c['id']} • {c['crime_type']}",
                    "status": c["status"],
                    "priority": c["priority"],
                    "score": c.get("reopen_score", 70.0),
                    "centrality": node_centrality,
                    "details": c["summary"]
                }
            })

        # Layout entities on right side
        for j, e in enumerate(entities):
            row = j % 6
            col = j // 6
            e_id = e["id"]
            node_centrality = round(centrality.get(e_id, 0.1), 3)
            react_nodes.append({
                "id": e_id,
                "type": "custom",
                "position": {"x": 750 + col * col_width, "y": 60 + row * (row_height + 10)},
                "data": {
                    "label": e["name"],
                    "nodeType": e["type"],
                    "subtitle": e["category"],
                    "details": e["details"],
                    "centrality": node_centrality,
                    "linkedCasesCount": len(e.get("cases_linked", []))
                }
            })

        react_edges = []
        for idx, edge in enumerate(edges):
            react_edges.append({
                "id": f"e-{idx}-{edge['source']}-{edge['target']}",
                "source": edge["source"],
                "target": edge["target"],
                "label": edge["label"],
                "animated": edge["weight"] > 0.9,
                "style": {"stroke": "#C9902E" if edge["weight"] > 0.9 else "#3FA9A0", "strokeWidth": 2}
            })

        return {
            "nodes": react_nodes,
            "edges": react_edges,
            "stats": {
                "total_nodes": len(G.nodes()),
                "total_edges": len(G.edges()),
                "density": round(nx.density(G), 4) if len(G) > 0 else 0
            }
        }

graph_service = GraphService()
