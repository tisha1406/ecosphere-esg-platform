import pytest
from httpx import AsyncClient
from uuid import uuid4
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserRole, User
from app.core.security import create_access_token
from app.models.governance import Policy, ComplianceAudit, BoardActivity, PolicyStatusEnum

pytestmark = pytest.mark.anyio

async def create_user_and_token(db_session: AsyncSession, role: UserRole):
    user = User(
        id=uuid4(),
        email=f"test_{role.value}_{uuid4()}@example.com",
        hashed_password="test",
        full_name="Test User",
        role=role,
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    token = create_access_token(data={"sub": user.email, "type": "access"})
    return user, token

async def test_governance_score_unit(db_session: AsyncSession):
    from app.services.governance_service import GovernanceService
    
    svc = GovernanceService(db_session)
    score = await svc.compute_governance_score(date(2026, 1, 1), date(2026, 12, 31))
    # With no data, policy=100%, audit=100%, board=0% -> 40 + 40 + 0 = 80.0
    assert score == 80.0

async def test_governance_endpoints_rbac(client: AsyncClient, db_session: AsyncSession):
    employee, employee_token = await create_user_and_token(db_session, UserRole.employee)
    admin, admin_token = await create_user_and_token(db_session, UserRole.admin)

    # POST as employee should fail (403)
    response = await client.post(
        "/api/v1/governance/policies",
        headers={"Authorization": f"Bearer {employee_token}"},
        json={
            "name": "Test Policy",
            "category": "Ethics",
            "status": "draft",
            "effective_date": "2026-01-01",
            "owner_id": str(admin.id)
        }
    )
    assert response.status_code == 403

    # POST as admin should succeed (200)
    response = await client.post(
        "/api/v1/governance/policies",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Test Policy",
            "category": "Ethics",
            "status": "draft",
            "effective_date": "2026-01-01",
            "owner_id": str(admin.id)
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Test Policy"

    # GET as employee should succeed (200)
    response = await client.get(
        "/api/v1/governance/policies",
        headers={"Authorization": f"Bearer {employee_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["total"] >= 1
