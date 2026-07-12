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

class PolicyAcknowledgement(Base, AuditMixin):
    __tablename__ = "policy_acknowledgements"
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.id"), nullable=False)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    acknowledged_at = Column(Date, nullable=False)

    policy = relationship("Policy")
    employee = relationship("User")

class AuditStatusEnum(str, enum.Enum):
    planned = "planned"
    in_progress = "in_progress"
    completed = "completed"

class Audit(Base, AuditMixin):
    __tablename__ = "audits"
    title = Column(String(255), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    auditor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    audit_date = Column(Date, nullable=False, index=True)
    findings = Column(Text, nullable=False)
    status = Column(Enum(AuditStatusEnum, name="auditstatusenum"), default=AuditStatusEnum.planned)

    department = relationship("Department")
    auditor = relationship("User")

class ComplianceIssueSeverityEnum(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class ComplianceIssueStatusEnum(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"

class ComplianceIssue(Base, AuditMixin):
    __tablename__ = "compliance_issues"
    audit_id = Column(UUID(as_uuid=True), ForeignKey("audits.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    severity = Column(Enum(ComplianceIssueSeverityEnum, name="complianceissueseverityenum"), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(ComplianceIssueStatusEnum, name="complianceissuestatusenum"), default=ComplianceIssueStatusEnum.open)
    
    audit = relationship("Audit")
    department = relationship("Department")
    owner = relationship("User")

    @property
    def is_overdue(self) -> bool:
        from datetime import date
        return self.status != ComplianceIssueStatusEnum.resolved and self.due_date < date.today()

class BoardActivity(Base, AuditMixin):
    __tablename__ = "board_activities"
    meeting_date = Column(Date, nullable=False, index=True)
    topic = Column(String, nullable=False)
    decision = Column(Text, nullable=False)

    attendees = relationship("User", secondary=board_activity_attendees)
