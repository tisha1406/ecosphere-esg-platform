"""
Dashboard Service — read-only cross-module aggregation.

Follows the same cross-module read allowance used by the Reports service:
queries are SELECT-only against any module's tables via the shared AsyncSession.
No writes to any module's table are performed here.
"""
import asyncio
from datetime import date, datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

# Cross-module model imports (read-only, following reports_service pattern)
from app.models.scoring import EsgScoreSummary, PointsLedger
from app.models.user import User
from app.models.governance import Policy, ComplianceAudit, PolicyStatusEnum
from app.models.social import CsrInitiative, CsrStatusEnum
from app.models.environmental import CarbonEmission
from app.models.notification import Notification

from app.repositories.notification_repository import NotificationRepository
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    EsgScoreBlock,
    EsgScoreTrend,
    ActivityCounts,
    LeaderboardEntryCompact,
    NotificationRead,
)


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.notif_repo = NotificationRepository(db)

    # ── Public API ─────────────────────────────────────────────────────────────

    async def get_summary(
        self, current_user_id: UUID, company_id: str = "default"
    ) -> DashboardSummaryResponse:
        """
        Aggregate all dashboard data using parallel asyncio.gather to avoid
        sequential (waterfall) query execution.
        """
        (
            current_summary,
            previous_summary,
            open_policies,
            pending_audits,
            active_csr,
            emissions_month,
            leaderboard,
            recent_notifs,
        ) = await asyncio.gather(
            self._get_latest_score(company_id, offset_periods=0),
            self._get_latest_score(company_id, offset_periods=1),
            self._count_open_policies(),
            self._count_pending_audits(),
            self._count_active_csr(),
            self._emissions_this_month(),
            self._get_top_leaderboard(limit=5),
            self.notif_repo.get_recent_for_user(current_user_id, limit=5),
        )

        def _trend(curr: Optional[float], prev: Optional[float]) -> EsgScoreTrend:
            delta = round(curr - prev, 2) if (curr is not None and prev is not None) else None
            return EsgScoreTrend(
                current=round(curr or 0.0, 2),
                previous=round(prev, 2) if prev is not None else None,
                delta=delta,
            )

        c = current_summary
        p = previous_summary
        current_period = c.period if c else self._current_period()

        scores = EsgScoreBlock(
            environmental=_trend(
                c.environmental_score if c else 0.0,
                p.environmental_score if p else None,
            ),
            social=_trend(
                c.social_score if c else 0.0,
                p.social_score if p else None,
            ),
            governance=_trend(
                c.governance_score if c else 0.0,
                p.governance_score if p else None,
            ),
            overall=_trend(
                c.total_score if c else 0.0,
                p.total_score if p else None,
            ),
            period=current_period,
        )

        activity = ActivityCounts(
            open_policies=open_policies,
            pending_audits=pending_audits,
            active_csr_initiatives=active_csr,
            emissions_this_month_tco2e=round(emissions_month or 0.0, 2),
        )

        contributors = [
            LeaderboardEntryCompact(
                user_id=user_id,
                full_name=full_name,
                total_points=total_pts,
            )
            for user_id, full_name, total_pts in leaderboard
        ]

        return DashboardSummaryResponse(
            scores=scores,
            activity=activity,
            top_contributors=contributors,
            recent_notifications=[
                NotificationRead.model_validate(n) for n in recent_notifs
            ],
        )

    # ── Private Helpers ────────────────────────────────────────────────────────

    @staticmethod
    def _current_period() -> str:
        return str(datetime.utcnow().year)

    async def _get_latest_score(
        self, company_id: str, offset_periods: int = 0
    ) -> Optional[EsgScoreSummary]:
        """
        Returns the most recent EsgScoreSummary for the company,
        offset by `offset_periods` rows (0 = latest, 1 = previous).
        """
        result = await self.db.execute(
            select(EsgScoreSummary)
            .where(EsgScoreSummary.company_id == company_id)
            .order_by(desc(EsgScoreSummary.period))
            .offset(offset_periods)
            .limit(1)
        )
        return result.scalars().first()

    async def _count_open_policies(self) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(
                select(Policy)
                .where(Policy.status == PolicyStatusEnum.active, Policy.is_active == True)
                .subquery()
            )
        )
        return result.scalar_one() or 0

    async def _count_pending_audits(self) -> int:
        """
        Pending audits = audits scheduled for today or in the future.
        """
        today = date.today()
        result = await self.db.execute(
            select(func.count()).select_from(
                select(ComplianceAudit)
                .where(ComplianceAudit.audit_date >= today, ComplianceAudit.is_active == True)
                .subquery()
            )
        )
        return result.scalar_one() or 0

    async def _count_active_csr(self) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(
                select(CsrInitiative)
                .where(CsrInitiative.status == CsrStatusEnum.active, CsrInitiative.is_active == True)
                .subquery()
            )
        )
        return result.scalar_one() or 0

    async def _emissions_this_month(self) -> float:
        today = date.today()
        month_start = today.replace(day=1)
        result = await self.db.execute(
            select(func.sum(CarbonEmission.value_tco2e)).where(
                CarbonEmission.date >= month_start,
                CarbonEmission.is_active == True,
            )
        )
        return result.scalar_one_or_none() or 0.0

    async def _get_top_leaderboard(self, limit: int = 5):
        """Returns list of (user_id, full_name, total_points)."""
        result = await self.db.execute(
            select(
                PointsLedger.user_id,
                User.full_name,
                func.sum(PointsLedger.points).label("total_points"),
            )
            .join(User, PointsLedger.user_id == User.id)
            .group_by(PointsLedger.user_id, User.full_name)
            .order_by(desc("total_points"))
            .limit(limit)
        )
        return [(row.user_id, row.full_name, row.total_points) for row in result.all()]
