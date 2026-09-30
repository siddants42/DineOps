import { useState } from "react"
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function TopNavbar() {
  const navigate = useNavigate()

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  )

  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  function toggleTheme() {
    const next = !dark

    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("dineops-theme", next ? "dark" : "light")
    setDark(next)
  }

  function logout() {
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-gray-100 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">

      <div className="flex h-full items-center justify-between px-6">

        {/* Search */}
        <div className="hidden md:flex w-full max-w-md items-center">

          <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition focus-within:border-emerald-400 focus-within:bg-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:bg-gray-800">

            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-white"
            />

            <span className="hidden lg:block rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-gray-400 shadow-sm dark:bg-gray-800">
              CTRL K
            </span>

          </div>

        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications */}
          <div className="relative">

            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">

                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h3>

                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                    3 new
                  </span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">

                  <Notification
                    title="New order received"
                    text="Order #1048 has been received."
                  />

                  <Notification
                    title="Low stock alert"
                    text="Tomatoes are below minimum stock."
                  />

                  <Notification
                    title="Payment received"
                    text="Payment of ₹2,450 received."
                  />

                </div>

                <button
                  onClick={() => {
                    setNotificationsOpen(false)
                    navigate("/notifications")
                  }}
                  className="w-full px-5 py-3 text-sm font-semibold text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  View all notifications
                </button>

              </div>
            )}

          </div>

          {/* Divider */}
          <div className="mx-2 h-8 w-px bg-gray-200 dark:bg-gray-800" />

          {/* Profile */}
          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow-sm">
                A
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  DineOps Admin
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>
              </div>

              <ChevronDown size={16} className="text-gray-400" />

            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">

                <button
                  onClick={() => navigate("/settings")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <User size={17} />
                  Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={17} />
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  )
}

function Notification({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="flex gap-3 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800">

      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />

      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {text}
        </p>

        <p className="mt-1 text-[11px] text-gray-300">
          Just now
        </p>
      </div>

    </div>
  )
}