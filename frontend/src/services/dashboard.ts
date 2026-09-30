import api from "./api"
import type { DashboardAnalytics } from "../types"
import type { DashboardData } from "../types"

export type { DashboardData } from "../types"

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard/")
  return response.data
}


export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const response = await api.get<DashboardAnalytics>("/dashboard/analytics")
  return response.data
}
