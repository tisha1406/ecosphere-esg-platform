from datetime import date
from typing import Optional, Tuple, List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.governance import Policy, ComplianceAudit, BoardActivity, PolicyStatusEnum
from app.models.user import User

class GovernanceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Policy ---
    async def create_policy(self, obj_in: dict) -> Policy:
        obj = Policy(**obj_in)
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def get_policy(self, id: UUID) -> Optional[Policy]:
        result = await self.db.execute(
            select(Policy).where(Policy.id == id, Policy.is_active == True)
        )
        return result.scalars().first()

    async def get_policies(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None,
        status: Optional[PolicyStatusEnum] = None, category: Optional[str] = None
    ) -> Tuple[List[Policy], int]:
        query = select(Policy).where(Policy.is_active == True)
        if start_date:
            query = query.where(Policy.effective_date >= start_date)
        if end_date:
            query = query.where(Policy.effective_date <= end_date)
        if status:
            query = query.where(Policy.status == status)
        if category:
            query = query.where(Policy.category == category)
            
        total_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = total_result.scalar() or 0
        
        query = query.offset(skip).limit(limit).order_by(Policy.effective_date.desc())
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        return items, total

    async def update_policy(self, db_obj: Policy, obj_in: dict) -> Policy:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete_policy(self, db_obj: Policy) -> bool:
        db_obj.is_active = False
        await self.db.commit()
        return True

    # --- Compliance Audit ---
    async def create_compliance_audit(self, obj_in: dict) -> ComplianceAudit:
        obj = ComplianceAudit(**obj_in)
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def get_compliance_audit(self, id: UUID) -> Optional[ComplianceAudit]:
        result = await self.db.execute(
            select(ComplianceAudit).where(ComplianceAudit.id == id, ComplianceAudit.is_active == True)
        )
        return result.scalars().first()

    async def get_compliance_audits(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None,
        auditor_id: Optional[UUID] = None
    ) -> Tuple[List[ComplianceAudit], int]:
        query = select(ComplianceAudit).where(ComplianceAudit.is_active == True)
        if start_date:
            query = query.where(ComplianceAudit.audit_date >= start_date)
        if end_date:
            query = query.where(ComplianceAudit.audit_date <= end_date)
        if auditor_id:
            query = query.where(ComplianceAudit.auditor_id == auditor_id)
            
        total_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = total_result.scalar() or 0
        
        query = query.offset(skip).limit(limit).order_by(ComplianceAudit.audit_date.desc())
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        return items, total

    async def update_compliance_audit(self, db_obj: ComplianceAudit, obj_in: dict) -> ComplianceAudit:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete_compliance_audit(self, db_obj: ComplianceAudit) -> bool:
        db_obj.is_active = False
        await self.db.commit()
        return True

    # --- Board Activity ---
    async def create_board_activity(self, obj_in: dict, attendee_ids: List[UUID]) -> BoardActivity:
        obj = BoardActivity(**obj_in)
        if attendee_ids:
            result = await self.db.execute(select(User).where(User.id.in_(attendee_ids)))
            users = result.scalars().all()
            obj.attendees.extend(users)
            
        self.db.add(obj)
        await self.db.commit()
        await self.db.refresh(obj)
        return obj

    async def get_board_activity(self, id: UUID) -> Optional[BoardActivity]:
        result = await self.db.execute(
            select(BoardActivity)
            .options(selectinload(BoardActivity.attendees))
            .where(BoardActivity.id == id, BoardActivity.is_active == True)
        )
        return result.scalars().first()

    async def get_board_activities(
        self, skip: int = 0, limit: int = 10,
        start_date: Optional[date] = None, end_date: Optional[date] = None
    ) -> Tuple[List[BoardActivity], int]:
        query = select(BoardActivity).where(BoardActivity.is_active == True)
        if start_date:
            query = query.where(BoardActivity.meeting_date >= start_date)
        if end_date:
            query = query.where(BoardActivity.meeting_date <= end_date)
            
        total_result = await self.db.execute(select(func.count()).select_from(query.subquery()))
        total = total_result.scalar() or 0
        
        query = query.options(selectinload(BoardActivity.attendees)).offset(skip).limit(limit).order_by(BoardActivity.meeting_date.desc())
        result = await self.db.execute(query)
        items = list(result.scalars().all())
        return items, total

    async def update_board_activity(self, db_obj: BoardActivity, obj_in: dict, attendee_ids: Optional[List[UUID]] = None) -> BoardActivity:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
            
        if attendee_ids is not None:
            # Need to eagerly load attendees if not already loaded, but it should be loaded from get
            result = await self.db.execute(select(User).where(User.id.in_(attendee_ids)))
            users = result.scalars().all()
            db_obj.attendees = list(users)
            
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete_board_activity(self, db_obj: BoardActivity) -> bool:
        db_obj.is_active = False
        await self.db.commit()
        return True

    # --- Aggregations for Scoring ---
    async def get_policy_stats(self, start_date: date, end_date: date) -> Tuple[int, int]:
        """Returns (active_policies, total_policies)"""
        total_result = await self.db.execute(
            select(func.count())
            .select_from(Policy)
            .where(Policy.effective_date >= start_date, Policy.effective_date <= end_date, Policy.is_active == True)
        )
        total = total_result.scalar() or 0

        active_result = await self.db.execute(
            select(func.count())
            .select_from(Policy)
            .where(
                Policy.effective_date >= start_date, 
                Policy.effective_date <= end_date, 
                Policy.status == PolicyStatusEnum.active,
                Policy.is_active == True
            )
        )
        active = active_result.scalar() or 0
        
        return active, total

    async def get_average_audit_score(self, start_date: date, end_date: date) -> float:
        result = await self.db.execute(
            select(func.avg(ComplianceAudit.score))
            .where(ComplianceAudit.audit_date >= start_date, ComplianceAudit.audit_date <= end_date, ComplianceAudit.is_active == True)
        )
        avg_score = result.scalar()
        return float(avg_score) if avg_score is not None else 100.0

    async def get_board_activity_count(self, start_date: date, end_date: date) -> int:
        result = await self.db.execute(
            select(func.count())
            .select_from(BoardActivity)
            .where(BoardActivity.meeting_date >= start_date, BoardActivity.meeting_date <= end_date, BoardActivity.is_active == True)
        )
        return result.scalar() or 0
