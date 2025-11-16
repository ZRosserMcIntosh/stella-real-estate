import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      delay: 0,
      duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6),
      left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80,
      top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50,
      width: 100 * (0.7 + Math.random() * 0.6),
      opacity: 0.7 + Math.random() * 0.6,
    }));
  }, []); // Empty deps - only generate once

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo mode check
    if (email.toLowerCase() === 'demo' && password === 'stella') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
      return;
    }

    try {
      // Sign in logic
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Check if user is a founding member
        const { data: foundingMember } = await supabase
          .from('founding_members')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (foundingMember) {
          navigate('/member/dashboard');
        } else {
          navigate('/admin');
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        html, body {
          background: linear-gradient(to bottom, #050505, #080606, #050505) !important;
          background-attachment: fixed;
          min-height: 100vh;
        }
        /* Force inputs to respect case sensitivity */
        #email, #password {
          text-transform: none !important;
          font-variant: normal !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
        /* Force placeholder to be lowercase too */
        #email::placeholder, #password::placeholder {
          text-transform: none !important;
        }
      `}</style>
      <div className="relative min-h-screen bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505] flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505]">
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-amber-100/70 animate-pulse"
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
          background: linear-gradient(90deg, rgba(255, 250, 240, 0.9), rgba(251, 191, 36, 0.5), transparent);
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
      <div className="relative z-10 w-full max-w-xs">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-5 transition-all duration-500 ease-in-out">
          {/* Stella Logo/Title */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img 
                src="/stella-logo.png" 
                alt="Stella Logo" 
                className="h-16 sm:h-20 w-auto object-contain"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))'
                }}
              />
            </div>
            <h1 
              className="text-sm sm:text-base font-light uppercase tracking-[0.4em] text-amber-200/80 mb-2" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 300,
                textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
              }}
            >
              ENTRAR
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                {t('constellation.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs"
                placeholder="voce@email.com.br"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                {t('constellation.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs pr-9"
                  placeholder="senha"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-200 text-[10px] sm:text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-200 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-amber-500/30 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/25 text-[10px] sm:text-xs"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {loading ? t('constellation.loading') : t('constellation.signin_button')}
            </button>
          </form>

          <div className="mt-3 sm:mt-4 text-center animate-fadeIn space-y-2">
            <p className="text-white/60 text-[10px] sm:text-xs">
              Não tem uma conta?
            </p>
            <Link
              to="/admin/signup"
              className="block text-amber-200/80 hover:text-amber-200 transition-colors text-[10px] sm:text-xs font-medium"
            >
              Cadastrar
            </Link>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="block w-full text-amber-200/60 hover:text-amber-200 transition-colors text-[10px] sm:text-xs mt-2"
            >
              {t('auth.back_to_home')}
            </button>
          </div>
        </div>

        {/* Demo mode hint */}
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-white/30 text-[9px] sm:text-[10px]">
            Demo: email: demo, password: stella
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
