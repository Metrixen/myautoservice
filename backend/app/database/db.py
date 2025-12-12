from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings
from app.models import appointment, customer, reminder, service, shop, user, vehicle  # noqa: F401
from app.models.base import Base

settings = get_settings()

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(
    settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
    future=True,
    bind=engine,
)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _apply_sqlite_schema_patches()


def _apply_sqlite_schema_patches() -> None:
    if not settings.database_url.startswith("sqlite"):
        return

    with engine.begin() as conn:
        # Basic guard so local SQLite dev DBs pick up new nullable columns without migrations.
        # Production deployments should rely on real migrations before rolling out schema changes.
        user_columns = {
            row["name"] for row in conn.execute(text("PRAGMA table_info('users')")).mappings()
        }
        if "phone" not in user_columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(50)"))
        conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_phone ON users(phone)"))

        customer_columns = {
            row["name"] for row in conn.execute(text("PRAGMA table_info('customers')")).mappings()
        }
        if "user_id" not in customer_columns:
            conn.execute(text("ALTER TABLE customers ADD COLUMN user_id INTEGER"))
        conn.execute(
            text(
                "CREATE UNIQUE INDEX IF NOT EXISTS ix_customers_user_id ON customers(user_id)"
            )
        )
        if "shop_id" not in customer_columns:
            conn.execute(text("ALTER TABLE customers ADD COLUMN shop_id INTEGER"))
        conn.execute(
            text("CREATE INDEX IF NOT EXISTS ix_customers_shop_id ON customers(shop_id)")
        )
