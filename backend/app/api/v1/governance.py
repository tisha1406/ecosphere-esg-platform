from datetime import date
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import require_role, get_current_user
from app.models.user import UserRole, User
from app.models.governance import PolicyStatusEnum
from app.schemas.common import ResponseEnvelope, PaginatedResponse
from app.schemas.governance import (
    PolicyCreate, PolicyUpdate, PolicyRead,
    ComplianceAuditCreate, ComplianceAuditUpdate, ComplianceAuditRead,
    BoardActivityCreate, BoardActivityUpdate, BoardActivityRead
)
from app.services.governance_service import GovernanceService

router = APIRouter(prefix="/api/v1/governance", tags=["Governance"])

write_roles = [UserRole.admin, UserRole.esg_manager, UserRole.governance_officer]
read_roles = list(UserRole)

def get_service(db: AsyncSession = Depends(get_db)) -> GovernanceService:
    return GovernanceService(db)

# --- Policies ---
@router.post("/policies", response_model=ResponseEnvelope[PolicyRead])
async def create_policy(
    data: PolicyCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.create_policy(data, current_user.id)
    return ResponseEnvelope(data=PolicyRead.model_validate(obj))

@router.get("/policies", response_model=ResponseEnvelope[PaginatedResponse[PolicyRead]])
async def get_policies(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[PolicyStatusEnum] = None,
    category: Optional[str] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_policies(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date, 
        status=status, category=category
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[PolicyRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/policies/{id}", response_model=ResponseEnvelope[PolicyRead])
async def get_policy(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.get_policy(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return ResponseEnvelope(data=PolicyRead.model_validate(obj))

@router.patch("/policies/{id}", response_model=ResponseEnvelope[PolicyRead])
async def update_policy(
    id: UUID,
    data: PolicyUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.update_policy(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return ResponseEnvelope(data=PolicyRead.model_validate(obj))

@router.delete("/policies/{id}", response_model=ResponseEnvelope[dict])
async def delete_policy(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    success = await service.delete_policy(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return ResponseEnvelope(data={"deleted": True})

# --- Compliance Audits ---
@router.post("/audits", response_model=ResponseEnvelope[ComplianceAuditRead])
async def create_compliance_audit(
    data: ComplianceAuditCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.create_compliance_audit(data, current_user.id)
    return ResponseEnvelope(data=ComplianceAuditRead.model_validate(obj))

@router.get("/audits", response_model=ResponseEnvelope[PaginatedResponse[ComplianceAuditRead]])
async def get_compliance_audits(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    auditor_id: Optional[UUID] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_compliance_audits(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date, auditor_id=auditor_id
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[ComplianceAuditRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/audits/{id}", response_model=ResponseEnvelope[ComplianceAuditRead])
async def get_compliance_audit(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.get_compliance_audit(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance audit not found")
    return ResponseEnvelope(data=ComplianceAuditRead.model_validate(obj))

@router.patch("/audits/{id}", response_model=ResponseEnvelope[ComplianceAuditRead])
async def update_compliance_audit(
    id: UUID,
    data: ComplianceAuditUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.update_compliance_audit(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance audit not found")
    return ResponseEnvelope(data=ComplianceAuditRead.model_validate(obj))

@router.delete("/audits/{id}", response_model=ResponseEnvelope[dict])
async def delete_compliance_audit(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    success = await service.delete_compliance_audit(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Compliance audit not found")
    return ResponseEnvelope(data={"deleted": True})

# --- Board Activity ---
@router.post("/board-activity", response_model=ResponseEnvelope[BoardActivityRead])
async def create_board_activity(
    data: BoardActivityCreate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.create_board_activity(data, current_user.id)
    return ResponseEnvelope(data=BoardActivityRead.model_validate(obj))

@router.get("/board-activity", response_model=ResponseEnvelope[PaginatedResponse[BoardActivityRead]])
async def get_board_activities(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    skip = (page - 1) * page_size
    items, total = await service.get_board_activities(
        skip=skip, limit=page_size, start_date=start_date, end_date=end_date
    )
    return ResponseEnvelope(data=PaginatedResponse(
        items=[BoardActivityRead.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size
    ))

@router.get("/board-activity/{id}", response_model=ResponseEnvelope[BoardActivityRead])
async def get_board_activity(
    id: UUID,
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.get_board_activity(id)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board activity not found")
    return ResponseEnvelope(data=BoardActivityRead.model_validate(obj))

@router.patch("/board-activity/{id}", response_model=ResponseEnvelope[BoardActivityRead])
async def update_board_activity(
    id: UUID,
    data: BoardActivityUpdate,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    obj = await service.update_board_activity(id, data)
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board activity not found")
    return ResponseEnvelope(data=BoardActivityRead.model_validate(obj))

@router.delete("/board-activity/{id}", response_model=ResponseEnvelope[dict])
async def delete_board_activity(
    id: UUID,
    current_user: User = Depends(require_role(*write_roles)),
    service: GovernanceService = Depends(get_service)
):
    success = await service.delete_board_activity(id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board activity not found")
    return ResponseEnvelope(data={"deleted": True})

from app.models.governance import PolicyAcknowledgement, ComplianceIssue
from app.schemas.governance import (
    PolicyAcknowledgementCreate, PolicyAcknowledgementUpdate, PolicyAcknowledgementRead,
    ComplianceIssueCreate, ComplianceIssueUpdate, ComplianceIssueRead
)
from typing import List
from sqlalchemy import select

# --- Policy Acknowledgements ---
@router.post("/policy-acknowledgements", response_model=ResponseEnvelope[PolicyAcknowledgementRead], status_code=status.HTTP_201_CREATED)
async def create_policy_acknowledgement(data: PolicyAcknowledgementCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = PolicyAcknowledgement(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=PolicyAcknowledgementRead.model_validate(db_obj))

@router.get("/policy-acknowledgements", response_model=ResponseEnvelope[List[PolicyAcknowledgementRead]])
async def list_policy_acknowledgements(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(PolicyAcknowledgement))
    items = result.scalars().all()
    return ResponseEnvelope(data=[PolicyAcknowledgementRead.model_validate(i) for i in items])

@router.get("/policy-acknowledgements/{id}", response_model=ResponseEnvelope[PolicyAcknowledgementRead])
async def get_policy_acknowledgement(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(PolicyAcknowledgement, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Acknowledgement not found")
    return ResponseEnvelope(data=PolicyAcknowledgementRead.model_validate(db_obj))

@router.patch("/policy-acknowledgements/{id}", response_model=ResponseEnvelope[PolicyAcknowledgementRead])
async def update_policy_acknowledgement(id: UUID, data: PolicyAcknowledgementUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(PolicyAcknowledgement, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Acknowledgement not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=PolicyAcknowledgementRead.model_validate(db_obj))

@router.delete("/policy-acknowledgements/{id}", response_model=ResponseEnvelope[dict])
async def delete_policy_acknowledgement(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(PolicyAcknowledgement, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Acknowledgement not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

# --- Compliance Issues ---
@router.post("/compliance-issues", response_model=ResponseEnvelope[ComplianceIssueRead], status_code=status.HTTP_201_CREATED)
async def create_compliance_issue(data: ComplianceIssueCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    from app.models.settings import CompanySetting
    from app.models.notification import Notification
    from sqlalchemy import select
    
    db_obj = ComplianceIssue(**data.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    
    # Rule 4: Trigger Notification on ComplianceIssue create if settings allow
    result = await db.execute(select(CompanySetting).limit(1))
    settings = result.scalars().first()
    
    if settings and getattr(settings, 'notification_email_alerts', False):
        # We notify the admin user
        admin_result = await db.execute(select(User).where(User.role == UserRole.admin).limit(1))
        admin = admin_result.scalars().first()
        if admin:
            notif = Notification(
                user_id=admin.id,
                message=f"New Compliance Issue created: {db_obj.title} (Severity: {db_obj.severity})",
                is_read=False
            )
            db.add(notif)
            await db.commit()
            
    return ResponseEnvelope(data=ComplianceIssueRead.model_validate(db_obj))

@router.get("/compliance-issues", response_model=ResponseEnvelope[List[ComplianceIssueRead]])
async def list_compliance_issues(db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    result = await db.execute(select(ComplianceIssue))
    items = result.scalars().all()
    return ResponseEnvelope(data=[ComplianceIssueRead.model_validate(i) for i in items])

@router.get("/compliance-issues/{id}", response_model=ResponseEnvelope[ComplianceIssueRead])
async def get_compliance_issue(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*read_roles))):
    db_obj = await db.get(ComplianceIssue, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Issue not found")
    return ResponseEnvelope(data=ComplianceIssueRead.model_validate(db_obj))

@router.patch("/compliance-issues/{id}", response_model=ResponseEnvelope[ComplianceIssueRead])
async def update_compliance_issue(id: UUID, data: ComplianceIssueUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(ComplianceIssue, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Issue not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    await db.commit()
    await db.refresh(db_obj)
    return ResponseEnvelope(data=ComplianceIssueRead.model_validate(db_obj))

@router.delete("/compliance-issues/{id}", response_model=ResponseEnvelope[dict])
async def delete_compliance_issue(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(require_role(*write_roles))):
    db_obj = await db.get(ComplianceIssue, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Issue not found")
    await db.delete(db_obj)
    await db.commit()
    return ResponseEnvelope(data={"deleted": True})

# --- Score ---
@router.get("/score", response_model=ResponseEnvelope[float])
async def get_governance_score(
    start_date: date = Query(...),
    end_date: date = Query(...),
    current_user: User = Depends(require_role(*read_roles)),
    service: GovernanceService = Depends(get_service)
):
    score = await service.compute_governance_score(start_date, end_date)
    return ResponseEnvelope(data=score)
