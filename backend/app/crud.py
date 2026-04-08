import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.tables import DatasetRecord, TrainedModel, TrainingJob


def _id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def new_dataset_id() -> str:
    return _id("ds")


def _iso(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat().replace("+00:00", "Z")


def dataset_to_dict(row: DatasetRecord) -> dict:
    return {
        "id": row.id,
        "name": row.name,
        "file_path": row.file_path,
        "created_at": _iso(row.created_at),
    }


def job_to_dict(row: TrainingJob) -> dict:
    return {
        "id": row.id,
        "dataset_id": row.dataset_id,
        "base_model": row.base_model,
        "status": row.status,
        "progress": row.progress,
        "created_at": _iso(row.created_at),
    }


def model_to_dict(row: TrainedModel) -> dict:
    return {
        "id": row.id,
        "job_id": row.job_id,
        "base_model": row.base_model,
        "adapter_path": row.adapter_path,
        "created_at": _iso(row.created_at),
    }


def dataset_create(db: Session, name: str, file_path: str, dataset_id: str | None = None) -> dict:
    ds_id = dataset_id or _id("ds")
    row = DatasetRecord(id=ds_id, name=name or ds_id, file_path=file_path)
    db.add(row)
    db.commit()
    db.refresh(row)
    return dataset_to_dict(row)


def dataset_list(db: Session) -> list[dict]:
    stmt = select(DatasetRecord).order_by(DatasetRecord.created_at.desc())
    rows = db.scalars(stmt).all()
    return [dataset_to_dict(r) for r in rows]


def dataset_get(db: Session, dataset_id: str) -> DatasetRecord | None:
    return db.get(DatasetRecord, dataset_id)


def dataset_delete(db: Session, dataset_id: str) -> bool:
    row = db.get(DatasetRecord, dataset_id)
    if not row:
        return False
    jobs = db.scalars(
        select(TrainingJob).where(TrainingJob.dataset_id == dataset_id)
    ).all()
    for job in jobs:
        models = db.scalars(
            select(TrainedModel).where(TrainedModel.job_id == job.id)
        ).all()
        for m in models:
            db.delete(m)
        db.delete(job)
    path = Path(row.file_path)
    if path.is_file():
        path.unlink()
    db.delete(row)
    db.commit()
    return True


def job_create(db: Session, dataset_id: str, base_model: str, config: dict) -> dict:
    row = TrainingJob(
        id=_id("job"),
        dataset_id=dataset_id,
        base_model=base_model,
        status="Queued",
        progress=0,
        config_json=json.dumps(config),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return job_to_dict(row)


def job_list(db: Session) -> list[dict]:
    stmt = select(TrainingJob).order_by(TrainingJob.created_at.desc())
    rows = db.scalars(stmt).all()
    return [job_to_dict(r) for r in rows]


def job_get(db: Session, job_id: str) -> dict | None:
    row = db.get(TrainingJob, job_id)
    return job_to_dict(row) if row else None


def job_update_status(db: Session, job_id: str, status: str, progress: int = 0) -> bool:
    row = db.get(TrainingJob, job_id)
    if not row:
        return False
    row.status = status
    row.progress = progress
    if status == "Completed":
        model_id = _id("model")
        adapter_rel = settings.models_dir() / model_id / "adapter"
        tm = TrainedModel(
            id=model_id,
            job_id=job_id,
            base_model=row.base_model,
            adapter_path=str(adapter_rel.resolve()),
        )
        db.add(tm)
    db.commit()
    return True


def model_list(db: Session) -> list[dict]:
    stmt = select(TrainedModel).order_by(TrainedModel.created_at.desc())
    rows = db.scalars(stmt).all()
    return [model_to_dict(r) for r in rows]


def model_get(db: Session, model_id: str) -> dict | None:
    row = db.get(TrainedModel, model_id)
    return model_to_dict(row) if row else None
