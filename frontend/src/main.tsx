import React from "react"
import ReactDOM from "react-dom/client"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import "./index.css"

import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/Dashboard"
import Products from "./pages/products/Products"
import Categories from "./pages/categories/Categories"
import Inventory from "./pages/inventory/Inventory"
import Suppliers from "./pages/suppliers/Suppliers"
import PurchaseOrders from "./pages/purchase-orders/PurchaseOrders"
import SalesOrders from "./pages/sales-orders/SalesOrders"
import Customers from "./pages/customers/Customers"
import Invoices from "./pages/invoices/Invoices";
import Payments from "./pages/payments/Payments"
import Notifications from "./pages/notifications/Notifications"
import Reports from "./pages/reports/Reports"
import AuditLogs from "./pages/audit-logs/AuditLogs"
import Settings from "./pages/settings/Settings"
import Users from "./pages/users/Users"
import MainLayout from "./components/layout/MainLayout"
import ProtectedRoute from "./routes/ProtectedRoute"
import { useUIStore } from "./store/uiStore"


function ThemeSync() {
  const { darkMode } = useUIStore()

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  return null
}

function AppRoutes() {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================= PROTECTED APP ================= */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/"
          element={<MainLayout />}
        >

          {/* Root → Dashboard */}
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<Products />}
          />

          {/* Categories */}
          <Route
            path="categories"
            element={<Categories />}
          />

          {/* Inventory */}
          <Route
            path="inventory"
            element={<Inventory />}
          />

          {/* Suppliers */}
          <Route
            path="suppliers"
            element={<Suppliers />}
          />

          <Route
  path="purchase-orders"
  element={<PurchaseOrders />}
/>

<Route
  path="sales-orders"
  element={<SalesOrders />}
/>

<Route
  path="customers"
  element={<Customers />}
/>
<Route path="/invoices" element={<Invoices />} />

<Route
  path="payments"
  element={<Payments />}
/>

<Route
  path="notifications"
  element={<Notifications />}
/>

<Route
  path="reports"
  element={<Reports />}
/>

<Route
  path="audit-logs"
  element={<AuditLogs />}
/>

<Route
  path="settings"
  element={<Settings />}
/>

<Route
  path="users"
  element={<Users />}
/>
        </Route>

      </Route>

      {/* ================= UNKNOWN URL ================= */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  )
}

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeSync />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
)