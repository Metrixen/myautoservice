from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/", summary="Root status")
def root():
    settings = get_settings()
    return {"message": f"{settings.app_name} is running"}


@router.get("/health", summary="Liveness probe")
def health():
    return {"status": "ok"}
