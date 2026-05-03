from datetime import UTC, datetime

from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_name: Mapped[str | None] = mapped_column(String(255))
    job_title: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(120))
    platform: Mapped[str | None] = mapped_column(String(120))
    job_link: Mapped[str | None] = mapped_column(Text)
    salary_text: Mapped[str | None] = mapped_column(String(120))
    salary_min: Mapped[int | None] = mapped_column(Integer)
    salary_max: Mapped[int | None] = mapped_column(Integer)
    experience_required: Mapped[str | None] = mapped_column(String(120))
    degree_required: Mapped[str | None] = mapped_column(String(120))
    remote_allowed: Mapped[bool] = mapped_column(Boolean, default=False)
    jd_raw_text: Mapped[str | None] = mapped_column(Text)
    skills_extracted: Mapped[list[str] | None] = mapped_column(
        ARRAY(String), default=list
    )
    keywords: Mapped[list[str] | None] = mapped_column(ARRAY(String), default=list)
    track: Mapped[str] = mapped_column(String(64), default="other")
    match_score: Mapped[int] = mapped_column(Integer, default=0)
    match_level: Mapped[str] = mapped_column(String(64), default="ignore")
    status: Mapped[str] = mapped_column(String(64), default="pending_analysis")
    resume_version: Mapped[str | None] = mapped_column(String(120))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utc_now, onupdate=utc_now
    )


class AppPreference(Base):
    __tablename__ = "app_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    target_cities: Mapped[list[str] | None] = mapped_column(ARRAY(String), default=list)
    target_tracks: Mapped[list[str] | None] = mapped_column(ARRAY(String), default=list)
    priority_skills: Mapped[list[str] | None] = mapped_column(
        ARRAY(String), default=list
    )
    min_salary: Mapped[int | None] = mapped_column(Integer)
    default_resume_version: Mapped[str | None] = mapped_column(String(120))
    llm_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utc_now, onupdate=utc_now
    )


class SourceLink(Base):
    __tablename__ = "source_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_key: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    platform_name: Mapped[str] = mapped_column(String(120))
    title: Mapped[str] = mapped_column(String(180))
    url: Mapped[str] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(String(120))
    track: Mapped[str | None] = mapped_column(String(64))
    keywords: Mapped[list[str] | None] = mapped_column(ARRAY(String), default=list)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utc_now, onupdate=utc_now
    )


class JobEvent(Base):
    __tablename__ = "job_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    job_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), index=True
    )
    event_type: Mapped[str] = mapped_column(String(64))
    notes: Mapped[str | None] = mapped_column(Text)
    event_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
