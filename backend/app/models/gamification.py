from sqlalchemy import Column, String, Integer, Text, Boolean, Enum, Date, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base
from app.models.base import AuditMixin


class Badge(Base, AuditMixin):
    __tablename__ = "badges"

    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000), nullable=True)
    unlock_rule = Column(JSON, nullable=False) # e.g. {"metric":"xp","operator":">=","value":500}
    icon = Column(String(255), nullable=False)


class RewardStatusEnum(str, enum.Enum):
    active = "active"
    out_of_stock = "out_of_stock"
    retired = "retired"

class Reward(Base, AuditMixin):
    __tablename__ = "rewards"

    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    points_required = Column(Integer, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    status = Column(Enum(RewardStatusEnum, name="rewardstatusenum"), default=RewardStatusEnum.active)


class ChallengeDifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class ChallengeStatusEnum(str, enum.Enum):
    draft = "draft"
    active = "active"
    under_review = "under_review"
    completed = "completed"
    archived = "archived"

class Challenge(Base, AuditMixin):
    __tablename__ = "challenges"
    title = Column(String(255), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)
    description = Column(String(1000), nullable=True)
    xp = Column(Integer, nullable=False)
    difficulty = Column(Enum(ChallengeDifficultyEnum, name="challengedifficultyenum"), nullable=False)
    evidence_required = Column(Boolean, default=False)
    deadline = Column(Date, nullable=False)
    status = Column(Enum(ChallengeStatusEnum, name="challengestatusenum"), default=ChallengeStatusEnum.draft)

    category = relationship("Category")


class ChallengeApprovalEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ChallengeParticipation(Base, AuditMixin):
    __tablename__ = "challenge_participations"
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"), nullable=False)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    progress = Column(Float, default=0.0) # percentage
    proof = Column(String(1000), nullable=True) # file ref
    approval = Column(Enum(ChallengeApprovalEnum, name="challengeapprovalenum"), default=ChallengeApprovalEnum.pending)
    xp_awarded = Column(Integer, default=0)

    challenge = relationship("Challenge")
    employee = relationship("User")
