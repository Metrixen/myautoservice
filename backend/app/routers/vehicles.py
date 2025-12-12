from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_current_user, get_db
from app.models import Customer, User, UserRole, Vehicle, VehicleOwnerHistory
from app.schemas.vehicle import VehicleCreate, VehicleOwnerHistoryRead, VehicleRead

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


def _require_shop_user(user: User) -> int:
    if user.role == UserRole.CUSTOMER or user.shop_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Shop membership required for this action",
        )
    return user.shop_id


def _get_customer_profile(db: Session, user: User) -> Customer | None:
    return db.execute(select(Customer).where(Customer.user_id == user.id)).scalar_one_or_none()


def _assert_vehicle_access(
    vehicle: Vehicle,
    user: User,
    customer_profile: Customer | None = None,
) -> None:
    if user.role == UserRole.CUSTOMER:
        if not customer_profile or vehicle.current_owner_id != customer_profile.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
        return

    shop_id = _require_shop_user(user)
    if vehicle.shop_id != shop_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")


@router.post("", response_model=VehicleRead, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Vehicle:
    shop_id = _require_shop_user(_current_user)
    if payload.shop_id != shop_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot create vehicle for another shop")

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

    vehicle = Vehicle(**payload.model_dump(exclude={"shop_id"}), shop_id=shop_id)
    vehicle.last_seen_at = datetime.utcnow()
    db.add(vehicle)
    db.flush()

    if payload.current_owner_id:
        owner = db.get(Customer, payload.current_owner_id)
        if not owner:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")
        if owner.shop_id != shop_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Owner belongs to a different shop",
            )
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
    owner_id: int | None = Query(default=None, description="Filter by current owner"),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Vehicle]:
    query = db.query(Vehicle).options(joinedload(Vehicle.current_owner))
    if plate:
        query = query.filter(Vehicle.plate.ilike(f"%{plate}%"))

    if _current_user.role == UserRole.CUSTOMER:
        customer_profile = _get_customer_profile(db, _current_user)
        if not customer_profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
        if owner_id and owner_id != customer_profile.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot view other customers' vehicles",
            )
        query = query.filter(Vehicle.current_owner_id == customer_profile.id)
        if shop_id:
            query = query.filter(Vehicle.shop_id == shop_id)
    else:
        scoped_shop_id = _require_shop_user(_current_user)
        if shop_id and shop_id != scoped_shop_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Cannot view other shops' vehicles"
            )
        query = query.filter(Vehicle.shop_id == scoped_shop_id)
        if owner_id:
            query = query.filter(Vehicle.current_owner_id == owner_id)

    return query.order_by(Vehicle.plate).all()


@router.get("/{vehicle_id}", response_model=VehicleRead)
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Vehicle:
    vehicle = (
        db.query(Vehicle)
        .options(joinedload(Vehicle.current_owner))
        .filter(Vehicle.id == vehicle_id)
        .first()
    )
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    customer_profile = None
    if _current_user.role == UserRole.CUSTOMER:
        customer_profile = _get_customer_profile(db, _current_user)
    _assert_vehicle_access(vehicle, _current_user, customer_profile)
    return vehicle


@router.get("/{vehicle_id}/owners", response_model=list[VehicleOwnerHistoryRead])
def get_owner_history(
    vehicle_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[VehicleOwnerHistory]:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    customer_profile = None
    if _current_user.role == UserRole.CUSTOMER:
        customer_profile = _get_customer_profile(db, _current_user)
    _assert_vehicle_access(vehicle, _current_user, customer_profile)
    history = (
        db.query(VehicleOwnerHistory)
        .options(joinedload(VehicleOwnerHistory.customer))
        .filter(VehicleOwnerHistory.vehicle_id == vehicle_id)
        .order_by(VehicleOwnerHistory.start_date.desc())
        .all()
    )
    return history
