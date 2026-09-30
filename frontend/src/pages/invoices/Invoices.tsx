import { useEffect, useState } from "react"
import {
  FileText,
  RefreshCw,
  Eye,
  IndianRupee,
  CheckCircle2,
  Clock3,
} from "lucide-react"

import {
  getInvoices,
  type Invoice,
} from "../../services/invoices"

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadInvoices() {
    try {
      setLoading(true)
      setError("")

      const data = await getInvoices()

      setInvoices(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load invoices.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount),
    0
  )

  const paidCount = invoices.filter(
    (invoice) => invoice.status.toLowerCase() === "paid"
  ).length

  const unpaidCount = invoices.filter(
    (invoice) => invoice.status.toLowerCase() === "unpaid"
  ).length

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer invoices
          </p>
        </div>

        <button
          type="button"
          onClick={loadInvoices}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Invoices
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {invoices.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Amount
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatAmount(totalAmount)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <IndianRupee size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Paid
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {paidCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Unpaid
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {unpaidCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} />
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

      {/* Invoice table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Invoice List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View all invoices generated from sales orders
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <RefreshCw
                size={18}
                className="animate-spin"
              />
              Loading invoices...
            </div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <FileText size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No invoices found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Invoices created from sales orders will appear here.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Sales Order
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {invoices.map((invoice) => {

                  const isPaid =
                    invoice.status.toLowerCase() === "paid"

                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-50 transition hover:bg-gray-50/70"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <FileText size={17} />
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {invoice.invoice_number}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID #{invoice.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        #{invoice.sales_order_id}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(invoice.issued_at)}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {formatAmount(invoice.total_amount)}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            isPaid
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {invoice.status}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Invoices