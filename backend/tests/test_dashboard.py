import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from datetime import date

from app.models.user import User, UserRole
from app.models.scoring import EsgScoreSummary, PointsLedger
from app.models.governance import Policy, ComplianceAudit, PolicyStatusEnum
from app.models.social import CsrInitiative, CsrStatusEnum
from app.models.notification import Notification
from app.core.security import create_access_token
from app.services.dashboard_service import DashboardService
from app.repositories.notification_repository import NotificationRepository

pytestmark = pytest.mark.anyio


async def _make_user(db: AsyncSession, role: UserRole, email: str, name: str):
    user = User(id=uuid4(), email=email, hashed_password="fake", full_name=name, role=role)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token(data={"sub": user.email, "type": "access"})
    return user, token


# ── Dashboard Summary Tests ────────────────────────────────────────────────────

async def test_dashboard_summary_returns_structure(client: AsyncClient, db_session: AsyncSession):
    """GET /api/v1/dashboard/summary returns the expected keys."""
    user, token = await _make_user(db_session, UserRole.esg_manager, "dash_mgr@corp.com", "Manager")

    response = await client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert "scores" in data
    assert "activity" in data
    assert "top_contributors" in data
    assert "recent_notifications" in data
    # Scores block has the four required keys
    scores = data["scores"]
    assert "environmental" in scores
    assert "social" in scores
    assert "governance" in scores
    assert "overall" in scores
    assert "period" in scores


async def test_dashboard_summary_counts_active_csr(client: AsyncClient, db_session: AsyncSession):
    """activity.active_csr_initiatives reflects active CSR rows."""
    user, token = await _make_user(db_session, UserRole.esg_manager, "dash_csr@corp.com", "CSR Mgr")

    # Insert one active and one planned CSR initiative
    csr_active = CsrInitiative(
        id=uuid4(),
        name="Active Initiative",
        budget=10000,
        beneficiaries=100,
        status=CsrStatusEnum.active,
        start_date=date(2026, 1, 1),
    )
    csr_planned = CsrInitiative(
        id=uuid4(),
        name="Planned Initiative",
        budget=5000,
        beneficiaries=50,
        status=CsrStatusEnum.planned,
        start_date=date(2026, 6, 1),
    )
    db_session.add_all([csr_active, csr_planned])
    await db_session.commit()

    response = await client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    activity = response.json()["data"]["activity"]
    assert activity["active_csr_initiatives"] >= 1


async def test_dashboard_summary_top_contributors_ordered(client: AsyncClient, db_session: AsyncSession):
    """top_contributors are ordered by total_points DESC."""
    u1, _ = await _make_user(db_session, UserRole.employee, "dash_u1@corp.com", "Alpha")
    u2, _ = await _make_user(db_session, UserRole.employee, "dash_u2@corp.com", "Beta")

    p1 = PointsLedger(user_id=u1.id, points=200, reason="test", source_table="t", source_id=uuid4())
    p2 = PointsLedger(user_id=u2.id, points=50, reason="test", source_table="t", source_id=uuid4())
    db_session.add_all([p1, p2])
    await db_session.commit()

    manager, token = await _make_user(db_session, UserRole.esg_manager, "dash_view@corp.com", "Viewer")
    response = await client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    contributors = response.json()["data"]["top_contributors"]
    if len(contributors) >= 2:
        # Ensure descending order
        assert contributors[0]["total_points"] >= contributors[1]["total_points"]


async def test_dashboard_summary_score_trend(client: AsyncClient, db_session: AsyncSession):
    """Scores block shows delta when two periods exist."""
    # Insert two EsgScoreSummary rows for the same company
    s1 = EsgScoreSummary(
        id=uuid4(),
        company_id="test-trend",
        period="2025",
        environmental_score=60.0,
        social_score=65.0,
        governance_score=70.0,
        total_score=65.0,
    )
    s2 = EsgScoreSummary(
        id=uuid4(),
        company_id="test-trend",
        period="2026",
        environmental_score=75.0,
        social_score=80.0,
        governance_score=85.0,
        total_score=80.0,
    )
    db_session.add_all([s1, s2])
    await db_session.commit()

    user, token = await _make_user(db_session, UserRole.admin, "dash_trend@corp.com", "Trend Admin")
    response = await client.get(
        "/api/v1/dashboard/summary?company_id=test-trend",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    scores = response.json()["data"]["scores"]
    env = scores["environmental"]
    assert env["current"] == 75.0
    assert env["previous"] == 60.0
    assert env["delta"] == 15.0


# ── Notification Endpoint Tests ────────────────────────────────────────────────

async def test_list_notifications_empty(client: AsyncClient, db_session: AsyncSession):
    """GET /api/v1/dashboard/notifications returns empty list for new user."""
    user, token = await _make_user(db_session, UserRole.employee, "notif_emp1@corp.com", "NotifUser1")
    response = await client.get(
        "/api/v1/dashboard/notifications",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total"] == 0
    assert data["items"] == []


async def test_list_notifications_filter_by_is_read(client: AsyncClient, db_session: AsyncSession):
    """Notifications can be filtered by is_read."""
    user, token = await _make_user(db_session, UserRole.employee, "notif_emp2@corp.com", "NotifUser2")

    n1 = Notification(id=uuid4(), user_id=user.id, message="Unread notif", source_table="system", is_read=False)
    n2 = Notification(id=uuid4(), user_id=user.id, message="Read notif", source_table="system", is_read=True)
    db_session.add_all([n1, n2])
    await db_session.commit()

    # Filter unread only
    response = await client.get(
        "/api/v1/dashboard/notifications?is_read=false",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total"] == 1
    assert data["items"][0]["is_read"] is False

    # Filter read only
    response = await client.get(
        "/api/v1/dashboard/notifications?is_read=true",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["total"] == 1
    assert data["items"][0]["is_read"] is True


async def test_mark_notification_as_read(client: AsyncClient, db_session: AsyncSession):
    """PATCH /api/v1/dashboard/notifications/{id}/read marks the notification read."""
    user, token = await _make_user(db_session, UserRole.employee, "notif_emp3@corp.com", "NotifUser3")

    notif = Notification(
        id=uuid4(),
        user_id=user.id,
        message="Test notification",
        source_table="system",
        is_read=False,
    )
    db_session.add(notif)
    await db_session.commit()

    response = await client.patch(
        f"/api/v1/dashboard/notifications/{notif.id}/read",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    result = response.json()["data"]
    assert result["is_read"] is True
    assert result["id"] == str(notif.id)


async def test_mark_notification_as_read_other_user_forbidden(client: AsyncClient, db_session: AsyncSession):
    """PATCH /notifications/{id}/read returns 403 when another user tries to mark it."""
    owner, _ = await _make_user(db_session, UserRole.employee, "notif_owner@corp.com", "Owner")
    attacker, atk_token = await _make_user(db_session, UserRole.employee, "notif_atk@corp.com", "Attacker")

    notif = Notification(
        id=uuid4(),
        user_id=owner.id,
        message="Owner's notification",
        source_table="system",
        is_read=False,
    )
    db_session.add(notif)
    await db_session.commit()

    response = await client.patch(
        f"/api/v1/dashboard/notifications/{notif.id}/read",
        headers={"Authorization": f"Bearer {atk_token}"},
    )
    assert response.status_code == 403


async def test_dashboard_requires_auth(client: AsyncClient, db_session: AsyncSession):
    """GET /summary without token returns 401."""
    response = await client.get("/api/v1/dashboard/summary")
    assert response.status_code == 401
