from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/{model_id}")
def chat(model_id: str, body: ChatRequest, db: Session = Depends(get_db)):
    model = crud.model_get(db, model_id)
    if not model:
        raise HTTPException(404, "Model not found")
    return {
        "response": f"[MVP] Model {model_id} would reply to: \"{body.message}\". Connect an inference service for real responses."
    }
