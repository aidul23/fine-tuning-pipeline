"""In-memory store for MVP. Replace with PostgreSQL + object storage in production."""

from datetime import datetime
from typing import Optional

_datasets: dict[str, dict] = {}
_jobs: dict[str, dict] = {}
_models: dict[str, dict] = {}

def _id(prefix: str) -> str:
    import uuid
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def dataset_create(name: str, file_path: str) -> dict:
    id = _id("ds")
    _datasets[id] = {
        "id": id,
        "name": name or id,
        "file_path": file_path,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    return _datasets[id]


def dataset_list() -> list[dict]:
    return list(_datasets.values())


def dataset_get(id: str) -> Optional[dict]:
    return _datasets.get(id)


def dataset_delete(id: str) -> bool:
    if id in _datasets:
        del _datasets[id]
        return True
    return False


def job_create(dataset_id: str, base_model: str, config: dict) -> dict:
    id = _id("job")
    _jobs[id] = {
        "id": id,
        "dataset_id": dataset_id,
        "base_model": base_model,
        "status": "Queued",
        "progress": 0,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    # In MVP, simulate completion after a moment (no real worker)
    # In production: enqueue to Celery and worker updates status
    return _jobs[id]


def job_list() -> list[dict]:
    return list(_jobs.values())


def job_get(id: str) -> Optional[dict]:
    return _jobs.get(id)


def job_update_status(id: str, status: str, progress: int = 0) -> bool:
    if id in _jobs:
        _jobs[id]["status"] = status
        _jobs[id]["progress"] = progress
        if status == "Completed":
            # Create a model entry for this job
            model_id = _id("model")
            _models[model_id] = {
                "id": model_id,
                "job_id": id,
                "base_model": _jobs[id]["base_model"],
                "adapter_path": f"storage/models/{model_id}/adapter",
                "created_at": datetime.utcnow().isoformat() + "Z",
            }
        return True
    return False


def model_list() -> list[dict]:
    return list(_models.values())


def model_get(id: str) -> Optional[dict]:
    return _models.get(id)
