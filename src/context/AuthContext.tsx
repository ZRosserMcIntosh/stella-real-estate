import React from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

type AuthContextValue = {
  session: Session | null
  loading: boolean
  isDemo: boolean
  activateDemo: () => Promise<void>
  signOut: () => Promise<void>
}

const STORAGE_KEY = 'stella:demo-mode'

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const readStoredDemoFlag = () => {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = React.useState<Session | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isDemo, setIsDemo] = React.useState(readStoredDemoFlag)

  const persistDemoFlag = React.useCallback((next: boolean) => {
    if (typeof window === 'undefined') return
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, '1')
      else window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore storage errors */
    }
  }, [])

  const applyDemoClass = React.useCallback((active: boolean) => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('demo-mode', active)
  }, [])

  React.useEffect(() => {
    applyDemoClass(isDemo)
  }, [applyDemoClass, isDemo])

  React.useEffect(() => {
    let mounted = true
    const resolveSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(data.session ?? null)
        if (data.session) {
          setIsDemo(false)
          persistDemoFlag(false)
        } else {
          setIsDemo(readStoredDemoFlag())
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void resolveSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      if (nextSession) {
        setIsDemo(false)
        persistDemoFlag(false)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [persistDemoFlag])

  const activateDemo = React.useCallback(async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
    } catch {
      /* ignore sign-out failures */
    } finally {
      persistDemoFlag(true)
      setSession(null)
      setIsDemo(true)
      setLoading(false)
    }
  }, [persistDemoFlag])

  const signOut = React.useCallback(async () => {
    setLoading(true)
    persistDemoFlag(false)
    setIsDemo(false)
    try {
      await supabase.auth.signOut()
    } catch {
      /* ignore sign-out failures */
    } finally {
      setSession(null)
      setLoading(false)
    }
  }, [persistDemoFlag])

  const value = React.useMemo<AuthContextValue>(() => ({
    session,
    loading,
    isDemo,
    activateDemo,
    signOut,
  }), [session, loading, isDemo, activateDemo, signOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

