from pydantic import BaseModel
from typing import List


class RootCause(BaseModel):
    summary: str
    confidence: float
    evidence: List[str]


class AnalysisResult(BaseModel):
    incident_id: str
    summary: str
    severity: str
    root_cause: RootCause
    contributing_factors: List[str]
    recommendations: List[str]