from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


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
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
