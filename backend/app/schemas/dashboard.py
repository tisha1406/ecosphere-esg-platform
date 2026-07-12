from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


# --- Notification Schemas ---

class NotificationBase(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    source_table: str = Field(default="system", max_length=100)
    is_read: bool = False


class NotificationCreate(NotificationBase):
    user_id: UUID


class NotificationRead(NotificationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


# --- Dashboard Summary Schemas ---

class EsgScoreTrend(BaseModel):
    current: float
    previous: Optional[float] = None
    delta: Optional[float] = None  # positive = improved


class EsgScoreBlock(BaseModel):
    environmental: EsgScoreTrend
    social: EsgScoreTrend
    governance: EsgScoreTrend
    overall: EsgScoreTrend
    period: str


class ActivityCounts(BaseModel):
    open_policies: int
    pending_audits: int
    active_csr_initiatives: int
    emissions_this_month_tco2e: float


class LeaderboardEntryCompact(BaseModel):
    user_id: UUID
    full_name: str
    total_points: int


class DashboardSummaryResponse(BaseModel):
    scores: EsgScoreBlock
    activity: ActivityCounts
    top_contributors: List[LeaderboardEntryCompact]
    recent_notifications: List[NotificationRead]
