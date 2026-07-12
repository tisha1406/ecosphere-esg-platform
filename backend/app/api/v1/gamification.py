import uuid
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import UserRole, User
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.gamification import (
    BadgeCreate, BadgeUpdate, BadgeRead,
    LeaderboardResponse, PointsHistoryResponse,
    AwardPointsRequest
)
from app.services.gamification_service import GamificationService

router = APIRouter(prefix="/api/v1/gamification", tags=["Gamification"])

write_roles = [UserRole.admin, UserRole.esg_manager]
read_roles = list(UserRole)

def get_service(db: AsyncSession = Depends(get_db)) -> GamificationService:
    return GamificationService(db)

# ──────────────────────────────────────────────────
# Badges
# ──────────────────────────────────────────────────
@router.post("/badges", response_model=ResponseEnvelope[BadgeRead])
async def create_badge(
    data: BadgeCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GamificationService = Depends(get_service),
):
    obj = await service.create_badge(data)
    return ResponseEnvelope(data=BadgeRead.model_validate(obj))

@router.get("/badges", response_model=ResponseEnvelope[PaginatedResponse[BadgeRead]])
async def list_badges(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_role(*read_roles)),
    service: GamificationService = Depends(get_service),
):
    skip = (page - 1) * page_size
    items, total = await service.get_badges(skip=skip, limit=page_size)
    return ResponseEnvelope(data=PaginatedResponse(
        items=[BadgeRead.model_validate(i) for i in items],
        total=total, page=page, page_size=page_size,
    ))

@router.patch("/badges/{id}", response_model=ResponseEnvelope[BadgeRead])
async def update_badge(
    id: UUID,
    data: BadgeUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GamificationService = Depends(get_service),
):
    obj = await service.update_badge(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")
    return ResponseEnvelope(data=BadgeRead.model_validate(obj))

@router.delete("/badges/{id}", response_model=ResponseEnvelope[dict])
async def delete_badge(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: GamificationService = Depends(get_service),
):
    success = await service.delete_badge(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge not found")
    return ResponseEnvelope(data={"deleted": True})

# ──────────────────────────────────────────────────
# Leaderboard & Points
# ──────────────────────────────────────────────────
@router.get("/leaderboard", response_model=ResponseEnvelope[LeaderboardResponse])
async def get_leaderboard(
    period: str = Query("all-time"),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_role(*read_roles)),
    service: GamificationService = Depends(get_service),
):
    result = await service.get_leaderboard(limit=limit, period=period)
    return ResponseEnvelope(data=result)

@router.get("/points/{user_id}", response_model=ResponseEnvelope[PointsHistoryResponse])
async def get_user_points(
    user_id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: GamificationService = Depends(get_service),
):
    result = await service.get_user_points_history(user_id)
    return ResponseEnvelope(data=result)

# Internal/Admin Endpoint for manual points adjustments
@router.post("/points/award", response_model=ResponseEnvelope[dict])
async def award_points(
    data: AwardPointsRequest,
    current_user: User = Depends(require_role(UserRole.admin)),
    service: GamificationService = Depends(get_service),
):
    await service.award_points(
        user_id=data.user_id,
        points=data.points,
        reason=data.reason,
        source_table="manual_adjustment",
        source_id=uuid.uuid4(),
    )
    return ResponseEnvelope(data={"awarded": True})
