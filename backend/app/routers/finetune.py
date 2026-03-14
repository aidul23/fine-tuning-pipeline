from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import store

router = APIRouter()


class CreateJobRequest(BaseModel):
    base_model: str
    dataset_id: str
    epochs: int = 3
    learning_rate: float = 0.0002
    max_seq_length: int = 1024


@router.post("/jobs")
def create_job(body: CreateJobRequest):
    if not store.dataset_get(body.dataset_id):
        raise HTTPException(404, "Dataset not found")
    allowed = ["TinyLlama/TinyLlama-1.1B", "Qwen/Qwen-0.5B", "HuggingFaceTB/SmolLM-1B"]
    if body.base_model not in allowed:
        raise HTTPException(400, f"Base model must be one of: {allowed}")
    job = store.job_create(
        dataset_id=body.dataset_id,
        base_model=body.base_model,
        config={
            "epochs": body.epochs,
            "learning_rate": body.learning_rate,
            "max_seq_length": body.max_seq_length,
        },
    )
    return {"job_id": job["id"]}


@router.get("/jobs")
def list_jobs():
    return store.job_list()


@router.get("/jobs/{job_id}")
def get_job(job_id: str):
    job = store.job_get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job
