from datetime import datetime
from typing import List, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (UniqueConstraint("plate", name="uq_vehicle_plate"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    plate: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    vin: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    make: Mapped[Optional[str]] = mapped_column(String(100))
    model: Mapped[Optional[str]] = mapped_column(String(100))
    year: Mapped[Optional[int]] = mapped_column(Integer)

    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id", ondelete="CASCADE"), nullable=False)
    current_owner_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True
    )
    first_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    shop = relationship("Shop", back_populates="vehicles")
    current_owner = relationship("Customer", back_populates="vehicles")
    owners = relationship(
        "VehicleOwnerHistory",
        back_populates="vehicle",
        cascade="all, delete",
        order_by="VehicleOwnerHistory.start_date.desc()",
    )
    visits: Mapped[List["ServiceVisit"]] = relationship(
        "ServiceVisit", back_populates="vehicle", cascade="all, delete"
    )
    reminders: Mapped[List["Reminder"]] = relationship(
        "Reminder", back_populates="vehicle", cascade="all, delete"
    )
    appointments: Mapped[List["Appointment"]] = relationship(
        "Appointment", back_populates="vehicle", cascade="all, delete"
    )


class VehicleOwnerHistory(Base):
    __tablename__ = "vehicle_owner_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    note: Mapped[Optional[str]] = mapped_column(String(255))

    vehicle = relationship("Vehicle", back_populates="owners")
    customer = relationship("Customer", back_populates="owner_history")
