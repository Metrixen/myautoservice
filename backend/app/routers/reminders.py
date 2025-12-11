from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models import Reminder, ServiceVisit, Vehicle
from app.schemas.reminder import ReminderPreviewResponse, ReminderRead

router = APIRouter(prefix="/vehicles/{vehicle_id}/reminders", tags=["reminders"])

DEFAULT_KM_INTERVAL = 10000


@router.get("", response_model=list[ReminderRead])
def list_reminders(vehicle_id: int, db: Session = Depends(get_db)) -> list[Reminder]:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return (
        db.query(Reminder)
        .filter(Reminder.vehicle_id == vehicle_id)
        .order_by(Reminder.due_date.desc(), Reminder.id.desc())
        .all()
    )


@router.post("/preview", response_model=ReminderPreviewResponse, status_code=status.HTTP_200_OK)
def preview_reminder(vehicle_id: int, db: Session = Depends(get_db)) -> ReminderPreviewResponse:
    vehicle = db.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

    visits = (
        db.query(ServiceVisit)
        .filter(ServiceVisit.vehicle_id == vehicle_id, ServiceVisit.mileage.isnot(None))
        .order_by(ServiceVisit.visit_date.desc(), ServiceVisit.id.desc())
        .limit(2)
        .all()
    )
    if len(visits) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Need at least two visits with mileage to calculate reminder",
        )

    latest, previous = visits[0], visits[1]
    km_delta = latest.mileage - previous.mileage
    days_delta = max((latest.visit_date - previous.visit_date).days, 1)

    if km_delta <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mileage must increase between visits to calculate usage",
        )

    average_km_per_day = km_delta / days_delta
    days_until_due = max(int(DEFAULT_KM_INTERVAL / average_km_per_day), 1)
    suggested_due_date = latest.visit_date.date() + timedelta(days=days_until_due)

    return ReminderPreviewResponse(
        suggested_due_date=suggested_due_date,
        average_km_per_day=round(average_km_per_day, 2),
        km_interval=DEFAULT_KM_INTERVAL,
    )
