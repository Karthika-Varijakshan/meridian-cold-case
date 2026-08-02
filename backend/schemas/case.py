"""
Pydantic schemas for MERIDIAN case data.

These define the request/response contracts for the API layer. They mirror
the shape of the existing JSON mock store exactly, so the frontend (built
against the old Flask responses) keeps working unchanged during the
FastAPI migration.
"""
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class WitnessStatement(BaseModel):
    id: str
    witness_name: str
    role: str
    statement: str
    date: str


class EvidenceItem(BaseModel):
    id: str
    type: str
    name: str
    location: str
    status: str
    ocr_text: Optional[str] = ""


class Case(BaseModel):
    id: str
    title: str
    status: str
    priority: str
    crime_type: str
    location: str
    date: str
    lead_investigator: str
    summary: str
    mo_description: str = ""
    reopen_score: float = 50.0
    confidence: float = 0.5
    evidence_count: int = 0
    witness_count: int = 0
    linked_cases: List[str] = Field(default_factory=list)
    witness_statements: List[WitnessStatement] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)


class CaseCreateRequest(BaseModel):
    """Payload accepted by POST /api/upload. All fields optional except title,
    matching the permissive behavior of the original Flask endpoint."""
    title: str
    status: Optional[str] = "Cold"
    priority: Optional[str] = "High"
    crime_type: Optional[str] = "Homicide"
    location: Optional[str] = "Unknown Location"
    date: Optional[str] = None
    lead_investigator: Optional[str] = "Unassigned"
    summary: Optional[str] = "New case uploaded for AI analysis."
    mo_description: Optional[str] = ""
    reopen_score: Optional[float] = 85.0
    witness_statements: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[Dict[str, Any]] = Field(default_factory=list)


class CaseListResponse(BaseModel):
    total: int
    cases: List[Dict[str, Any]]


class AnalyzeRequest(BaseModel):
    case_id: Optional[str] = "CASE-1994-082"


class TimelineResponse(BaseModel):
    total: int
    timeline: List[Dict[str, Any]]


class PatternsResponse(BaseModel):
    total: int
    patterns: List[Dict[str, Any]]


class HealthResponse(BaseModel):
    status: str
    system: str
    version: str
    timestamp: str
