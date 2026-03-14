from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import store

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/{model_id}")
def chat(model_id: str, body: ChatRequest):
    model = store.model_get(model_id)
    if not model:
        raise HTTPException(404, "Model not found")
    # MVP: echo-style response. Production: load base model + adapter and run inference (vLLM/TGI).
    return {
        "response": f"[MVP] Model {model_id} would reply to: \"{body.message}\". Connect an inference service for real responses."
    }
