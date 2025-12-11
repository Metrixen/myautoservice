from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from app.models.service import ServiceType
from app.schemas.customer import CustomerRead
from app.schemas.user import UserRead


class ServiceLineItemCreate(BaseModel):
    description: str = Field(..., max_length=255)
    part_number: str | None = Field(default=None, max_length=100)
    cost: float | None = None


class ServiceLineItemRead(ServiceLineItemCreate):
    id: int

    model_config = {"from_attributes": True}


class ServiceVisitBase(BaseModel):
    visit_date: datetime | None = None
    mileage: int | None = Field(default=None, ge=0)
    service_type: ServiceType = ServiceType.OTHER
    notes: str | None = Field(default=None, max_length=500)
    mechanic_id: int | None = None
    customer_id: int | None = None


class ServiceVisitCreate(ServiceVisitBase):
    line_items: List[ServiceLineItemCreate] | None = None


class ServiceVisitRead(ServiceVisitBase):
    id: int
    vehicle_id: int
    shop_id: int
    created_at: datetime
    line_items: List[ServiceLineItemRead] = []
    mechanic: UserRead | None = None
    customer: CustomerRead | None = None

    model_config = {"from_attributes": True}
