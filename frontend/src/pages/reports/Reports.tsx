import { useEffect, useState } from "react"
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  RefreshCw,
  ShoppingCart,
} from "lucide-react"

import {
  getSalesReport,
  type SalesReport,
} from "../../services/reports"

const Reports = () => {
  const [report, setReport] = useState<SalesReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadReport() {
    try {
      setLoading(true)
      setError("")

      const data = await getSalesReport()
      setReport(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load sales report.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  const completionRate =
    report && report.total_orders > 0
      ? Math.round(
          (report.completed_orders /
            report.total_orders) *
            100
        )
      : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Sales and order performance overview
          </p>
        </div>

        <button
          type="button"
          onClick={loadReport}
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

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-20 shadow-sm">

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2
              size={19}
              className="animate-spin"
            />
            Loading sales report...
          </div>

        </div>
      ) : report ? (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Orders */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Total Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {report.total_orders}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingCart size={21} />
                </div>

              </div>
            </div>

            {/* Total Sales */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Total Sales
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatAmount(report.total_sales)}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <IndianRupee size={21} />
                </div>

              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Completed Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {report.completed_orders}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 size={21} />
                </div>

              </div>
            </div>

            {/* Pending */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Pending Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {report.pending_orders}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock3 size={21} />
                </div>

              </div>
            </div>

          </div>

          {/* Sales Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Order Status */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Order Status
                  </h2>

                  <p className="text-sm text-gray-500">
                    Current sales order distribution
                  </p>
                </div>

              </div>

              <div className="mt-8 space-y-5">

                {/* Completed */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium text-gray-700">
                      Completed
                    </span>

                    <span className="text-gray-500">
                      {report.completed_orders}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${
                          report.total_orders > 0
                            ? (report.completed_orders /
                                report.total_orders) *
                              100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>

                {/* Pending */}
                <div>

                  <div className="mb-2 flex items-center justify-between text-sm">

                    <span className="font-medium text-gray-700">
                      Pending
                    </span>

                    <span className="text-gray-500">
                      {report.pending_orders}
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-amber-500 transition-all"
                      style={{
                        width: `${
                          report.total_orders > 0
                            ? (report.pending_orders /
                                report.total_orders) *
                              100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* Performance */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Performance
                  </h2>

                  <p className="text-sm text-gray-500">
                    Overall order completion
                  </p>
                </div>

              </div>

              <div className="mt-8">

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Completion Rate
                    </p>

                    <p className="mt-2 text-4xl font-bold text-gray-900">
                      {completionRate}%
                    </p>
                  </div>

                  <CheckCircle2
                    size={38}
                    className="text-emerald-500"
                  />

                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${completionRate}%`,
                    }}
                  />

                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-500">

                  <span>
                    {report.completed_orders} completed
                  </span>

                  <span>
                    {report.total_orders} total
                  </span>

                </div>

              </div>

            </div>

          </div>
        </>
      ) : null}

    </div>
  )
}

export default Reports