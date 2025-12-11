from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models import Appointment, AppointmentStatus, Shop, User, Vehicle
from app.schemas.appointment import AppointmentCreate, AppointmentRead

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("", response_model=AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Appointment:
    vehicle = db.get(Vehicle, payload.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    shop = db.get(Shop, payload.shop_id)
    if not shop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shop not found")

    if vehicle.shop_id != payload.shop_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is not associated with this shop",
        )

    appointment = Appointment(**payload.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("", response_model=list[AppointmentRead])
def list_appointments(
    shop_id: int | None = None,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Appointment]:
    query = db.query(Appointment)
    if shop_id:
        query = query.filter(Appointment.shop_id == shop_id)
    return query.order_by(Appointment.requested_slot.desc()).all()
