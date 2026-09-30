import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  Edit3,
  FolderOpen,
  Plus,
  Search,
  X,
} from "lucide-react"

import {
  getCategories,
  createCategory,
  updateCategory,
  type Category,
} from "../../services/categories"

const categoryImages: Record<string, string> = {
  beverages:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",

  burgers:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",

  pizza:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",

  desserts:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",

  pasta:
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
}

const defaultCategoryImage =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600"

function getCategoryImage(categoryName: string) {
  return (
    categoryImages[categoryName.toLowerCase()] ||
    defaultCategoryImage
  )
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null)

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
  })

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error(err)
      setError("Unable to load categories.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Search
  const filteredCategories = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    if (!searchText) {
      return categories
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(searchText) ||
        (category.description || "")
          .toLowerCase()
          .includes(searchText)
      )
    })
  }, [categories, search])

  // Open add modal
  const openAddModal = () => {
    setEditingCategory(null)

    setForm({
      name: "",
      description: "",
    })

    setFormError("")
    setShowModal(true)
  }

  // Open edit modal
  const openEditModal = (category: Category) => {
    setEditingCategory(category)

    setForm({
      name: category.name,
      description: category.description || "",
    })

    setFormError("")
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    if (formLoading) return

    setShowModal(false)
    setEditingCategory(null)
    setFormError("")
  }

  // Submit
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setFormError("")
    setFormLoading(true)

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      }

      if (!payload.name) {
        setFormError("Category name is required.")
        return
      }

      if (editingCategory) {
        const updated = await updateCategory(
          editingCategory.id,
          payload
        )

        setCategories((current) =>
          current.map((category) =>
            category.id === updated.id
              ? updated
              : category
          )
        )
      } else {
        const created = await createCategory(payload)

        setCategories((current) => [
          created,
          ...current,
        ])
      }

      setShowModal(false)
      setEditingCategory(null)

      setForm({
        name: "",
        description: "",
      })
    } catch (err: any) {
      console.error(err)

      setFormError(
        err.response?.data?.detail ||
          "Unable to save category."
      )
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>
          <p className="text-sm text-gray-400 mb-1">
            Menu Management
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="text-gray-500 mt-1">
            Organize your restaurant products into categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">

        <div className="relative">

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
            placeholder="Search categories..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 transition"
          />

        </div>

      </div>

      {/* Category count */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredCategories.length}
          </span>{" "}
          categories
        </p>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <FolderOpen size={16} />
          {categories.length} total
        </div>

      </div>

      {/* Loading */}
      {loading ? (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-gray-100" />

              <div className="p-6">
                <div className="h-5 bg-gray-100 rounded w-1/2" />

                <div className="h-4 bg-gray-100 rounded mt-3 w-full" />

                <div className="h-4 bg-gray-100 rounded mt-2 w-2/3" />
              </div>
            </div>
          ))}

        </div>

      ) : filteredCategories.length === 0 ? (

        /* Empty state */
        <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center">
            <FolderOpen
              size={28}
              className="text-emerald-500"
            />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mt-5">
            No categories found
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Try changing your search or create a new category.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 transition"
          >
            <Plus size={16} />
            Add Category
          </button>

        </div>

      ) : (

        /* Category cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredCategories.map((category) => (

            <div
              key={category.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition duration-300"
            >

              {/* Image */}
              <div className="h-44 overflow-hidden">

                <img
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />

              </div>

              {/* Content */}
              <div className="p-6">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {category.name}
                    </h2>

                    <p className="text-sm text-gray-400 mt-2 min-h-[40px]">
                      {category.description ||
                        "No description available."}
                    </p>

                  </div>

                  <span
                    className={
                      category.is_active
                        ? "shrink-0 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold"
                        : "shrink-0 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold"
                    }
                  >
                    {category.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">

                  <p className="text-xs text-gray-400">
                    Category #{category.id}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(category)
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 text-sm font-semibold transition"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Add/Edit Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {editingCategory
                    ? "Update category information."
                    : "Create a new product category."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              >
                <X size={19} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Form error */}
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              {/* Category Name */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Beverages"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 outline-none text-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />

              </div>

              {/* Description */}
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  placeholder="e.g. Cold and hot beverages"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm resize-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={formLoading}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 h-11 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 disabled:opacity-60 transition"
                >
                  {formLoading
                    ? "Saving..."
                    : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default Categories