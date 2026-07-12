from pydantic import BaseModel
from typing import List

class TrendPoint(BaseModel):
    month: str
    score: float

class InitiativeSummary(BaseModel):
    name: str
    impact: str

class ContributorSummary(BaseModel):
    name: str
    points: int

class ConsolidatedReport(BaseModel):
    company_name: str
    period: str
    environmental_score: float
    social_score: float
    governance_score: float
    overall_esg_score: float
    trend_series: List[TrendPoint]
    top_initiatives: List[InitiativeSummary]
    top_contributors: List[ContributorSummary]

class ExportRequest(BaseModel):
    format: str # "pdf" or "xlsx"
    company_id: str
    period: str
