from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


from typing import Any
from app.models.gamification import (
    RewardStatusEnum,
    ChallengeDifficultyEnum,
    ChallengeStatusEnum,
    ChallengeApprovalEnum
)

# --- Badge Schemas ---
class BadgeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    unlock_rule: Any = Field(...)
    icon: str = Field(..., min_length=1, max_length=255)

class BadgeCreate(BadgeBase):
    pass

class BadgeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    unlock_rule: Optional[Any] = None
    icon: Optional[str] = Field(None, min_length=1, max_length=255)

class BadgeRead(BadgeBase):
    id: UUID
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- Reward Schemas ---
class RewardBase(BaseModel):
    name: str
    description: Optional[str] = None
    points_required: int
    stock: int = 0
    status: RewardStatusEnum = RewardStatusEnum.active

class RewardCreate(RewardBase):
    pass

class RewardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    points_required: Optional[int] = None
    stock: Optional[int] = None
    status: Optional[RewardStatusEnum] = None

class RewardRead(RewardBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- Challenge Schemas ---
class ChallengeBase(BaseModel):
    title: str
    category_id: UUID
    description: Optional[str] = None
    xp: int
    difficulty: ChallengeDifficultyEnum
    evidence_required: bool = False
    deadline: datetime
    status: ChallengeStatusEnum = ChallengeStatusEnum.draft

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[UUID] = None
    description: Optional[str] = None
    xp: Optional[int] = None
    difficulty: Optional[ChallengeDifficultyEnum] = None
    evidence_required: Optional[bool] = None
    deadline: Optional[datetime] = None
    status: Optional[ChallengeStatusEnum] = None

class ChallengeRead(ChallengeBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- ChallengeParticipation Schemas ---
class ChallengeParticipationBase(BaseModel):
    challenge_id: UUID
    employee_id: UUID
    progress: float = 0.0
    proof: Optional[str] = None
    approval: ChallengeApprovalEnum = ChallengeApprovalEnum.pending
    xp_awarded: int = 0

class ChallengeParticipationCreate(ChallengeParticipationBase):
    pass

class ChallengeParticipationUpdate(BaseModel):
    progress: Optional[float] = None
    proof: Optional[str] = None
    approval: Optional[ChallengeApprovalEnum] = None
    xp_awarded: Optional[int] = None

class ChallengeParticipationRead(ChallengeParticipationBase):
    id: UUID
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

class RedeemRewardRequest(BaseModel):
    reward_id: UUID
