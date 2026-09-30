from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.sales_order import SalesOrder
from app.models.user import User


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/sales")
def sales_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_orders = (
        db.query(func.count(SalesOrder.id))
        .scalar()
    )

    total_sales = (
        db.query(
            func.coalesce(
                func.sum(SalesOrder.total_amount),
                0,
            )
        )
        .scalar()
    )

    completed_orders = (
        db.query(func.count(SalesOrder.id))
        .filter(
            SalesOrder.status == "completed"
        )
        .scalar()
    )

    pending_orders = (
        db.query(func.count(SalesOrder.id))
        .filter(
            SalesOrder.status == "pending"
        )
        .scalar()
    )

    return {
        "total_orders": total_orders,
        "total_sales": total_sales,
        "completed_orders": completed_orders,
        "pending_orders": pending_orders,
    }