from datetime import date
from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.models.social import CsrStatusEnum


# --- Department ---
class DepartmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    company_id: str = Field(..., min_length=1)

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentRead(DepartmentBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


# --- Employee ---
class EmployeeBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    department_id: Optional[UUID] = None
    company_id: str = Field(..., min_length=1)

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeRead(EmployeeBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


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


# --- CsrInitiative ---
class CsrBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    budget: Decimal = Field(..., ge=0)
    beneficiaries: int = Field(..., ge=0)
    status: CsrStatusEnum = CsrStatusEnum.planned
    start_date: date
    end_date: Optional[date] = None
    responsible_id: Optional[UUID] = None

class CsrCreate(CsrBase):
    pass

class CsrUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    budget: Optional[Decimal] = Field(None, ge=0)
    beneficiaries: Optional[int] = Field(None, ge=0)
    status: Optional[CsrStatusEnum] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    responsible_id: Optional[UUID] = None

class CsrRead(CsrBase):
    id: UUID
    is_active: bool
    created_at: date
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
