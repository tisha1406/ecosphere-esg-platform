import enum
from sqlalchemy import Column, String, Integer, Enum, Date, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin

class DepartmentStatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class Department(Base, AuditMixin):
    __tablename__ = "departments"
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True)
    head_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    parent_department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    employee_count = Column(Integer, default=0)
    status = Column(Enum(DepartmentStatusEnum, name="departmentstatusenum"), default=DepartmentStatusEnum.active)
    company_id = Column(String(100), nullable=False, index=True)

    head = relationship("User", foreign_keys=[head_id])
    parent_department = relationship("Department", remote_side="Department.id")


class CategoryTypeEnum(str, enum.Enum):
    csr_activity = "csr_activity"
    challenge = "challenge"

class CategoryStatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class Category(Base, AuditMixin):
    __tablename__ = "categories"
    name = Column(String(255), nullable=False)
    type = Column(Enum(CategoryTypeEnum, name="categorytypeenum"), nullable=False)
    status = Column(Enum(CategoryStatusEnum, name="categorystatusenum"), default=CategoryStatusEnum.active)


class EmissionFactor(Base, AuditMixin):
    __tablename__ = "emission_factors"
    category = Column(String(255), nullable=False)
    source = Column(String(255), nullable=False)
    unit = Column(String(50), nullable=False)
    co2_factor_value = Column(Float, nullable=False)
    effective_date = Column(Date, nullable=False)


class ProductESGProfile(Base, AuditMixin):
    __tablename__ = "product_esg_profiles"
    product_name = Column(String(255), nullable=False)
    product_ref = Column(String(100), nullable=True)
    emission_factor_id = Column(UUID(as_uuid=True), ForeignKey("emission_factors.id"), nullable=True)
    esg_notes = Column(String(1000), nullable=True)

    emission_factor = relationship("EmissionFactor")


class EnvironmentalGoalStatusEnum(str, enum.Enum):
    active = "active"
    on_track = "on_track"
    at_risk = "at_risk"
    completed = "completed"

class EnvironmentalGoal(Base, AuditMixin):
    __tablename__ = "environmental_goals"
    name = Column(String(255), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    target_co2 = Column(Float, nullable=False)
    current_co2 = Column(Float, default=0.0)
    deadline = Column(Date, nullable=False)
    status = Column(Enum(EnvironmentalGoalStatusEnum, name="environmentalgoalstatusenum"), default=EnvironmentalGoalStatusEnum.active)

    department = relationship("Department")

    @property
    def progress(self) -> float:
        if self.target_co2 > 0:
            return (self.current_co2 / self.target_co2) * 100
        return 0.0
