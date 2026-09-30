import { useState } from "react"
import type { FormEvent } from "react"
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Utensils,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, login } from "../../services/auth"
import { useAuth } from "../../hooks/useAuth"

function Login() {
  const navigate = useNavigate()
  const { setSession } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      // 1. Login and receive JWT
      const response = await login(email, password)

      // 2. Store token BEFORE calling /auth/me
      setSession(response.access_token, null)

      // 3. Get logged-in user's details
      const user = await getCurrentUser()

      // 4. Store token + user
      setSession(response.access_token, user)

      // 5. Go to dashboard
      navigate("/dashboard", { replace: true })
    } catch (error: any) {
      console.error("Login error:", error?.response?.data || error)

      setError(
        error?.response?.data?.detail ||
          "Unable to login. Please check your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">

      {/* LEFT SIDE */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">

        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
          alt="Restaurant"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500">
              <Utensils size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                DineOps
              </h1>

              <p className="text-sm text-white/70">
                Restaurant ERP
              </p>
            </div>
          </div>

          <div className="max-w-lg">

            <p className="mb-3 font-semibold text-emerald-300">
              RESTAURANT OPERATIONS
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Everything your restaurant needs,
              <span className="text-emerald-300">
                {" "}in one place.
              </span>
            </h2>

            <p className="mt-5 text-lg text-white/75">
              Manage orders, inventory, products,
              customers and your entire restaurant
              operation from one powerful platform.
            </p>

          </div>

          <p className="text-sm text-white/60">
            © 2026 DineOps. All rights reserved.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* MOBILE LOGO */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Utensils size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                DineOps
              </h1>

              <p className="text-xs text-gray-400">
                Restaurant ERP
              </p>
            </div>

          </div>

          {/* HEADING */}
          <div className="mb-8">

            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="mt-2 text-gray-500">
              Sign in to manage your restaurant.
            </p>

          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@dineops.com"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-12 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-emerald-500 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Secure restaurant management powered by DineOps
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login