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
    auto_emission_calculation: bool = True
    require_evidence_csr: bool = True
    auto_award_badges: bool = True
    email_alerts_compliance: bool = True
    weight_environmental: float = 40.0
    weight_social: float = 30.0
    weight_governance: float = 30.0

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
    auto_emission_calculation: Optional[bool] = None
    require_evidence_csr: Optional[bool] = None
    auto_award_badges: Optional[bool] = None
    email_alerts_compliance: Optional[bool] = None
    weight_environmental: Optional[float] = None
    weight_social: Optional[float] = None
    weight_governance: Optional[float] = None

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
    auto_emission_calculation: bool
    require_evidence_csr: bool
    auto_award_badges: bool
    email_alerts_compliance: bool
    weight_environmental: float
    weight_social: float
    weight_governance: float
    is_active: bool
    created_at: datetime
    updated_at: datetime
