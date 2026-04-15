from collections.abc import Generator

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.jobs import JobRepository


def get_job_repository(
    db: Session = Depends(get_db),
) -> Generator[JobRepository, None, None]:
    yield JobRepository(db)
