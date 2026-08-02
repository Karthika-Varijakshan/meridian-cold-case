import json
import os
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "mock_data", "database.json")

class DatabaseService:
    """
    Data Access Abstraction Layer for MERIDIAN.
    Currently backed by JSON store; easily swappable with PostgreSQL or MongoDB.
    """
    
    @staticmethod
    def _read_db() -> Dict[str, Any]:
        if not os.path.exists(DB_FILE):
            return {"cases": [], "entities": [], "graph_edges": [], "patterns": []}
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)

    @staticmethod
    def _write_db(data: Dict[str, Any]) -> None:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def get_all_cases(self) -> List[Dict[str, Any]]:
        db = self._read_db()
        return db.get("cases", [])

    def get_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        cases = self.get_all_cases()
        for c in cases:
            if c["id"].lower() == case_id.lower():
                return c
        return None

    def add_case(self, new_case: Dict[str, Any]) -> Dict[str, Any]:
        db = self._read_db()
        db["cases"].insert(0, new_case)
        self._write_db(db)
        return new_case

    def update_case(self, case_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db = self._read_db()
        for idx, c in enumerate(db["cases"]):
            if c["id"].lower() == case_id.lower():
                db["cases"][idx].update(updates)
                self._write_db(db)
                return db["cases"][idx]
        return None

    def get_all_entities(self) -> List[Dict[str, Any]]:
        db = self._read_db()
        return db.get("entities", [])

    def get_graph_edges(self) -> List[Dict[str, Any]]:
        db = self._read_db()
        return db.get("graph_edges", [])

    def get_patterns(self) -> List[Dict[str, Any]]:
        db = self._read_db()
        return db.get("patterns", [])

    def get_timeline_events(self) -> List[Dict[str, Any]]:
        cases = self.get_all_cases()
        timeline = []
        for c in cases:
            timeline.append({
                "id": f"TL-{c['id']}",
                "case_id": c["id"],
                "title": c["title"],
                "date": c["date"],
                "year": int(c["date"].split("-")[0]) if "-" in c["date"] else 2000,
                "location": c["location"],
                "crime_type": c["crime_type"],
                "summary": c["summary"],
                "priority": c["priority"],
                "status": c["status"]
            })
        timeline.sort(key=lambda x: x["date"])
        return timeline

db_service = DatabaseService()
