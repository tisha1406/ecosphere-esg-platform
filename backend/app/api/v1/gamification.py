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

from app.models.gamification import Challenge, ChallengeParticipation, Reward
from app.schemas.gamification import (
    ChallengeCreate, ChallengeUpdate, ChallengeRead,
    ChallengeParticipationCreate, ChallengeParticipationUpdate, ChallengeParticipationRead,
    RewardCreate, RewardUpdate, RewardRead
)
from sqlalchemy import select
from typing import List

# --- Challenges ---
@router.post("/challenges", response_model=ResponseEnvelope[ChallengeRead], status_code=status.HTTP_201_CREATED)
async def create_challenge(data: ChallengeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = Challenge(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=ChallengeRead.model_validate(db_obj))

@router.get("/challenges", response_model=ResponseEnvelope[List[ChallengeRead]])
async def list_challenges(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(Challenge))
    items = result.scalars().all()
    return ResponseEnvelope(data=[ChallengeRead.model_validate(i) for i in items])

@router.get("/challenges/{id}", response_model=ResponseEnvelope[ChallengeRead])
async def get_challenge(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(Challenge, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return ResponseEnvelope(data=ChallengeRead.model_validate(db_obj))

@router.patch("/challenges/{id}", response_model=ResponseEnvelope[ChallengeRead])
async def update_challenge(id: UUID, data: ChallengeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(Challenge, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Challenge not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=ChallengeRead.model_validate(db_obj))

@router.delete("/challenges/{id}", response_model=ResponseEnvelope[dict])
async def delete_challenge(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(Challenge, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Challenge not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

# --- Challenge Participations ---
@router.post("/challenge-participations", response_model=ResponseEnvelope[ChallengeParticipationRead], status_code=status.HTTP_201_CREATED)
async def create_challenge_participation(data: ChallengeParticipationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = ChallengeParticipation(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=ChallengeParticipationRead.model_validate(db_obj))

@router.get("/challenge-participations", response_model=ResponseEnvelope[List[ChallengeParticipationRead]])
async def list_challenge_participations(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(ChallengeParticipation))
    items = result.scalars().all()
    return ResponseEnvelope(data=[ChallengeParticipationRead.model_validate(i) for i in items])

@router.get("/challenge-participations/{id}", response_model=ResponseEnvelope[ChallengeParticipationRead])
async def get_challenge_participation(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(ChallengeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
    return ResponseEnvelope(data=ChallengeParticipationRead.model_validate(db_obj))

@router.patch("/challenge-participations/{id}", response_model=ResponseEnvelope[ChallengeParticipationRead])
async def update_challenge_participation(id: UUID, data: ChallengeParticipationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(ChallengeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=ChallengeParticipationRead.model_validate(db_obj))

@router.delete("/challenge-participations/{id}", response_model=ResponseEnvelope[dict])
async def delete_challenge_participation(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(ChallengeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

# --- Rewards ---
@router.post("/rewards", response_model=ResponseEnvelope[RewardRead], status_code=status.HTTP_201_CREATED)
async def create_reward(data: RewardCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = Reward(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=RewardRead.model_validate(db_obj))

@router.get("/rewards", response_model=ResponseEnvelope[List[RewardRead]])
async def list_rewards(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(Reward))
    items = result.scalars().all()
    return ResponseEnvelope(data=[RewardRead.model_validate(i) for i in items])

@router.get("/rewards/{id}", response_model=ResponseEnvelope[RewardRead])
async def get_reward(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(Reward, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Reward not found")
    return ResponseEnvelope(data=RewardRead.model_validate(db_obj))

@router.patch("/rewards/{id}", response_model=ResponseEnvelope[RewardRead])
async def update_reward(id: UUID, data: RewardUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(Reward, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Reward not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=RewardRead.model_validate(db_obj))

@router.delete("/rewards/{id}", response_model=ResponseEnvelope[dict])
async def delete_reward(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(Reward, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Reward not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

from app.schemas.gamification import RedeemRewardRequest

@router.post("/rewards/redeem", response_model=ResponseEnvelope[dict])
async def redeem_reward(
    data: RedeemRewardRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(require_role(*read_roles)),
    service: GamificationService = Depends(get_service)
):
    reward = await db.get(Reward, data.reward_id)
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    
    if reward.stock <= 0:
        raise HTTPException(status_code=400, detail="Reward is out of stock")
        
    # Check user points
    user_points = await service.repo.get_user_points_total(current_user.id)
    if user_points < reward.points_required:
        raise HTTPException(status_code=400, detail="Insufficient points to redeem this reward")
        
    # Deduct points and decrease stock atomically
    reward.stock -= 1
    
    # Actually award negative points
    from app.models.scoring import PointsLedger
    import uuid
    db_obj = PointsLedger(
        user_id=current_user.id,
        points=-reward.points_required,
        reason=f"Redeemed reward: {reward.name}",
        source_table="rewards",
        source_id=reward.id
    )
    db.add(db_obj)
    await db.commit()
    
    return ResponseEnvelope(data={"redeemed": True, "reward": reward.name, "points_deducted": reward.points_required})
