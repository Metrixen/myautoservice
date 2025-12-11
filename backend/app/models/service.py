from datetime import datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ServiceType(str, Enum):
    OIL_CHANGE = "oil_change"
    INSPECTION = "inspection"
    BRAKE_SERVICE = "brake_service"
    TIRE = "tire"
    OTHER = "other"


class ServiceVisit(Base):
    __tablename__ = "service_visits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    shop_id: Mapped[int] = mapped_column(ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[Optional[int]] = mapped_column(ForeignKey("customers.id", ondelete="SET NULL"))
    mechanic_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))

    visit_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    mileage: Mapped[Optional[int]] = mapped_column(Integer, index=True)
    service_type: Mapped[ServiceType] = mapped_column(SqlEnum(ServiceType), default=ServiceType.OTHER, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    vehicle = relationship("Vehicle", back_populates="visits")
    shop = relationship("Shop", back_populates="visits")
    customer = relationship("Customer", back_populates="visits")
    mechanic = relationship("User", back_populates="visits")
    line_items: Mapped[List["ServiceLineItem"]] = relationship(
        "ServiceLineItem", back_populates="visit", cascade="all, delete"
    )


class ServiceLineItem(Base):
    __tablename__ = "service_line_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    visit_id: Mapped[int] = mapped_column(ForeignKey("service_visits.id", ondelete="CASCADE"), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    part_number: Mapped[Optional[str]] = mapped_column(String(100))
    cost: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))

    visit = relationship("ServiceVisit", back_populates="line_items")
