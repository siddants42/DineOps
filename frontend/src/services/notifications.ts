import api from "./api"

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get<Notification[]>("/notifications/")
  return response.data
}

export async function markNotificationRead(
  id: number
): Promise<Notification> {
  const response = await api.put<Notification>(
    `/notifications/${id}/read`
  )

  return response.data
}