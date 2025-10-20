import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'
import BackgroundVideo from '../components/BackgroundVideo'
import { getSiteSettings } from '../lib/siteSettings'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loginVideoId, setLoginVideoId] = useState<string>('bv2x5gn_Tc0')

  React.useEffect(() => {
    const load = async () => {
      try {
        const s = await getSiteSettings(['video_login_id'])
        if (s.video_login_id) setLoginVideoId(s.video_login_id)
      } catch { /* ignore */ }
    }
    load()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    let error: { message: string } | null = null
    if (mode === 'signin') {
      const res = await supabase.auth.signInWithPassword({ email, password })
      error = res.error
    } else {
      const res = await supabase.auth.signUp({ email, password })
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
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-lg">
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
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
        </label>

        <label className="grid gap-1 text-sm mt-3">
          <span className="font-medium">{t('auth.password')}</span>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button disabled={loading}
          className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">
          {loading ? (mode === 'signin' ? t('auth.signingIn') : t('auth.creating')) : (mode === 'signin' ? t('auth.signIn') : t('auth.createAccount'))}
        </button>
      </form>
      </div>
  <p className="mt-3 text-center text-sm text-slate-300 relative z-10 drop-shadow">{t('auth.forgotPrompt')} <Link className="text-brand-200 hover:underline" to="/forgot-password">{t('auth.reset')}</Link>.</p>
    </div>
  )
}

