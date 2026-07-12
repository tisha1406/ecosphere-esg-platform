import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.settings import CompanySetting

async def seed_data():
    async with SessionLocal() as db:
        print("Seeding database...")
        
        # Check if users already exist
        result = await db.execute(select(User))
        existing_users = result.scalars().all()
        if existing_users:
            print("Users already exist. Skipping seed.")
            return

        users = [
            User(
                email="admin@ecosphere.com",
                full_name="Alice Admin",
                role=UserRole.admin,
                hashed_password=get_password_hash("Demo@1234")
            ),
            User(
                email="manager@ecosphere.com",
                full_name="Bob Manager",
                role=UserRole.esg_manager,
                hashed_password=get_password_hash("Demo@1234")
            ),
            User(
                email="env@ecosphere.com",
                full_name="Charlie Environmental",
                role=UserRole.environmental_officer,
                hashed_password=get_password_hash("Demo@1234")
            ),
            User(
                email="social@ecosphere.com",
                full_name="Diana Social",
                role=UserRole.social_officer,
                hashed_password=get_password_hash("Demo@1234")
            ),
            User(
                email="gov@ecosphere.com",
                full_name="Ethan Governance",
                role=UserRole.governance_officer,
                hashed_password=get_password_hash("Demo@1234")
            ),
            User(
                email="employee@ecosphere.com",
                full_name="Frank Employee",
                role=UserRole.employee,
                hashed_password=get_password_hash("Demo@1234")
            ),
        ]
        
        db.add_all(users)
        
        # Seed default company settings
        company_setting = CompanySetting(
            company_name="EcoSphere Global Corp",
            carbon_target=1000.0,
            water_target=5000.0,
            waste_target=100.0,
            diversity_target=40.0,
            governance_target=90.0,
            low_score_threshold=40.0,
            medium_score_threshold=70.0,
            notification_email_alerts=True,
            notification_weekly_reports=True
        )
        db.add(company_setting)
        
        await db.commit()
        print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_data())
