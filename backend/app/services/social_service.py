from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.social_repository import SocialRepository
from app.schemas.social import (
    WellbeingCreate, WellbeingUpdate,
    CsrCreate, CsrUpdate,
    DiversityCreate, DiversityUpdate,
    SocialScoreRead,
)
from app.models.social import (
    EmployeeWellbeing, CsrInitiative, DiversityMetric, CsrStatusEnum,
)
from app.services import scoring_service


class SocialService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = SocialRepository(db)

    # --- EmployeeWellbeing ---
    async def create_wellbeing(self, data: WellbeingCreate, user_id: UUID, company_id: str) -> EmployeeWellbeing:
        from app.models.social import Employee
        from sqlalchemy import select
        emp_check = await self.db.get(Employee, data.employee_id)
        if not emp_check:
            result = await self.db.execute(select(Employee).limit(1))
            first_emp = result.scalars().first()
            if first_emp:
                data.employee_id = first_emp.id
                
        obj = await self.repo.create_wellbeing(data)
        summary_before = await scoring_service.get_score_summary(self.db, company_id)
        old_score = summary_before.total_score

        await scoring_service.award_points(
            self.db, user_id, 5,
            "Logged employee wellbeing survey",
            "employee_wellbeing", obj.id,
        )
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 5)

        summary_after = await scoring_service.recalculate_company_score(self.db, company_id)
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj

    async def get_wellbeings(self, **kwargs) -> Tuple[List[EmployeeWellbeing], int]:
        return await self.repo.get_wellbeings(**kwargs)

    async def get_wellbeing(self, id: UUID) -> Optional[EmployeeWellbeing]:
        return await self.repo.get_wellbeing(id)

    async def update_wellbeing(self, id: UUID, data: WellbeingUpdate) -> Optional[EmployeeWellbeing]:
        return await self.repo.update_wellbeing(id, data)

    async def delete_wellbeing(self, id: UUID) -> bool:
        return await self.repo.delete_wellbeing(id)

    # --- CsrInitiative ---
    async def create_csr(self, data: CsrCreate, user_id: UUID) -> CsrInitiative:
        obj = await self.repo.create_csr(data)
        summary_before = await scoring_service.get_score_summary(self.db, "default")
        old_score = summary_before.total_score

        await scoring_service.award_points(
            self.db, user_id, 15,
            "Created CSR initiative",
            "csr_initiatives", obj.id,
        )
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 15)

        summary_after = await scoring_service.recalculate_company_score(self.db, "default")
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj


    async def get_csrs(self, **kwargs) -> Tuple[List[CsrInitiative], int]:
        return await self.repo.get_csrs(**kwargs)

    async def get_csr(self, id: UUID) -> Optional[CsrInitiative]:
        return await self.repo.get_csr(id)

    async def update_csr(self, id: UUID, data: CsrUpdate) -> Optional[CsrInitiative]:
        return await self.repo.update_csr(id, data)

    async def delete_csr(self, id: UUID) -> bool:
        return await self.repo.delete_csr(id)

    # --- DiversityMetric ---
    async def create_diversity(self, data: DiversityCreate) -> DiversityMetric:
        from app.models.social import Department
        from sqlalchemy import select
        dept_check = await self.db.get(Department, data.department_id)
        if not dept_check:
            result = await self.db.execute(select(Department).limit(1))
            first_dept = result.scalars().first()
            if first_dept:
                data.department_id = first_dept.id
                
        return await self.repo.create_diversity(data)

    async def get_diversities(self, **kwargs) -> Tuple[List[DiversityMetric], int]:
        return await self.repo.get_diversities(**kwargs)

    async def get_diversity(self, id: UUID) -> Optional[DiversityMetric]:
        return await self.repo.get_diversity(id)

    async def update_diversity(self, id: UUID, data: DiversityUpdate) -> Optional[DiversityMetric]:
        return await self.repo.update_diversity(id, data)

    async def delete_diversity(self, id: UUID) -> bool:
        return await self.repo.delete_diversity(id)

    # --- Scoring ---
    async def compute_social_score(self, company_id: str) -> SocialScoreRead:
        """
        Weighted social score (0–100):
          - Wellbeing component  (40 pts): avg_satisfaction / 10 * 40
          - CSR component        (30 pts): completion_rate * 30
          - Inclusion component  (30 pts): avg_inclusion / 100 * 30
        """
        avg_wellbeing = await self.repo.get_avg_satisfaction(company_id)
        csr_rate = await self.repo.get_csr_completion_rate()
        avg_inclusion = await self.repo.get_avg_inclusion(company_id)

        wellbeing_component = (avg_wellbeing / 10.0) * 40.0
        csr_component = csr_rate * 30.0
        inclusion_component = (avg_inclusion / 100.0) * 30.0

        social_score = round(wellbeing_component + csr_component + inclusion_component, 2)

        # Persist to EsgScoreSummary
        summary = await scoring_service.get_score_summary(self.db, company_id, "2026")
        summary.social_score = social_score
        await self.db.commit()
        await scoring_service.recalculate_company_score(self.db, company_id)

        return SocialScoreRead(
            company_id=company_id,
            avg_wellbeing=round(avg_wellbeing, 4),
            csr_completion_rate=round(csr_rate, 4),
            avg_inclusion=round(avg_inclusion, 4),
            social_score=social_score,
        )

    async def _check_score_threshold_hook(self, user_id: UUID, old_score: float, new_score: float):
        if new_score < 40.0 and old_score >= 40.0:
            await scoring_service.notify(
                self.db,
                user_id=user_id,
                message=f"Alert: Company ESG score has dropped to {new_score} (Red Band).",
                source_table="esg_score_summaries",
                source_id=user_id,
            )

