from collections import Counter
from datetime import datetime

from sqlalchemy import desc, func, or_, select
from sqlalchemy.orm import Session

from app.models.job import Job
from app.schemas.dashboard import (
    DashboardSummary,
    SkillFrequency,
    StatusCount,
    TrackCount,
)
from app.schemas.job import JobCreate, JobUpdate


class JobRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_jobs(
        self,
        *,
        q: str | None = None,
        city: str | None = None,
        track: str | None = None,
        match_level: str | None = None,
        status: str | None = None,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
    ) -> list[Job]:
        query = select(Job)

        if q:
            keyword = f"%{q.strip()}%"
            query = query.where(
                or_(
                    Job.company_name.ilike(keyword),
                    Job.job_title.ilike(keyword),
                    Job.city.ilike(keyword),
                    Job.platform.ilike(keyword),
                    Job.notes.ilike(keyword),
                    Job.jd_raw_text.ilike(keyword),
                )
            )

        if city:
            query = query.where(Job.city.ilike(f"%{city.strip()}%"))
        if track:
            query = query.where(Job.track == track)
        if match_level:
            query = query.where(Job.match_level == match_level)
        if status:
            query = query.where(Job.status == status)

        sort_column = Job.match_score if sort_by == "match_score" else Job.updated_at
        query = query.order_by(sort_column if sort_order == "asc" else desc(sort_column))
        return list(self.db.scalars(query).all())

    def get_job(self, job_id: int) -> Job | None:
        return self.db.get(Job, job_id)

    def create_job(self, payload: JobCreate) -> Job:
        job = Job(**payload.model_dump())
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def update_job(self, current_job: Job, payload: JobUpdate) -> Job:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(current_job, field, value)
        current_job.updated_at = datetime.utcnow()
        self.db.add(current_job)
        self.db.commit()
        self.db.refresh(current_job)
        return current_job

    def delete_job(self, current_job: Job) -> None:
        self.db.delete(current_job)
        self.db.commit()

    def get_dashboard_summary(self, *, top_n: int = 5) -> DashboardSummary:
        total_jobs = self.db.scalar(select(func.count()).select_from(Job)) or 0
        status_rows = self.db.execute(
            select(Job.status, func.count()).group_by(Job.status).order_by(func.count().desc())
        ).all()
        track_rows = self.db.execute(
            select(Job.track, func.count()).group_by(Job.track).order_by(func.count().desc())
        ).all()
        shanghai_jobs = (
            self.db.scalar(
                select(func.count()).select_from(Job).where(Job.city.ilike("%上海%"))
            )
            or 0
        )
        top_jobs = list(
            self.db.scalars(
                select(Job).order_by(desc(Job.match_score), desc(Job.updated_at)).limit(top_n)
            ).all()
        )
        all_skills = self.db.scalars(select(Job.skills_extracted)).all()
        skill_counter: Counter[str] = Counter()
        for skill_list in all_skills:
            for skill in skill_list or []:
                normalized = skill.strip()
                if normalized:
                    skill_counter[normalized] += 1

        return DashboardSummary(
            total_jobs=total_jobs,
            status_counts=[
                StatusCount(status=status_key, count=count) for status_key, count in status_rows
            ],
            track_counts=[TrackCount(track=track_key, count=count) for track_key, count in track_rows],
            shanghai_jobs=shanghai_jobs,
            top_jobs=top_jobs,
            top_skills=[
                SkillFrequency(skill=skill, count=count)
                for skill, count in skill_counter.most_common(top_n)
            ],
        )
