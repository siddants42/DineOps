import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Eye,
  PackagePlus,
  Plus,
  RefreshCw,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react"

import {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrderStatus,
  type PurchaseOrder,
} from "../../services/purchaseOrders"

import {
  getSuppliers,
  type Supplier,
} from "../../services/suppliers"

import {
  getProducts,
  type Product,
} from "../../services/products"

interface OrderItemForm {
  product_id: string
  quantity: string
  unit_price: string
}

const emptyItem = (): OrderItemForm => ({
  product_id: "",
  quantity: "1",
  unit_price: "",
})

const statusOptions = [
  "pending",
  "approved",
  "received",
  "cancelled",
]

function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrder | null>(null)

  const [supplierId, setSupplierId] = useState("")
  const [items, setItems] = useState<OrderItemForm[]>([
    emptyItem(),
  ])

  async function loadData() {
    try {
      setLoading(true)
      setError("")

      const [orderData, supplierData, productData] =
        await Promise.all([
          getPurchaseOrders(),
          getSuppliers(),
          getProducts(),
        ])

      setOrders(orderData)
      setSuppliers(supplierData)
      setProducts(productData)
    } catch (err: any) {
      console.error("Purchase order loading error:", err)

      setError(
        err?.response?.data?.detail ||
          "Unable to load purchase order data."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  function openCreateModal() {
    setSupplierId("")
    setItems([emptyItem()])
    setError("")
    setShowModal(true)
  }

  function closeModal() {
    if (!saving) {
      setShowModal(false)
    }
  }

  function updateItem(
    index: number,
    field: keyof OrderItemForm,
    value: string
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    )
  }

  function addItem() {
    setItems((current) => [...current, emptyItem()])
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.length === 1
        ? current
        : current.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  function getProductPrice(productId: string) {
    const product = products.find(
      (item) => item.id === Number(productId)
    )

    return product ? String(product.price) : ""
  }

  const estimatedTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.unit_price) || 0

      return total + quantity * price
    }, 0)
  }, [items])

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()

    if (!supplierId) {
      setError("Please select a supplier.")
      return
    }

    const validItems = items.filter(
      (item) =>
        item.product_id &&
        Number(item.quantity) > 0 &&
        Number(item.unit_price) >= 0
    )

    if (!validItems.length) {
      setError("Add at least one valid product.")
      return
    }

    try {
      setSaving(true)
      setError("")

      await createPurchaseOrder({
        supplier_id: Number(supplierId),
        items: validItems.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      })

      setShowModal(false)
      setSupplierId("")
      setItems([emptyItem()])

      await loadData()
    } catch (err: any) {
      console.error("Purchase order creation error:", err)

      setError(
        err?.response?.data?.detail ||
          "Unable to create purchase order."
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(
    order: PurchaseOrder,
    status: string
  ) {
    try {
      setError("")

      await updatePurchaseOrderStatus(order.id, status)

      await loadData()

      if (selectedOrder?.id === order.id) {
        setSelectedOrder(null)
      }
    } catch (err: any) {
      console.error("Purchase order status error:", err)

      setError(
        err?.response?.data?.detail ||
          "Unable to update purchase order status."
      )
    }
  }

  function getSupplierName(id: number) {
    return (
      suppliers.find((supplier) => supplier.id === id)?.name ||
      `Supplier #${id}`
    )
  }

  function getProductName(id: number) {
    return (
      products.find((product) => product.id === id)?.name ||
      `Product #${id}`
    )
  }

  function statusClass(status: string) {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-blue-50 text-blue-600"

      case "received":
        return "bg-emerald-50 text-emerald-600"

      case "cancelled":
        return "bg-red-50 text-red-600"

      default:
        return "bg-amber-50 text-amber-600"
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Procurement
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Purchase Orders
          </h1>

          <p className="mt-1 text-gray-500">
            Purchase products from your suppliers and track receiving.
          </p>
        </div>

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Plus size={17} />
            Create Purchase Order
          </button>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShoppingCart size={21} />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Total Orders
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {orders.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <PackagePlus size={21} />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Pending Orders
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {
              orders.filter(
                (order) => order.status.toLowerCase() === "pending"
              ).length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 size={21} />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Received Orders
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {
              orders.filter(
                (order) => order.status.toLowerCase() === "received"
              ).length
            }
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-bold text-gray-900">
            Purchase Order List
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">
            Loading purchase orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">

            <ShoppingCart
              size={42}
              className="mx-auto text-gray-300"
            />

            <p className="mt-4 font-semibold text-gray-700">
              No purchase orders yet
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Create your first purchase order.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        PO-{String(order.id).padStart(4, "0")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getSupplierName(order.supplier_id)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.length}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹
                      {Number(order.total_amount).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        <Eye size={15} />
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create Purchase Order
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Select a supplier and add products.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleCreate}
              className="space-y-6 p-6"
            >

              {/* SUPPLIER */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Supplier
                </label>

                <select
                  required
                  value={supplierId}
                  onChange={(event) =>
                    setSupplierId(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                >
                  <option value="">
                    Select supplier
                  </option>

                  {suppliers
                    .filter((supplier) => supplier.is_active)
                    .map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* ITEMS */}
              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Products
                    </h3>

                    <p className="text-xs text-gray-400">
                      Add products being purchased.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                  >
                    <Plus size={14} />
                    Add Product
                  </button>

                </div>

                <div className="space-y-3">

                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_100px_130px_40px]"
                    >

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                          Product
                        </label>

                        <select
                          required
                          value={item.product_id}
                          onChange={(event) => {
                            const productId =
                              event.target.value

                            updateItem(
                              index,
                              "product_id",
                              productId
                            )

                            if (productId) {
                              updateItem(
                                index,
                                "unit_price",
                                getProductPrice(productId)
                              )
                            }
                          }}
                          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                        >
                          <option value="">
                            Select product
                          </option>

                          {products
                            .filter(
                              (product) => product.is_active
                            )
                            .map((product) => (
                              <option
                                key={product.id}
                                value={product.id}
                              >
                                {product.name} — ₹
                                {Number(
                                  product.price
                                ).toFixed(2)}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                          Quantity
                        </label>

                        <input
                          required
                          min="1"
                          type="number"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "quantity",
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                          Unit Price
                        </label>

                        <input
                          required
                          min="0"
                          step="0.01"
                          type="number"
                          value={item.unit_price}
                          onChange={(event) =>
                            updateItem(
                              index,
                              "unit_price",
                              event.target.value
                            )
                          }
                          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="flex items-end">

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          disabled={items.length === 1}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* TOTAL */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">

                <span className="text-sm font-medium text-gray-500">
                  Estimated Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ₹
                  {estimatedTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </span>

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Purchase Order"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <p className="text-sm text-gray-400">
                  Purchase Order
                </p>

                <h2 className="text-xl font-bold text-gray-900">
                  PO-{String(selectedOrder.id).padStart(4, "0")}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Supplier
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {getSupplierName(
                      selectedOrder.supplier_id
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Total
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    ₹
                    {Number(
                      selectedOrder.total_amount
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Order Items
                </h3>

                <div className="divide-y rounded-xl border border-gray-100">

                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4"
                    >

                      <div>
                        <p className="font-medium text-gray-900">
                          {getProductName(item.product_id)}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.quantity} × ₹
                          {Number(
                            item.unit_price
                          ).toFixed(2)}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹
                        {Number(
                          item.total_price
                        ).toFixed(2)}
                      </p>

                    </div>
                  ))}

                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Update Status
                </label>

                <select
                  value={selectedOrder.status}
                  onChange={(event) =>
                    void handleStatusChange(
                      selectedOrder,
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-emerald-400"
                >
                  {statusOptions.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status.charAt(0).toUpperCase() +
                        status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default PurchaseOrders