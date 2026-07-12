import enum
from sqlalchemy import Column, String, Float, Enum, Date, ForeignKey, Table, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin

class PolicyStatusEnum(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"

board_activity_attendees = Table(
    "board_activity_attendees",
    Base.metadata,
    Column("activity_id", UUID(as_uuid=True), ForeignKey("board_activities.id"), primary_key=True),
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
)

class Policy(Base, AuditMixin):
    __tablename__ = "policies"
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(Enum(PolicyStatusEnum), nullable=False, default=PolicyStatusEnum.draft)
    effective_date = Column(Date, nullable=False, index=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    owner = relationship("User")

class ComplianceAudit(Base, AuditMixin):
    __tablename__ = "compliance_audits"
    audit_date = Column(Date, nullable=False, index=True)
    auditor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    score = Column(Float, nullable=False)
    findings = Column(Text, nullable=False)

    auditor = relationship("User")

class BoardActivity(Base, AuditMixin):
    __tablename__ = "board_activities"
    meeting_date = Column(Date, nullable=False, index=True)
    topic = Column(String, nullable=False)
    decision = Column(Text, nullable=False)

    attendees = relationship("User", secondary=board_activity_attendees)
