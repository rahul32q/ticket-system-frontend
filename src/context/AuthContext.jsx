import { createContext, useContext, useState, useCallback } from 'react'
import { api, getToken, setToken, clearToken } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken())

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    setToken(data.token)
    setTokenState(data.token)
  }, [])

  const register = useCallback(async (name, email, password) => {
    await api.register(name, email, password)
    await login(email, password)
  }, [login])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
