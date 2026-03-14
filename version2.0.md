# Version 1 Status & Next Plan (v2.0)

## What Is Done (Version 1)

### Frontend
- **Stack:** Next.js 14 (App Router), React, Tailwind CSS, Glass UI (glassmorphism).
- **Pages:** Dashboard, Datasets, Fine-Tune, Jobs, Models, Chat.
- **UI:** Sidebar (desktop), mobile nav, footer (© and year only).
- **Features:** Dataset upload/list/delete, training config form, job list and detail, model list with Chat/Download, chat UI with model selector and message thread.
- **API client:** All backend endpoints called from the frontend.

### Backend
- **Stack:** FastAPI.
- **Endpoints:**
  - Datasets: `GET /datasets`, `POST /datasets/upload`, `DELETE /datasets/{id}`.
  - Jobs: `POST /finetune/jobs`, `GET /finetune/jobs`, `GET /finetune/jobs/{id}`.
  - Models: `GET /models`, `GET /models/{id}/download` (placeholder).
  - Chat: `POST /chat/{model_id}` (placeholder).
- **Storage:** In-memory only (no database, no persistent file storage).
- **Validation:** Base model allowlist (TinyLlama, Qwen-0.5B, SmolLM-1B), dataset file type/size checks.

### Not Done (By Design in v1)
- No GPU training worker: jobs are created but never run; status stays "Queued".
- No real inference: chat returns a placeholder.
- No real artifacts: download returns JSON placeholder; no adapter/merged model files.
- No persistence: all data is lost on backend restart.

---

## Where We Are

Version 1 delivers the **full user-facing product**: all screens and API contracts for the fine-tuning workflow. The **execution pipeline is not implemented**: no real training, no real inference, no persistent storage. The codebase is ready to plug in PostgreSQL, a job queue, a GPU worker, and an inference service.

---

## Next Plan (v2.0)

1. **Persistence**
   - Add **PostgreSQL** for datasets, jobs, and models metadata.
   - Add **object storage** (S3 / MinIO or local path) for dataset files and model artifacts (adapter, merged, tokenizer).

2. **Training pipeline**
   - Introduce **Redis** and **Celery** (or similar) for job queue.
   - Implement a **GPU worker** that: pulls jobs, loads dataset from storage, runs LoRA fine-tuning (e.g. Transformers + TRL + PEFT), saves adapter and config to storage, updates job status and creates model record.

3. **Inference**
   - Integrate an **inference service** (e.g. vLLM or Text Generation Inference) that loads base model + LoRA adapter.
   - Wire **Chat** endpoint to this service so responses are real model outputs.

4. **Download**
   - Serve real artifact URLs (signed S3/MinIO or direct stream) from `GET /models/{id}/download` for adapter and/or merged model.

5. **Optional later**
   - User authentication and per-user datasets/jobs/models.
   - Dataset validation (schema, sample preview).
   - Training logs and metrics in Jobs UI.
   - Quotas and rate limits.
