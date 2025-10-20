import React from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [status, setStatus] = React.useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [message, setMessage] = React.useState('')
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setStatus('error'); setMessage('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setStatus('error'); setMessage('Passwords do not match.'); return }
    setStatus('saving'); setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setStatus('error'); setMessage(error.message) }
    else { setStatus('saved'); setMessage('Password updated. Redirecting to login…'); setTimeout(()=>navigate('/login'), 1500) }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/80 p-6">
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <p className="mt-1 text-sm text-slate-500">Set a new password for your account.</p>
        <label className="grid gap-1 text-sm mt-4">
          <span className="font-medium">New password</span>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40" />
        </label>
        <label className="grid gap-1 text-sm mt-3">
          <span className="font-medium">Confirm password</span>
          <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40" />
        </label>
        {message && <p className={`mt-3 text-sm ${status==='error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
        <button disabled={status==='saving'} className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">
          {status==='saving' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
