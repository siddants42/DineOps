import { create } from "zustand"
import type { AuthUser, UserRole } from "../types"

interface AuthState {
  token: string | null
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean

  setSession: (token: string, user?: AuthUser | null) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

function getStoredUser(): AuthUser | null {
  const stored = localStorage.getItem("dineops_user")

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    localStorage.removeItem("dineops_user")
    return null
  }
}

const storedToken = localStorage.getItem("access_token")
const storedUser = getStoredUser()

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  role: storedUser?.role ?? null,
  isAuthenticated: Boolean(storedToken),

  setSession: (token, user = null) => {
    localStorage.setItem("access_token", token)

    if (user) {
      localStorage.setItem("dineops_user", JSON.stringify(user))

      if (user.role) {
        localStorage.setItem("user_role", user.role)
      }
    }

    set({
      token,
      user,
      role: user?.role ?? null,
      isAuthenticated: true,
    })
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem("dineops_user", JSON.stringify(user))

      if (user.role) {
        localStorage.setItem("user_role", user.role)
      }

      set({
        user,
        role: user.role ?? null,
      })
    } else {
      localStorage.removeItem("dineops_user")
      localStorage.removeItem("user_role")

      set({
        user: null,
        role: null,
      })
    }
  },

  logout: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("dineops_user")
    localStorage.removeItem("user_role")

    set({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
    })
  },
}))