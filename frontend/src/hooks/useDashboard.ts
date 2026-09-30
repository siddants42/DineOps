import { useCallback, useEffect, useState } from "react"
import {
  getDashboardData,
  getDashboardAnalytics,
} from "../services/dashboard"

import type {
  DashboardData,
  DashboardAnalytics,
} from "../types"

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [analytics, setAnalytics] =
    useState<DashboardAnalytics | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const [dashboardData, analyticsData] =
        await Promise.all([
          getDashboardData(),
          getDashboardAnalytics(),
        ])

      setData(dashboardData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error("Dashboard error:", err)
      setError("Unable to load dashboard data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    data,
    analytics,
    loading,
    error,
    refresh,
  }
}