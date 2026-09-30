from datetime import datetime, time
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.inventory import Inventory
from app.models.product import Product
from app.models.sales_order import SalesOrder
from app.models.user import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_products = db.query(func.count(Product.id)).scalar()
    total_customers = db.query(func.count(Customer.id)).scalar()
    total_orders = db.query(func.count(SalesOrder.id)).scalar()

    total_sales = (
        db.query(func.coalesce(func.sum(SalesOrder.total_amount), 0))
        .scalar()
    )

    pending_orders = (
        db.query(func.count(SalesOrder.id))
        .filter(SalesOrder.status == "pending")
        .scalar()
    )

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_sales": total_sales,
        "pending_orders": pending_orders,
    }

@router.get("/analytics")
def dashboard_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today_start = datetime.combine(datetime.utcnow().date(), time.min)
    today_sales = (
        db.query(func.coalesce(func.sum(SalesOrder.total_amount), 0))
        .filter(SalesOrder.created_at >= today_start)
        .scalar()
    )
    inventory_value = (
        db.query(func.coalesce(func.sum(Product.price * Inventory.quantity), 0))
        .join(Inventory, Inventory.product_id == Product.id)
        .scalar()
    )
    pending_payments = (
        db.query(func.coalesce(func.sum(Invoice.total_amount), 0))
        .filter(Invoice.status != "paid")
        .scalar()
    )
    low_stock_items = (
        db.query(func.count(Inventory.id))
        .filter(Inventory.quantity <= Inventory.minimum_stock)
        .scalar()
    )
    completed_orders = (
        db.query(func.count(SalesOrder.id))
        .filter(SalesOrder.status == "completed")
        .scalar()
    )
    return {
        "today_sales": Decimal(today_sales or 0),
        "inventory_value": Decimal(inventory_value or 0),
        "pending_payments": Decimal(pending_payments or 0),
        "low_stock_items": low_stock_items or 0,
        "completed_orders": completed_orders or 0,
    }
