from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.models.social import CsrStatusEnum, EmployeeParticipationApprovalEnum

# --- EmployeeWellbeing ---
class WellbeingBase(BaseModel):
    employee_id: UUID
    survey_date: date
    satisfaction_score: float = Field(..., ge=0.0, le=10.0)

class WellbeingCreate(WellbeingBase):
    pass

class WellbeingUpdate(BaseModel):
    survey_date: Optional[date] = None
    satisfaction_score: Optional[float] = Field(None, ge=0.0, le=10.0)

class WellbeingRead(WellbeingBase):
    id: UUID
    is_active: bool
    created_at: date
    model_config = ConfigDict(from_attributes=True)


# --- CSRActivity ---
class CsrBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category_id: UUID
    icon: Optional[str] = None
    evidence_required: bool = False
    status: CsrStatusEnum = CsrStatusEnum.planned
    department_id: UUID
    start_date: date
    end_date: Optional[date] = None

class CsrCreate(CsrBase):
    pass

class CsrUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    icon: Optional[str] = None
    evidence_required: Optional[bool] = None
    status: Optional[CsrStatusEnum] = None
    department_id: Optional[UUID] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class CsrRead(CsrBase):
    id: UUID
    is_active: bool
    created_at: date
    model_config = ConfigDict(from_attributes=True)


# --- EmployeeParticipation ---
class EmployeeParticipationBase(BaseModel):
    employee_id: UUID
    activity_id: UUID
    proof: Optional[str] = None
    approval_status: EmployeeParticipationApprovalEnum = EmployeeParticipationApprovalEnum.pending
    points_earned: int = 0
    completion_date: date

class EmployeeParticipationCreate(EmployeeParticipationBase):
    pass

class EmployeeParticipationUpdate(BaseModel):
    proof: Optional[str] = None
    approval_status: Optional[EmployeeParticipationApprovalEnum] = None
    points_earned: Optional[int] = None

class EmployeeParticipationRead(EmployeeParticipationBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


# --- DiversityMetric ---
class DiversityBase(BaseModel):
    period: str = Field(..., min_length=1, max_length=50)
    department_id: UUID
    gender_ratio: float = Field(..., ge=0.0, le=1.0)
    inclusion_score: float = Field(..., ge=0.0, le=100.0)

class DiversityCreate(DiversityBase):
    pass

class DiversityUpdate(BaseModel):
    period: Optional[str] = Field(None, min_length=1, max_length=50)
    gender_ratio: Optional[float] = Field(None, ge=0.0, le=1.0)
    inclusion_score: Optional[float] = Field(None, ge=0.0, le=100.0)

class DiversityRead(DiversityBase):
    id: UUID
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


# --- Social Score ---
class SocialScoreRead(BaseModel):
    company_id: str
    avg_wellbeing: float
    csr_completion_rate: float
    avg_inclusion: float
    social_score: float
