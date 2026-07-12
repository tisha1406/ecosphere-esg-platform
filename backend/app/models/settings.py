from sqlalchemy import Column, String, Float, Boolean
from app.core.database import Base
from app.models.base import AuditMixin

class CompanySetting(Base, AuditMixin):
    __tablename__ = "company_settings"

    company_name = Column(String(255), nullable=False, default="EcoSphere Corp")
    
    # ESG Targets
    carbon_target = Column(Float, nullable=False, default=1000.0)
    water_target = Column(Float, nullable=False, default=5000.0)
    waste_target = Column(Float, nullable=False, default=100.0)
    diversity_target = Column(Float, nullable=False, default=40.0)
    governance_target = Column(Float, nullable=False, default=90.0)
    
    # Score Thresholds for Gauges (Red/Amber/Green)
    low_score_threshold = Column(Float, nullable=False, default=40.0)
    medium_score_threshold = Column(Float, nullable=False, default=70.0)
    
    # Notifications Preferences
    notification_email_alerts = Column(Boolean, nullable=False, default=True)
    notification_weekly_reports = Column(Boolean, nullable=False, default=True)
