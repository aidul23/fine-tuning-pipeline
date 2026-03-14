from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import datasets, finetune, models, chat

app = FastAPI(
    title="Fine-Tuning Platform API",
    description="API for the Fine-Tuning Platform (v1 MVP)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
app.include_router(finetune.router, prefix="/finetune", tags=["finetune"])
app.include_router(models.router, prefix="/models", tags=["models"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])


@app.get("/health")
def health():
    return {"status": "ok"}
