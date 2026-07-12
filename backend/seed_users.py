import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.settings import CompanySetting

async def seed_users():
    async with SessionLocal() as db:
        print("Seeding users...")
        
        # Check if users already exist
        result = await db.execute(select(User))
        existing_users = result.scalars().all()
        if existing_users:
            print("Users already exist.")
            return

        users = [
            User(email="admin@ecosphere.com", full_name="Alice Admin", role=UserRole.admin, hashed_password=get_password_hash("Demo@1234")),
            User(email="manager@ecosphere.com", full_name="Bob Manager", role=UserRole.esg_manager, hashed_password=get_password_hash("Demo@1234")),
        ]
        db.add_all(users)
        
        company_setting = CompanySetting(
            company_name="EcoSphere Global Corp",
            carbon_target=1000.0, water_target=5000.0, waste_target=100.0, diversity_target=40.0,
            governance_target=90.0, low_score_threshold=40.0, medium_score_threshold=70.0,
            notification_email_alerts=True, notification_weekly_reports=True
        )
        db.add(company_setting)
        
        await db.commit()
        print("Done seeding users.")

if __name__ == "__main__":
    asyncio.run(seed_users())
