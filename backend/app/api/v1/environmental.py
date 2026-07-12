from datetime import date
from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import UserRole, User
from app.models.environmental import ScopeEnum, EnergyTypeEnum, WasteTypeEnum
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.environmental import (
    CarbonEmissionCreate, CarbonEmissionUpdate, CarbonEmissionRead,
    EnergyUsageCreate, EnergyUsageUpdate, EnergyUsageRead,
    WasteTrackingCreate, WasteTrackingUpdate, WasteTrackingRead
)
from app.services.environmental_service import EnvironmentalService

router = APIRouter(prefix="/api/v1/environmental", tags=["Environmental"])

# Roles
write_roles = [UserRole.admin, UserRole.esg_manager, UserRole.environmental_officer]
read_roles = list(UserRole)

def get_service(db: AsyncSession = Depends(get_db)) -> EnvironmentalService:
    return EnvironmentalService(db)

# --- CarbonEmissions ---
@router.post("/emissions", response_model=ResponseEnvelope[CarbonEmissionRead])
async def create_carbon_emission(
    data: CarbonEmissionCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.create_carbon_emission(data, current_user.id)
    return ResponseEnvelope(data=CarbonEmissionRead.model_validate(obj))

@router.get("/emissions", response_model=ResponseEnvelope[PaginatedResponse[CarbonEmissionRead]])
async def get_carbon_emissions(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    source: Optional[str] = None,
    scope: Optional[ScopeEnum] = None,
    company_id: Optional[UUID] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_carbon_emissions(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date, 
        source=source, scope=scope, company_id=company_id
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[CarbonEmissionRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/emissions/{id}", response_model=ResponseEnvelope[CarbonEmissionRead])
async def get_carbon_emission(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.get_carbon_emission(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carbon emission not found")
    return ResponseEnvelope(data=CarbonEmissionRead.model_validate(obj))

@router.patch("/emissions/{id}", response_model=ResponseEnvelope[CarbonEmissionRead])
async def update_carbon_emission(
    id: UUID,
    data: CarbonEmissionUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.update_carbon_emission(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carbon emission not found")
    return ResponseEnvelope(data=CarbonEmissionRead.model_validate(obj))

from app.models.environmental import CarbonTransaction
from app.schemas.environmental import (
    CarbonTransactionCreate, CarbonTransactionUpdate, CarbonTransactionRead
)

@router.delete("/emissions/{id}", response_model=ResponseEnvelope[dict])
async def delete_carbon_emission(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    success = await service.delete_carbon_emission(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carbon emission not found")
    return ResponseEnvelope(data={"deleted": True})

# --- CarbonTransactions ---
@router.post("/transactions", response_model=ResponseEnvelope[CarbonTransactionRead], status_code=status.HTTP_201_CREATED)
async def create_carbon_transaction(data: CarbonTransactionCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    from app.models.master import EmissionFactor
    from app.models.settings import CompanySetting
    from sqlalchemy import select

    # Rule: Calculate CO2e
    emission_factor = await db.get(EmissionFactor, data.emission_factor_id)
    if not emission_factor:
        raise HTTPException(status_code=404, detail="Emission factor not found")
        
    result = await db.execute(select(CompanySetting).limit(1))
    settings = result.scalars().first()
    
    calculated = data.quantity * emission_factor.factor_value
    
    db_obj = CarbonTransaction(
        **data.model_dump(), 
        calculated_co2e=calculated,
        auto_generated=settings.auto_emission_calculation if settings else False
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=CarbonTransactionRead.model_validate(db_obj))

@router.get("/transactions", response_model=ResponseEnvelope[List[CarbonTransactionRead]])
async def get_carbon_transactions(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    from sqlalchemy import select
    result = await db.execute(select(CarbonTransaction))
    items = result.scalars().all()
    return ResponseEnvelope(data=[CarbonTransactionRead.model_validate(i) for i in items])

@router.get("/transactions/{id}", response_model=ResponseEnvelope[CarbonTransactionRead])
async def get_carbon_transaction(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(CarbonTransaction, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Carbon transaction not found")
    return ResponseEnvelope(data=CarbonTransactionRead.model_validate(db_obj))

@router.patch("/transactions/{id}", response_model=ResponseEnvelope[CarbonTransactionRead])
async def update_carbon_transaction(id: UUID, data: CarbonTransactionUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(CarbonTransaction, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Carbon transaction not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=CarbonTransactionRead.model_validate(db_obj))

@router.delete("/transactions/{id}", response_model=ResponseEnvelope[dict])
async def delete_carbon_transaction(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(CarbonTransaction, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Carbon transaction not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

# --- EnergyUsage ---
@router.post("/energy", response_model=ResponseEnvelope[EnergyUsageRead])
async def create_energy_usage(
    data: EnergyUsageCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.create_energy_usage(data, current_user.id)
    return ResponseEnvelope(data=EnergyUsageRead.model_validate(obj))

@router.get("/energy", response_model=ResponseEnvelope[PaginatedResponse[EnergyUsageRead]])
async def get_energy_usages(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    energy_type: Optional[EnergyTypeEnum] = None,
    facility_id: Optional[UUID] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_energy_usages(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date, 
        energy_type=energy_type, facility_id=facility_id
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[EnergyUsageRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/energy/{id}", response_model=ResponseEnvelope[EnergyUsageRead])
async def get_energy_usage(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.get_energy_usage(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Energy usage not found")
    return ResponseEnvelope(data=EnergyUsageRead.model_validate(obj))

@router.patch("/energy/{id}", response_model=ResponseEnvelope[EnergyUsageRead])
async def update_energy_usage(
    id: UUID,
    data: EnergyUsageUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.update_energy_usage(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Energy usage not found")
    return ResponseEnvelope(data=EnergyUsageRead.model_validate(obj))

@router.delete("/energy/{id}", response_model=ResponseEnvelope[dict])
async def delete_energy_usage(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    success = await service.delete_energy_usage(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Energy usage not found")
    return ResponseEnvelope(data={"deleted": True})

# --- WasteTracking ---
@router.post("/waste", response_model=ResponseEnvelope[WasteTrackingRead])
async def create_waste_tracking(
    data: WasteTrackingCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.create_waste_tracking(data, current_user.id)
    return ResponseEnvelope(data=WasteTrackingRead.model_validate(obj))

@router.get("/waste", response_model=ResponseEnvelope[PaginatedResponse[WasteTrackingRead]])
async def get_waste_trackings(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    waste_type: Optional[WasteTypeEnum] = None,
    company_id: Optional[UUID] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_waste_trackings(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date, 
        waste_type=waste_type, company_id=company_id
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[WasteTrackingRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/waste/{id}", response_model=ResponseEnvelope[WasteTrackingRead])
async def get_waste_tracking(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.get_waste_tracking(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waste tracking not found")
    return ResponseEnvelope(data=WasteTrackingRead.model_validate(obj))

@router.patch("/waste/{id}", response_model=ResponseEnvelope[WasteTrackingRead])
async def update_waste_tracking(
    id: UUID,
    data: WasteTrackingUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    obj = await service.update_waste_tracking(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waste tracking not found")
    return ResponseEnvelope(data=WasteTrackingRead.model_validate(obj))

@router.delete("/waste/{id}", response_model=ResponseEnvelope[dict])
async def delete_waste_tracking(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    success = await service.delete_waste_tracking(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Waste tracking not found")
    return ResponseEnvelope(data={"deleted": True})

# --- Score ---
@router.get("/score", response_model=ResponseEnvelope[float])
async def get_environmental_score(
    company_id: UUID,
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(require_role(*read_roles)),
    service: EnvironmentalService = Depends(get_service)
):
    score = await service.compute_environmental_score(company_id, start_date, end_date)
    return ResponseEnvelope(data=score)
