from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import chat, datasets, finetune, models


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.storage_root.mkdir(parents=True, exist_ok=True)
    settings.datasets_dir().mkdir(parents=True, exist_ok=True)
    settings.models_dir().mkdir(parents=True, exist_ok=True)
    if settings.database_url.startswith("sqlite"):
        raw = settings.database_url.replace("sqlite:///", "", 1)
        if raw and not raw.startswith(":memory:"):
            db_file = Path(raw)
            if not db_file.is_absolute():
                db_file = Path.cwd() / db_file
            db_file.parent.mkdir(parents=True, exist_ok=True)
    init_db()
    yield


app = FastAPI(
    title="Fine-Tuning Platform API",
    description="API for the Fine-Tuning Platform (v1 MVP)",
    version="1.0.0",
    lifespan=lifespan,
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
