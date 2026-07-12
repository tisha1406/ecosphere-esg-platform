import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4

from app.models.user import User, UserRole
from app.models.gamification import Badge
from app.models.scoring import PointsLedger
from app.core.security import create_access_token

pytestmark = pytest.mark.anyio


async def create_user_and_token(db_session: AsyncSession, role: UserRole, email: str, name: str):
    user = User(
        id=uuid4(),
        email=email,
        hashed_password="fake",
        full_name=name,
        role=role,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    token = create_access_token(data={"sub": user.email, "type": "access"})
    return user, token


async def test_gamification_leaderboard(client: AsyncClient, db_session: AsyncSession):
    u1, _ = await create_user_and_token(db_session, UserRole.employee, "emp1@corp.com", "Alice")
    u2, _ = await create_user_and_token(db_session, UserRole.employee, "emp2@corp.com", "Bob")

    # Add points
    p1 = PointsLedger(user_id=u1.id, points=50, reason="task", source_table="t", source_id=uuid4())
    p2 = PointsLedger(user_id=u1.id, points=20, reason="task", source_table="t", source_id=uuid4())
    p3 = PointsLedger(user_id=u2.id, points=100, reason="task", source_table="t", source_id=uuid4())
    db_session.add_all([p1, p2, p3])
    await db_session.commit()

    # Any user can read the leaderboard
    _, token = await create_user_and_token(db_session, UserRole.employee, "emp3@corp.com", "Charlie")
    response = await client.get(
        "/api/v1/gamification/leaderboard",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()["data"]["entries"]
    
    # Check ordering (Bob 100, Alice 70)
    assert len(data) == 2
    assert data[0]["user_id"] == str(u2.id)
    assert data[0]["total_points"] == 100
    assert data[1]["user_id"] == str(u1.id)
    assert data[1]["total_points"] == 70


async def test_gamification_badge_threshold(client: AsyncClient, db_session: AsyncSession):
    # Setup badge
    badge = Badge(id=uuid4(), name="Gold Star", criteria="Earn 100 points", icon="star.png", points_value=100)
    db_session.add(badge)
    await db_session.commit()
    
    admin, token = await create_user_and_token(db_session, UserRole.admin, "admin_badge@corp.com", "Admin")
    user, _ = await create_user_and_token(db_session, UserRole.employee, "emp4@corp.com", "Dave")

    # Test logic directly via service or indirectly if exposed.
    # The badge award check is logic in GamificationService.check_and_award_badge.
    from app.services.gamification_service import GamificationService
    service = GamificationService(db_session)
    
    # User has 0 points initially
    awarded = await service.check_and_award_badge(user.id, badge.id)
    assert not awarded
    
    # Add 100 points
    p = PointsLedger(user_id=user.id, points=100, reason="bonus", source_table="manual", source_id=uuid4())
    db_session.add(p)
    await db_session.commit()
    
    awarded = await service.check_and_award_badge(user.id, badge.id)
    assert awarded


async def test_gamification_points_rbac(client: AsyncClient, db_session: AsyncSession):
    admin, admin_token = await create_user_and_token(db_session, UserRole.admin, "admin_rbac@corp.com", "Admin")
    emp, emp_token = await create_user_and_token(db_session, UserRole.employee, "emp_rbac@corp.com", "Employee")
    
    # POST /api/v1/gamification/points/award as employee should fail (403)
    response = await client.post(
        "/api/v1/gamification/points/award",
        headers={"Authorization": f"Bearer {emp_token}"},
        json={"user_id": str(emp.id), "points": 10, "reason": "Good job"}
    )
    assert response.status_code == 403
    
    # POST /api/v1/gamification/points/award as admin should succeed (200)
    response = await client.post(
        "/api/v1/gamification/points/award",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"user_id": str(emp.id), "points": 10, "reason": "Good job"}
    )
    assert response.status_code == 200
    
    # Verify points were awarded
    from app.services.gamification_service import GamificationService
    service = GamificationService(db_session)
    total = await service.repo.get_user_points_total(emp.id)
    assert total == 10
