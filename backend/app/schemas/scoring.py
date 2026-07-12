from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class PointsLedgerCreate(BaseModel):
    user_id: UUID
    points: int
    reason: str
    source_table: str
    source_id: UUID

class PointsLedgerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    user_id: UUID
    points: int
    reason: str
    source_table: str
    source_id: UUID
    created_at: datetime
    updated_at: datetime

class EsgScoreSummaryCreate(BaseModel):
    company_id: str = "default"
    period: str
    environmental_score: float = 0.0
    social_score: float = 0.0
    governance_score: float = 0.0
    total_score: float = 0.0

class EsgScoreSummaryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    company_id: str
    period: str
    environmental_score: float
    social_score: float
    governance_score: float
    total_score: float
    created_at: datetime
    updated_at: datetime
