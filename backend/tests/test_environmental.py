import pytest
from httpx import AsyncClient
from uuid import uuid4
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserRole, User
from app.core.security import create_access_token
from app.models.environmental import Company, Facility

pytestmark = pytest.mark.asyncio

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

async def test_env_score_unit(db_session: AsyncSession):
    from app.services.environmental_service import EnvironmentalService
    
    company = Company(id=uuid4(), name="Test Corp")
    db_session.add(company)
    await db_session.commit()
    
    svc = EnvironmentalService(db_session)
    score = await svc.compute_environmental_score(company.id, date(2026, 1, 1), date(2026, 12, 31))
    assert score == 100.0

async def test_environmental_endpoints_rbac(client: AsyncClient, db_session: AsyncSession):
    company = Company(id=uuid4(), name="Test Corp RBAC")
    db_session.add(company)
    await db_session.commit()

    employee, employee_token = await create_user_and_token(db_session, UserRole.employee)
    admin, admin_token = await create_user_and_token(db_session, UserRole.admin)

    # POST as employee should fail (403)
    response = await client.post(
        "/api/v1/environmental/emissions",
        headers={"Authorization": f"Bearer {employee_token}"},
        json={
            "date": "2026-01-01",
            "source": "Factory A",
            "scope": "scope_1",
            "value_tco2e": 100.5,
            "company_id": str(company.id)
        }
    )
    assert response.status_code == 403

    # POST as admin should succeed (200)
    response = await client.post(
        "/api/v1/environmental/emissions",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "date": "2026-01-01",
            "source": "Factory A",
            "scope": "scope_1",
            "value_tco2e": 100.5,
            "company_id": str(company.id)
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["source"] == "Factory A"

    # GET as employee should succeed (200)
    response = await client.get(
        "/api/v1/environmental/emissions",
        headers={"Authorization": f"Bearer {employee_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["total"] >= 1
