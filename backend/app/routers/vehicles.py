from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db
from app.models import Customer, Vehicle, VehicleOwnerHistory
from app.schemas.vehicle import VehicleCreate, VehicleOwnerHistoryRead, VehicleRead

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.post("", response_model=VehicleRead, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)) -> Vehicle:
    existing = (
        db.query(Vehicle)
        .options(joinedload(Vehicle.current_owner))
        .filter(Vehicle.plate == payload.plate)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle with this plate already exists",
        )

    vehicle = Vehicle(**payload.model_dump())
    vehicle.last_seen_at = datetime.utcnow()
    db.add(vehicle)
    db.flush()

    if payload.current_owner_id:
        owner = db.get(Customer, payload.current_owner_id)
        if not owner:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")
        db.add(
            VehicleOwnerHistory(
                vehicle_id=vehicle.id,
                customer_id=owner.id,
                note="Set at vehicle creation",
            )
        )

    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("", response_model=list[VehicleRead])
def list_vehicles(
    plate: str | None = Query(default=None, description="Filter by license plate"),
    shop_id: int | None = Query(default=None, description="Filter by shop"),
    db: Session = Depends(get_db),
) -> list[Vehicle]:
    query = db.query(Vehicle).options(joinedload(Vehicle.current_owner))
    if plate:
        query = query.filter(Vehicle.plate.ilike(f"%{plate}%"))
    if shop_id:
        query = query.filter(Vehicle.shop_id == shop_id)
    return query.order_by(Vehicle.plate).all()


@router.get("/{vehicle_id}", response_model=VehicleRead)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)) -> Vehicle:
    vehicle = (
        db.query(Vehicle)
        .options(joinedload(Vehicle.current_owner))
        .filter(Vehicle.id == vehicle_id)
        .first()
    )
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return vehicle


@router.get("/{vehicle_id}/owners", response_model=list[VehicleOwnerHistoryRead])
def get_owner_history(vehicle_id: int, db: Session = Depends(get_db)) -> list[VehicleOwnerHistory]:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    history = (
        db.query(VehicleOwnerHistory)
        .options(joinedload(VehicleOwnerHistory.customer))
        .filter(VehicleOwnerHistory.vehicle_id == vehicle_id)
        .order_by(VehicleOwnerHistory.start_date.desc())
        .all()
    )
    return history
