import { useEffect, useMemo, useState } from "react"
import {

  CheckCircle2,
  Clock3,
  Eye,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCw,
  ShoppingBag,
  X,
} from "lucide-react"

import {
  createSalesOrder,
  getSalesOrders,
  updateSalesOrderStatus,
  type SalesOrder,
} from "../../services/salesOrders"

import { getCustomers, type Customer } from "../../services/customers"
import { getProducts, type Product } from "../../services/products"

function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null)

  const [customerId, setCustomerId] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("1")

  async function loadData() {
    try {
      setLoading(true)
      setError("")

      const [orderData, customerData, productData] =
        await Promise.all([
          getSalesOrders(),
          getCustomers(),
          getProducts(),
        ])

      setOrders(orderData)
      setCustomers(customerData)
      setProducts(productData)
    } catch (err: any) {
      console.error(err)
      setError(
        err?.response?.data?.detail ||
          "Unable to load sales orders."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const activeProducts = useMemo(
    () => products.filter((product) => product.is_active),
    [products]
  )

  async function handleCreateOrder() {
    if (!customerId || !productId || !quantity) {
      setError("Please select customer, product and quantity.")
      return
    }

    const selectedProduct = products.find(
      (product) => product.id === Number(productId)
    )

    if (!selectedProduct) {
      setError("Selected product was not found.")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      await createSalesOrder({
        customer_id: Number(customerId),
        items: [
          {
            product_id: selectedProduct.id,
            quantity: Number(quantity),
            unit_price: Number(selectedProduct.price),
          },
        ],
      })

      setSuccess("Sales order created successfully.")

      setCustomerId("")
      setProductId("")
      setQuantity("1")
      setShowModal(false)

      await loadData()
    } catch (err: any) {
      console.error(err)

      setError(
        err?.response?.data?.detail ||
          "Unable to create sales order."
      )
    } finally {
      setSaving(false)
    }
  }

  async function changeStatus(
    order: SalesOrder,
    status: string
  ) {
    try {
      setError("")
      setSuccess("")

      await updateSalesOrderStatus(order.id, status)

      setSuccess(
        `Order #${order.id} updated to ${status}.`
      )

      await loadData()
    } catch (err: any) {
      console.error(err)

      setError(
        err?.response?.data?.detail ||
          "Unable to update order status."
      )
    }
  }

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount))
  }

  function getCustomerName(customerId: number) {
    return (
      customers.find(
        (customer) => customer.id === customerId
      )?.name || `Customer #${customerId}`
    )
  }

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  )

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Operations
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sales Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage restaurant sales orders.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setError("")
              setSuccess("")
              setShowModal(true)
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            <Plus size={17} />
            New Order
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
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {orders.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Sales
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(totalSales)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {pendingOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {completedOrders}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Recent Sales Orders
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Orders connected to your FastAPI backend.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag
              size={36}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-500">
              No sales orders found.
            </p>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-4 text-sm font-semibold text-emerald-600"
            >
              Create your first order
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-gray-800/60">
                <tr>
                  <th className="px-6 py-4">
                    Order
                  </th>

                  <th className="px-6 py-4">
                    Customer
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                  >

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        #{order.id}
                      </p>

                      <p className="text-xs text-gray-400">
                        {order.items?.length || 0} item(s)
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {getCustomerName(order.customer_id)}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {formatAmount(order.total_amount)}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : order.status === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <Eye size={17} />
                        </button>

                        {order.status === "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              void changeStatus(
                                order,
                                "completed"
                              )
                            }
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                          >
                            Complete
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Create order modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create Sales Order
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Create a new restaurant order.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers
                    .filter((customer) => customer.is_active)
                    .map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Product
                </label>

                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    Select product
                  </option>

                  {activeProducts.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} — {formatAmount(product.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => void handleCreateOrder()}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Creating Order..."
                  : "Create Order"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Order details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Order #{selectedOrder.id}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {getCustomerName(
                    selectedOrder.customer_id
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mt-6 space-y-3">

              {selectedOrder.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Product #{item.product_id}
                    </p>

                    <p className="text-xs text-gray-400">
                      {item.quantity} ×{" "}
                      {formatAmount(item.unit_price)}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(item.total_price)}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">

              <span className="font-semibold text-gray-500">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(
                  selectedOrder.total_amount
                )}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default SalesOrders