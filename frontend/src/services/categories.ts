import api from "./api"

export interface Category {
  id: number
  name: string
  description: string | null
  is_active: boolean
  created_at: boolean
}

export interface CategoryCreate {
  name: string
  description?: string
}

export interface CategoryUpdate {
  name?: string
  description?: string
  is_active?: boolean
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories/")
  return response.data
}

export async function createCategory(
  category: CategoryCreate
): Promise<Category> {
  const response = await api.post<Category>(
    "/categories/",
    category
  )

  return response.data
}

export async function updateCategory(
  id: number,
  category: CategoryUpdate
): Promise<Category> {
  const response = await api.put<Category>(
    `/categories/${id}`,
    category
  )

  return response.data
}