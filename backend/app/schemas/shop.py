from pydantic import BaseModel, EmailStr, Field


class ShopBase(BaseModel):
    name: str = Field(..., max_length=255)
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, max_length=50)
    address: str | None = Field(default=None, max_length=255)


class ShopCreate(ShopBase):
    pass


class ShopRead(ShopBase):
    id: int

    model_config = {"from_attributes": True}
