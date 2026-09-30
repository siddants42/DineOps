import { useEffect, useState } from "react"
import api from "../../services/api"

type Supplier = {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  is_active: boolean
  created_at: string
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [message, setMessage] = useState("Starting...")

  useEffect(() => {
    console.log("SUPPLIERS PAGE MOUNTED")

    async function load() {
      try {
        setMessage("Calling API...")

        const response = await api.get<Supplier[]>("/suppliers/")

        console.log("SUPPLIERS AXIOS RESPONSE:", response.data)

        setSuppliers(response.data)
        setMessage(`Loaded ${response.data.length} supplier(s)`)
      } catch (error: any) {
        console.error("SUPPLIERS AXIOS ERROR:", error)

        setMessage(
          error?.response?.data?.detail ||
          error?.message ||
          "API request failed"
        )
      }
    }

    load()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Supplier Management
      </h1>

      <p className="mt-2 text-gray-500">
        {message}
      </p>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        {suppliers.length === 0 ? (
          <p className="text-gray-500">
            No suppliers loaded.
          </p>
        ) : (
          suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="border-b border-gray-100 py-4"
            >
              <p className="font-semibold text-gray-900">
                {supplier.name}
              </p>

              <p className="text-sm text-gray-500">
                {supplier.email || "-"}
              </p>

              <p className="text-sm text-gray-500">
                {supplier.phone || "-"}
              </p>

              <p className="text-sm text-gray-500">
                {supplier.address || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}