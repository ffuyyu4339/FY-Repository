from datetime import datetime
from typing import Literal

from pydantic import BaseModel, field_validator

JobEventType = Literal[
    "opened_source",
    "copied_jd",
    "created",
    "updated",
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
    "note",
]


class JobEventCreate(BaseModel):
    event_type: JobEventType
    notes: str | None = None
    event_at: datetime | None = None

    @field_validator("notes", mode="before")
    @classmethod
    def normalize_notes(cls, value: str | None):
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None


class JobEventRead(BaseModel):
    id: int
    job_id: int
    event_type: JobEventType
    notes: str | None = None
    event_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
