from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Shop
from app.schemas.shop import ShopCreate, ShopRead

router = APIRouter(prefix="/shops", tags=["shops"])


@router.post("", response_model=ShopRead, status_code=status.HTTP_201_CREATED)
def create_shop(payload: ShopCreate, db: Session = Depends(get_db)) -> Shop:
    existing = db.query(Shop).filter(Shop.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Shop name already exists")

    shop = Shop(**payload.model_dump())
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop


@router.get("", response_model=list[ShopRead])
def list_shops(db: Session = Depends(get_db)) -> list[Shop]:
    return db.query(Shop).order_by(Shop.name).all()
