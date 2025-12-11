import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv
from pydantic import BaseModel, Field


def _parse_origins(raw: str | None) -> List[str]:
    if not raw:
        return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


class Settings(BaseModel):
    app_name: str = Field(default_factory=lambda: os.getenv("APP_NAME", "MyAutoService API"))
    database_url: str = Field(
        default_factory=lambda: os.getenv(
            "DATABASE_URL", "sqlite:///./myautoservice.db"
        )
    )
    allowed_origins: List[str] = Field(
        default_factory=lambda: _parse_origins(os.getenv("ALLOWED_ORIGINS"))
    )
    jwt_secret_key: str = Field(default_factory=lambda: os.getenv("JWT_SECRET_KEY", "change-me"))
    jwt_algorithm: str = Field(default_factory=lambda: os.getenv("JWT_ALGORITHM", "HS256"))
    access_token_expire_minutes: int = Field(
        default_factory=lambda: int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    )


@lru_cache
def get_settings() -> Settings:
    load_dotenv()
    return Settings()
