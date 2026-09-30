import { useEffect, useState } from "react"
import {
  Activity,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react"

import {
  getAuditLogs,
  type AuditLog,
} from "../../services/auditLogs"

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadLogs() {
    try {
      setLoading(true)
      setError("")

      const data = await getAuditLogs()
      setLogs(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load audit logs.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

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
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track important activity across DineOps
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Activities
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {logs.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Users Involved
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {
                  new Set(
                    logs
                      .filter((log) => log.user_id !== null)
                      .map((log) => log.user_id)
                  ).size
                }
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <User size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Latest Activity
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-900">
                {logs.length > 0
                  ? formatDate(logs[0].created_at)
                  : "No activity"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* Logs */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Activity History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent actions recorded by the system
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading audit logs...
            </div>

          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <FileText size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No audit logs
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              System activity will appear here when audit records are created.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Activity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Entity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50/70"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Activity size={17} />
                        </div>

                        <div>
                          <p className="font-medium capitalize text-gray-900">
                            {log.action}
                          </p>

                          <p className="text-xs text-gray-400">
                            Log #{log.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4">

                      <p className="text-sm font-medium capitalize text-gray-700">
                        {log.entity_type}
                      </p>

                      {log.entity_id !== null && (
                        <p className="text-xs text-gray-400">
                          ID #{log.entity_id}
                        </p>
                      )}

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.user_id !== null
                        ? `User #${log.user_id}`
                        : "System"}
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-gray-600">
                      {log.description || "—"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(log.created_at)}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default AuditLogs