from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class PaymentCreate(BaseModel):
    invoice_id: int
    amount: Decimal = Field(..., gt=0)
    payment_method: str


class PaymentResponse(BaseModel):
    id: int
    invoice_id: int
    amount: Decimal
    payment_method: str
    status: str
    paid_at: datetime

    model_config = ConfigDict(from_attributes=True)