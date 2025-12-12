from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.notifications import notify_customer_credentials
from app.core.security import generate_temporary_password, get_password_hash
from app.dependencies import get_current_user, get_db
from app.models import Customer, User, UserRole
from app.schemas.customer import CustomerCreate, CustomerRead

router = APIRouter(prefix="/customers", tags=["customers"])


def _require_shop_user(user: User) -> int:
    if user.role == UserRole.CUSTOMER or user.shop_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Shop membership required for this action",
        )
    return user.shop_id


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Customer:
    shop_id = _require_shop_user(_current_user)
    existing_customer = db.execute(select(Customer).where(Customer.phone == payload.phone)).scalar_one_or_none()
    if existing_customer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone already registered")

    existing_user = db.execute(select(User).where(User.phone == payload.phone)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone already registered")

    if payload.email:
        email_conflict = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
        if email_conflict:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    temp_password = generate_temporary_password()
    customer_user = User(
        phone=payload.phone,
        email=payload.email,
        full_name=f"{payload.first_name} {payload.last_name}".strip(),
        role=UserRole.CUSTOMER,
        shop_id=shop_id,
        hashed_password=get_password_hash(temp_password),
    )
    db.add(customer_user)
    db.flush()

    customer = Customer(**payload.model_dump(), user_id=customer_user.id, shop_id=shop_id)
    db.add(customer)
    db.commit()
    db.refresh(customer)

    notify_customer_credentials(payload.phone, temp_password, payload.email)
    return customer


@router.get("", response_model=list[CustomerRead])
def list_customers(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Customer]:
    shop_id = _require_shop_user(_current_user)
    return (
        db.query(Customer)
        .filter(Customer.shop_id == shop_id)
        .order_by(Customer.created_at.desc())
        .all()
    )


@router.get("/me", response_model=CustomerRead)
def get_my_customer_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Customer:
    def derive_customer_names(user: User) -> tuple[str, str]:
        if user.full_name:
            parts = user.full_name.strip().split(" ", 1)
            first = parts[0].strip()
            last = parts[1].strip() if len(parts) > 1 else ""
        else:
            first, last = "", ""

        if not first:
            first = user.phone or (user.email.split("@")[0] if user.email else "Customer")
        if not last:
            last = "Account"
        return first[:100], last[:100]

    customer = db.execute(select(Customer).where(Customer.user_id == current_user.id)).scalar_one_or_none()

    if customer:
        return customer

    if current_user.role != UserRole.CUSTOMER:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")

    match_conditions = []
    if current_user.phone:
        match_conditions.append(Customer.phone == current_user.phone)
    if current_user.email:
        match_conditions.append(Customer.email == current_user.email)

    if match_conditions:
        matched_customer = db.execute(
            select(Customer).where(or_(*match_conditions), Customer.user_id.is_(None))
        ).scalar_one_or_none()
        if matched_customer:
            if (
                matched_customer.shop_id
                and current_user.shop_id
                and matched_customer.shop_id != current_user.shop_id
            ):
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")
            matched_customer.user_id = current_user.id
            db.add(matched_customer)
            if not current_user.shop_id and matched_customer.shop_id:
                current_user.shop_id = matched_customer.shop_id
                db.add(current_user)
            db.commit()
            db.refresh(matched_customer)
            return matched_customer

    if not current_user.phone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")

    first_name, last_name = derive_customer_names(current_user)
    new_customer = Customer(
        first_name=first_name,
        last_name=last_name,
        phone=current_user.phone,
        email=current_user.email,
        user_id=current_user.id,
        shop_id=current_user.shop_id,
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer profile not found")


@router.get("/{customer_id}", response_model=CustomerRead)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Customer:
    shop_id = _require_shop_user(_current_user)
    customer = db.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    if customer.shop_id != shop_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer
