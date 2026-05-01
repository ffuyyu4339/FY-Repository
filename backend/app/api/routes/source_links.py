from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.api.deps import get_job_repository
from app.repositories.jobs import JobRepository
from app.schemas.source_link import SourceLinkCreate, SourceLinkRead, SourceLinkUpdate

router = APIRouter()


def get_source_link_or_404(repository: JobRepository, source_link_id: int):
    source_link = repository.get_source_link(source_link_id)
    if source_link is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="来源链接不存在",
        )
    return source_link


@router.get("/source-links", response_model=list[SourceLinkRead])
def list_source_links(
    include_disabled: bool = Query(default=False),
    repository: JobRepository = Depends(get_job_repository),
) -> list[SourceLinkRead]:
    return repository.list_source_links(include_disabled=include_disabled)


@router.post(
    "/source-links",
    response_model=SourceLinkRead,
    status_code=status.HTTP_201_CREATED,
)
def create_source_link(
    payload: SourceLinkCreate,
    repository: JobRepository = Depends(get_job_repository),
) -> SourceLinkRead:
    return repository.create_source_link(payload)


@router.put("/source-links/{source_link_id}", response_model=SourceLinkRead)
def update_source_link(
    source_link_id: int,
    payload: SourceLinkUpdate,
    repository: JobRepository = Depends(get_job_repository),
) -> SourceLinkRead:
    source_link = get_source_link_or_404(repository, source_link_id)
    return repository.update_source_link(source_link, payload)


@router.delete("/source-links/{source_link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_source_link(
    source_link_id: int,
    repository: JobRepository = Depends(get_job_repository),
) -> Response:
    source_link = get_source_link_or_404(repository, source_link_id)
    repository.delete_source_link(source_link)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
