from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=50)
    email: EmailStr | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int
    shop_id: int | None = None

    model_config = {"from_attributes": True}
