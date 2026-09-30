import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
  X,
} from "lucide-react"

import {
  getInventory,
  createInventory,
  stockIn,
  stockOut,
  type Inventory as InventoryItem,
} from "../../services/inventory"

import {
  getProducts,
  type Product,
} from "../../services/products"

type AdjustmentType = "in" | "out" | "initialize" | null

function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [selectedInventory, setSelectedInventory] =
    useState<InventoryItem | null>(null)

  const [adjustmentType, setAdjustmentType] =
    useState<AdjustmentType>(null)

  const [quantity, setQuantity] = useState("")
  const [minimumStock, setMinimumStock] = useState("10")

  const [adjusting, setAdjusting] = useState(false)

  // =========================================================
  // LOAD PRODUCTS + INVENTORY
  // =========================================================

  async function loadInventory() {
    try {
      setLoading(true)
      setError("")

      const [productsData, inventoryData] =
        await Promise.all([
          getProducts(),
          getInventory(),
        ])

      setProducts(productsData)
      setInventory(inventoryData)

    } catch (err) {
      console.error("Inventory loading error:", err)

      const error = err as {
        response?: {
          data?: {
            detail?: string
            message?: string
          }
        }
      }

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to load inventory."

      setError(message)

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  // =========================================================
  // MERGE PRODUCTS + INVENTORY
  // =========================================================

  const inventoryRows = useMemo(() => {
    return products
      .filter((product) => product.is_active)
      .map((product) => {
        const inventoryItem = inventory.find(
          (item) => item.product_id === product.id
        )

        return {
          product,
          inventory: inventoryItem ?? null,
        }
      })
  }, [products, inventory])

  // =========================================================
  // STATISTICS
  // =========================================================

  const statistics = useMemo(() => {
    const totalProducts = inventoryRows.length

    const totalQuantity = inventoryRows.reduce(
      (sum, row) =>
        sum + (row.inventory?.quantity ?? 0),
      0
    )

    const lowStock = inventoryRows.filter((row) => {
      if (!row.inventory) {
        return false
      }

      return (
        row.inventory.quantity > 0 &&
        row.inventory.quantity <=
          row.inventory.minimum_stock
      )
    }).length

    const outOfStock = inventoryRows.filter((row) => {
      return (
        !row.inventory ||
        row.inventory.quantity === 0
      )
    }).length

    return {
      totalProducts,
      totalQuantity,
      lowStock,
      outOfStock,
    }
  }, [inventoryRows])

  // =========================================================
  // INITIALIZE INVENTORY
  // =========================================================

  function openInitialize(product: Product) {
    setSelectedProduct(product)
    setSelectedInventory(null)
    setAdjustmentType("initialize")
    setQuantity("")
    setMinimumStock("10")
    setError("")
  }

  // =========================================================
  // STOCK ADJUSTMENT
  // =========================================================

  function openAdjustment(
    product: Product,
    item: InventoryItem,
    type: "in" | "out"
  ) {
    setSelectedProduct(product)
    setSelectedInventory(item)
    setAdjustmentType(type)
    setQuantity("")
    setMinimumStock(String(item.minimum_stock))
    setError("")
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  function closeModal() {
    setSelectedProduct(null)
    setSelectedInventory(null)
    setAdjustmentType(null)
    setQuantity("")
    setMinimumStock("10")
  }

  // =========================================================
  // INITIALIZE INVENTORY
  // =========================================================

  async function handleInitialize() {
    if (!selectedProduct) {
      return
    }

    const initialQuantity = Number(quantity)
    const minimumStockValue = Number(minimumStock)

    if (
      !Number.isInteger(initialQuantity) ||
      initialQuantity < 0 ||
      !Number.isInteger(minimumStockValue) ||
      minimumStockValue < 0
    ) {
      setError("Please enter valid stock values.")
      return
    }

    try {
      setAdjusting(true)
      setError("")

      const created = await createInventory({
        product_id: selectedProduct.id,
        quantity: initialQuantity,
        minimum_stock: minimumStockValue,
      })

      setInventory((current) => [
        ...current,
        created,
      ])

      closeModal()

    } catch (err) {
      console.error(
        "Inventory initialization failed:",
        err
      )

      const error = err as {
        response?: {
          data?: {
            detail?: string
            message?: string
          }
        }
      }

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Unable to initialize inventory."

      setError(message)

    } finally {
      setAdjusting(false)
    }
  }

  // =========================================================
  // STOCK IN / STOCK OUT
  // =========================================================

  async function handleAdjustment() {
    if (
      !selectedProduct ||
      !selectedInventory ||
      !adjustmentType ||
      adjustmentType === "initialize"
    ) {
      return
    }

    const amount = Number(quantity)

    if (
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      setError("Please enter a valid quantity.")
      return
    }

    if (
      adjustmentType === "out" &&
      amount > selectedInventory.quantity
    ) {
      setError(
        "Quantity cannot exceed current stock."
      )
      return
    }

    try {
      setAdjusting(true)
      setError("")

      const updated =
        adjustmentType === "in"
          ? await stockIn(
              selectedInventory.product_id,
              amount
            )
          : await stockOut(
              selectedInventory.product_id,
              amount
            )

      setInventory((current) =>
        current.map((item) =>
          item.product_id === updated.product_id
            ? updated
            : item
        )
      )

      closeModal()

    } catch (err) {
      console.error(
        "Stock adjustment failed:",
        err
      )

      const error = err as {
        response?: {
          data?: {
            detail?: string
            message?: string
          }
        }
      }

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        (
          adjustmentType === "in"
            ? "Unable to add stock."
            : "Unable to remove stock."
        )

      setError(message)

    } finally {
      setAdjusting(false)
    }
  }

  // =========================================================
  // STATUS
  // =========================================================

  function getStatus(
    item: InventoryItem | null
  ) {
    if (!item) {
      return {
        label: "Not initialized",
        className:
          "bg-gray-100 text-gray-600",
      }
    }

    if (item.quantity === 0) {
      return {
        label: "Out of stock",
        className:
          "bg-red-50 text-red-600",
      }
    }

    if (
      item.quantity <= item.minimum_stock
    ) {
      return {
        label: "Low stock",
        className:
          "bg-amber-50 text-amber-600",
      }
    }

    return {
      label: "In stock",
      className:
        "bg-emerald-50 text-emerald-600",
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">
            Inventory
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>

          <p className="mt-1 text-gray-500">
            Monitor stock levels and manage product inventory.
          </p>
        </div>

        <button
          onClick={loadInventory}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">

          <div className="flex items-center gap-3">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>

          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>

        </div>
      )}


      {/* STATISTICS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* PRODUCTS */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Products
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics.totalProducts}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package
                size={20}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>


        {/* TOTAL UNITS */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Total Units
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics.totalQuantity}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Boxes
                size={20}
                className="text-emerald-600"
              />
            </div>

          </div>

        </div>


        {/* LOW STOCK */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Low Stock
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics.lowStock}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <AlertTriangle
                size={20}
                className="text-amber-600"
              />
            </div>

          </div>

        </div>


        {/* OUT OF STOCK */}

        <div className="bg-white rounded-2xl border border-gray-100 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Out of Stock
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statistics.outOfStock}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <Package
                size={20}
                className="text-red-600"
              />
            </div>

          </div>

        </div>

      </div>


      {/* INVENTORY TABLE */}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-100">

          <h2 className="text-lg font-semibold text-gray-900">
            Stock Overview
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Current inventory levels for your products.
          </p>

        </div>


        {loading ? (

          <div className="p-12 text-center text-gray-400">
            Loading inventory...
          </div>

        ) : inventoryRows.length === 0 ? (

          <div className="p-12 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">

              <Package
                size={24}
                className="text-gray-400"
              />

            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No products found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Create a product first to manage its inventory.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="text-left text-xs uppercase tracking-wider text-gray-400 bg-gray-50/70">

                  <th className="px-6 py-4 font-semibold">
                    Product
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Current Stock
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Minimum
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

                {inventoryRows.map(
                  ({ product, inventory: item }) => {

                    const status = getStatus(item)

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/60 transition"
                      >

                        {/* PRODUCT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">

                              <Package
                                size={18}
                                className="text-emerald-600"
                              />

                            </div>

                            <div>

                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                SKU: {product.sku}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* CURRENT STOCK */}

                        <td className="px-6 py-5">

                          <span className="text-lg font-semibold text-gray-900">
                            {item?.quantity ?? 0}
                          </span>

                          <span className="text-sm text-gray-400 ml-1">
                            units
                          </span>

                        </td>


                        {/* MINIMUM */}

                        <td className="px-6 py-5 text-sm text-gray-600">

                          {item
                            ? item.minimum_stock
                            : "—"}

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                          >

                            {item &&
                              item.quantity >
                                item.minimum_stock && (
                                <CheckCircle2
                                  size={13}
                                />
                              )}

                            {status.label}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            {!item ? (

                              <button
                                onClick={() =>
                                  openInitialize(product)
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition"
                              >

                                <Plus size={14} />

                                Initialize

                              </button>

                            ) : (

                              <>
                                <button
                                  onClick={() =>
                                    openAdjustment(
                                      product,
                                      item,
                                      "in"
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition"
                                >

                                  <ArrowUp size={14} />

                                  Stock In

                                </button>

                                <button
                                  onClick={() =>
                                    openAdjustment(
                                      product,
                                      item,
                                      "out"
                                    )
                                  }
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                                >

                                  <ArrowDown size={14} />

                                  Stock Out

                                </button>
                              </>

                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* MODAL */}

      {selectedProduct && adjustmentType && (

        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">

                  {adjustmentType === "initialize"
                    ? "Initialize Inventory"
                    : adjustmentType === "in"
                      ? "Stock In"
                      : "Stock Out"}

                </h2>

                <p className="text-sm text-gray-400 mt-1">

                  {selectedProduct.name}

                  {" • "}

                  {selectedProduct.sku}

                </p>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 transition"
              >
                <X size={18} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="p-6">

              {adjustmentType === "initialize" ? (

                <>

                  <div className="mb-5 p-4 rounded-xl bg-gray-50">

                    <p className="text-xs text-gray-400">
                      Product
                    </p>

                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedProduct.name}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      SKU: {selectedProduct.sku}
                    </p>

                  </div>


                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    placeholder="Enter initial stock"
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />


                  <label className="block text-sm font-medium text-gray-700 mt-5 mb-2">
                    Minimum Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minimumStock}
                    onChange={(event) =>
                      setMinimumStock(event.target.value)
                    }
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />

                </>

              ) : (

                <>

                  <div className="mb-5 p-4 rounded-xl bg-gray-50">

                    <p className="text-xs text-gray-400">
                      Current Stock
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {selectedInventory?.quantity ?? 0}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {selectedProduct.sku}
                    </p>

                  </div>


                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    placeholder="Enter quantity"
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />


                  {adjustmentType === "out" &&
                    Number(quantity) >
                      (selectedInventory?.quantity ?? 0) && (

                    <p className="text-xs text-red-500 mt-2">
                      Quantity cannot exceed current stock.
                    </p>

                  )}

                </>

              )}


              {/* BUTTONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={closeModal}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    adjustmentType === "initialize"
                      ? handleInitialize
                      : handleAdjustment
                  }
                  disabled={
                    adjusting ||
                    (
                      adjustmentType === "initialize"
                        ? (
                            !Number.isInteger(
                              Number(quantity)
                            ) ||
                            Number(quantity) < 0 ||
                            !Number.isInteger(
                              Number(minimumStock)
                            ) ||
                            Number(minimumStock) < 0
                          )
                        : (
                            !Number.isInteger(
                              Number(quantity)
                            ) ||
                            Number(quantity) <= 0 ||
                            (
                              adjustmentType === "out" &&
                              Number(quantity) >
                                (
                                  selectedInventory?.quantity ??
                                  0
                                )
                            )
                          )
                    )
                  }
                  className={`flex-1 h-11 rounded-xl text-white text-sm font-semibold transition disabled:opacity-50 ${
                    adjustmentType === "out"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >

                  {adjusting
                    ? "Saving..."
                    : adjustmentType === "initialize"
                      ? "Initialize"
                      : adjustmentType === "in"
                        ? "Add Stock"
                        : "Remove Stock"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Inventory