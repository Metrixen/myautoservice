from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db
from app.models import ServiceLineItem, ServiceVisit, Vehicle
from app.schemas.service_visit import ServiceVisitCreate, ServiceVisitRead

router = APIRouter(prefix="/vehicles/{vehicle_id}/visits", tags=["service_visits"])


@router.post("", response_model=ServiceVisitRead, status_code=status.HTTP_201_CREATED)
def create_visit(
    vehicle_id: int, payload: ServiceVisitCreate, db: Session = Depends(get_db)
) -> ServiceVisit:
    vehicle = (
        db.query(Vehicle)
        .options(joinedload(Vehicle.current_owner))
        .filter(Vehicle.id == vehicle_id)
        .first()
    )
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    visit_date = payload.visit_date or datetime.utcnow()
    visit = ServiceVisit(
        vehicle_id=vehicle.id,
        shop_id=vehicle.shop_id,
        customer_id=payload.customer_id or vehicle.current_owner_id,
        mechanic_id=payload.mechanic_id,
        visit_date=visit_date,
        mileage=payload.mileage,
        service_type=payload.service_type,
        notes=payload.notes,
    )
    db.add(visit)
    db.flush()

    if payload.line_items:
        for item in payload.line_items:
            visit.line_items.append(ServiceLineItem(**item.model_dump()))

    vehicle.last_seen_at = visit_date
    db.commit()
    db.refresh(visit)
    return visit


@router.get("", response_model=list[ServiceVisitRead])
def list_visits(vehicle_id: int, db: Session = Depends(get_db)) -> list[ServiceVisit]:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    visits = (
        db.query(ServiceVisit)
        .options(
            joinedload(ServiceVisit.line_items),
            joinedload(ServiceVisit.mechanic),
            joinedload(ServiceVisit.customer),
        )
        .filter(ServiceVisit.vehicle_id == vehicle_id)
        .order_by(ServiceVisit.visit_date.desc(), ServiceVisit.id.desc())
        .all()
    )
    return visits
