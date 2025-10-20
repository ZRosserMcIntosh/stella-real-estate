import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [message, setMessage] = React.useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setMessage('')
    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) { setStatus('error'); setMessage(error.message) }
    else { setStatus('sent'); setMessage('If an account exists, a reset link has been sent.') }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/80 p-6">
        <h1 className="text-xl font-semibold">Forgot Password</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your email to receive a reset link.</p>
        <label className="grid gap-1 text-sm mt-4">
          <span className="font-medium">Email</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="rounded-xl border border-slate-300 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40" />
        </label>
        {message && (
          <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-700'}`}>{message}</p>
        )}
        <button disabled={status==='sending'} className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">
          {status==='sending' ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </div>
  )
}
