from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.customer import CustomerRead


class VehicleBase(BaseModel):
    plate: str = Field(..., max_length=20)
    make: str | None = Field(default=None, max_length=100)
    model: str | None = Field(default=None, max_length=100)
    year: int | None = None
    vin: str | None = Field(default=None, max_length=50)
    shop_id: int
    current_owner_id: int | None = None


class VehicleCreate(VehicleBase):
    pass


class VehicleRead(VehicleBase):
    id: int
    first_seen_at: datetime
    last_seen_at: datetime | None = None
    current_owner: CustomerRead | None = None

    model_config = {"from_attributes": True}


class VehicleOwnerHistoryRead(BaseModel):
    id: int
    customer: CustomerRead
    start_date: datetime
    end_date: datetime | None = None
    note: str | None = None

    model_config = {"from_attributes": True}
