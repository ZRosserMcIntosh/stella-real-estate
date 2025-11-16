import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function ConstellationDashboard() {
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | null>(null)
  const [memberData, setMemberData] = useState<any>(null)
  const navigate = useNavigate()
  const { session } = useAuth()

  useEffect(() => {
    if (!session) {
      navigate('/sub/constellation/login')
      return
    }

    checkPaymentStatus()
  }, [session, navigate])

  const checkPaymentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      if (error) {
        console.error('Error fetching member data:', error)
        setLoading(false)
        return
      }

      setMemberData(data)
      setPaymentStatus(data.payment_status)
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/sub/constellation/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // User has pending payment
  if (paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Pending
          </h1>
          
          <p className="text-lg text-slate-300 mb-6">
            Thank you for your interest in Constellation, {memberData?.full_name}!
          </p>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
            <p className="text-slate-300 mb-4">
              You still need to complete your payment to get access to the Constellation platform.
            </p>
            <p className="text-sm text-slate-400">
              If you just completed payment, please wait a few seconds and click "Refresh Status" below.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setLoading(true)
                checkPaymentStatus()
              }}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Refresh Status
            </button>
            <button
              onClick={() => navigate('/sub/constellation/signup')}
              className="py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              Complete Payment
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User has paid
  if (paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to Constellation!
          </h1>
          
          <p className="text-lg text-slate-300 mb-2">
            Thank you, {memberData?.full_name}!
          </p>
          
          {memberData?.member_number && (
            <p className="text-sm text-indigo-400 mb-6">
              Founding Member #{memberData.member_number}
            </p>
          )}

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
            <p className="text-slate-300 mb-4">
              Your payment has been confirmed. You are now a <span className="text-indigo-400 font-semibold">Founding Member #{memberData?.member_number}</span> of Constellation!
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Email: <span className="text-white">{memberData?.email}</span><br/>
              CRECI: <span className="text-white">{memberData?.creci_number}/{memberData?.creci_uf}</span><br/>
              Status: <span className="text-green-400">Paid</span><br/>
              {memberData?.payment_completed_at && (
                <>Member Since: <span className="text-white">{new Date(memberData.payment_completed_at).toLocaleDateString()}</span></>
              )}
            </p>
            <p className="text-slate-300">
              We'll notify you via email at <span className="text-indigo-400">{memberData?.email}</span> when your Constellation dashboard is ready.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/sub/constellation')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
            >
              Back to Portal
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
            >
              Sign Out
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-8">
            Dashboard coming soon • We're building your personalized platform
          </p>
        </div>
      </div>
    )
  }

  // Fallback - no payment record found
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
        <p className="text-white">No payment record found. Please contact support.</p>
        <button
          onClick={handleSignOut}
          className="mt-4 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
