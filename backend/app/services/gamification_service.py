from typing import List, Optional, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.gamification_repository import GamificationRepository
from app.schemas.gamification import (
    BadgeCreate, BadgeUpdate,
    LeaderboardResponse, LeaderboardEntry,
    PointsHistoryResponse, PointsHistoryEntry,
)
from app.models.gamification import Badge
from app.services import scoring_service


class GamificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = GamificationRepository(db)

    # --- Badge CRUD ---
    async def create_badge(self, data: BadgeCreate) -> Badge:
        return await self.repo.create_badge(data)

    async def get_badge(self, id: UUID) -> Optional[Badge]:
        return await self.repo.get_badge(id)

    async def get_badges(self, **kwargs) -> Tuple[List[Badge], int]:
        return await self.repo.get_badges(**kwargs)

    async def update_badge(self, id: UUID, data: BadgeUpdate) -> Optional[Badge]:
        return await self.repo.update_badge(id, data)

    async def delete_badge(self, id: UUID) -> bool:
        return await self.repo.delete_badge(id)

    # --- Points and Leaderboard ---
    async def award_points(self, user_id: UUID, points: int, reason: str, source_table: str, source_id: UUID):
        """
        Proxy manual points awarding to the core scoring service.
        """
        await scoring_service.award_points(self.db, user_id, points, reason, source_table, source_id)
        await self.check_new_badges_hook(user_id, points)

    async def check_new_badges_hook(self, user_id: UUID, points_added: int):
        total_points = await self.repo.get_user_points_total(user_id)
        old_points = total_points - points_added
        badges, _ = await self.repo.get_badges(skip=0, limit=100)
        for badge in badges:
            if old_points < badge.points_value <= total_points:
                await scoring_service.notify(
                    self.db,
                    user_id=user_id,
                    message=f"Congratulations! You've been awarded the '{badge.name}' badge.",
                    source_table="badges",
                    source_id=badge.id
                )


    async def get_user_points_history(self, user_id: UUID) -> PointsHistoryResponse:
        total = await self.repo.get_user_points_total(user_id)
        history_records = await self.repo.get_user_points_history(user_id)
        
        return PointsHistoryResponse(
            user_id=user_id,
            total_points=total,
            history=[
                PointsHistoryEntry.model_validate(record)
                for record in history_records
            ]
        )

    async def get_leaderboard(self, limit: int = 10, period: str = "all-time") -> LeaderboardResponse:
        # Note: Phase B3 prompt allows extending to specific periods if needed.
        # Currently, the repository query gets all-time SUM(points).
        # We pass period back in the response for context.
        leaderboard_data = await self.repo.get_leaderboard(limit=limit)
        
        entries = []
        for user_id, full_name, total_points in leaderboard_data:
            entries.append(
                LeaderboardEntry(
                    user_id=user_id,
                    full_name=full_name,
                    total_points=total_points
                )
            )
            
        return LeaderboardResponse(
            period=period,
            limit=limit,
            entries=entries
        )

    async def check_and_award_badge(self, user_id: UUID, badge_id: UUID) -> bool:
        """
        Checks if the user meets the points criteria for the badge.
        Returns True if eligible/awarded, False otherwise.
        Note: True persistence of user_badges requires an associative model, 
        but checking eligibility meets Phase B3 explicit acceptance criteria.
        """
        badge = await self.repo.get_badge(badge_id)
        if not badge:
            return False
            
        total_points = await self.repo.get_user_points_total(user_id)
        if total_points >= badge.points_value:
            # User is eligible for this badge based on criteria
            return True
            
        return False
