import api from "./api"

export interface Product {
  id: number
  name: string
  sku: string
  description: string | null
  price: number
  category_id: number
  is_active: boolean
}

export interface ProductCreate {
  name: string
  sku: string
  description?: string
  price: number
  category_id: number
}

export interface ProductUpdate {
  name?: string
  sku?: string
  description?: string
  price?: number
  category_id?: number
  is_active?: boolean
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/")
  return response.data
}

export async function createProduct(
  product: ProductCreate
): Promise<Product> {
  const response = await api.post<Product>("/products/", product)
  return response.data
}

export async function updateProduct(
  id: number,
  product: ProductUpdate
): Promise<Product> {
  const response = await api.put<Product>(
    `/products/${id}`,
    product
  )

  return response.data
}