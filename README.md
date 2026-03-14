# Fine-Tuning Platform (v1 MVP)

Web-based platform to select a base model, upload a dataset, run LoRA fine-tuning, and chat with or download the fine-tuned model.

## Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Glass UI
- **Backend:** FastAPI
- **Storage/DB:** In-memory for MVP (replace with PostgreSQL + S3/MinIO for production)
- **Workers:** Placeholder (add Redis + Celery + GPU worker for real training)

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

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

## Project layout

```
ft/
├── frontend/          # Next.js app (Glass UI)
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── store.py   # In-memory store (MVP)
│   │   └── routers/
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

## Limitations (v1)

- No real GPU training (jobs are created but not executed by a worker).
- Chat returns a placeholder response until an inference service is wired.
- Download returns JSON placeholder; no adapter files stored.
- In-memory store; data is lost on restart.

Replace the store with PostgreSQL, add Celery + Redis and a GPU worker, and connect vLLM/TGI for inference to reach production.
