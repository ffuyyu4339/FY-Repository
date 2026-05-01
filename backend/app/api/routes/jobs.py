from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.deps import get_job_repository
from app.repositories.jobs import JobRepository
from app.schemas.job import JobCreate, JobRead, JobUpdate
from app.schemas.job_event import JobEventCreate, JobEventRead

SortField = Literal["updated_at", "match_score"]
SortOrder = Literal["asc", "desc"]
StatusGroup = Literal["interviewing"]

router = APIRouter()


def get_job_or_404(repository: JobRepository, job_id: int):
    job = repository.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="岗位不存在")
    return job


@router.get("/jobs", response_model=list[JobRead])
def list_jobs(
    q: str | None = Query(default=None),
    city: str | None = Query(default=None),
    track: str | None = Query(default=None),
    match_level: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    status_group: StatusGroup | None = Query(default=None),
    sort_by: SortField = Query(default="updated_at"),
    sort_order: SortOrder = Query(default="desc"),
    repository: JobRepository = Depends(get_job_repository),
) -> list[JobRead]:
    return repository.list_jobs(
        q=q,
        city=city,
        track=track,
        match_level=match_level,
        status=status_filter,
        status_group=status_group,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.post("/jobs", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    repository: JobRepository = Depends(get_job_repository),
) -> JobRead:
    return repository.create_job(payload)


@router.get("/jobs/{job_id}", response_model=JobRead)
def get_job(
    job_id: int, repository: JobRepository = Depends(get_job_repository)
) -> JobRead:
    return get_job_or_404(repository, job_id)


@router.put("/jobs/{job_id}", response_model=JobRead)
def update_job(
    job_id: int,
    payload: JobUpdate,
    repository: JobRepository = Depends(get_job_repository),
) -> JobRead:
    current_job = get_job_or_404(repository, job_id)
    return repository.update_job(current_job, payload)


@router.delete("/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: int,
    repository: JobRepository = Depends(get_job_repository),
) -> Response:
    current_job = get_job_or_404(repository, job_id)
    repository.delete_job(current_job)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/jobs/{job_id}/events", response_model=list[JobEventRead])
def list_job_events(
    job_id: int,
    repository: JobRepository = Depends(get_job_repository),
) -> list[JobEventRead]:
    get_job_or_404(repository, job_id)
    return repository.list_job_events(job_id)


@router.post(
    "/jobs/{job_id}/events",
    response_model=JobEventRead,
    status_code=status.HTTP_201_CREATED,
)
def create_job_event(
    job_id: int,
    payload: JobEventCreate,
    repository: JobRepository = Depends(get_job_repository),
) -> JobEventRead:
    get_job_or_404(repository, job_id)
    return repository.create_job_event(job_id, payload)
