import { useEffect, useState } from "react"
import {
  Plus,
  Search,
  Pencil,
  UserRound,
  X,
  Power,
} from "lucide-react"

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  type Customer,
} from "../../services/customers"

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  async function loadCustomers() {
    try {
      setLoading(true)
      setError("")

      const data = await getCustomers()
      setCustomers(data)
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to load customers."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCustomers()
  }, [])

  function openCreate() {
    setEditing(null)

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
    })

    setError("")
    setOpen(true)
  }

  function openEdit(customer: Customer) {
    setEditing(customer)

    setForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    })

    setError("")
    setOpen(true)
  }

  async function toggleCustomerStatus(
    customer: Customer
  ) {
    try {
      setError("")

      const updated = await updateCustomer(
        customer.id,
        {
          is_active: !customer.is_active,
        }
      )

      setCustomers((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      )
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to update customer status."
      )
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")

      if (!form.name.trim()) {
        setError("Customer name is required.")
        return
      }

      if (editing) {
        await updateCustomer(editing.id, {
          name: form.name.trim(),
          email: form.email || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
        })
      } else {
        await createCustomer({
          name: form.name.trim(),
          email: form.email || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
        })
      }

      setOpen(false)
      setEditing(null)

      await loadCustomers()
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to save customer."
      )
    } finally {
      setSaving(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) => {
      const value = search.toLowerCase().trim()

      return (
        customer.name
          .toLowerCase()
          .includes(value) ||
        customer.email
          ?.toLowerCase()
          .includes(value) ||
        customer.phone
          ?.toLowerCase()
          .includes(value)
      )
    }
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            CRM
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Customers
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your restaurant customers.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          <Plus size={17} />
          Add Customer
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Customer List
              </h2>

              <p className="text-sm text-gray-400">
                {filteredCustomers.length} customer(s)
              </p>
            </div>

          </div>

        </div>

        {loading ? (

          <div className="p-10 text-center text-sm text-gray-400">
            Loading customers...
          </div>

        ) : filteredCustomers.length === 0 ? (

          <div className="p-10 text-center text-sm text-gray-400">
            No customers found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-gray-800/60">

                <tr>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="px-6 py-4">
                    Email
                  </th>

                  <th className="px-6 py-4">
                    Address
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                {filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={customer.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >

                      <td className="px-6 py-4">

                        <p className="font-semibold text-gray-900 dark:text-white">
                          {customer.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          #{customer.id}
                        </p>

                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {customer.email || "—"}
                      </td>

                      <td className="max-w-xs px-6 py-4 text-gray-500">

                        <span className="line-clamp-1">
                          {customer.address || "—"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            customer.is_active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {customer.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(customer)
                            }
                            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void toggleCustomerStatus(
                                customer
                              )
                            }
                            className={`inline-flex items-center gap-1.5 font-semibold ${
                              customer.is_active
                                ? "text-red-500 hover:text-red-600"
                                : "text-emerald-600 hover:text-emerald-700"
                            }`}
                          >
                            <Power size={15} />

                            {customer.is_active
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Modal */}
      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editing
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="text-sm text-gray-400">
                  {editing
                    ? "Update customer information."
                    : "Create a new customer account."}
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setOpen(false)
                    setEditing(null)
                  }
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                required
                placeholder="Customer name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <textarea
                placeholder="Address"
                rows={3}
                value={form.address}
                onChange={(event) =>
                  setForm({
                    ...form,
                    address: event.target.value,
                  })
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />

              <div className="flex gap-3">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setOpen(false)
                    setEditing(null)
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Update Customer"
                      : "Create Customer"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Customers