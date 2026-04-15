from pydantic import BaseModel, Field


class JDAnalyzeRequest(BaseModel):
    jd_raw_text: str = Field(min_length=20, description="岗位 JD 原文")


class JDAnalyzeResponse(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    city: str | None = None
    experience_required: str | None = None
    degree_required: str | None = None
    salary_text: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    remote_allowed: bool = False
    skills_extracted: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    track: str = "other"
    match_score: int = 0
    match_level: str = "ignore"
