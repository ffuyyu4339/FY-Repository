from collections import Counter
from copy import deepcopy
from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_job_repository
from app.main import app
from app.schemas.dashboard import DashboardSummary, SkillFrequency, StatusCount, TrackCount
from app.schemas.job import JobCreate, JobRead, JobUpdate


class FakeJobRepository:
    def __init__(self) -> None:
        now = datetime.utcnow()
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
        self.next_id = 2

    def list_jobs(
        self,
        *,
        q=None,
        city=None,
        track=None,
        match_level=None,
        status=None,
        sort_by="updated_at",
        sort_order="desc",
    ):
        jobs = deepcopy(self.jobs)
        if q:
            jobs = [
                job
                for job in jobs
                if q.lower()
                in " ".join(
                    str(job.get(field) or "")
                    for field in [
                        "company_name",
                        "job_title",
                        "city",
                        "platform",
                        "notes",
                        "jd_raw_text",
                    ]
                ).lower()
            ]
        if city:
            jobs = [job for job in jobs if city in str(job.get("city") or "")]
        if track:
            jobs = [job for job in jobs if job["track"] == track]
        if match_level:
            jobs = [job for job in jobs if job["match_level"] == match_level]
        if status:
            jobs = [job for job in jobs if job["status"] == status]
        reverse = sort_order != "asc"
        jobs.sort(key=lambda item: item[sort_by], reverse=reverse)
        return [JobRead.model_validate(job) for job in jobs]

    def get_job(self, job_id: int):
        for job in self.jobs:
            if job["id"] == job_id:
                return JobRead.model_validate(job)
        return None

    def create_job(self, payload: JobCreate):
        now = datetime.utcnow()
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
                self.jobs[index] = {
                    **job,
                    **payload.model_dump(exclude_unset=True),
                    "updated_at": datetime.utcnow(),
                }
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
        top_jobs = sorted(self.jobs, key=lambda item: item["match_score"], reverse=True)[:top_n]
        return DashboardSummary(
            total_jobs=len(self.jobs),
            status_counts=[StatusCount(status=key, count=value) for key, value in counter_status.items()],
            track_counts=[TrackCount(track=key, count=value) for key, value in counter_track.items()],
            shanghai_jobs=sum(1 for job in self.jobs if "上海" in str(job.get("city") or "")),
            top_jobs=[JobRead.model_validate(job) for job in top_jobs],
            top_skills=[SkillFrequency(skill=key, count=value) for key, value in counter_skill.items()],
        )


@pytest.fixture
def fake_repository():
    repository = FakeJobRepository()
    app.dependency_overrides[get_job_repository] = lambda: repository
    yield repository
    app.dependency_overrides.clear()


@pytest.fixture
def client(fake_repository):
    yield TestClient(app)
