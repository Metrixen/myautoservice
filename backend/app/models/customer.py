from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), index=True)
    shop_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("shops.id", ondelete="CASCADE"), nullable=True, index=True
    )
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    vehicles: Mapped[List["Vehicle"]] = relationship(
        "Vehicle", back_populates="current_owner", cascade="all, delete-orphan"
    )
    owner_history: Mapped[List["VehicleOwnerHistory"]] = relationship(
        "VehicleOwnerHistory", back_populates="customer", cascade="all, delete"
    )
    visits: Mapped[List["ServiceVisit"]] = relationship(
        "ServiceVisit", back_populates="customer", cascade="all, delete"
    )
    user_account: Mapped[Optional["User"]] = relationship(
        "User", back_populates="customer_profile", uselist=False
    )
    shop: Mapped[Optional["Shop"]] = relationship("Shop", back_populates="customers")
