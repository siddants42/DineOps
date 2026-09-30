import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"

import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Customers from "./pages/customers/Customers"
import Products from "./pages/products/Products"
import Categories from "./pages/categories/Categories"
import Inventory from "./pages/inventory/Inventory"
import Suppliers from "./pages/suppliers/Suppliers"
import PurchaseOrders from "./pages/purchase-orders/PurchaseOrders"
import SalesOrders from "./pages/sales-orders/SalesOrders"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* ERP */}
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/sales-orders" element={<SalesOrders />} />

          <Route path="/products" element={<Products />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/inventory" element={<Inventory />} />

          <Route path="/suppliers" element={<Suppliers />} />

          <Route
            path="/purchase-orders"
            element={<PurchaseOrders />}
          />

          <Route path="/customers" element={<Customers />} />

        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App