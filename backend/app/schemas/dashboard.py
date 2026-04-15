from pydantic import BaseModel, Field

from app.schemas.job import JobRead


class StatusCount(BaseModel):
    status: str
    count: int


class TrackCount(BaseModel):
    track: str
    count: int


class SkillFrequency(BaseModel):
    skill: str
    count: int


class DashboardSummary(BaseModel):
    total_jobs: int
    status_counts: list[StatusCount] = Field(default_factory=list)
    track_counts: list[TrackCount] = Field(default_factory=list)
    shanghai_jobs: int
    top_jobs: list[JobRead] = Field(default_factory=list)
    top_skills: list[SkillFrequency] = Field(default_factory=list)
