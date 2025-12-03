import React, { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link } from 'react-router-dom'
import { ConstellationUrls } from '../../utils/constellationUrl'

export default function ConstellationReset() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sub/constellation/update-password`,
      })

      if (resetError) throw resetError

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Animated star background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
        {/* Static stars */}
        {staticStars.map((star) => (
          <div
            key={`static-${star.id}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animation: `twinkle ${star.animationDuration}s ease-in-out ${star.animationDelay}s infinite`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              width: `${star.width}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animation: `shoot ${star.duration}s linear ${star.delay}s infinite`,
              transform: 'rotate(-45deg)',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Redefinir Senha
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Digite seu e-mail para receber instruções
              </p>
            </div>

            {success ? (
              <div className="text-center">
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">
                    E-mail de redefinição enviado! Verifique sua caixa de entrada.
                  </p>
                </div>
                <a
                  href={ConstellationUrls.login()}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
                >
                  ← Voltar para Login
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-xs sm:text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {loading ? 'Enviando...' : 'Enviar E-mail de Redefinição'}
                </button>
              </form>
            )}

            {/* Links */}
            <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs">
              <a href={ConstellationUrls.home()} className="text-slate-400 hover:text-indigo-400 transition-colors">
                ← Voltar
              </a>
              <a href={ConstellationUrls.login()} className="text-slate-400 hover:text-indigo-400 transition-colors">
                Fazer Login
              </a>
              <a href={ConstellationUrls.signup()} className="text-slate-400 hover:text-indigo-400 transition-colors">
                Criar Conta →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(1000px) translateY(1000px) rotate(-45deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
