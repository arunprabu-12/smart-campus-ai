/** Central axios instance — attaches JWT to every request. Redirects to /login on 401. */
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
})

// Attach JWT token to every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.metadata = { startTime: new Date().getTime() }
  return config
})

// Handle 401 globally — clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.metadata?.startTime) {
      const duration = new Date().getTime() - response.config.metadata.startTime
      window.dispatchEvent(new CustomEvent('api_latency', { detail: duration }))
    }
    return response
  },
  (error) => {
    if (error.config?.metadata?.startTime) {
      const duration = new Date().getTime() - error.config.metadata.startTime
      window.dispatchEvent(new CustomEvent('api_latency', { detail: duration }))
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
