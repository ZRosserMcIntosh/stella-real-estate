import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import BackgroundVideo from '../components/BackgroundVideo'
import { getSiteSettings } from '../lib/siteSettings'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loginVideoId, setLoginVideoId] = useState<string>('bv2x5gn_Tc0')
  const { activateDemo, session, isDemo, loading: authLoading } = useAuth()

  React.useEffect(() => {
    const load = async () => {
      try {
        const s = await getSiteSettings(['video_login_id'])
        if (s.video_login_id) setLoginVideoId(s.video_login_id)
      } catch { /* ignore */ }
    }
    load()
  }, [])

  React.useEffect(() => {
    if (authLoading) return
    if (session || isDemo) navigate('/admin', { replace: true })
  }, [authLoading, session, isDemo, navigate])

  const startDemo = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await activateDemo()
      navigate('/admin')
    } catch (err: any) {
      const message = err?.message ?? 'Unable to start demo session.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [activateDemo, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = identifier.trim()
    if (mode === 'signin' && trimmed.toLowerCase() === 'demo') {
      // Only allow demo if the password matches the shared demo password
      if (password.trim() !== 'stella') {
        setError('Enter DEMO with password stella to explore, or sign in with your email.')
        return
      }
      await startDemo()
      return
    }
    setLoading(true)
    let error: { message: string } | null = null
    if (mode === 'signin') {
      if (!trimmed || !trimmed.includes('@')) {
        setLoading(false)
        return setError('Enter the email address for your account.')
      }
      const res = await supabase.auth.signInWithPassword({ email: trimmed, password })
      error = res.error
      
      // Safari-specific: Check if localStorage is available
      if (!error && !res.data?.session) {
        try {
          if (typeof window !== 'undefined' && !window.localStorage) {
            setError('Please enable cookies and site data in your browser settings to sign in.')
            setLoading(false)
            return
          }
        } catch (e) {
          setError('Please enable cookies and site data in Safari (Settings > Privacy) to sign in.')
          setLoading(false)
          return
        }
      }
    } else {
      if (!trimmed || !trimmed.includes('@')) {
        setLoading(false)
        return setError('Enter a valid email address to create an account.')
      }
      const res = await supabase.auth.signUp({ email: trimmed, password })
      error = res.error
      // If email confirmations are enabled, user must confirm via email before sign-in
      if (!error && res.data?.user && res.data.user?.email_confirmed_at == null) {
        setLoading(false)
        return setError('Check your email to confirm your account, then sign in.')
      }
    }
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/admin')
  }

  return (
    <div className="min-h-screen flex flex-col p-6 relative">
      <BackgroundVideo videoId={loginVideoId} />
      <div className="flex items-center justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 grid place-items-center relative z-10">
      <form onSubmit={onSubmit} noValidate className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}</h1>
          <button
            type="button"
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null) }}
            className="text-sm text-brand-700 hover:underline"
          >
            {mode === 'signin' ? t('auth.createAccount') : t('auth.haveAccount')}
          </button>
        </div>
  <p className="mt-1 text-sm text-slate-500">{t('auth.useAccount')}</p>

  <label className="grid gap-1 text-sm mt-4">
          <span className="font-medium">{t('auth.email')}</span>
          <input
            value={identifier}
            onChange={e=>setIdentifier(e.target.value)}
            type={mode === 'signin' ? 'text' : 'email'}
            inputMode={mode === 'signin' ? 'text' : 'email'}
            autoCorrect="off"
            autoCapitalize="none"
            autoComplete="username"
            required
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
        </label>

        <label className="grid gap-1 text-sm mt-3">
          <span className="font-medium">{t('auth.password')}</span>
          <div className="relative">
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type={showPassword ? "text" : "password"} 
              required
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button disabled={loading}
          className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">
          {loading ? (mode === 'signin' ? t('auth.signingIn') : t('auth.creating')) : (mode === 'signin' ? t('auth.signIn') : t('auth.createAccount'))}
        </button>
  {/* Demo CTA intentionally hidden; DEMO/stella still works via identifier handling. */}
      </form>
      </div>
  <p className="mt-3 text-center text-sm text-slate-300 relative z-10 drop-shadow">{t('auth.forgotPrompt')} <Link className="text-brand-200 hover:underline" to="/forgot-password">{t('auth.reset')}</Link>.</p>
    </div>
  )
}
