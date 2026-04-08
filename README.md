# Fine-Tuning Platform (v1 MVP)

Web-based platform to select a base model, upload a dataset, run LoRA fine-tuning, and chat with or download the fine-tuned model.

## Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Glass UI
- **Backend:** FastAPI
- **Persistence:** SQLAlchemy + **SQLite** by default (`backend/data/ft.db`); set `DATABASE_URL` for **PostgreSQL**. Dataset files on **local disk** under `backend/storage/datasets/`.
- **Workers:** Placeholder (add Redis + Celery + GPU worker for real training)

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
# optional: cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run `uvicorn` from the `backend` directory so default paths (`./data`, `./storage`) resolve correctly.

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

Optional: set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local` if the API is not on the same host.

## Configuration (backend)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./data/ft.db` | PostgreSQL: `postgresql+psycopg2://user:pass@host/dbname` |
| `STORAGE_ROOT` | `./storage` | Dataset files and future model artifacts |

See `backend/.env.example`.

## Project layout

```
ft/
├── frontend/          # Next.js app (Glass UI)
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── tables.py  # SQLAlchemy models
│   │   ├── crud.py
│   │   └── routers/
│   ├── data/          # SQLite DB (gitignored, created at runtime)
│   ├── storage/       # Uploaded datasets (gitignored)
│   └── requirements.txt
└── README.md
```

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | /datasets | List datasets |
| POST | /datasets/upload | Upload JSONL dataset |
| DELETE | /datasets/{id} | Delete dataset |
| POST | /finetune/jobs | Create training job |
| GET | /finetune/jobs | List jobs |
| GET | /finetune/jobs/{id} | Job status |
| GET | /models | List fine-tuned models |
| GET | /models/{id}/download | Download model (MVP: placeholder) |
| POST | /chat/{model_id} | Chat with model (MVP: echo) |

## Supported models (v1)

- TinyLlama/TinyLlama-1.1B
- Qwen/Qwen-0.5B
- HuggingFaceTB/SmolLM-1B

## Dataset format

JSONL with per-line JSON:

```json
{"instruction": "Explain gravity", "input": "", "output": "Gravity is the force..."}
```

## Limitations (current)

- No real GPU training (jobs are created but not executed by a worker).
- Chat returns a placeholder response until an inference service is wired.
- Download returns JSON placeholder; no real adapter files yet.
- Datasets and metadata **persist** across restarts (SQLite + files). Next: Redis + Celery + GPU worker, then vLLM/TGI for inference.
