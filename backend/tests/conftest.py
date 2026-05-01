from collections import Counter
from copy import deepcopy
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_job_repository
from app.main import app
from app.schemas.dashboard import (
    DashboardSummary,
    SkillFrequency,
    StatusCount,
    TrackCount,
)
from app.schemas.job import JobCreate, JobRead, JobUpdate
from app.schemas.job_event import JobEventCreate, JobEventRead
from app.schemas.preferences import PreferenceRead, PreferenceUpdate
from app.schemas.source_link import SourceLinkCreate, SourceLinkRead, SourceLinkUpdate


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class FakeJobRepository:
    def __init__(self) -> None:
        now = utc_now()
        self.jobs = [
            {
                "id": 1,
                "company_name": "星图智能",
                "job_title": "AI 应用开发工程师",
                "city": "上海",
                "platform": "Boss",
                "job_link": "https://example.com/job-1",
                "salary_text": "25K-35K",
                "salary_min": 25,
                "salary_max": 35,
                "experience_required": "1-3年",
                "degree_required": "本科",
                "remote_allowed": False,
                "jd_raw_text": "负责 LLM、RAG 与 Agent 应用开发。",
                "skills_extracted": ["Python", "LLM", "RAG", "Agent"],
                "keywords": ["Python", "LLM", "RAG", "Agent"],
                "track": "ai_app_dev",
                "match_score": 88,
                "match_level": "priority_apply",
                "status": "ready_to_apply",
                "resume_version": "v3",
                "notes": "重点岗位",
                "created_at": now,
                "updated_at": now,
            }
        ]
        self.preferences = {
            "id": 1,
            "target_cities": ["上海", "远程"],
            "target_tracks": ["data_analyst", "ai_app_dev", "model_deployment"],
            "priority_skills": ["Python", "SQL", "LLM", "RAG", "Agent"],
            "min_salary": 18,
            "default_resume_version": "v1",
            "llm_enabled": False,
            "created_at": now,
            "updated_at": now,
        }
        self.source_links = [
            {
                "id": 1,
                "source_key": "boss_zhipin",
                "platform_name": "BOSS直聘",
                "title": "BOSS直聘职位搜索",
                "url": "https://www.zhipin.com/",
                "city": None,
                "track": None,
                "keywords": ["AI", "Python"],
                "enabled": True,
                "sort_order": 10,
                "created_at": now,
                "updated_at": now,
            }
        ]
        self.events = [
            {
                "id": 1,
                "job_id": 1,
                "event_type": "created",
                "notes": "创建岗位记录。",
                "event_at": now,
                "created_at": now,
            }
        ]
        self.next_id = 2
        self.next_source_link_id = 2
        self.next_event_id = 2

    def list_jobs(
        self,
        *,
        q=None,
        city=None,
        track=None,
        match_level=None,
        status=None,
        status_group=None,
        sort_by="updated_at",
        sort_order="desc",
    ):
        jobs = deepcopy(self.jobs)
        if q:
            keyword = q.lower()

            def job_search_text(job):
                return (
                    " ".join(
                        str(job.get(field) or "")
                        for field in [
                            "company_name",
                            "job_title",
                            "city",
                            "platform",
                            "notes",
                            "jd_raw_text",
                        ]
                    )
                    + " "
                    + " ".join(job.get("skills_extracted") or [])
                    + " "
                    + " ".join(job.get("keywords") or [])
                ).lower()

            jobs = [job for job in jobs if keyword in job_search_text(job)]
        if city:
            jobs = [job for job in jobs if city in str(job.get("city") or "")]
        if track:
            jobs = [job for job in jobs if job["track"] == track]
        if match_level:
            jobs = [job for job in jobs if job["match_level"] == match_level]
        if status:
            jobs = [job for job in jobs if job["status"] == status]
        elif status_group == "interviewing":
            jobs = [
                job
                for job in jobs
                if job["status"] in {"interview_1", "interview_2", "hr_interview"}
            ]
        reverse = sort_order != "asc"
        jobs.sort(key=lambda item: item[sort_by], reverse=reverse)
        return [JobRead.model_validate(job) for job in jobs]

    def get_job(self, job_id: int):
        for job in self.jobs:
            if job["id"] == job_id:
                return JobRead.model_validate(job)
        return None

    def create_job(self, payload: JobCreate):
        now = utc_now()
        job = payload.model_dump()
        job["id"] = self.next_id
        job["created_at"] = now
        job["updated_at"] = now
        self.next_id += 1
        self.jobs.append(job)
        return JobRead.model_validate(job)

    def update_job(self, current_job: JobRead, payload: JobUpdate):
        for index, job in enumerate(self.jobs):
            if job["id"] == current_job.id:
                update_data = payload.model_dump(exclude_unset=True)
                self.jobs[index] = {
                    **job,
                    **update_data,
                    "updated_at": utc_now(),
                }
                if "status" in update_data and update_data["status"] != job["status"]:
                    self.create_job_event(
                        job["id"],
                        JobEventCreate(
                            event_type=update_data["status"],
                            notes=(
                                f"状态从 {job['status']} "
                                f"更新为 {update_data['status']}。"
                            ),
                        ),
                    )
                return JobRead.model_validate(self.jobs[index])
        raise KeyError("job not found")

    def delete_job(self, current_job: JobRead):
        self.jobs = [job for job in self.jobs if job["id"] != current_job.id]

    def get_dashboard_summary(self, *, top_n: int = 5):
        counter_status = Counter(job["status"] for job in self.jobs)
        counter_track = Counter(job["track"] for job in self.jobs)
        counter_skill = Counter()
        for job in self.jobs:
            counter_skill.update(job.get("skills_extracted") or [])
        top_jobs = sorted(
            [
                job
                for job in self.jobs
                if job["status"] not in {"rejected", "archived"}
                and job["match_level"] != "ignore"
            ],
            key=lambda item: item["match_score"],
            reverse=True,
        )[:top_n]
        return DashboardSummary(
            total_jobs=len(self.jobs),
            status_counts=[
                StatusCount(status=key, count=value)
                for key, value in counter_status.items()
            ],
            track_counts=[
                TrackCount(track=key, count=value)
                for key, value in counter_track.items()
            ],
            shanghai_jobs=sum(
                1 for job in self.jobs if "上海" in str(job.get("city") or "")
            ),
            top_jobs=[JobRead.model_validate(job) for job in top_jobs],
            top_skills=[
                SkillFrequency(skill=key, count=value)
                for key, value in counter_skill.items()
            ],
        )

    def get_preferences(self):
        return PreferenceRead.model_validate(self.preferences)

    def update_preferences(self, payload: PreferenceUpdate):
        self.preferences = {
            **self.preferences,
            **payload.model_dump(),
            "updated_at": utc_now(),
        }
        return PreferenceRead.model_validate(self.preferences)

    def list_source_links(self, *, include_disabled=False):
        links = deepcopy(self.source_links)
        if not include_disabled:
            links = [link for link in links if link["enabled"]]
        links.sort(key=lambda item: (item["sort_order"], item["id"]))
        return [SourceLinkRead.model_validate(link) for link in links]

    def get_source_link(self, source_link_id: int):
        for source_link in self.source_links:
            if source_link["id"] == source_link_id:
                return SourceLinkRead.model_validate(source_link)
        return None

    def create_source_link(self, payload: SourceLinkCreate):
        now = utc_now()
        source_link = payload.model_dump()
        source_link["id"] = self.next_source_link_id
        source_link["source_key"] = (
            source_link["source_key"] or f"custom_{self.next_source_link_id}"
        )
        source_link["created_at"] = now
        source_link["updated_at"] = now
        self.next_source_link_id += 1
        self.source_links.append(source_link)
        return SourceLinkRead.model_validate(source_link)

    def update_source_link(self, current_source_link, payload: SourceLinkUpdate):
        for index, source_link in enumerate(self.source_links):
            if source_link["id"] == current_source_link.id:
                self.source_links[index] = {
                    **source_link,
                    **payload.model_dump(exclude_unset=True),
                    "updated_at": utc_now(),
                }
                return SourceLinkRead.model_validate(self.source_links[index])
        raise KeyError("source link not found")

    def delete_source_link(self, current_source_link):
        self.source_links = [
            source_link
            for source_link in self.source_links
            if source_link["id"] != current_source_link.id
        ]

    def list_job_events(self, job_id: int):
        events = [event for event in self.events if event["job_id"] == job_id]
        events.sort(key=lambda item: (item["event_at"], item["id"]), reverse=True)
        return [JobEventRead.model_validate(event) for event in events]

    def create_job_event(self, job_id: int, payload: JobEventCreate, *, commit=True):
        now = utc_now()
        event = {
            "id": self.next_event_id,
            "job_id": job_id,
            "event_type": payload.event_type,
            "notes": payload.notes,
            "event_at": payload.event_at or now,
            "created_at": now,
        }
        self.next_event_id += 1
        self.events.append(event)
        return JobEventRead.model_validate(event)


@pytest.fixture
def fake_repository():
    repository = FakeJobRepository()
    app.dependency_overrides[get_job_repository] = lambda: repository
    yield repository
    app.dependency_overrides.clear()


@pytest.fixture
def client(fake_repository):
    yield TestClient(app)
