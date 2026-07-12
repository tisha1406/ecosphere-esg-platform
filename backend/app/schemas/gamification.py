from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


# --- Badge Schemas ---
class BadgeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    criteria: str = Field(..., min_length=1)
    icon: str = Field(..., min_length=1, max_length=255)
    points_value: int = Field(..., ge=0)

class BadgeCreate(BadgeBase):
    pass

class BadgeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    criteria: Optional[str] = Field(None, min_length=1)
    icon: Optional[str] = Field(None, min_length=1, max_length=255)
    points_value: Optional[int] = Field(None, ge=0)

class BadgeRead(BadgeBase):
    id: UUID
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# --- Leaderboard Schemas ---
class LeaderboardEntry(BaseModel):
    user_id: UUID
    full_name: str
    avatar_url: Optional[str] = None
    total_points: int

class LeaderboardResponse(BaseModel):
    period: str
    limit: int
    entries: List[LeaderboardEntry]


# --- Points History ---
class PointsHistoryEntry(BaseModel):
    id: UUID
    points: int
    reason: str
    source_table: str
    source_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class PointsHistoryResponse(BaseModel):
    user_id: UUID
    total_points: int
    history: List[PointsHistoryEntry]


# --- Award Points (Internal/Admin Only) ---
class AwardPointsRequest(BaseModel):
    user_id: UUID
    points: int = Field(..., description="Points to award (can be negative)")
    reason: str = Field(..., min_length=1, max_length=255)
