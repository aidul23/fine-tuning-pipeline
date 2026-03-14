from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app import store

router = APIRouter()


@router.get("")
def list_models():
    return store.model_list()


@router.get("/{model_id}/download")
def download_model(model_id: str):
    model = store.model_get(model_id)
    if not model:
        raise HTTPException(404, "Model not found")
    # MVP: return a placeholder URL or 404. Production: signed S3 URL or stream from storage.
    return JSONResponse(
        content={"message": "Download not implemented in MVP", "adapter_path": model["adapter_path"]}
    )
