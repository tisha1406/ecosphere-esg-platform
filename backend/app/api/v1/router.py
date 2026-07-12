from fastapi import APIRouter
<<<<<<< Updated upstream
from app.api.v1 import auth, settings
=======
from app.api.v1 import auth, settings, environmental, governance
>>>>>>> Stashed changes

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(settings.router)
<<<<<<< Updated upstream

# Placeholder routers for subsequent modules:
# Developer A (Tisha) stubs:
# api_router.include_router(environmental.router)
# api_router.include_router(governance.router)
=======
api_router.include_router(environmental.router)
api_router.include_router(governance.router)

# Placeholder routers for subsequent modules:
# Developer A (Tisha) stubs:
>>>>>>> Stashed changes
# api_router.include_router(reports.router)

# Developer B (Selin) stubs:
# api_router.include_router(social.router)
# api_router.include_router(gamification.router)
# api_router.include_router(dashboard.router)
