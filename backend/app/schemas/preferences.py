from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.schemas.job import TrackValue


class PreferenceBase(BaseModel):
    target_cities: list[str] = Field(default_factory=list)
    target_tracks: list[TrackValue] = Field(default_factory=list)
    priority_skills: list[str] = Field(default_factory=list)
    min_salary: int | None = Field(default=None, ge=0)
    default_resume_version: str | None = None
    llm_enabled: bool = False

    @field_validator("target_cities", "priority_skills", mode="before")
    @classmethod
    def normalize_string_lists(cls, value: list[str] | str | None):
        if value is None:
            return []
        if isinstance(value, str):
            parts = [item.strip() for item in value.replace("，", ",").split(",")]
        else:
            parts = [str(item).strip() for item in value]
        return [item for item in parts if item]

    @field_validator("default_resume_version", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None


class PreferenceUpdate(PreferenceBase):
    pass


class PreferenceRead(PreferenceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
