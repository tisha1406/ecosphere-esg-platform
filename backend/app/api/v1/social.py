from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import UserRole, User
from app.models.social import CsrStatusEnum
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.social import (
    WellbeingCreate, WellbeingUpdate, WellbeingRead,
    CsrCreate, CsrUpdate, CsrRead,
    DiversityCreate, DiversityUpdate, DiversityRead,
    SocialScoreRead,
)
from app.services.social_service import SocialService

router = APIRouter(prefix="/api/v1/social", tags=["Social"])

# RBAC role sets
write_roles = [UserRole.admin, UserRole.esg_manager, UserRole.social_officer]
read_roles = list(UserRole)


def get_service(db: AsyncSession = Depends(get_db)) -> SocialService:
    return SocialService(db)


# ──────────────────────────────────────────────────
# Wellbeing  /api/v1/social/wellbeing
# ──────────────────────────────────────────────────
@router.post("/wellbeing", response_model=ResponseEnvelope[WellbeingRead])
async def create_wellbeing(
    data: WellbeingCreate,
    company_id: str = Query(..., description="Company ID for scoring context"),
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.create_wellbeing(data, current_user.id, company_id)
    return ResponseEnvelope(data=WellbeingRead.model_validate(obj))


@router.get("/wellbeing", response_model=ResponseEnvelope[PaginatedResponse[WellbeingRead]])
async def list_wellbeings(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    employee_id: Optional[UUID] = None,
    company_id: Optional[str] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    skip = (page - 1) * page_size
    items, total = await service.get_wellbeings(
        skip=skip, limit=page_size,
        employee_id=employee_id, company_id=company_id,
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[WellbeingRead.model_validate(i) for i in items],
        total=total, page=page, page_size=page_size,
    ))


@router.get("/wellbeing/{id}", response_model=ResponseEnvelope[WellbeingRead])
async def get_wellbeing(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.get_wellbeing(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellbeing record not found")
    return ResponseEnvelope(data=WellbeingRead.model_validate(obj))


@router.patch("/wellbeing/{id}", response_model=ResponseEnvelope[WellbeingRead])
async def update_wellbeing(
    id: UUID,
    data: WellbeingUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.update_wellbeing(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellbeing record not found")
    return ResponseEnvelope(data=WellbeingRead.model_validate(obj))


@router.delete("/wellbeing/{id}", response_model=ResponseEnvelope[dict])
async def delete_wellbeing(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    success = await service.delete_wellbeing(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wellbeing record not found")
    return ResponseEnvelope(data={"deleted": True})


# ──────────────────────────────────────────────────
# CSR Initiatives  /api/v1/social/csr
# ──────────────────────────────────────────────────
@router.post("/csr", response_model=ResponseEnvelope[CsrRead])
async def create_csr(
    data: CsrCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.create_csr(data, current_user.id)
    return ResponseEnvelope(data=CsrRead.model_validate(obj))


@router.get("/csr", response_model=ResponseEnvelope[PaginatedResponse[CsrRead]])
async def list_csrs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status_filter: Optional[CsrStatusEnum] = Query(None, alias="status"),
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    skip = (page - 1) * page_size
    items, total = await service.get_csrs(skip=skip, limit=page_size, status=status_filter)
    return ResponseEnvelope(data=PaginatedResponse(
        items=[CsrRead.model_validate(i) for i in items],
        total=total, page=page, page_size=page_size,
    ))


@router.get("/csr/{id}", response_model=ResponseEnvelope[CsrRead])
async def get_csr(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.get_csr(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR initiative not found")
    return ResponseEnvelope(data=CsrRead.model_validate(obj))


@router.patch("/csr/{id}", response_model=ResponseEnvelope[CsrRead])
async def update_csr(
    id: UUID,
    data: CsrUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.update_csr(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR initiative not found")
    return ResponseEnvelope(data=CsrRead.model_validate(obj))


@router.delete("/csr/{id}", response_model=ResponseEnvelope[dict])
async def delete_csr(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    success = await service.delete_csr(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CSR initiative not found")
    return ResponseEnvelope(data={"deleted": True})


# ──────────────────────────────────────────────────
# Diversity Metrics  /api/v1/social/diversity
# ──────────────────────────────────────────────────
@router.post("/diversity", response_model=ResponseEnvelope[DiversityRead])
async def create_diversity(
    data: DiversityCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.create_diversity(data)
    return ResponseEnvelope(data=DiversityRead.model_validate(obj))


@router.get("/diversity", response_model=ResponseEnvelope[PaginatedResponse[DiversityRead]])
async def list_diversities(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    department_id: Optional[UUID] = None,
    period: Optional[str] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    skip = (page - 1) * page_size
    items, total = await service.get_diversities(
        skip=skip, limit=page_size,
        department_id=department_id, period=period,
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[DiversityRead.model_validate(i) for i in items],
        total=total, page=page, page_size=page_size,
    ))


@router.get("/diversity/{id}", response_model=ResponseEnvelope[DiversityRead])
async def get_diversity(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.get_diversity(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diversity metric not found")
    return ResponseEnvelope(data=DiversityRead.model_validate(obj))


@router.patch("/diversity/{id}", response_model=ResponseEnvelope[DiversityRead])
async def update_diversity(
    id: UUID,
    data: DiversityUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    obj = await service.update_diversity(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diversity metric not found")
    return ResponseEnvelope(data=DiversityRead.model_validate(obj))


@router.delete("/diversity/{id}", response_model=ResponseEnvelope[dict])
async def delete_diversity(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: SocialService = Depends(get_service),
):
    success = await service.delete_diversity(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diversity metric not found")
    return ResponseEnvelope(data={"deleted": True})


# ──────────────────────────────────────────────────
# Employee Participation  /api/v1/social/participations
# ──────────────────────────────────────────────────
from app.models.social import EmployeeParticipation
from app.schemas.social import EmployeeParticipationCreate, EmployeeParticipationUpdate, EmployeeParticipationRead
from typing import List
from sqlalchemy import select

@router.post("/participations", response_model=ResponseEnvelope[EmployeeParticipationRead], status_code=status.HTTP_201_CREATED)
async def create_participation(data: EmployeeParticipationCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = EmployeeParticipation(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=EmployeeParticipationRead.model_validate(db_obj))

@router.get("/participations", response_model=ResponseEnvelope[List[EmployeeParticipationRead]])
async def list_participations(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(EmployeeParticipation))
    items = result.scalars().all()
    return ResponseEnvelope(data=[EmployeeParticipationRead.model_validate(i) for i in items])

@router.get("/participations/{id}", response_model=ResponseEnvelope[EmployeeParticipationRead])
async def get_participation(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(EmployeeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
    return ResponseEnvelope(data=EmployeeParticipationRead.model_validate(db_obj))

@router.patch("/participations/{id}", response_model=ResponseEnvelope[EmployeeParticipationRead])
async def update_participation(id: UUID, data: EmployeeParticipationUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    from app.models.settings import CompanySetting
    
    db_obj = await db.get(EmployeeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
        
    # Rule 2: CSR Evidence Required
    if data.approval_status == EmployeeParticipationApprovalEnum.approved:
        # Check if the activity requires evidence, OR if global settings require evidence
        await db.refresh(db_obj, ['activity'])
        result = await db.execute(select(CompanySetting).limit(1))
        settings = result.scalars().first()
        
        proof = data.proof if data.proof is not None else db_obj.proof
        
        if (db_obj.activity.evidence_required or (settings and settings.csr_evidence_required)):
            if not proof or proof.strip() == "":
                raise HTTPException(status_code=400, detail="Cannot approve CSR activity: Proof of participation is required.")
                
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=EmployeeParticipationRead.model_validate(db_obj))

@router.delete("/participations/{id}", response_model=ResponseEnvelope[dict])
async def delete_participation(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(EmployeeParticipation, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Participation not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})


# ──────────────────────────────────────────────────
# Social Score  /api/v1/social/score
# ──────────────────────────────────────────────────
@router.get("/score", response_model=ResponseEnvelope[SocialScoreRead])
async def get_social_score(
    company_id: str = Query("default"),
    current_user: User = Depends(require_role(*read_roles)),
    service: SocialService = Depends(get_service),
):
    result = await service.compute_social_score(company_id)
    return ResponseEnvelope(data=result)
