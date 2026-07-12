from datetime import date
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from app.models.master import (
    DepartmentStatusEnum,
    CategoryTypeEnum,
    CategoryStatusEnum,
    EnvironmentalGoalStatusEnum
)

# --- Department ---
class DepartmentBase(BaseModel):
    name: str
    code: Optional[str] = None
    head_id: Optional[UUID] = None
    parent_department_id: Optional[UUID] = None
    employee_count: int = 0
    status: DepartmentStatusEnum = DepartmentStatusEnum.active
    company_id: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    head_id: Optional[UUID] = None
    parent_department_id: Optional[UUID] = None
    employee_count: Optional[int] = None
    status: Optional[DepartmentStatusEnum] = None
    company_id: Optional[str] = None

class DepartmentRead(DepartmentBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- Category ---
class CategoryBase(BaseModel):
    name: str
    type: CategoryTypeEnum
    status: CategoryStatusEnum = CategoryStatusEnum.active

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[CategoryTypeEnum] = None
    status: Optional[CategoryStatusEnum] = None

class CategoryRead(CategoryBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- EmissionFactor ---
class EmissionFactorBase(BaseModel):
    category: str
    source: str
    unit: str
    co2_factor_value: float
    effective_date: date

class EmissionFactorCreate(EmissionFactorBase):
    pass

class EmissionFactorUpdate(BaseModel):
    category: Optional[str] = None
    source: Optional[str] = None
    unit: Optional[str] = None
    co2_factor_value: Optional[float] = None
    effective_date: Optional[date] = None

class EmissionFactorRead(EmissionFactorBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- ProductESGProfile ---
class ProductESGProfileBase(BaseModel):
    product_name: str
    product_ref: Optional[str] = None
    emission_factor_id: Optional[UUID] = None
    esg_notes: Optional[str] = None

class ProductESGProfileCreate(ProductESGProfileBase):
    pass

class ProductESGProfileUpdate(BaseModel):
    product_name: Optional[str] = None
    product_ref: Optional[str] = None
    emission_factor_id: Optional[UUID] = None
    esg_notes: Optional[str] = None

class ProductESGProfileRead(ProductESGProfileBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- EnvironmentalGoal ---
class EnvironmentalGoalBase(BaseModel):
    name: str
    department_id: UUID
    target_co2: float
    current_co2: float = 0.0
    deadline: date
    status: EnvironmentalGoalStatusEnum = EnvironmentalGoalStatusEnum.active

class EnvironmentalGoalCreate(EnvironmentalGoalBase):
    pass

class EnvironmentalGoalUpdate(BaseModel):
    name: Optional[str] = None
    department_id: Optional[UUID] = None
    target_co2: Optional[float] = None
    current_co2: Optional[float] = None
    deadline: Optional[date] = None
    status: Optional[EnvironmentalGoalStatusEnum] = None

class EnvironmentalGoalRead(EnvironmentalGoalBase):
    id: UUID
    progress: float
    model_config = ConfigDict(from_attributes=True)
