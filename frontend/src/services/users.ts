import api from "./api"
import type { RoleRecord, UserRecord } from "../types"

export interface CreateUserPayload {
  email: string
  password: string
  full_name: string
  role_id?: number | null
}

export interface UpdateUserPayload {
  full_name?: string
  is_active?: boolean
  role_id?: number | null
}

export async function getUsers() {
  const response = await api.get<UserRecord[]>("/users/")
  return response.data
}

export async function getRoles() {
  const response = await api.get<RoleRecord[]>("/roles/")
  return response.data
}

export async function createUser(data: CreateUserPayload) {
  const response = await api.post<UserRecord>("/users/", data)
  return response.data
}

export async function updateUser(id: number, data: UpdateUserPayload) {
  const response = await api.put<UserRecord>(`/users/${id}`, data)
  return response.data
}
