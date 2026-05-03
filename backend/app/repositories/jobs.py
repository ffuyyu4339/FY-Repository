from collections import Counter
from uuid import uuid4

from sqlalchemy import desc, func, not_, or_, select
from sqlalchemy.orm import Session

from app.models.job import AppPreference, Job, JobEvent, SourceLink, utc_now
from app.schemas.dashboard import (
    DashboardSummary,
    SkillFrequency,
    StatusCount,
    TrackCount,
)
from app.schemas.job import JobCreate, JobUpdate
from app.schemas.job_event import JobEventCreate
from app.schemas.preferences import PreferenceUpdate
from app.schemas.source_link import SourceLinkCreate, SourceLinkUpdate

INTERVIEWING_STATUSES = {"interview_1", "interview_2", "hr_interview"}
INACTIVE_TOP_JOB_STATUSES = {"rejected", "archived"}


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
        status_group: str | None = None,
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
                    func.array_to_string(Job.skills_extracted, " ").ilike(keyword),
                    func.array_to_string(Job.keywords, " ").ilike(keyword),
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
        elif status_group == "interviewing":
            query = query.where(Job.status.in_(INTERVIEWING_STATUSES))

        sort_column = Job.match_score if sort_by == "match_score" else Job.updated_at
        query = query.order_by(
            sort_column if sort_order == "asc" else desc(sort_column)
        )
        return list(self.db.scalars(query).all())

    def get_job(self, job_id: int) -> Job | None:
        return self.db.get(Job, job_id)

    def create_job(self, payload: JobCreate) -> Job:
        job = Job(**payload.model_dump())
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        self.create_job_event(
            job.id,
            JobEventCreate(event_type="created", notes="创建岗位记录。"),
            commit=False,
        )
        self.db.commit()
        return job

    def update_job(self, current_job: Job, payload: JobUpdate) -> Job:
        update_data = payload.model_dump(exclude_unset=True)
        previous_status = current_job.status
        for field, value in update_data.items():
            setattr(current_job, field, value)
        current_job.updated_at = utc_now()
        self.db.add(current_job)
        if "status" in update_data and update_data["status"] != previous_status:
            event_notes = f"状态从 {previous_status} 更新为 {update_data['status']}。"
            self.create_job_event(
                current_job.id,
                JobEventCreate(event_type=update_data["status"], notes=event_notes),
                commit=False,
            )
        self.db.commit()
        self.db.refresh(current_job)
        return current_job

    def delete_job(self, current_job: Job) -> None:
        self.db.delete(current_job)
        self.db.commit()

    def get_dashboard_summary(self, *, top_n: int = 5) -> DashboardSummary:
        total_jobs = self.db.scalar(select(func.count()).select_from(Job)) or 0
        status_rows = self.db.execute(
            select(Job.status, func.count())
            .group_by(Job.status)
            .order_by(func.count().desc())
        ).all()
        track_rows = self.db.execute(
            select(Job.track, func.count())
            .group_by(Job.track)
            .order_by(func.count().desc())
        ).all()
        shanghai_jobs = (
            self.db.scalar(
                select(func.count()).select_from(Job).where(Job.city.ilike("%上海%"))
            )
            or 0
        )
        top_jobs = list(
            self.db.scalars(
                select(Job)
                .where(Job.match_level != "ignore")
                .where(not_(Job.status.in_(INACTIVE_TOP_JOB_STATUSES)))
                .order_by(desc(Job.match_score), desc(Job.updated_at))
                .limit(top_n)
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
                StatusCount(status=status_key, count=count)
                for status_key, count in status_rows
            ],
            track_counts=[
                TrackCount(track=track_key, count=count)
                for track_key, count in track_rows
            ],
            shanghai_jobs=shanghai_jobs,
            top_jobs=top_jobs,
            top_skills=[
                SkillFrequency(skill=skill, count=count)
                for skill, count in skill_counter.most_common(top_n)
            ],
        )

    def get_preferences(self) -> AppPreference:
        preferences = self.db.get(AppPreference, 1)
        if preferences is None:
            preferences = AppPreference(id=1)
            self.db.add(preferences)
            self.db.commit()
            self.db.refresh(preferences)
        return preferences

    def update_preferences(self, payload: PreferenceUpdate) -> AppPreference:
        preferences = self.get_preferences()
        for field, value in payload.model_dump().items():
            setattr(preferences, field, value)
        preferences.updated_at = utc_now()
        self.db.add(preferences)
        self.db.commit()
        self.db.refresh(preferences)
        return preferences

    def list_source_links(self, *, include_disabled: bool = False) -> list[SourceLink]:
        query = select(SourceLink)
        if not include_disabled:
            query = query.where(SourceLink.enabled.is_(True))
        query = query.order_by(SourceLink.sort_order, SourceLink.id)
        return list(self.db.scalars(query).all())

    def get_source_link(self, source_link_id: int) -> SourceLink | None:
        return self.db.get(SourceLink, source_link_id)

    def create_source_link(self, payload: SourceLinkCreate) -> SourceLink:
        source_key = payload.source_key or f"custom_{uuid4().hex[:12]}"
        source_link = SourceLink(
            **payload.model_dump(exclude={"source_key"}),
            source_key=source_key,
        )
        self.db.add(source_link)
        self.db.commit()
        self.db.refresh(source_link)
        return source_link

    def update_source_link(
        self, current_source_link: SourceLink, payload: SourceLinkUpdate
    ) -> SourceLink:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(current_source_link, field, value)
        current_source_link.updated_at = utc_now()
        self.db.add(current_source_link)
        self.db.commit()
        self.db.refresh(current_source_link)
        return current_source_link

    def delete_source_link(self, current_source_link: SourceLink) -> None:
        self.db.delete(current_source_link)
        self.db.commit()

    def list_job_events(self, job_id: int) -> list[JobEvent]:
        query = (
            select(JobEvent)
            .where(JobEvent.job_id == job_id)
            .order_by(desc(JobEvent.event_at), desc(JobEvent.id))
        )
        return list(self.db.scalars(query).all())

    def create_job_event(
        self, job_id: int, payload: JobEventCreate, *, commit: bool = True
    ) -> JobEvent:
        event = JobEvent(
            job_id=job_id,
            event_type=payload.event_type,
            notes=payload.notes,
            event_at=payload.event_at or utc_now(),
        )
        self.db.add(event)
        if commit:
            self.db.commit()
            self.db.refresh(event)
        return event
