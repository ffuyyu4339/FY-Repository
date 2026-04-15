from fastapi import APIRouter

from app.api.routes.analyzer import router as analyzer_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.health import router as health_router
from app.api.routes.jobs import router as jobs_router

api_router = APIRouter(prefix="/api")
api_router.include_router(health_router, tags=["health"])
api_router.include_router(jobs_router, tags=["jobs"])
api_router.include_router(analyzer_router, tags=["analyzer"])
api_router.include_router(dashboard_router, tags=["dashboard"])
