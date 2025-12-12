from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    full_name: str | None = Field(default=None, max_length=255)
    role: UserRole
    shop_id: int | None = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserRead(UserBase):
    id: int

    model_config = {"from_attributes": True}
