/** Spec section 1 — holds JWT + current student profile. Wired to real /auth endpoints. */
import { createContext, useContext, useState, useEffect } from 'react'
import { loginStudent, registerStudent } from '../api/auth'
import apiClient from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: if token exists, fetch /students/me to hydrate student state
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      fetchProfile(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async (tok) => {
    try {
      const res = await apiClient.get('/students/me', {
        headers: { Authorization: `Bearer ${tok}` },
      })
      setStudent(res.data)
    } catch {
      // Token invalid — clear it
      setToken(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await loginStudent({ college_email: email, password })
    const { access_token } = res.data
    localStorage.setItem('token', access_token)
    setToken(access_token)
    await fetchProfile(access_token)
  }

  const register = async (payload) => {
    const res = await registerStudent(payload)
    const { access_token } = res.data
    localStorage.setItem('token', access_token)
    setToken(access_token)
    await fetchProfile(access_token)
  }

  const logout = () => {
    setToken(null)
    setStudent(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, student, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
