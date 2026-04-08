from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db

router = APIRouter()


@router.get("")
def list_models(db: Session = Depends(get_db)):
    return crud.model_list(db)


@router.get("/{model_id}/download")
def download_model(model_id: str, db: Session = Depends(get_db)):
    model = crud.model_get(db, model_id)
    if not model:
        raise HTTPException(404, "Model not found")
    return JSONResponse(
        content={
            "message": "Download not implemented in MVP",
            "adapter_path": model["adapter_path"],
        }
    )
