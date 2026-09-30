from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SalesOrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: Decimal = Field(..., gt=0)


class SalesOrderCreate(BaseModel):
    customer_id: int
    items: list[SalesOrderItemCreate] = Field(..., min_length=1)


class SalesOrderStatusUpdate(BaseModel):
    status: str


class SalesOrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = ConfigDict(from_attributes=True)


class SalesOrderResponse(BaseModel):
    id: int
    customer_id: int
    status: str
    total_amount: Decimal
    created_at: datetime
    items: list[SalesOrderItemResponse]

    model_config = ConfigDict(from_attributes=True)