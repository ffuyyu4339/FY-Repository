from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

TrackValue = Literal[
    "data_analyst",
    "ai_app_dev",
    "android_client",
    "model_deployment",
    "general_software",
    "other",
]
MatchLevelValue = Literal["priority_apply", "apply", "stretch", "ignore"]
StatusValue = Literal[
    "pending_analysis",
    "ready_to_apply",
    "applied",
    "online_test",
    "interview_1",
    "interview_2",
    "hr_interview",
    "offer",
    "rejected",
    "archived",
]


class JobBase(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    city: str | None = None
    platform: str | None = None
    job_link: str | None = None
    salary_text: str | None = None
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    experience_required: str | None = None
    degree_required: str | None = None
    remote_allowed: bool = False
    jd_raw_text: str | None = None
    skills_extracted: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    track: TrackValue = "other"
    match_score: int = Field(default=0, ge=0, le=100)
    match_level: MatchLevelValue = "ignore"
    status: StatusValue = "pending_analysis"
    resume_version: str | None = None
    notes: str | None = None

    @field_validator(
        "company_name",
        "job_title",
        "city",
        "platform",
        "job_link",
        "salary_text",
        "experience_required",
        "degree_required",
        "jd_raw_text",
        "resume_version",
        "notes",
        mode="before",
    )
    @classmethod
    def normalize_optional_text(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None

    @field_validator("skills_extracted", "keywords", mode="before")
    @classmethod
    def normalize_string_lists(cls, value: list[str] | str | None):
        if value is None:
            return []
        if isinstance(value, str):
            parts = [item.strip() for item in value.replace("，", ",").split(",")]
        else:
            parts = [str(item).strip() for item in value]
        return [item for item in parts if item]


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    city: str | None = None
    platform: str | None = None
    job_link: str | None = None
    salary_text: str | None = None
    salary_min: int | None = Field(default=None, ge=0)
    salary_max: int | None = Field(default=None, ge=0)
    experience_required: str | None = None
    degree_required: str | None = None
    remote_allowed: bool | None = None
    jd_raw_text: str | None = None
    skills_extracted: list[str] | None = None
    keywords: list[str] | None = None
    track: TrackValue | None = None
    match_score: int | None = Field(default=None, ge=0, le=100)
    match_level: MatchLevelValue | None = None
    status: StatusValue | None = None
    resume_version: str | None = None
    notes: str | None = None

    @field_validator(
        "company_name",
        "job_title",
        "city",
        "platform",
        "job_link",
        "salary_text",
        "experience_required",
        "degree_required",
        "jd_raw_text",
        "resume_version",
        "notes",
        mode="before",
    )
    @classmethod
    def normalize_update_optional_text(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None

    @field_validator("skills_extracted", "keywords", mode="before")
    @classmethod
    def normalize_update_lists(cls, value: list[str] | str | None):
        if value is None:
            return None
        if isinstance(value, str):
            parts = [item.strip() for item in value.replace("，", ",").split(",")]
        else:
            parts = [str(item).strip() for item in value]
        return [item for item in parts if item]


class JobRead(JobBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
