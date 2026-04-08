from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import crud
from app.config import settings
from app.database import get_db

router = APIRouter()


@router.get("")
def list_datasets(db: Session = Depends(get_db)):
    return crud.dataset_list(db)


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    name: str | None = Form(None),
    db: Session = Depends(get_db),
):
    if not file.filename or not (
        file.filename.endswith(".jsonl") or file.filename.endswith(".json")
    ):
        raise HTTPException(400, "Only .jsonl or .json datasets are supported")
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 50MB)")

    settings.datasets_dir().mkdir(parents=True, exist_ok=True)
    ds_id = crud.new_dataset_id()
    dest = settings.datasets_dir() / f"{ds_id}.jsonl"
    dest.write_bytes(content)
    abs_path = str(dest.resolve())
    display_name = (name or file.filename).strip() or ds_id
    entry = crud.dataset_create(db, name=display_name, file_path=abs_path, dataset_id=ds_id)
    return {"dataset_id": entry["id"]}


@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str, db: Session = Depends(get_db)):
    if not crud.dataset_delete(db, dataset_id):
        raise HTTPException(404, "Dataset not found")
    return {"ok": True}
