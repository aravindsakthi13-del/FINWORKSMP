import type { User } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getSession,
  getUserProfile,
  onAuthStateChange,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  type SignInParams,
  type SignUpParams,
  type UserProfile,
  type UserRole,
} from '../services/authService'
import { isSupabaseConfigured } from '../services/supabaseClient'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  role: UserRole | null
  loading: boolean
  error: string | null
  isConfigured: boolean
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      try {
        const session = await getSession()
        if (session?.user && isMounted) {
          setUser(session.user)
          const userProfile = await getUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Auth initialization failed')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    const { unsubscribe } = onAuthStateChange((session, userProfile) => {
      if (!isMounted) return
      setUser(session?.user || null)
      setProfile(userProfile)
      setLoading(false)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (params: SignInParams) => {
    setLoading(true)
    setError(null)
    const result = await apiSignIn(params)
    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return { success: false, error: result.error.message }
    }

    setUser(result.user)
    setProfile(result.profile)
    return { success: true }
  }, [])

  const signUp = useCallback(async (params: SignUpParams) => {
    setLoading(true)
    setError(null)
    const result = await apiSignUp(params)
    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      return { success: false, error: result.error.message }
    }

    setUser(result.user)
    setProfile(result.profile)
    return { success: true }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    await apiSignOut()
    setUser(null)
    setProfile(null)
    setLoading(false)
  }, [])

  const value: AuthContextValue = {
    user,
    profile,
    role: profile?.role || (user?.user_metadata?.role as UserRole) || null,
    loading,
    error,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
