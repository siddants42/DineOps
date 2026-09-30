import api from "./api"

export interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
}

export interface CustomerCreate {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface CustomerUpdate {
  name?: string
  email?: string
  phone?: string
  address?: string
  is_active?: boolean
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>("/customers/")
  return response.data
}

export async function getCustomer(id: number): Promise<Customer> {
  const response = await api.get<Customer>(`/customers/${id}`)
  return response.data
}

export async function createCustomer(
  data: CustomerCreate
): Promise<Customer> {
  const response = await api.post<Customer>("/customers/", data)
  return response.data
}

export async function updateCustomer(
  id: number,
  data: CustomerUpdate
): Promise<Customer> {
  const response = await api.put<Customer>(
    `/customers/${id}`,
    data
  )

  return response.data
}