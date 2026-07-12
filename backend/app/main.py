from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.api.v1.router import api_router

app = FastAPI(
    title="EcoSphere ESG Management Platform API",
    description="Backend API services for ESG indicators tracking and gamification system.",
    version="1.0.0"
)

# Exception handlers setup
register_exception_handlers(app)

print(f"Loaded CORS origins: {settings.CORS_ORIGINS}")
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes registration
app.include_router(api_router)

@app.get("/api/v1/health")
async def health_check():
    return {
        "success": True,
        "data": {"status": "ok"},
        "message": "EcoSphere Core API operational"
    }
