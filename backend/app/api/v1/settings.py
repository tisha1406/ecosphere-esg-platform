from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import UserRole
from app.models.settings import CompanySetting
from app.schemas.settings import CompanySettingRead, CompanySettingUpdate
from app.schemas.common import ResponseEnvelope

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])

async def get_or_create_settings(db: AsyncSession) -> CompanySetting:
    result = await db.execute(select(CompanySetting))
    settings = result.scalars().first()
    if not settings:
        settings = CompanySetting()
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings

@router.get("", response_model=ResponseEnvelope[CompanySettingRead])
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.admin))
):
    settings = await get_or_create_settings(db)
    return ResponseEnvelope(success=True, data=settings, message="Settings retrieved")

@router.put("", response_model=ResponseEnvelope[CompanySettingRead])
async def update_settings(
    settings_in: CompanySettingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.admin))
):
    settings = await get_or_create_settings(db)
    for field, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    await db.commit()
    await db.refresh(settings)
    return ResponseEnvelope(success=True, data=settings, message="Settings updated successfully")
