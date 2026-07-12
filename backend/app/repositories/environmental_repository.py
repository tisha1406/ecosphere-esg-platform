from datetime import date
from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.environmental import (
    CarbonEmission, EnergyUsage, WasteTracking, 
    ScopeEnum, EnergyTypeEnum, WasteTypeEnum
)
from app.schemas.environmental import (
    CarbonEmissionCreate, CarbonEmissionUpdate,
    EnergyUsageCreate, EnergyUsageUpdate,
    WasteTrackingCreate, WasteTrackingUpdate
)

class EnvironmentalRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- CarbonEmission ---
    async def create_carbon_emission(self, data: CarbonEmissionCreate) -> CarbonEmission:
        obj = CarbonEmission(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_carbon_emission(self, id: UUID) -> Optional[CarbonEmission]:
        result = await self.session.execute(select(CarbonEmission).where(CarbonEmission.id == id))
        return result.scalars().first()

    async def get_carbon_emissions(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        start_date: Optional[date] = None, 
        end_date: Optional[date] = None, 
        source: Optional[str] = None, 
        scope: Optional[ScopeEnum] = None,
        company_id: Optional[UUID] = None
    ) -> Tuple[List[CarbonEmission], int]:
        query = select(CarbonEmission)
        
        if start_date:
            query = query.where(CarbonEmission.date >= start_date)
        if end_date:
            query = query.where(CarbonEmission.date <= end_date)
        if source:
            query = query.where(CarbonEmission.source.ilike(f"%{source}%"))
        if scope:
            query = query.where(CarbonEmission.scope == scope)
        if company_id:
            query = query.where(CarbonEmission.company_id == company_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()

        return list(items), total

    async def update_carbon_emission(self, id: UUID, data: CarbonEmissionUpdate) -> Optional[CarbonEmission]:
        obj = await self.get_carbon_emission(id)
        if obj:
            update_data = data.model_dump(exclude_unset=True)
            for k, v in update_data.items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_carbon_emission(self, id: UUID) -> bool:
        obj = await self.get_carbon_emission(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    # --- EnergyUsage ---
    async def create_energy_usage(self, data: EnergyUsageCreate) -> EnergyUsage:
        obj = EnergyUsage(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_energy_usage(self, id: UUID) -> Optional[EnergyUsage]:
        result = await self.session.execute(select(EnergyUsage).where(EnergyUsage.id == id))
        return result.scalars().first()

    async def get_energy_usages(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        start_date: Optional[date] = None, 
        end_date: Optional[date] = None, 
        energy_type: Optional[EnergyTypeEnum] = None,
        facility_id: Optional[UUID] = None
    ) -> Tuple[List[EnergyUsage], int]:
        query = select(EnergyUsage)
        
        if start_date:
            query = query.where(EnergyUsage.date >= start_date)
        if end_date:
            query = query.where(EnergyUsage.date <= end_date)
        if energy_type:
            query = query.where(EnergyUsage.energy_type == energy_type)
        if facility_id:
            query = query.where(EnergyUsage.facility_id == facility_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()

        return list(items), total

    async def update_energy_usage(self, id: UUID, data: EnergyUsageUpdate) -> Optional[EnergyUsage]:
        obj = await self.get_energy_usage(id)
        if obj:
            update_data = data.model_dump(exclude_unset=True)
            for k, v in update_data.items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_energy_usage(self, id: UUID) -> bool:
        obj = await self.get_energy_usage(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    # --- WasteTracking ---
    async def create_waste_tracking(self, data: WasteTrackingCreate) -> WasteTracking:
        obj = WasteTracking(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_waste_tracking(self, id: UUID) -> Optional[WasteTracking]:
        result = await self.session.execute(select(WasteTracking).where(WasteTracking.id == id))
        return result.scalars().first()

    async def get_waste_trackings(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        start_date: Optional[date] = None, 
        end_date: Optional[date] = None, 
        waste_type: Optional[WasteTypeEnum] = None,
        company_id: Optional[UUID] = None
    ) -> Tuple[List[WasteTracking], int]:
        query = select(WasteTracking)
        
        if start_date:
            query = query.where(WasteTracking.date >= start_date)
        if end_date:
            query = query.where(WasteTracking.date <= end_date)
        if waste_type:
            query = query.where(WasteTracking.waste_type == waste_type)
        if company_id:
            query = query.where(WasteTracking.company_id == company_id)

        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = result.scalars().all()

        return list(items), total

    async def update_waste_tracking(self, id: UUID, data: WasteTrackingUpdate) -> Optional[WasteTracking]:
        obj = await self.get_waste_tracking(id)
        if obj:
            update_data = data.model_dump(exclude_unset=True)
            for k, v in update_data.items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_waste_tracking(self, id: UUID) -> bool:
        obj = await self.get_waste_tracking(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    async def get_emissions_sum_by_company(self, company_id: UUID, start_date: date, end_date: date) -> float:
        result = await self.session.execute(
            select(func.sum(CarbonEmission.value_tco2e))
            .where(CarbonEmission.company_id == company_id)
            .where(CarbonEmission.date >= start_date)
            .where(CarbonEmission.date <= end_date)
        )
        return result.scalar_one_or_none() or 0.0
        
    async def get_energy_sum_by_company(self, company_id: UUID, start_date: date, end_date: date) -> float:
        from app.models.environmental import Facility
        result = await self.session.execute(
            select(func.sum(EnergyUsage.kwh_consumed))
            .join(Facility, EnergyUsage.facility_id == Facility.id)
            .where(Facility.company_id == company_id)
            .where(EnergyUsage.date >= start_date)
            .where(EnergyUsage.date <= end_date)
        )
        return result.scalar_one_or_none() or 0.0
        
    async def get_waste_stats_by_company(self, company_id: UUID, start_date: date, end_date: date) -> Tuple[float, float]:
        result = await self.session.execute(
            select(func.sum(WasteTracking.kg_recycled), func.sum(WasteTracking.kg_landfill))
            .where(WasteTracking.company_id == company_id)
            .where(WasteTracking.date >= start_date)
            .where(WasteTracking.date <= end_date)
        )
        row = result.first()
        if row:
            return float(row[0] or 0.0), float(row[1] or 0.0)
        return 0.0, 0.0
