from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class InventoryCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=0, ge=0)
    minimum_stock: int = Field(default=10, ge=0)


class InventoryUpdate(BaseModel):
    minimum_stock: int | None = Field(default=None, ge=0)


class StockAdjustment(BaseModel):
    quantity: int = Field(..., gt=0)


class InventoryResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    minimum_stock: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)