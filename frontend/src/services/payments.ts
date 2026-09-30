import api from "./api"

export interface Payment {
  id: number
  invoice_id: number
  amount: number
  payment_method: string
  status: string
  paid_at: string
}

export interface PaymentCreate {
  invoice_id: number
  amount: number
  payment_method: string
}

export async function getPayments(): Promise<Payment[]> {
  const response = await api.get<Payment[]>("/payments/")
  return response.data
}

export async function createPayment(
  data: PaymentCreate
): Promise<Payment> {
  const response = await api.post<Payment>("/payments/", data)
  return response.data
}