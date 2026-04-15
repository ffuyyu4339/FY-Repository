from fastapi import APIRouter

from app.schemas.analyzer import JDAnalyzeRequest, JDAnalyzeResponse
from app.services.analyzer import analyze_jd_text

router = APIRouter()


@router.post("/analyze-jd", response_model=JDAnalyzeResponse)
def analyze_jd(payload: JDAnalyzeRequest) -> JDAnalyzeResponse:
    return analyze_jd_text(payload.jd_raw_text)
