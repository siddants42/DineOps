from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.users import router as users_router
from app.api.v1.endpoints.roles import router as roles_router
from app.api.v1.endpoints.categories import router as categories_router
from app.api.v1.endpoints.products import router as products_router
from app.api.v1.endpoints.inventory import router as inventory_router
from app.api.v1.endpoints.suppliers import router as suppliers_router
from app.api.v1.endpoints.purchase_orders import (
    router as purchase_orders_router,
)
from app.api.v1.endpoints.customers import router as customers_router
from app.api.v1.endpoints.sales_orders import router as sales_orders_router
from app.api.v1.endpoints.invoices import router as invoices_router
from app.api.v1.endpoints.payments import router as payments_router
from app.api.v1.endpoints.audit_logs import router as audit_logs_router
from app.api.v1.endpoints.notifications import router as notifications_router
from app.api.v1.endpoints.dashboard import router as dashboard_router
from app.api.v1.endpoints.reports import router as reports_router

from app.db.session import get_db


app = FastAPI(
    title="DineOps API",
    description="Restaurant & Cloud Kitchen Operations ERP",
    version="0.1.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication & Users
app.include_router(
    users_router,
    prefix="/api/v1",
)

app.include_router(
    auth_router,
    prefix="/api/v1",
)

app.include_router(
    roles_router,
    prefix="/api/v1",
)


# Products & Categories
app.include_router(
    categories_router,
    prefix="/api/v1",
)

app.include_router(
    products_router,
    prefix="/api/v1",
)


# Inventory & Suppliers
app.include_router(
    inventory_router,
    prefix="/api/v1",
)

app.include_router(
    suppliers_router,
    prefix="/api/v1",
)


# Purchase Orders
app.include_router(
    purchase_orders_router,
    prefix="/api/v1",
)


# Customers & Sales
app.include_router(
    customers_router,
    prefix="/api/v1",
)

app.include_router(
    sales_orders_router,
    prefix="/api/v1",
)


# Invoices & Payments
app.include_router(
    invoices_router,
    prefix="/api/v1",
)

app.include_router(
    payments_router,
    prefix="/api/v1",
)


# Audit & Notifications
app.include_router(
    audit_logs_router,
    prefix="/api/v1",
)

app.include_router(
    notifications_router,
    prefix="/api/v1",
)


# Dashboard & Reports
app.include_router(
    dashboard_router,
    prefix="/api/v1",
)

app.include_router(
    reports_router,
    prefix="/api/v1",
)


# Health Check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DineOps API",
    }


# Database Health Check
@app.get("/health/database")
def database_health_check(
    db: Session = Depends(get_db),
):
    result = db.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
        "result": result.scalar(),
    }