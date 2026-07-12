from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.scoring import PointsLedger, EsgScoreSummary
from app.models.user import User
from app.models.notification import Notification

async def notify(
    db: AsyncSession,
    user_id: UUID,
    message: str,
    source_table: str,
    source_id: UUID
) -> Notification:
    notification = Notification(
        user_id=user_id,
        message=message,
        source_table=source_table,
        is_read=False
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def award_points(
    db: AsyncSession,
    user_id: UUID,
    points: int,
    reason: str,
    source_table: str,
    source_id: UUID
) -> PointsLedger:
    ledger_entry = PointsLedger(
        user_id=user_id,
        points=points,
        reason=reason,
        source_table=source_table,
        source_id=source_id
    )
    db.add(ledger_entry)
    await db.commit()
    await db.refresh(ledger_entry)
    return ledger_entry

async def get_score_summary(
    db: AsyncSession,
    company_id: str = "default",
    period: str = "2026"
) -> EsgScoreSummary:
    result = await db.execute(
        select(EsgScoreSummary).where(
            EsgScoreSummary.company_id == company_id,
            EsgScoreSummary.period == period
        )
    )
    summary = result.scalars().first()
    if not summary:
        summary = EsgScoreSummary(
            company_id=company_id,
            period=period,
            environmental_score=75.0,
            social_score=70.0,
            governance_score=80.0,
            total_score=75.0
        )
        db.add(summary)
        await db.commit()
        await db.refresh(summary)
    return summary

async def recalculate_company_score(
    db: AsyncSession,
    company_id: str = "default"
) -> EsgScoreSummary:
    period = "2026"  # Baseline default period for aggregate scoring
    summary = await get_score_summary(db, company_id, period)
    
    # Simple algorithm: average of components
    summary.total_score = round(
        (summary.environmental_score + summary.social_score + summary.governance_score) / 3,
        2
    )
    await db.commit()
    await db.refresh(summary)
    return summary
