import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../api/client'

export type Manager = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  role: string
}

type AuthState = {
  token: string | null
  manager: Manager | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const STORAGE_TOKEN = 'sm_token'
const STORAGE_MANAGER = 'sm_manager'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN))
  const [manager, setManager] = useState<Manager | null>(() => {
    const raw = localStorage.getItem(STORAGE_MANAGER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as Manager
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_TOKEN, token)
    else localStorage.removeItem(STORAGE_TOKEN)
  }, [token])

  useEffect(() => {
    if (manager) localStorage.setItem(STORAGE_MANAGER, JSON.stringify(manager))
    else localStorage.removeItem(STORAGE_MANAGER)
  }, [manager])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await api<{ token: string; manager: Manager }>('/system-management/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(res.token)
      setManager({
        ...res.manager,
        id: String(res.manager.id),
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setManager(null)
  }, [])

  const value = useMemo(
    () => ({ token, manager, loading, login, logout }),
    [token, manager, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
