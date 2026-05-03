from fastapi import APIRouter, Depends

from app.api.deps import get_job_repository
from app.repositories.jobs import JobRepository
from app.schemas.analyzer import JDAnalyzeRequest, JDAnalyzeResponse
from app.services.analyzer import analyze_jd_text

router = APIRouter()


@router.post("/analyze-jd", response_model=JDAnalyzeResponse)
def analyze_jd(
    payload: JDAnalyzeRequest,
    repository: JobRepository = Depends(get_job_repository),
) -> JDAnalyzeResponse:
    preferences = repository.get_preferences()
    return analyze_jd_text(payload.jd_raw_text, preferences=preferences)
