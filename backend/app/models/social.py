import enum
from sqlalchemy import Column, String, Float, Integer, Enum, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin


class CsrStatusEnum(str, enum.Enum):
    planned = "planned"
    active = "active"
    completed = "completed"


class Department(Base, AuditMixin):
    """Minimal Department model — Social module only, not shared with Environmental."""
    __tablename__ = "departments"

    name = Column(String(255), nullable=False)
    company_id = Column(String(100), nullable=False, index=True)

    diversity_metrics = relationship("DiversityMetric", back_populates="department")
    employees = relationship("Employee", back_populates="department")


class Employee(Base, AuditMixin):
    """Minimal Employee model — Social module only."""
    __tablename__ = "employees"

    full_name = Column(String(255), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True, index=True)
    company_id = Column(String(100), nullable=False, index=True)

    department = relationship("Department", back_populates="employees")
    wellbeing_surveys = relationship("EmployeeWellbeing", back_populates="employee")


class EmployeeWellbeing(Base, AuditMixin):
    __tablename__ = "employee_wellbeing"

    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    survey_date = Column(Date, nullable=False, index=True)
    satisfaction_score = Column(Float, nullable=False)  # 0.0–10.0

    employee = relationship("Employee", back_populates="wellbeing_surveys")


class CsrInitiative(Base, AuditMixin):
    __tablename__ = "csr_initiatives"

    name = Column(String(255), nullable=False)
    budget = Column(Numeric(14, 2), nullable=False)
    beneficiaries = Column(Integer, nullable=False, default=0)
    status = Column(Enum(CsrStatusEnum, name="csrstatusenum"), nullable=False, default=CsrStatusEnum.planned, index=True)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True)
    responsible_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)


class DiversityMetric(Base, AuditMixin):
    __tablename__ = "diversity_metrics"

    period = Column(String(50), nullable=False, index=True)  # e.g. "2026-Q1"
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True)
    gender_ratio = Column(Float, nullable=False)        # 0.0–1.0 (proportion female)
    inclusion_score = Column(Float, nullable=False)    # 0.0–100.0

    department = relationship("Department", back_populates="diversity_metrics")
