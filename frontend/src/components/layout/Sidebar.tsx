import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Truck,
  ClipboardList,
  Users,
  Receipt,
  CreditCard,
  Bell,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  UtensilsCrossed,
  UserCog,
  Moon,
  Sun,
} from "lucide-react"

import { NavLink, useNavigate } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

import { useAuth } from "../../hooks/useAuth"
import { useUIStore } from "../../store/uiStore"
import type { UserRole } from "../../types"

interface MenuItem {
  name: string
  path: string
  icon: LucideIcon
  roles?: UserRole[]
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Sales Orders",
    path: "/sales-orders",
    icon: ShoppingBag,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Products",
    path: "/products",
    icon: Package,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Categories",
    path: "/categories",
    icon: UtensilsCrossed,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: Boxes,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Suppliers",
    path: "/suppliers",
    icon: Truck,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Purchase Orders",
    path: "/purchase-orders",
    icon: ClipboardList,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Customers",
    path: "/customers",
    icon: Users,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: Receipt,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Payments",
    path: "/payments",
    icon: CreditCard,
    roles: ["Admin", "Manager", "Staff"],
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: ["Admin", "Manager"],
  },
  {
    name: "Audit Logs",
    path: "/audit-logs",
    icon: FileText,
    roles: ["Admin"],
  },
  {
    name: "Users & Roles",
    path: "/users",
    icon: UserCog,
    roles: ["Admin"],
  },
]

function Sidebar() {
  const navigate = useNavigate()

  const { role, logout } = useAuth()

  const {
    setSidebarOpen,
    darkMode,
    toggleDarkMode,
  } = useUIStore()

  const visibleItems = menuItems.filter(
    (item) =>
      !item.roles ||
      !role ||
      item.roles.includes(role)
  )

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300">

      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-800 px-5">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <UtensilsCrossed size={21} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            DineOps
          </h1>

          <p className="text-xs text-slate-500">
            Restaurant ERP
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
          Main Menu
        </p>

        {visibleItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon
                size={18}
                strokeWidth={1.9}
                className="shrink-0"
              />

              <span>{item.name}</span>
            </NavLink>
          )
        })}

        {/* System */}
        <p className="mb-3 px-3 pt-7 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
          System
        </p>

        <NavLink
          to="/settings"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
          }
        >
          <Settings
            size={18}
            strokeWidth={1.9}
          />

          <span>Settings</span>
        </NavLink>

        {/* Dark Mode */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-slate-900 hover:text-white"
        >
          {darkMode ? (
            <Sun size={18} strokeWidth={1.9} />
          ) : (
            <Moon size={18} strokeWidth={1.9} />
          )}

          <span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-slate-800 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut
            size={18}
            strokeWidth={1.9}
          />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar