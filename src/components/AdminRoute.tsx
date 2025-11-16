import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function AdminRoute() {
  const { session, loading: authLoading } = useAuth()
  const [userType, setUserType] = useState<string | null>(null)
  const [checkingType, setCheckingType] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!session) {
      setCheckingType(false)
      return
    }

    checkUserType()
  }, [session, authLoading])

  const checkUserType = async () => {
    if (!session?.user?.id) {
      setCheckingType(false)
      return
    }

    try {
      // Check user_profiles table for user_type
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching user type:', error)
        setUserType(null)
      } else {
        setUserType(data?.user_type || null)
      }
    } catch (err) {
      console.error('Error:', err)
      setUserType(null)
    } finally {
      setCheckingType(false)
    }
  }

  // Still loading
  if (authLoading || checkingType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Check if user is admin or team member
  if (userType !== 'stella_admin' && userType !== 'stella_team') {
    // Constellation users or other types - redirect to their dashboard
    if (userType === 'constellation_user') {
      return <Navigate to="/sub/constellation/dashboard" replace />
    }
    // Unknown user type - redirect to login
    return <Navigate to="/login" replace />
  }

  // User is authorized admin/team - render protected routes
  return <Outlet />
}
