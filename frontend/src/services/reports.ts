import api from "./api"

export interface SalesReport {
  total_orders: number
  total_sales: number
  completed_orders: number
  pending_orders: number
}

export async function getSalesReport(): Promise<SalesReport> {
  const response = await api.get<SalesReport>("/reports/sales")
  return response.data
}