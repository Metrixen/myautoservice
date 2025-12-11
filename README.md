MyAutoService Backend
=====================

A lightweight FastAPI backend. Current functionality: a root health route returning a simple status message.

Setup
-----
- Ensure Python 3.12+ is available.
- Create/activate a virtual environment: `python3 -m venv backend/venv && source backend/venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`

Configuration
-------------
- Environment variables are loaded from `.env` if present.
- `DATABASE_URL`: SQLAlchemy connection string. Defaults to `sqlite:///./myautoservice.db` for local development.
- `ALLOWED_ORIGINS`: Comma-separated list for CORS. Defaults to `*`.
- `APP_NAME`: Overrides the FastAPI title shown in the docs.

Run the API
-----------
- From the repo root: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`
- Default dev server: http://127.0.0.1:8000/ (root GET returns a JSON status).

Available Routers (MVP)
-----------------------
- `GET /` and `GET /health` — health checks.
- `POST/GET /shops` — manage shops.
- `POST /customers`, `GET /customers/{id}` — manage customers.
- `POST/GET /vehicles` and `GET /vehicles/{id}` — create/search vehicles; enforce plate uniqueness.
- `GET /vehicles/{id}/owners` — ownership history.
- `POST /vehicles/{id}/visits`, `GET /vehicles/{id}/visits` — add and list service visits + line items.
- `GET /vehicles/{id}/reminders` and `POST /vehicles/{id}/reminders/preview` — view reminders and calculate next-due suggestion from mileage deltas.
- `POST/GET /appointments` — request and list appointment slots.

Project Structure
-----------------
- `backend/app/main.py` — FastAPI app entrypoint and routes.
- `backend/app/database/` — database configuration (placeholder).
- `backend/app/models/` — ORM models (placeholder).
- `backend/app/routers/` — modular API routers (placeholder).
- `backend/app/schemas/` — Pydantic schemas (placeholder).

Notes
-----
- Add environment variables (e.g., DB credentials) via `.env` when database work begins.
