import { useEffect, useState } from "react"
import {
  Bell,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react"

import {
  getNotifications,
  markNotificationRead,
  type Notification,
} from "../../services/notifications"

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadNotifications() {
    try {
      setLoading(true)
      setError("")

      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  async function handleMarkAsRead(id: number) {
    try {
      const updated = await markNotificationRead(id)

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? updated
            : notification
        )
      )
    } catch (err) {
      console.error(err)
      setError("Unable to mark notification as read.")
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your DineOps activity
          </p>
        </div>

        <button
          type="button"
          onClick={loadNotifications}
          className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Notifications
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Unread
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CheckCircle2 size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Notifications */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Recent Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Notifications for your account
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading notifications...
            </div>

          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <Bell size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No notifications
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              You're all caught up. New notifications will appear here.
            </p>

          </div>
        ) : (
          <div>

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 border-b border-gray-100 px-6 py-5 transition last:border-b-0 ${
                  notification.is_read
                    ? "bg-white"
                    : "bg-emerald-50/30"
                }`}
              >

                {/* Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    notification.is_read
                      ? "bg-gray-100 text-gray-500"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <Bell size={18} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <div className="flex items-center gap-2">

                        <h3
                          className={`text-sm ${
                            notification.is_read
                              ? "font-medium text-gray-700"
                              : "font-semibold text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.is_read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}

                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(notification.id)
                        }
                        className="flex shrink-0 items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <Check size={14} />
                        Mark as read
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  )
}

export default Notifications