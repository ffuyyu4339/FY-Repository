from fastapi import APIRouter, Depends

from app.api.deps import get_job_repository
from app.repositories.jobs import JobRepository
from app.schemas.preferences import PreferenceRead, PreferenceUpdate

router = APIRouter()


@router.get("/preferences", response_model=PreferenceRead)
def get_preferences(
    repository: JobRepository = Depends(get_job_repository),
) -> PreferenceRead:
    return repository.get_preferences()


@router.put("/preferences", response_model=PreferenceRead)
def update_preferences(
    payload: PreferenceUpdate,
    repository: JobRepository = Depends(get_job_repository),
) -> PreferenceRead:
    return repository.update_preferences(payload)
