import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopNavbar from "./TopNavbar"
import { useUIStore } from "../../store/uiStore"

function MainLayout() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex h-screen">

        {/* ================= SIDEBAR ================= */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50
            h-screen
            transition-transform duration-300
            lg:relative lg:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          <Sidebar />
        </div>

        {/* ================= MOBILE OVERLAY ================= */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="
              fixed inset-0 z-40
              bg-black/40
              backdrop-blur-[2px]
              lg:hidden
            "
          />
        )}

        {/* ================= MAIN AREA ================= */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* ================= TOP NAVBAR ================= */}
          <TopNavbar />

          {/* ================= SCROLLABLE PAGE ================= */}
          <main
            className="
              flex-1
              overflow-y-auto
              overflow-x-hidden
              p-4
              sm:p-6
              lg:p-8
            "
          >
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  )
}

export default MainLayout