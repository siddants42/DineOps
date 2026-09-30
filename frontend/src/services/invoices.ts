import api from "./api"

export interface Invoice {
  id: number
  sales_order_id: number
  invoice_number: string
  status: string
  total_amount: number
  issued_at: string
}

export async function getInvoice(
  id: number
): Promise<Invoice> {
  const response = await api.get<Invoice>(
    `/invoices/${id}`
  )

  return response.data
}

export async function getInvoices(): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>("/invoices/")
  return response.data
}