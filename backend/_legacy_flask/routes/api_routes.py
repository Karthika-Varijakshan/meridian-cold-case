from flask import Blueprint, jsonify, request
from services.db_service import db_service
from services.graph_service import graph_service
from agents.graph_workflow import run_full_langgraph_pipeline
import time

api_bp = Blueprint("api", __name__, url_prefix="/api")

@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "system": "MERIDIAN Cold Case Intelligence Platform",
        "version": "1.0.0",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }), 200

@api_bp.route("/cases", methods=["GET"])
def get_cases():
    cases = db_service.get_all_cases()
    # Support optional query filters
    status = request.args.get("status")
    priority = request.args.get("priority")
    search = request.args.get("search")

    filtered = cases
    if status:
        filtered = [c for c in filtered if c["status"].lower() == status.lower()]
    if priority:
        filtered = [c for c in filtered if c["priority"].lower() == priority.lower()]
    if search:
        s = search.lower()
        filtered = [
            c for c in filtered
            if s in c["title"].lower() or s in c["id"].lower() or s in c["location"].lower() or s in c["crime_type"].lower()
        ]

    return jsonify({
        "total": len(filtered),
        "cases": filtered
    }), 200

@api_bp.route("/cases/<case_id>", methods=["GET"])
def get_case_detail(case_id):
    case = db_service.get_case_by_id(case_id)
    if not case:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(case), 200

@api_bp.route("/upload", methods=["POST"])
def upload_case():
    data = request.json or {}
    if not data.get("title"):
        return jsonify({"error": "Case title is required"}), 400

    new_id = f"CASE-{time.strftime('%Y')}-{str(int(time.time()))[-3:]}"
    new_case = {
        "id": new_id,
        "title": data.get("title"),
        "status": data.get("status", "Cold"),
        "priority": data.get("priority", "High"),
        "crime_type": data.get("crime_type", "Homicide"),
        "location": data.get("location", "Unknown Location"),
        "date": data.get("date", time.strftime("%Y-%m-%d")),
        "lead_investigator": data.get("lead_investigator", "Unassigned"),
        "summary": data.get("summary", "New case uploaded for AI analysis."),
        "mo_description": data.get("mo_description", ""),
        "reopen_score": round(data.get("reopen_score", 85.0), 1),
        "confidence": 0.88,
        "evidence_count": len(data.get("evidence", [])),
        "witness_count": len(data.get("witness_statements", [])),
        "linked_cases": [],
        "witness_statements": data.get("witness_statements", []),
        "evidence": data.get("evidence", [])
    }

    created = db_service.add_case(new_case)
    return jsonify({"message": "Case uploaded successfully", "case": created}), 201

@api_bp.route("/analyze", methods=["POST"])
def analyze_case():
    data = request.json or {}
    case_id = data.get("case_id", "CASE-1994-082")
    case = db_service.get_case_by_id(case_id)
    if not case:
        case = db_service.get_all_cases()[0]

    # Run complete LangGraph agent workflow
    results = run_full_langgraph_pipeline(case)
    return jsonify(results), 200

@api_bp.route("/graph", methods=["GET"])
def get_graph():
    graph_data = graph_service.get_react_flow_graph()
    return jsonify(graph_data), 200

@api_bp.route("/timeline", methods=["GET"])
def get_timeline():
    timeline = db_service.get_timeline_events()
    return jsonify({
        "total": len(timeline),
        "timeline": timeline
    }), 200

@api_bp.route("/patterns", methods=["GET"])
def get_patterns():
    patterns = db_service.get_patterns()
    return jsonify({
        "total": len(patterns),
        "patterns": patterns
    }), 200

@api_bp.route("/report", methods=["GET"])
def get_report():
    case_id = request.args.get("case_id", "CASE-1994-082")
    case = db_service.get_case_by_id(case_id)
    if not case:
        case = db_service.get_all_cases()[0]

    pipeline_results = run_full_langgraph_pipeline(case)
    return jsonify({
        "case": case,
        "report": pipeline_results["summary_report"],
        "recommendation": pipeline_results["recommendation"],
        "patterns": pipeline_results["discovered_patterns"],
        "extracted_entities": pipeline_results["extracted_entities"]
    }), 200
