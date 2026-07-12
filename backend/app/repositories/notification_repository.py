from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification
from app.schemas.dashboard import NotificationCreate


class NotificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: NotificationCreate) -> Notification:
        obj = Notification(**data.model_dump())
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_by_id(self, id: UUID) -> Optional[Notification]:
        result = await self.session.execute(
            select(Notification).where(Notification.id == id)
        )
        return result.scalars().first()

    async def list_for_user(
        self,
        user_id: UUID,
        is_read: Optional[bool] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Notification], int]:
        base = select(Notification).where(Notification.user_id == user_id)
        if is_read is not None:
            base = base.where(Notification.is_read == is_read)

        count_q = select(func.count()).select_from(base.subquery())
        total = (await self.session.execute(count_q)).scalar_one()

        query = base.order_by(desc(Notification.created_at)).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all()), total

    async def get_recent_for_user(
        self, user_id: UUID, limit: int = 5
    ) -> List[Notification]:
        result = await self.session.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(desc(Notification.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def count_unread(self, user_id: UUID) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(
                select(Notification)
                .where(Notification.user_id == user_id, Notification.is_read == False)
                .subquery()
            )
        )
        return result.scalar_one()

    async def mark_as_read(self, id: UUID) -> Optional[Notification]:
        obj = await self.get_by_id(id)
        if obj:
            obj.is_read = True
            await self.session.commit()
            await self.session.refresh(obj)
        return obj

    async def mark_all_read(self, user_id: UUID) -> int:
        from sqlalchemy import update
        stmt = (
            update(Notification)
            .where(Notification.user_id == user_id)
            .where(Notification.is_read == False)
            .values(is_read=True)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount

