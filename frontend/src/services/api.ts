import axios from "axios"

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ""

      // Don't redirect while attempting to login.
      if (!requestUrl.includes("/auth/login")) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("dineops_user")
        localStorage.removeItem("user_role")

        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api