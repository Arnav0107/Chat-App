import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'
import { initSocket, disconnectSocket } from '../lib/socket'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
      initSocket(res.data._id) // ← connect socket on page load if already logged in
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    initSocket(res.data._id) // ← connect socket on login
    return res.data
  }

  const signup = async (fullName, email, password) => {
    const res = await api.post('/auth/signup', { fullName, email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data)
    initSocket(res.data._id) // ← connect socket on signup
    return res.data
  }

  const logout = async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    disconnectSocket() // ← disconnect socket on logout
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
