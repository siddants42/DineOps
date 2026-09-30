import api from "./api"
import type { AuthUser, LoginResponse } from "../types"

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  })

  return response.data
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<any>("/auth/me")

  const data = response.data

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    name: data.full_name,
    is_active: data.is_active,
    role_id: data.role_id,
    role: data.role_name,
    role_name: data.role_name,
    created_at: data.created_at,
  }
}

export async function logout(): Promise<void> {
  // JWT logout is handled client-side by removing the token.
}