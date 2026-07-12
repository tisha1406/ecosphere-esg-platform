import asyncio
import uuid
from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.settings import CompanySetting
from app.models.environmental import Company, Facility, CarbonEmission, ScopeEnum, EnergyUsage, EnergyTypeEnum, WasteTracking, WasteTypeEnum
from app.models.social import Department, Employee, EmployeeWellbeing, CsrInitiative, CsrStatusEnum, DiversityMetric
from app.models.governance import Policy, PolicyStatusEnum, ComplianceAudit, BoardActivity
from app.models.gamification import Badge
from app.models.scoring import PointsLedger, EsgScoreSummary
from app.models.notification import Notification

async def seed_data():
    async with SessionLocal() as db:
        print("Seeding database...")
        
        # Check if users already exist
        result = await db.execute(select(User))
        existing_users = result.scalars().all()
        if existing_users:
            print("Users already exist. Skipping seed.")
            return

        # Users
        users = [
            User(email="admin@ecosphere.com", full_name="Alice Admin", role=UserRole.admin, hashed_password=get_password_hash("Demo@1234")),
            User(email="manager@ecosphere.com", full_name="Bob Manager", role=UserRole.esg_manager, hashed_password=get_password_hash("Demo@1234")),
            User(email="env@ecosphere.com", full_name="Charlie Environmental", role=UserRole.environmental_officer, hashed_password=get_password_hash("Demo@1234")),
            User(email="social@ecosphere.com", full_name="Diana Social", role=UserRole.social_officer, hashed_password=get_password_hash("Demo@1234")),
            User(email="gov@ecosphere.com", full_name="Ethan Governance", role=UserRole.governance_officer, hashed_password=get_password_hash("Demo@1234")),
            User(email="employee@ecosphere.com", full_name="Frank Employee", role=UserRole.employee, hashed_password=get_password_hash("Demo@1234")),
        ]
        db.add_all(users)
        await db.commit()
        for u in users:
            await db.refresh(u)
        admin_user = next(u for u in users if u.role == UserRole.admin)
        employee_user = next(u for u in users if u.role == UserRole.employee)
        gov_user = next(u for u in users if u.role == UserRole.governance_officer)
        env_user = next(u for u in users if u.role == UserRole.environmental_officer)
        
        # Default company settings
        company_setting = CompanySetting(
            company_name="EcoSphere Global Corp",
            carbon_target=1000.0, water_target=5000.0, waste_target=100.0, diversity_target=40.0,
            governance_target=90.0, low_score_threshold=40.0, medium_score_threshold=70.0,
            notification_email_alerts=True, notification_weekly_reports=True
        )
        db.add(company_setting)

        # Environmental
        company = Company(name="EcoSphere Global Corp")
        db.add(company)
        await db.commit()
        await db.refresh(company)

        facility = Facility(name="Headquarters", company_id=company.id)
        db.add(facility)
        await db.commit()
        await db.refresh(facility)

        today = date.today()
        env_records = [
            CarbonEmission(date=today, source="Fleet Vehicles", scope=ScopeEnum.scope_1, value_tco2e=15.5, company_id=company.id),
            CarbonEmission(date=today - timedelta(days=30), source="Office Electricity", scope=ScopeEnum.scope_2, value_tco2e=45.2, company_id=company.id),
            EnergyUsage(date=today, energy_type=EnergyTypeEnum.electricity, kwh_consumed=12500, facility_id=facility.id),
            EnergyUsage(date=today, energy_type=EnergyTypeEnum.renewable, kwh_consumed=8500, facility_id=facility.id),
            WasteTracking(date=today, waste_type=WasteTypeEnum.recycled, kg_recycled=1200, kg_landfill=0, company_id=company.id),
            WasteTracking(date=today, waste_type=WasteTypeEnum.landfill, kg_recycled=0, kg_landfill=450, company_id=company.id),
        ]
        db.add_all(env_records)

        # Social
        department = Department(name="Engineering", company_id=str(company.id))
        db.add(department)
        await db.commit()
        await db.refresh(department)

        social_records = [
            Employee(full_name="Frank Employee", department_id=department.id, company_id=str(company.id)),
            CsrInitiative(name="Community Clean-up", budget=5000, beneficiaries=200, status=CsrStatusEnum.active, start_date=today - timedelta(days=15), end_date=today + timedelta(days=15), responsible_id=employee_user.id),
            DiversityMetric(period=f"{today.year}-Q1", department_id=department.id, gender_ratio=0.45, inclusion_score=85.5)
        ]
        db.add_all(social_records)
        await db.commit()
        
        # Governance
        gov_records = [
            Policy(name="Anti-Bribery Policy", category="Ethics", status=PolicyStatusEnum.active, effective_date=today - timedelta(days=365), owner_id=gov_user.id),
            ComplianceAudit(audit_date=today - timedelta(days=10), auditor_id=admin_user.id, score=92.5, findings="Minor documentation updates needed."),
            BoardActivity(meeting_date=today - timedelta(days=5), topic="Q1 ESG Review", decision="Approved increased budget for renewable energy transition.")
        ]
        db.add_all(gov_records)
        
        # Gamification
        badges = [
            Badge(name="Eco Warrior", criteria="Reduce carbon emissions by 10%", icon="🌿", points_value=100),
            Badge(name="Social Champion", criteria="Lead 3 CSR initiatives", icon="🤝", points_value=150),
            Badge(name="Governance Guru", criteria="Achieve 100% on compliance audit", icon="⚖️", points_value=200),
        ]
        db.add_all(badges)
        
        # Scoring & Points
        points = [
            PointsLedger(user_id=employee_user.id, points=50, reason="Logged recycling data", source_table="waste_tracking", source_id=uuid.uuid4()),
            PointsLedger(user_id=env_user.id, points=100, reason="Completed energy report", source_table="energy_usage", source_id=uuid.uuid4())
        ]
        db.add_all(points)

        score_summary = EsgScoreSummary(company_id=str(company.id), period=f"{today.year}-Q1", environmental_score=78.5, social_score=82.0, governance_score=91.5, total_score=84.0)
        db.add(score_summary)

        # Notifications
        notifs = [
            Notification(user_id=employee_user.id, message="Welcome to the EcoSphere ESG Platform.", is_read=False),
            Notification(user_id=env_user.id, message="Please submit Q1 emissions data.", is_read=False)
        ]
        db.add_all(notifs)

        await db.commit()
        print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_data())
