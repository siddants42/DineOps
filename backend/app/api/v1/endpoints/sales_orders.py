from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_staff, require_manager
from app.db.session import get_db
from app.models.customer import Customer
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.sales_order import SalesOrder, SalesOrderItem
from app.models.user import User
from app.schemas.sales_order import (
    SalesOrderCreate,
    SalesOrderResponse,
    SalesOrderStatusUpdate,
)


router = APIRouter(
    prefix="/sales-orders",
    tags=["Sales Orders"],
)


@router.get(
    "/",
    response_model=list[SalesOrderResponse],
)
def get_sales_orders(
    db: Session = Depends(get_db),
):
    return db.query(SalesOrder).all()


@router.get(
    "/{sales_order_id}",
    response_model=SalesOrderResponse,
)
def get_sales_order(
    sales_order_id: int,
    db: Session = Depends(get_db),
):
    order = (
        db.query(SalesOrder)
        .filter(SalesOrder.id == sales_order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales order not found",
        )

    return order


@router.post(
    "/",
    response_model=SalesOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sales_order(
    order_data: SalesOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == order_data.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    sales_order = SalesOrder(
        customer_id=order_data.customer_id,
        status="pending",
        total_amount=Decimal("0.00"),
    )

    db.add(sales_order)
    db.flush()

    total_amount = Decimal("0.00")

    for item_data in order_data.items:
        product = (
            db.query(Product)
            .filter(Product.id == item_data.product_id)
            .first()
        )

        if not product:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item_data.product_id} not found",
            )

        inventory = (
            db.query(Inventory)
            .filter(
                Inventory.product_id == item_data.product_id
            )
            .first()
        )

        if not inventory:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No inventory found for product {item_data.product_id}",
            )

        if inventory.quantity < item_data.quantity:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {item_data.product_id}",
            )

        item_total = (
            item_data.unit_price * item_data.quantity
        )

        item = SalesOrderItem(
            sales_order_id=sales_order.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total_price=item_total,
        )

        inventory.quantity -= item_data.quantity

        db.add(item)
        total_amount += item_total

    sales_order.total_amount = total_amount

    db.commit()
    db.refresh(sales_order)

    return sales_order


@router.put(
    "/{sales_order_id}/status",
    response_model=SalesOrderResponse,
)
def update_sales_order_status(
    sales_order_id: int,
    status_data: SalesOrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager),
):
    order = (
        db.query(SalesOrder)
        .filter(SalesOrder.id == sales_order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sales order not found",
        )

    allowed_statuses = {
        "pending",
        "confirmed",
        "processing",
        "completed",
        "cancelled",
    }

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid sales order status",
        )

    order.status = status_data.status

    db.commit()
    db.refresh(order)

    return order