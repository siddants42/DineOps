import api from "./api"

export interface SalesOrderItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
}

export interface SalesOrder {
  id: number
  customer_id: number
  status: string
  total_amount: number
  created_at: string
  items: SalesOrderItem[]
}

export interface SalesOrderItemCreate {
  product_id: number
  quantity: number
  unit_price: number
}

export interface SalesOrderCreate {
  customer_id: number
  items: SalesOrderItemCreate[]
}

export interface SalesOrderStatusUpdate {
  status: string
}

export async function getSalesOrders(): Promise<SalesOrder[]> {
  const response = await api.get<SalesOrder[]>(
    "/sales-orders/"
  )

  return response.data
}

export async function getSalesOrder(
  id: number
): Promise<SalesOrder> {
  const response = await api.get<SalesOrder>(
    `/sales-orders/${id}`
  )

  return response.data
}

export async function createSalesOrder(
  data: SalesOrderCreate
): Promise<SalesOrder> {
  const response = await api.post<SalesOrder>(
    "/sales-orders/",
    data
  )

  return response.data
}

export async function updateSalesOrderStatus(
  id: number,
  status: string
): Promise<SalesOrder> {
  const response = await api.put<SalesOrder>(
    `/sales-orders/${id}/status`,
    { status }
  )

  return response.data
}