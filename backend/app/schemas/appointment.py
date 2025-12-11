from datetime import datetime

from pydantic import BaseModel, Field

from app.models.appointment import AppointmentStatus


class AppointmentBase(BaseModel):
    vehicle_id: int
    shop_id: int
    requested_slot: datetime
    status: AppointmentStatus = AppointmentStatus.REQUESTED
    notes: str | None = Field(default=None, max_length=255)
    contact_channel: str | None = Field(default=None, max_length=50)


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRead(AppointmentBase):
    id: int

    model_config = {"from_attributes": True}
