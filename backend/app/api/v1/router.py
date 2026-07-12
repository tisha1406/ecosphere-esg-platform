from fastapi import APIRouter
from app.api.v1 import auth, settings

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(settings.router)

# Placeholder routers for subsequent modules:
# Developer A (Tisha) stubs:
# api_router.include_router(environmental.router)
# api_router.include_router(governance.router)
# api_router.include_router(reports.router)

# Developer B (Selin) stubs:
# api_router.include_router(social.router)
# api_router.include_router(gamification.router)
# api_router.include_router(dashboard.router)
