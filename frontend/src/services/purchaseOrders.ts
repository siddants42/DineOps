import api from "./api"

export interface PurchaseOrderItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
}

export interface PurchaseOrder {
  id: number
  supplier_id: number
  status: string
  total_amount: number
  created_at: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderItemCreate {
  product_id: number
  quantity: number
  unit_price: number
}

export interface PurchaseOrderCreate {
  supplier_id: number
  items: PurchaseOrderItemCreate[]
}

export interface PurchaseOrderStatusUpdate {
  status: string
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const response = await api.get<PurchaseOrder[]>(
    "/purchase-orders/"
  )

  return response.data
}

export async function getPurchaseOrder(
  id: number
): Promise<PurchaseOrder> {
  const response = await api.get<PurchaseOrder>(
    `/purchase-orders/${id}`
  )

  return response.data
}

export async function createPurchaseOrder(
  data: PurchaseOrderCreate
): Promise<PurchaseOrder> {
  const response = await api.post<PurchaseOrder>(
    "/purchase-orders/",
    data
  )

  return response.data
}

export async function updatePurchaseOrderStatus(
  id: number,
  status: string
): Promise<PurchaseOrder> {
  const response = await api.put<PurchaseOrder>(
    `/purchase-orders/${id}/status`,
    { status }
  )

  return response.data
}