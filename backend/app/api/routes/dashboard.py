from fastapi import APIRouter, Depends, Query

from app.api.deps import get_job_repository
from app.repositories.jobs import JobRepository
from app.schemas.dashboard import DashboardSummary

router = APIRouter()


@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    top_n: int = Query(default=5, ge=1, le=20),
    repository: JobRepository = Depends(get_job_repository),
) -> DashboardSummary:
    return repository.get_dashboard_summary(top_n=top_n)
