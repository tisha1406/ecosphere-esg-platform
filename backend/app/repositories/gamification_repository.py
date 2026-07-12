from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gamification import Badge
from app.models.scoring import PointsLedger
from app.models.user import User
from app.schemas.gamification import BadgeCreate, BadgeUpdate


class GamificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Badge CRUD ---
    async def create_badge(self, data: BadgeCreate) -> Badge:
        obj = Badge(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_badge(self, id: UUID) -> Optional[Badge]:
        result = await self.session.execute(
            select(Badge).where(Badge.id == id)
        )
        return result.scalars().first()

    async def get_badges(self, skip: int = 0, limit: int = 10) -> Tuple[List[Badge], int]:
        count_q = select(func.count()).select_from(Badge)
        total = (await self.session.execute(count_q)).scalar_one()
        query = select(Badge).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all()), total

    async def update_badge(self, id: UUID, data: BadgeUpdate) -> Optional[Badge]:
        obj = await self.get_badge(id)
        if obj:
            for k, v in data.model_dump(exclude_unset=True).items():
                setattr(obj, k, v)
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def delete_badge(self, id: UUID) -> bool:
        obj = await self.get_badge(id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False

    # --- Points and Leaderboard ---
    async def get_user_points_total(self, user_id: UUID) -> int:
        result = await self.session.execute(
            select(func.sum(PointsLedger.points)).where(PointsLedger.user_id == user_id)
        )
        return result.scalar_one_or_none() or 0

    async def get_user_points_history(self, user_id: UUID) -> List[PointsLedger]:
        result = await self.session.execute(
            select(PointsLedger)
            .where(PointsLedger.user_id == user_id)
            .order_by(desc(PointsLedger.created_at))
        )
        return list(result.scalars().all())

    async def get_leaderboard(self, limit: int = 10) -> List[Tuple[UUID, str, int]]:
        """
        Returns a list of tuples: (user_id, full_name, total_points)
        ordered by total_points DESC.
        """
        query = (
            select(
                PointsLedger.user_id,
                User.full_name,
                func.sum(PointsLedger.points).label("total_points")
            )
            .join(User, PointsLedger.user_id == User.id)
            .group_by(PointsLedger.user_id, User.full_name)
            .order_by(desc("total_points"))
            .limit(limit)
        )
        result = await self.session.execute(query)
        return [(row.user_id, row.full_name, row.total_points) for row in result.all()]
