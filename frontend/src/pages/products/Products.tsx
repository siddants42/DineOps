import { useEffect, useMemo, useState } from "react"
import {
  Edit3,
  Package,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react"

import {
  getProducts,
  createProduct,
  updateProduct,
  type Product,
} from "../../services/products"

import {
  getCategories,
  type Category,
} from "../../services/categories"

const productImages: Record<string, string> = {
  "cold coffee":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&q=85",

  "fresh lime soda":
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=900&q=85",

  "mango shake":
    "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=900&q=85",

  "classic chicken burger":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=85",

  "veg supreme burger":
    "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=900&q=85",

  "margherita pizza":
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=85",

  "farmhouse pizza":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85",

  "penne arrabbiata":
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=85",

  "creamy alfredo pasta":
    "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=900&q=85",

  "french fries":
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=85",

  "paneer tikka":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=85",

  "butter chicken":
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=85",

  "paneer butter masala":
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900&q=85",

  "chocolate brownie":
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=85",

  "gulab jamun":
    "https://images.unsplash.com/photo-1666190094762-0c7c3c0b2b3a?w=900&q=85",

  "caesar salad":
    "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=900&q=85",

  "greek salad":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85",

  "grilled chicken sandwich":
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=900&q=85",

  "veg club sandwich":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=900&q=85",

  "masala omelette":
    "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=900&q=85",
}

const fallbackImage =
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&q=85"

function getProductImage(name: string) {
  return productImages[name.trim().toLowerCase()] || fallbackImage
}

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null)

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    category_id: "",
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")

      const [productsData, categoriesData] =
        await Promise.all([
          getProducts(),
          getCategories(),
        ])

      setProducts(productsData)
      setCategories(categoriesData)
    } catch (err) {
      console.error(err)
      setError("Unable to load products.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchTerm = search.toLowerCase()

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchTerm) ||
        product.sku
          .toLowerCase()
          .includes(searchTerm)

      const matchesCategory =
        categoryFilter === "all" ||
        product.category_id === Number(categoryFilter)

      return matchesSearch && matchesCategory
    })
  }, [products, search, categoryFilter])

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find(
        (category) => category.id === categoryId
      )?.name || "Uncategorized"
    )
  }

  const openAddModal = () => {
    setEditingProduct(null)

    setForm({
      name: "",
      sku: "",
      description: "",
      price: "",
      category_id:
        categories.length > 0
          ? String(categories[0].id)
          : "",
    })

    setFormError("")
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)

    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      price: String(product.price),
      category_id: String(product.category_id),
    })

    setFormError("")
    setShowModal(true)
  }

  const closeModal = () => {
    if (formLoading) return

    setShowModal(false)
    setEditingProduct(null)
    setFormError("")
  }

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setFormError("")
    setFormLoading(true)

    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category_id: Number(form.category_id),
      }

      if (editingProduct) {
        const updated = await updateProduct(
          editingProduct.id,
          payload
        )

        setProducts((current) =>
          current.map((product) =>
            product.id === updated.id
              ? updated
              : product
          )
        )
      } else {
        const created = await createProduct(payload)

        setProducts((current) => [
          created,
          ...current,
        ])
      }

      closeModal()
    } catch (err: any) {
      console.error(err)

      setFormError(
        err.response?.data?.detail ||
          "Unable to save product."
      )
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="mb-1 text-sm text-gray-400">
            Menu Management
          </p>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your restaurant products and menu items.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow-lg"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex flex-col gap-3 md:flex-row">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products or SKU..."
              className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
            />

          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="h-11 rounded-xl border border-gray-100 bg-gray-50 px-4 text-sm text-gray-600 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Count */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Package size={16} />
          {products.length} total
        </div>

      </div>

      {/* Products */}
      {loading ? (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="h-48 bg-gray-100 dark:bg-gray-800" />

              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-5 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}

        </div>

      ) : filteredProducts.length === 0 ? (

        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40">
            <Package
              size={28}
              className="text-emerald-500"
            />
          </div>

          <h2 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
            No products found
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Try changing your search or add a new product.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add Product
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {filteredProducts.map((product) => (

            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >

              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">

                <img
                  src={getProductImage(product.name)}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />

                {/* Status */}
                <div className="absolute right-4 top-4">

                  <span
                    className={
                      product.is_active
                        ? "rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm backdrop-blur"
                        : "rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-500 shadow-sm backdrop-blur"
                    }
                  >
                    {product.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </div>

              {/* Content */}
              <div className="p-5">

                <div className="mb-2 flex items-center gap-2">

                  <Tag
                    size={14}
                    className="text-emerald-500"
                  />

                  <span className="text-xs font-semibold text-emerald-600">
                    {getCategoryName(product.category_id)}
                  </span>

                </div>

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                      {product.name}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      SKU: {product.sku}
                    </p>

                  </div>

                  <p className="whitespace-nowrap text-lg font-bold text-gray-900 dark:text-white">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>

                </div>

                {product.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-gray-400">
                    {product.description}
                  </p>
                )}

                <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(product)
                    }
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-50 text-sm font-semibold text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                  >
                    <Edit3 size={15} />
                    Edit Product
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {editingProduct
                    ? "Update product information."
                    : "Add a new item to your menu."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              {formError && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Product Name
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Cold Coffee"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {/* SKU */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  SKU
                </label>

                <input
                  required
                  value={form.sku}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sku: event.target.value,
                    })
                  }
                  placeholder="e.g. BEV-002"
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Price
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price: event.target.value,
                      })
                    }
                    placeholder="120"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category
                  </label>

                  <select
                    required
                    value={form.category_id}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category_id: event.target.value,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe the product..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="h-11 flex-1 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                >
                  {formLoading
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Products