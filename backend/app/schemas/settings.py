from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, ConfigDict

class CompanySettingCreate(BaseModel):
    company_name: str = "EcoSphere Corp"
    carbon_target: float = 1000.0
    water_target: float = 5000.0
    waste_target: float = 100.0
    diversity_target: float = 40.0
    governance_target: float = 90.0
    low_score_threshold: float = 40.0
    medium_score_threshold: float = 70.0
    notification_email_alerts: bool = True
    notification_weekly_reports: bool = True

class CompanySettingUpdate(BaseModel):
    company_name: Optional[str] = None
    carbon_target: Optional[float] = None
    water_target: Optional[float] = None
    waste_target: Optional[float] = None
    diversity_target: Optional[float] = None
    governance_target: Optional[float] = None
    low_score_threshold: Optional[float] = None
    medium_score_threshold: Optional[float] = None
    notification_email_alerts: Optional[bool] = None
    notification_weekly_reports: Optional[bool] = None

class CompanySettingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    company_name: str
    carbon_target: float
    water_target: float
    waste_target: float
    diversity_target: float
    governance_target: float
    low_score_threshold: float
    medium_score_threshold: float
    notification_email_alerts: bool
    notification_weekly_reports: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
