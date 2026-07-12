import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.core.database import Base
# Import all models to ensure they are registered with Base
from app.models.user import User
from app.models.settings import CompanySetting
from app.models.scoring import PointsLedger, EsgScoreSummary
from app.models.notification import Notification
from app.models.environmental import Company, Facility, CarbonEmission, EnergyUsage, WasteTracking
from app.models.social import Department, Employee, EmployeeWellbeing, CsrInitiative, DiversityMetric
from app.models.governance import Policy, ComplianceAudit, BoardActivity
from app.models.gamification import Badge

async def init_db():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("Database initialized successfully from models.")

if __name__ == "__main__":
    asyncio.run(init_db())
