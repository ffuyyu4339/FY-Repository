from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.schemas.job import TrackValue


class SourceLinkBase(BaseModel):
    platform_name: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=180)
    url: str = Field(min_length=8)
    city: str | None = None
    track: TrackValue | None = None
    keywords: list[str] = Field(default_factory=list)
    enabled: bool = True
    sort_order: int = 100

    @field_validator("platform_name", "title", "url", "city", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None

    @field_validator("keywords", mode="before")
    @classmethod
    def normalize_keywords(cls, value: list[str] | str | None):
        if value is None:
            return []
        if isinstance(value, str):
            parts = [item.strip() for item in value.replace("，", ",").split(",")]
        else:
            parts = [str(item).strip() for item in value]
        return [item for item in parts if item]


class SourceLinkCreate(SourceLinkBase):
    source_key: str | None = None

    @field_validator("source_key", mode="before")
    @classmethod
    def normalize_source_key(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip().lower().replace(" ", "_")
        return normalized or None


class SourceLinkUpdate(BaseModel):
    platform_name: str | None = None
    title: str | None = None
    url: str | None = None
    city: str | None = None
    track: TrackValue | None = None
    keywords: list[str] | None = None
    enabled: bool | None = None
    sort_order: int | None = None

    @field_validator("platform_name", "title", "url", "city", mode="before")
    @classmethod
    def normalize_update_text(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None

    @field_validator("keywords", mode="before")
    @classmethod
    def normalize_update_keywords(cls, value: list[str] | str | None):
        if value is None:
            return None
        if isinstance(value, str):
            parts = [item.strip() for item in value.replace("，", ",").split(",")]
        else:
            parts = [str(item).strip() for item in value]
        return [item for item in parts if item]


class SourceLinkRead(SourceLinkBase):
    id: int
    source_key: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
