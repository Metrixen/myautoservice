from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Shop(Base):
    __tablename__ = "shops"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255))
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50))
    address: Mapped[Optional[str]] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    staff: Mapped[List["User"]] = relationship("User", back_populates="shop", cascade="all, delete")
    vehicles: Mapped[List["Vehicle"]] = relationship("Vehicle", back_populates="shop", cascade="all, delete")
    visits: Mapped[List["ServiceVisit"]] = relationship("ServiceVisit", back_populates="shop", cascade="all, delete")
    appointments: Mapped[List["Appointment"]] = relationship("Appointment", back_populates="shop", cascade="all, delete")
