/**
 * AdminAuthContext — separate from student AuthContext.
 * Stores admin/staff JWT + profile in localStorage under 'admin_token'.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const AdminAuthContext = createContext(null)

const adminApi = axios.create({ baseURL: BASE_URL })

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null)
  const [admin, setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('admin_token')
    if (saved) {
      setToken(saved)
      fetchAdminProfile(saved)
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchAdminProfile(tok) {
    try {
      const res = await adminApi.get('/admin-auth/me', {
        headers: { Authorization: `Bearer ${tok}` },
      })
      setAdmin(res.data)
    } catch {
      setToken(null)
      localStorage.removeItem('admin_token')
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const res = await adminApi.post('/admin-auth/login', { email, password })
    const { access_token, role, name } = res.data
    localStorage.setItem('admin_token', access_token)
    setToken(access_token)
    setAdmin({ email, role, full_name: name })
    return role
  }

  function logout() {
    setToken(null)
    setAdmin(null)
    localStorage.removeItem('admin_token')
  }

  // Axios instance with auth header pre-set for admin API calls
  const api = {
    get: (url, cfg = {}) =>
      adminApi.get(url, { ...cfg, headers: { Authorization: `Bearer ${token}`, ...cfg.headers } }),
    post: (url, data, cfg = {}) =>
      adminApi.post(url, data, { ...cfg, headers: { Authorization: `Bearer ${token}`, ...cfg.headers } }),
    put: (url, data, cfg = {}) =>
      adminApi.put(url, data, { ...cfg, headers: { Authorization: `Bearer ${token}`, ...cfg.headers } }),
    delete: (url, cfg = {}) =>
      adminApi.delete(url, { ...cfg, headers: { Authorization: `Bearer ${token}`, ...cfg.headers } }),
  }

  return (
    <AdminAuthContext.Provider value={{ token, admin, login, logout, loading, api }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
