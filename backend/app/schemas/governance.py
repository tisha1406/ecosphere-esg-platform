from datetime import date, datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, ConfigDict

from app.models.governance import (
    PolicyStatusEnum,
    AuditStatusEnum,
    ComplianceIssueSeverityEnum,
    ComplianceIssueStatusEnum
)

class PolicyAcknowledgementBase(BaseModel):
    policy_id: UUID
    employee_id: UUID
    acknowledged_at: date

class PolicyAcknowledgementCreate(PolicyAcknowledgementBase):
    pass

class PolicyAcknowledgementUpdate(BaseModel):
    policy_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    acknowledged_at: Optional[date] = None

class PolicyAcknowledgementRead(PolicyAcknowledgementBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class AuditBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    department_id: UUID
    auditor_id: UUID
    audit_date: date
    findings: str = Field(..., min_length=1)
    status: AuditStatusEnum = AuditStatusEnum.planned

    @field_validator("audit_date")
    @classmethod
    def date_not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("audit_date cannot be in the future")
        return v

class AuditCreate(AuditBase):
    pass

class AuditUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[UUID] = None
    auditor_id: Optional[UUID] = None
    audit_date: Optional[date] = None
    findings: Optional[str] = None
    status: Optional[AuditStatusEnum] = None

    @field_validator("audit_date")
    @classmethod
    def date_not_in_future(cls, v: Optional[date]) -> Optional[date]:
        if v and v > date.today():
            raise ValueError("audit_date cannot be in the future")
        return v

class AuditRead(AuditBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


class ComplianceIssueBase(BaseModel):
    audit_id: UUID
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    severity: ComplianceIssueSeverityEnum
    department_id: UUID
    owner_id: UUID
    due_date: date
    status: ComplianceIssueStatusEnum = ComplianceIssueStatusEnum.open

class ComplianceIssueCreate(ComplianceIssueBase):
    pass

class ComplianceIssueUpdate(BaseModel):
    audit_id: Optional[UUID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[ComplianceIssueSeverityEnum] = None
    department_id: Optional[UUID] = None
    owner_id: Optional[UUID] = None
    due_date: Optional[date] = None
    status: Optional[ComplianceIssueStatusEnum] = None

class ComplianceIssueRead(ComplianceIssueBase):
    id: UUID
    is_overdue: bool
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
