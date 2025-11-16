import React, { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function ConstellationLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []); // Empty deps - only generate once
  
  // Shooting stars - memoized to prevent regeneration on re-renders
  const shootingStars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: 0, // All start at the same time
      duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6), // +/- 30% variation: base 3-5s (slower), then 70%-130%
      // Varied origins - more from top-left, some from middle, some from upper-right edge, some from lower-right
      left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80, // First 4 from top-left third (0-33%), next 2 middle, last 4 from right edge (80-100%)
      top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50, // Last 2 from lower half (50-100%)
      width: 100 * (0.7 + Math.random() * 0.6), // +/- 30% variation: base 100px, range 70-130px
      opacity: 0.7 + Math.random() * 0.6, // +/- 30% brightness: range 0.7-1.3 (capped at 1 by CSS)
    }));
  }, []); // Empty deps - only generate once
  
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { session, isDemo, loading: authLoading } = useAuth()

  React.useEffect(() => {
    if (authLoading) return
    if (session || isDemo) navigate('/sub/constellation/dashboard', { replace: true })
  }, [authLoading, session, isDemo, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = identifier.trim()
    
    setLoading(true)
    let error: { message: string } | null = null
    
    // Sign in only
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
    
    if (error) {
      setLoading(false)
      return setError(error.message || 'An unknown error occurred.')
    }
    
    // Constellation users go to dashboard, not main admin
    setLoading(false)
    setTimeout(() => navigate('/sub/constellation/dashboard', { replace: true }), 200)
  }

  return (
    <>
      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }
      `}</style>
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              animationDelay: star.animationDelay + 's',
              animationDuration: star.animationDuration + 's',
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Shooting stars effect */}
      <style>{`
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(-500px) translateY(500px) rotate(-45deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, #fff, transparent);
          animation: shoot linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.width}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-500 ease-in-out">
          {/* Constellation Logo/Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img 
                src="/tech-icons/contellation-logo.png" 
                alt="Constellation" 
                className="h-24 sm:h-32 w-auto object-contain"
                style={{
                  filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(129, 140, 248, 0.4)) drop-shadow(0 0 16px rgba(129, 140, 248, 0.2))'
                }}
              />
            </div>
            <h1 
              className="text-xl sm:text-2xl font-light uppercase tracking-[0.4em] text-indigo-200/80 mb-2" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                textShadow: '0 0 20px rgba(129, 140, 248, 0.5), 0 0 40px rgba(129, 140, 248, 0.2)'
              }}
            >
              CONSTELLATION
            </h1>
            <p className="text-[10px] sm:text-xs font-light uppercase tracking-[0.4em] text-indigo-200/60 mt-3 sm:mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('constellation.signin_subtitle')}
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 animate-fadeIn">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                {t('constellation.email')}
              </label>
              <input
                id="email"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                {t('constellation.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-xs sm:text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('constellation.loading') : t('constellation.signin_button')}
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs">
            <Link to="/sub/constellation" className="text-slate-400 hover:text-indigo-400 transition-colors">
              ← Voltar
            </Link>
            <Link to="/sub/constellation/reset" className="text-slate-400 hover:text-indigo-400 transition-colors">
              Esqueci Senha
            </Link>
            <Link to="/sub/constellation/signup" className="text-slate-400 hover:text-indigo-400 transition-colors">
              Criar Conta →
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
