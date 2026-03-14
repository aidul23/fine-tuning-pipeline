from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app import store

router = APIRouter()


@router.get("")
def list_datasets():
    return store.dataset_list()


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    name: str | None = Form(None),
):
    # Validate: JSONL only for v1
    if not file.filename or not (file.filename.endswith(".jsonl") or file.filename.endswith(".json")):
        raise HTTPException(400, "Only .jsonl or .json datasets are supported")
    # Size limit (e.g. 50MB)
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 50MB)")
    file_path = f"storage/datasets/{file.filename}"
    # In MVP we don't persist to disk; use in-memory path. Production: write to S3/MinIO/local.
    entry = store.dataset_create(name=name or file.filename, file_path=file_path)
    return {"dataset_id": entry["id"]}


@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str):
    if not store.dataset_delete(dataset_id):
        raise HTTPException(404, "Dataset not found")
    return {"ok": True}
