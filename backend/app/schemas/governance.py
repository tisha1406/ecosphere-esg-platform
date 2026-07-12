from datetime import date, datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, ConfigDict

from app.models.governance import PolicyStatusEnum

class PolicyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    status: PolicyStatusEnum
    effective_date: date

    @field_validator("effective_date")
    @classmethod
    def date_not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("effective_date cannot be in the future")
        return v

class PolicyCreate(PolicyBase):
    owner_id: UUID

class PolicyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[PolicyStatusEnum] = None
    effective_date: Optional[date] = None
    owner_id: Optional[UUID] = None

    @field_validator("effective_date")
    @classmethod
    def date_not_in_future(cls, v: Optional[date]) -> Optional[date]:
        if v and v > date.today():
            raise ValueError("effective_date cannot be in the future")
        return v

class PolicyRead(PolicyBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class ComplianceAuditBase(BaseModel):
    audit_date: date
    score: float = Field(..., ge=0.0, le=100.0)
    findings: str = Field(..., min_length=1)

    @field_validator("audit_date")
    @classmethod
    def date_not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("audit_date cannot be in the future")
        return v

class ComplianceAuditCreate(ComplianceAuditBase):
    auditor_id: UUID

class ComplianceAuditUpdate(BaseModel):
    audit_date: Optional[date] = None
    auditor_id: Optional[UUID] = None
    score: Optional[float] = Field(None, ge=0.0, le=100.0)
    findings: Optional[str] = Field(None, min_length=1)

    @field_validator("audit_date")
    @classmethod
    def date_not_in_future(cls, v: Optional[date]) -> Optional[date]:
        if v and v > date.today():
            raise ValueError("audit_date cannot be in the future")
        return v

class ComplianceAuditRead(ComplianceAuditBase):
    id: UUID
    auditor_id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class BoardActivityBase(BaseModel):
    meeting_date: date
    topic: str = Field(..., min_length=1, max_length=255)
    decision: str = Field(..., min_length=1)

    @field_validator("meeting_date")
    @classmethod
    def date_not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("meeting_date cannot be in the future")
        return v

class BoardActivityCreate(BoardActivityBase):
    attendee_ids: List[UUID] = Field(default_factory=list)

class BoardActivityUpdate(BaseModel):
    meeting_date: Optional[date] = None
    topic: Optional[str] = Field(None, min_length=1, max_length=255)
    decision: Optional[str] = Field(None, min_length=1)
    attendee_ids: Optional[List[UUID]] = None

    @field_validator("meeting_date")
    @classmethod
    def date_not_in_future(cls, v: Optional[date]) -> Optional[date]:
        if v and v > date.today():
            raise ValueError("meeting_date cannot be in the future")
        return v

class BoardActivityRead(BoardActivityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
