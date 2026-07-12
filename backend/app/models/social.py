import enum
from sqlalchemy import Column, String, Float, Integer, Enum, Date, Numeric, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin


class CsrStatusEnum(str, enum.Enum):
    planned = "planned"
    active = "active"
    completed = "completed"


class EmployeeWellbeing(Base, AuditMixin):
    __tablename__ = "employee_wellbeing"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    survey_date = Column(Date, nullable=False, index=True)
    satisfaction_score = Column(Float, nullable=False)  # 0.0–10.0

    employee = relationship("User")


class CSRActivity(Base, AuditMixin):
    __tablename__ = "csr_activities"

    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)
    icon = Column(String(255), nullable=True)
    evidence_required = Column(Boolean, default=False)
    status = Column(Enum(CsrStatusEnum, name="csrstatusenum"), nullable=False, default=CsrStatusEnum.planned, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True)

    category = relationship("Category")
    department = relationship("Department")


class EmployeeParticipationApprovalEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class EmployeeParticipation(Base, AuditMixin):
    __tablename__ = "employee_participations"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("csr_activities.id"), nullable=False)
    proof = Column(String(1000), nullable=True)
    approval_status = Column(Enum(EmployeeParticipationApprovalEnum, name="employeeparticipationapprovalenum"), default=EmployeeParticipationApprovalEnum.pending)
    points_earned = Column(Integer, default=0)
    completion_date = Column(Date, nullable=False)

    employee = relationship("User")
    activity = relationship("CSRActivity")


class DiversityMetric(Base, AuditMixin):
    __tablename__ = "diversity_metrics"

    period = Column(String(50), nullable=False, index=True)  # e.g. "2026-Q1"
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True)
    gender_ratio = Column(Float, nullable=False)        # 0.0–1.0 (proportion female)
    inclusion_score = Column(Float, nullable=False)    # 0.0–100.0

    department = relationship("Department")
