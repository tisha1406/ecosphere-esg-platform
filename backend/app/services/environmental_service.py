from datetime import date
from typing import Optional, List, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.environmental_repository import EnvironmentalRepository
from app.schemas.environmental import (
    CarbonEmissionCreate, CarbonEmissionUpdate,
    EnergyUsageCreate, EnergyUsageUpdate,
    WasteTrackingCreate, WasteTrackingUpdate
)
from app.models.environmental import CarbonEmission, EnergyUsage, WasteTracking, ScopeEnum, EnergyTypeEnum, WasteTypeEnum
from app.services import scoring_service
from app.models.settings import CompanySetting
from app.models.scoring import EsgScoreSummary

class EnvironmentalService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = EnvironmentalRepository(db)

    # --- CarbonEmission ---
    async def create_carbon_emission(self, data: CarbonEmissionCreate, user_id: UUID) -> CarbonEmission:
        obj = await self.repo.create_carbon_emission(data)
        summary_before = await scoring_service.get_score_summary(self.db, str(data.company_id))
        old_score = summary_before.total_score

        await scoring_service.award_points(
            self.db, user_id, 10, "Logged carbon emission data", "carbon_emissions", obj.id
        )
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 10)

        summary_after = await scoring_service.recalculate_company_score(self.db, str(data.company_id))
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj

    async def get_carbon_emissions(self, **kwargs) -> Tuple[List[CarbonEmission], int]:
        return await self.repo.get_carbon_emissions(**kwargs)

    async def get_carbon_emission(self, id: UUID) -> Optional[CarbonEmission]:
        return await self.repo.get_carbon_emission(id)

    async def update_carbon_emission(self, id: UUID, data: CarbonEmissionUpdate) -> Optional[CarbonEmission]:
        return await self.repo.update_carbon_emission(id, data)

    async def delete_carbon_emission(self, id: UUID) -> bool:
        return await self.repo.delete_carbon_emission(id)

    # --- EnergyUsage ---
    async def create_energy_usage(self, data: EnergyUsageCreate, user_id: UUID) -> EnergyUsage:
        obj = await self.repo.create_energy_usage(data)
        from app.models.environmental import Facility
        facility = await self.db.get(Facility, data.facility_id)
        if facility:
            summary_before = await scoring_service.get_score_summary(self.db, str(facility.company_id))
            old_score = summary_before.total_score

            await scoring_service.award_points(
                self.db, user_id, 10, "Logged energy usage data", "energy_usage", obj.id
            )
            from app.services.gamification_service import GamificationService
            await GamificationService(self.db).check_new_badges_hook(user_id, 10)

            summary_after = await scoring_service.recalculate_company_score(self.db, str(facility.company_id))
            await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj

    async def get_energy_usages(self, **kwargs) -> Tuple[List[EnergyUsage], int]:
        return await self.repo.get_energy_usages(**kwargs)

    async def get_energy_usage(self, id: UUID) -> Optional[EnergyUsage]:
        return await self.repo.get_energy_usage(id)

    async def update_energy_usage(self, id: UUID, data: EnergyUsageUpdate) -> Optional[EnergyUsage]:
        return await self.repo.update_energy_usage(id, data)

    async def delete_energy_usage(self, id: UUID) -> bool:
        return await self.repo.delete_energy_usage(id)

    # --- WasteTracking ---
    async def create_waste_tracking(self, data: WasteTrackingCreate, user_id: UUID) -> WasteTracking:
        obj = await self.repo.create_waste_tracking(data)
        summary_before = await scoring_service.get_score_summary(self.db, str(data.company_id))
        old_score = summary_before.total_score

        await scoring_service.award_points(
            self.db, user_id, 10, "Logged waste tracking data", "waste_tracking", obj.id
        )
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 10)

        summary_after = await scoring_service.recalculate_company_score(self.db, str(data.company_id))
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj

    async def get_waste_trackings(self, **kwargs) -> Tuple[List[WasteTracking], int]:
        return await self.repo.get_waste_trackings(**kwargs)

    async def get_waste_tracking(self, id: UUID) -> Optional[WasteTracking]:
        return await self.repo.get_waste_tracking(id)

    async def update_waste_tracking(self, id: UUID, data: WasteTrackingUpdate) -> Optional[WasteTracking]:
        return await self.repo.update_waste_tracking(id, data)

    async def delete_waste_tracking(self, id: UUID) -> bool:
        return await self.repo.delete_waste_tracking(id)

    async def _check_score_threshold_hook(self, user_id: UUID, old_score: float, new_score: float):
        if new_score < 40.0 and old_score >= 40.0:
            await scoring_service.notify(
                self.db,
                user_id=user_id,
                message=f"Alert: Company ESG score has dropped to {new_score} (Red Band).",
                source_table="esg_score_summaries",
                source_id=user_id,
            )


    # --- Scoring ---
    async def compute_environmental_score(self, company_id: UUID, start_date: date, end_date: date) -> float:
        result = await self.db.execute(select(CompanySetting).limit(1))
        settings = result.scalars().first()
        carbon_target = settings.carbon_target if settings else 1000.0
        waste_target = settings.waste_target if settings else 100.0
        energy_target = 50000.0

        emissions_sum = await self.repo.get_emissions_sum_by_company(company_id, start_date, end_date)
        energy_sum = await self.repo.get_energy_sum_by_company(company_id, start_date, end_date)
        recycled, landfill = await self.repo.get_waste_stats_by_company(company_id, start_date, end_date)

        if emissions_sum <= carbon_target:
            emissions_score = 40.0
        elif emissions_sum >= 2 * carbon_target:
            emissions_score = 0.0
        else:
            emissions_score = 40.0 * (1 - ((emissions_sum - carbon_target) / carbon_target))

        if energy_sum <= energy_target:
            energy_score = 30.0
        elif energy_sum >= 2 * energy_target:
            energy_score = 0.0
        else:
            energy_score = 30.0 * (1 - ((energy_sum - energy_target) / energy_target))

        total_waste = recycled + landfill
        if total_waste == 0:
            waste_score = 30.0
        else:
            recycling_ratio = recycled / total_waste
            if landfill <= waste_target:
                landfill_score = 15.0
            elif landfill >= 2 * waste_target:
                landfill_score = 0.0
            else:
                landfill_score = 15.0 * (1 - ((landfill - waste_target) / waste_target))
            
            recycle_score = 15.0 * recycling_ratio
            waste_score = landfill_score + recycle_score

        total_score = round(emissions_score + energy_score + waste_score, 2)
        
        summary = await scoring_service.get_score_summary(self.db, str(company_id), str(start_date.year))
        summary.environmental_score = total_score
        await self.db.commit()

        return total_score
