from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import UserRole, User
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.dashboard import (
    DashboardSummaryResponse,
    NotificationRead,
    NotificationCreate,
)
from app.services.dashboard_service import DashboardService
from app.repositories.notification_repository import NotificationRepository

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

all_roles = list(UserRole)


def get_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    return DashboardService(db)


def get_notif_repo(db: AsyncSession = Depends(get_db)) -> NotificationRepository:
    return NotificationRepository(db)


# ── Summary ────────────────────────────────────────────────────────────────────

@router.get(
    "/summary",
    response_model=ResponseEnvelope[DashboardSummaryResponse],
    summary="Get full dashboard summary (parallel aggregation)",
)
async def get_dashboard_summary(
    company_id: str = Query("default"),
    current_user: User = Depends(require_role(*all_roles)),
    service: DashboardService = Depends(get_service),
):
    summary = await service.get_summary(
        current_user_id=current_user.id,
        company_id=company_id,
    )
    return ResponseEnvelope(data=summary)


# ── Notifications ──────────────────────────────────────────────────────────────

@router.get(
    "/notifications",
    response_model=ResponseEnvelope[PaginatedResponse[NotificationRead]],
    summary="List notifications for the current user (paginated)",
)
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = Query(None, description="Filter by read status"),
    current_user: User = Depends(require_role(*all_roles)),
    repo: NotificationRepository = Depends(get_notif_repo),
):
    skip = (page - 1) * page_size
    items, total = await repo.list_for_user(
        user_id=current_user.id,
        is_read=is_read,
        skip=skip,
        limit=page_size,
    )
    return ResponseEnvelope(
        data=PaginatedResponse(
            items=[NotificationRead.model_validate(n) for n in items],
            total=total,
            page=page,
            page_size=page_size,
        )
    )


@router.patch(
    "/notifications/{id}/read",
    response_model=ResponseEnvelope[NotificationRead],
    summary="Mark a notification as read",
)
async def mark_notification_read(
    id: UUID,
    current_user: User = Depends(require_role(*all_roles)),
    repo: NotificationRepository = Depends(get_notif_repo),
):
    notif = await repo.get_by_id(id)
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    if notif.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your notification")
    updated = await repo.mark_as_read(id)
    return ResponseEnvelope(data=NotificationRead.model_validate(updated))
