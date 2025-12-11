from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.database.db import init_db
from app.routers import appointments, auth, customers, health, reminders, shops, vehicles, visits

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(shops.router)
app.include_router(customers.router)
app.include_router(vehicles.router)
app.include_router(visits.router)
app.include_router(reminders.router)
app.include_router(appointments.router)
