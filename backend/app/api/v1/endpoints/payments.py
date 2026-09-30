from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager
from app.db.session import get_db
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentResponse


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def get_payments(
    db: Session = Depends(get_db),
):
    return db.query(Payment).all()


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )

    return payment


@router.post(
    "/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == payment_data.invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )

    if invoice.status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice is already fully paid",
        )

    existing_payments = (
        db.query(Payment)
        .filter(Payment.invoice_id == invoice.id)
        .all()
    )

    paid_amount = sum(
        (payment.amount for payment in existing_payments),
        Decimal("0.00"),
    )

    remaining_amount = (
        invoice.total_amount - paid_amount
    )

    if payment_data.amount > remaining_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment exceeds remaining invoice amount",
        )

    payment = Payment(
        invoice_id=invoice.id,
        amount=payment_data.amount,
        payment_method=payment_data.payment_method,
        status="completed",
    )

    db.add(payment)

    new_paid_amount = (
        paid_amount + payment_data.amount
    )

    if new_paid_amount >= invoice.total_amount:
        invoice.status = "paid"
    else:
        invoice.status = "partially_paid"

    db.commit()
    db.refresh(payment)

    return payment