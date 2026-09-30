import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCw,
  X,
} from "lucide-react"

import {
  createPayment,
  getPayments,
  type Payment,
} from "../../services/payments"

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showModal, setShowModal] = useState(false)

  const [invoiceId, setInvoiceId] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function loadPayments() {
    try {
      setLoading(true)
      setError("")

      const data = await getPayments()
      setPayments(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load payments.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  async function handleCreatePayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!invoiceId || !amount || !paymentMethod) {
      setError("Please fill all required fields.")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      await createPayment({
        invoice_id: Number(invoiceId),
        amount: Number(amount),
        payment_method: paymentMethod,
      })

      setSuccess("Payment created successfully.")

      setInvoiceId("")
      setAmount("")
      setPaymentMethod("cash")
      setShowModal(false)

      await loadPayments()
    } catch (err: any) {
      console.error(err)

      const message =
        err?.response?.data?.detail ||
        "Unable to create payment."

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  const completedPayments = payments.filter(
    (payment) =>
      payment.status.toLowerCase() === "completed"
  ).length

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Record and track customer payments
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadPayments}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setError("")
              setSuccess("")
              setShowModal(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <Plus size={17} />
            Add Payment
          </button>

        </div>

      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Payments
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {payments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Collected
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatAmount(totalAmount)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee size={21} />
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {completedPayments}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* Payments table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View all recorded payments
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading payments...
            </div>

          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <CreditCard size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No payments found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Payments recorded against invoices will appear here.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50/70"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <CreditCard size={17} />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            Payment #{payment.id}
                          </p>

                          <p className="text-xs text-gray-400">
                            ID #{payment.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      Invoice #{payment.invoice_id}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="px-6 py-4">

                      <span className="capitalize text-sm text-gray-600">
                        {payment.payment_method}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(payment.paid_at)}
                    </td>

                    <td className="px-6 py-4">

                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-600">
                        {payment.status}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Payment
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Record a payment against an invoice
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleCreatePayment}
              className="space-y-5 px-6 py-6"
            >

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Invoice ID
                </label>

                <input
                  type="number"
                  min="1"
                  value={invoiceId}
                  onChange={(event) =>
                    setInvoiceId(event.target.value)
                  }
                  placeholder="e.g. 1"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  placeholder="e.g. 100"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="cash">
                    Cash
                  </option>

                  <option value="card">
                    Card
                  </option>

                  <option value="upi">
                    UPI
                  </option>

                  <option value="bank_transfer">
                    Bank Transfer
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : "Record Payment"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Payments