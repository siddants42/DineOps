import api from "./api"

export interface Supplier {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
}

export interface SupplierCreate {
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface SupplierUpdate {
  name?: string
  email?: string
  phone?: string
  address?: string
  is_active?: boolean
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>("/suppliers/")
  return response.data
}

export async function createSupplier(
  data: SupplierCreate
): Promise<Supplier> {
  const response = await api.post<Supplier>("/suppliers/", data)
  return response.data
}

export async function updateSupplier(
  id: number,
  data: SupplierUpdate
): Promise<Supplier> {
  const response = await api.put<Supplier>(
    `/suppliers/${id}`,
    data
  )

  return response.data
}