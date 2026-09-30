from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class InvoiceCreate(BaseModel):
    sales_order_id: int


class InvoiceResponse(BaseModel):
    id: int
    sales_order_id: int
    invoice_number: str
    status: str
    total_amount: Decimal
    issued_at: datetime

    model_config = ConfigDict(from_attributes=True)