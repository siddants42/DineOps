from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_manager
from app.db.session import get_db
from app.models.invoice import Invoice
from app.models.sales_order import SalesOrder
from app.models.user import User
from app.schemas.invoice import InvoiceCreate, InvoiceResponse


router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"],
)


@router.get(
    "/",
    response_model=list[InvoiceResponse],
)
def get_invoices(
    db: Session = Depends(get_db),
):
    return db.query(Invoice).all()


@router.get(
    "/{invoice_id}",
    response_model=InvoiceResponse,
)
def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    invoice = (
        db.query(Invoice)
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found",
        )

    return invoice


@router.post(
    "/",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    sales_order = (
        db.query(SalesOrder)
        .filter(SalesOrder.id == invoice_data.sales_order_id)
        .first()
    )

    if not sales_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales order not found",
        )

    existing_invoice = (
        db.query(Invoice)
        .filter(
            Invoice.sales_order_id
            == invoice_data.sales_order_id
        )
        .first()
    )

    if existing_invoice:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invoice already exists for this sales order",
        )

    invoice_number = f"INV-{sales_order.id:06d}"

    invoice = Invoice(
        sales_order_id=sales_order.id,
        invoice_number=invoice_number,
        status="unpaid",
        total_amount=sales_order.total_amount,
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return invoice