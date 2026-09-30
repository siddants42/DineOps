import api from "./api"

export interface Inventory {
  id: number
  product_id: number
  quantity: number
  minimum_stock: number
  updated_at: string
}

export interface InventoryCreate {
  product_id: number
  quantity: number
  minimum_stock: number
}

export interface InventoryUpdate {
  minimum_stock?: number
}

export async function getInventory(): Promise<Inventory[]> {
  const response = await api.get<Inventory[]>("/inventory/")
  return response.data
}

export async function createInventory(
  data: InventoryCreate
): Promise<Inventory> {
  const response = await api.post<Inventory>("/inventory/", data)
  return response.data
}

export async function updateInventory(
  productId: number,
  data: InventoryUpdate
): Promise<Inventory> {
  const response = await api.put<Inventory>(
    `/inventory/${productId}`,
    data
  )

  return response.data
}

export async function stockIn(
  productId: number,
  quantity: number
): Promise<Inventory> {
  const response = await api.post<Inventory>(
    `/inventory/${productId}/stock-in`,
    { quantity }
  )

  return response.data
}

export async function stockOut(
  productId: number,
  quantity: number
): Promise<Inventory> {
  const response = await api.post<Inventory>(
    `/inventory/${productId}/stock-out`,
    { quantity }
  )

  return response.data
}