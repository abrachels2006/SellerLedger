import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react"
 
import {
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  loginUser,
  registerUser,
  setStoredToken,
  type LoginInput,
  type RegisterInput,
  type User,
} from "../lib/api"
 
type AuthStatus = "checking" | "authenticated" | "unauthenticated"
 
type AuthContextValue = {
  user: User | null
  status: AuthStatus
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => void
}
 
const AuthContext = createContext<AuthContextValue | undefined>(undefined)
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => {
    return getStoredToken() ? "checking" : "unauthenticated"
  })
 
  useEffect(() => {
    let ignore = false
 
    async function loadCurrentUser() {
      // No token means there is nothing to verify.
      if (!getStoredToken()) {
        setStatus("unauthenticated")
        return
      }
 
      try {
        // Ask the backend whether the stored token is still valid.
        const response = await getCurrentUser()
 
        if (!ignore) {
          setUser(response.user)
          setStatus("authenticated")
        }
      } catch {
        // If the token is expired or invalid, remove it and sign out locally.
        clearStoredToken()
 
        if (!ignore) {
          setUser(null)
          setStatus("unauthenticated")
        }
      }
    }
 
    void loadCurrentUser()
 
    return () => {
      ignore = true
    }
  }, [])
 
  const login = useCallback(async (input: LoginInput) => {
    const response = await loginUser(input)
    setStoredToken(response.token)
    setUser(response.user)
    setStatus("authenticated")
  }, [])
 
  const register = useCallback(async (input: RegisterInput) => {
    const response = await registerUser(input)
    setStoredToken(response.token)
    setUser(response.user)
    setStatus("authenticated")
  }, [])
 
  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
    setStatus("unauthenticated")
  }, [])
 
  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout],
  )
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
 
export function useAuth() {
  const context = useContext(AuthContext)
 
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
 
  return context
}
