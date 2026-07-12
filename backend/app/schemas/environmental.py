from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from uuid import UUID
from app.models.environmental import ScopeEnum, EnergyTypeEnum, WasteTypeEnum

def validate_date_not_future(v: date) -> date:
    if v > date.today():
        raise ValueError("Date cannot be in the future")
    return v

# --- CarbonEmission ---
class CarbonEmissionBase(BaseModel):
    date: date
    source: str
    scope: ScopeEnum
    value_tco2e: float = Field(..., ge=0.0)
    company_id: UUID

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        return validate_date_not_future(v)

class CarbonEmissionCreate(CarbonEmissionBase):
    pass

class CarbonEmissionUpdate(BaseModel):
    date: Optional[date] = None
    source: Optional[str] = None
    scope: Optional[ScopeEnum] = None
    value_tco2e: Optional[float] = Field(None, ge=0.0)
    company_id: Optional[UUID] = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if v:
            return validate_date_not_future(v)
        return v

class CarbonEmissionRead(CarbonEmissionBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


# --- EnergyUsage ---
class EnergyUsageBase(BaseModel):
    date: date
    energy_type: EnergyTypeEnum
    kwh_consumed: float = Field(..., ge=0.0)
    facility_id: UUID

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        return validate_date_not_future(v)

class EnergyUsageCreate(EnergyUsageBase):
    pass

class EnergyUsageUpdate(BaseModel):
    date: Optional[date] = None
    energy_type: Optional[EnergyTypeEnum] = None
    kwh_consumed: Optional[float] = Field(None, ge=0.0)
    facility_id: Optional[UUID] = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if v:
            return validate_date_not_future(v)
        return v

class EnergyUsageRead(EnergyUsageBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


# --- WasteTracking ---
class WasteTrackingBase(BaseModel):
    date: date
    waste_type: WasteTypeEnum
    kg_recycled: float = Field(0.0, ge=0.0)
    kg_landfill: float = Field(0.0, ge=0.0)
    company_id: UUID

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        return validate_date_not_future(v)

class WasteTrackingCreate(WasteTrackingBase):
    pass

class WasteTrackingUpdate(BaseModel):
    date: Optional[date] = None
    waste_type: Optional[WasteTypeEnum] = None
    kg_recycled: Optional[float] = Field(None, ge=0.0)
    kg_landfill: Optional[float] = Field(None, ge=0.0)
    company_id: Optional[UUID] = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if v:
            return validate_date_not_future(v)
        return v

class WasteTrackingRead(WasteTrackingBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

from app.models.environmental import CarbonSourceTypeEnum

class CarbonTransactionBase(BaseModel):
    date: date
    source_type: CarbonSourceTypeEnum
    source_ref: Optional[str] = None
    emission_factor_id: UUID
    quantity: float = Field(..., ge=0.0)
    department_id: UUID
    
    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        return validate_date_not_future(v)

class CarbonTransactionCreate(CarbonTransactionBase):
    pass

class CarbonTransactionUpdate(BaseModel):
    date: Optional[date] = None
    source_type: Optional[CarbonSourceTypeEnum] = None
    source_ref: Optional[str] = None
    emission_factor_id: Optional[UUID] = None
    quantity: Optional[float] = Field(None, ge=0.0)
    department_id: Optional[UUID] = None

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        if v:
            return validate_date_not_future(v)
        return v

class CarbonTransactionRead(CarbonTransactionBase):
    id: UUID
    calculated_co2e: float
    auto_generated: bool
    model_config = ConfigDict(from_attributes=True)
