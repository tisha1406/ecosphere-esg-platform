from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from app.models.base import AuditMixin

class PointsLedger(Base, AuditMixin):
    __tablename__ = "points_ledgers"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    points = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    source_table = Column(String(100), nullable=False)
    source_id = Column(UUID(as_uuid=True), nullable=False)

class EsgScoreSummary(Base, AuditMixin):
    __tablename__ = "esg_score_summaries"

    company_id = Column(String(100), nullable=False, default="default", index=True)
    period = Column(String(50), nullable=False, index=True)
    environmental_score = Column(Float, nullable=False, default=0.0)
    social_score = Column(Float, nullable=False, default=0.0)
    governance_score = Column(Float, nullable=False, default=0.0)
    total_score = Column(Float, nullable=False, default=0.0)

class DepartmentScore(Base, AuditMixin):
    __tablename__ = "department_scores"
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False, index=True)
    period = Column(String(50), nullable=False, index=True)
    environmental_score = Column(Float, nullable=False, default=0.0)
    social_score = Column(Float, nullable=False, default=0.0)
    governance_score = Column(Float, nullable=False, default=0.0)
    total_score = Column(Float, nullable=False, default=0.0)

    from sqlalchemy.orm import relationship
    department = relationship("Department")
