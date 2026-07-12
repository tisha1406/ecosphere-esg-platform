from datetime import date
from typing import Optional, Tuple, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.governance import (
    PolicyCreate, PolicyUpdate,
    ComplianceAuditCreate, ComplianceAuditUpdate,
    BoardActivityCreate, BoardActivityUpdate
)
from app.models.governance import Policy, ComplianceAudit, BoardActivity, PolicyStatusEnum
from app.repositories.governance_repository import GovernanceRepository
from app.services import scoring_service

class GovernanceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = GovernanceRepository(db)

    # --- Policy ---
    async def create_policy(self, obj_in: PolicyCreate, user_id: UUID) -> Policy:
        obj = await self.repo.create_policy(obj_in.model_dump())
        summary_before = await scoring_service.get_score_summary(self.db, "default")
        old_score = summary_before.total_score

        await scoring_service.award_points(self.db, user_id, 10, "Created new governance policy", "policies", obj.id)
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 10)

        summary_after = await scoring_service.recalculate_company_score(self.db)
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj

    async def get_policy(self, id: UUID) -> Optional[Policy]:
        return await self.repo.get_policy(id)

    async def get_policies(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None,
        status: Optional[PolicyStatusEnum] = None, category: Optional[str] = None
    ) -> Tuple[List[Policy], int]:
        return await self.repo.get_policies(skip, limit, start_date, end_date, status, category)

    async def update_policy(self, id: UUID, obj_in: PolicyUpdate) -> Optional[Policy]:
        db_obj = await self.repo.get_policy(id)
        if not db_obj:
            return None
        return await self.repo.update_policy(db_obj, obj_in.model_dump(exclude_unset=True))

    async def delete_policy(self, id: UUID) -> bool:
        db_obj = await self.repo.get_policy(id)
        if not db_obj:
            return False
        return await self.repo.delete_policy(db_obj)

    # --- Compliance Audit ---
    async def create_compliance_audit(self, obj_in: ComplianceAuditCreate, user_id: UUID) -> ComplianceAudit:
        obj = await self.repo.create_compliance_audit(obj_in.model_dump())
        summary_before = await scoring_service.get_score_summary(self.db, "default")
        old_score = summary_before.total_score

        await scoring_service.award_points(self.db, user_id, 20, "Submitted compliance audit", "compliance_audits", obj.id)
        from app.services.gamification_service import GamificationService
        await GamificationService(self.db).check_new_badges_hook(user_id, 20)

        summary_after = await scoring_service.recalculate_company_score(self.db)
        await self._check_score_threshold_hook(user_id, old_score, summary_after.total_score)
        return obj


    async def get_compliance_audit(self, id: UUID) -> Optional[ComplianceAudit]:
        return await self.repo.get_compliance_audit(id)

    async def get_compliance_audits(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None,
        auditor_id: Optional[UUID] = None
    ) -> Tuple[List[ComplianceAudit], int]:
        return await self.repo.get_compliance_audits(skip, limit, start_date, end_date, auditor_id)

    async def update_compliance_audit(self, id: UUID, obj_in: ComplianceAuditUpdate) -> Optional[ComplianceAudit]:
        db_obj = await self.repo.get_compliance_audit(id)
        if not db_obj:
            return None
        return await self.repo.update_compliance_audit(db_obj, obj_in.model_dump(exclude_unset=True))

    async def delete_compliance_audit(self, id: UUID) -> bool:
        db_obj = await self.repo.get_compliance_audit(id)
        if not db_obj:
            return False
        return await self.repo.delete_compliance_audit(db_obj)

    # --- Board Activity ---
    async def create_board_activity(self, obj_in: BoardActivityCreate, user_id: UUID) -> BoardActivity:
        data = obj_in.model_dump(exclude={"attendee_ids"})
        obj = await self.repo.create_board_activity(data, obj_in.attendee_ids)
        return obj

    async def get_board_activity(self, id: UUID) -> Optional[BoardActivity]:
        return await self.repo.get_board_activity(id)

    async def get_board_activities(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> Tuple[List[BoardActivity], int]:
        return await self.repo.get_board_activities(skip, limit, start_date, end_date)

    async def update_board_activity(self, id: UUID, obj_in: BoardActivityUpdate) -> Optional[BoardActivity]:
        db_obj = await self.repo.get_board_activity(id)
        if not db_obj:
            return None
        data = obj_in.model_dump(exclude_unset=True, exclude={"attendee_ids"})
        attendee_ids = obj_in.attendee_ids
        return await self.repo.update_board_activity(db_obj, data, attendee_ids)

    async def delete_board_activity(self, id: UUID) -> bool:
        db_obj = await self.repo.get_board_activity(id)
        if not db_obj:
            return False
        return await self.repo.delete_board_activity(db_obj)

    # --- Score ---
    async def compute_governance_score(self, start_date: date, end_date: date) -> float:
        active_p, total_p = await self.repo.get_policy_stats(start_date, end_date)
        avg_audit = await self.repo.get_average_audit_score(start_date, end_date)
        board_count = await self.repo.get_board_activity_count(start_date, end_date)

        policy_score = (active_p / total_p * 100.0) if total_p > 0 else 100.0
        policy_component = policy_score * 0.40

        audit_component = avg_audit * 0.40

        board_percent = min(board_count / 4.0 * 100.0, 100.0)
        board_component = board_percent * 0.20

        total_score = round(policy_component + audit_component + board_component, 2)
        return total_score

    async def _check_score_threshold_hook(self, user_id: UUID, old_score: float, new_score: float):
        if new_score < 40.0 and old_score >= 40.0:
            await scoring_service.notify(
                self.db,
                user_id=user_id,
                message=f"Alert: Company ESG score has dropped to {new_score} (Red Band).",
                source_table="esg_score_summaries",
                source_id=user_id,
            )

