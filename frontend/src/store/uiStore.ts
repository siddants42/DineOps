import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  darkMode: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
}

const storedDarkMode = localStorage.getItem("dineops_dark_mode") === "true"

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  darkMode: storedDarkMode,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      localStorage.setItem("dineops_dark_mode", String(next))
      return { darkMode: next }
    }),
}))
