from datetime import date, datetime

from pydantic import BaseModel, Field

from app.models.reminder import ReminderStatus


class ReminderBase(BaseModel):
    due_date: date
    reason: str = Field(..., max_length=255)
    channel: str | None = Field(default=None, max_length=50)


class ReminderCreate(ReminderBase):
    status: ReminderStatus = ReminderStatus.PENDING


class ReminderRead(ReminderBase):
    id: int
    status: ReminderStatus
    sent_at: datetime | None = None

    model_config = {"from_attributes": True}


class ReminderPreviewResponse(BaseModel):
    suggested_due_date: date
    average_km_per_day: float
    km_interval: int
