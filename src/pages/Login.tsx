import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Shooting stars state with randomized properties
  const [shootingStars, setShootingStars] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    left: number;
    top: number;
    width: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stars = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        delay: 0, // All start at the same time
        duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6), // +/- 30% variation: base 3-5s (slower), then 70%-130%
        // Varied origins - more from top-left, some from middle, some from upper-right edge, some from lower-right
        left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80, // First 4 from top-left third (0-33%), next 2 middle, last 4 from right edge (80-100%)
        top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50, // Last 2 from lower half (50-100%)
        width: 100 * (0.7 + Math.random() * 0.6), // +/- 30% variation: base 100px, range 70-130px
        opacity: 0.7 + Math.random() * 0.6, // +/- 30% brightness: range 0.7-1.3 (capped at 1 by CSS)
      }));
      setShootingStars(stars);
    }, 100); // Start almost immediately
    return () => clearTimeout(timer);
  }, []);

  const handleModeSwitch = (signUp: boolean) => {
    if (signUp !== isSignUp) {
      setIsTransitioning(true);
      setIsSignUp(signUp);
      setError('');
      
      // Delay form expansion to create sequential animation effect
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200); // Match the slider transition duration
    }
  };

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
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError(t('auth.password_mismatch'));
          setLoading(false);
          return;
        }
        
        // Sign up logic
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Check if user is a founding member
          const { data: foundingMember } = await supabase
            .from('founding_members')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

          if (foundingMember) {
            navigate('/member/onboarding');
          } else {
            navigate('/');
          }
        }
      } else {
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
            navigate('/');
          }
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
        body {
          background: linear-gradient(to bottom, #0a0a0a, #0f0a08, #0a0a0a);
          background-attachment: fixed;
        }
      `}</style>
      <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0a08] to-[#0a0a0a] flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0a08] to-[#0a0a0a]">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100/70 animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
              opacity: Math.random() * 0.5 + 0.5,
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
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-500 ease-in-out">
          {/* Stella Logo/Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img 
                src="/stella-logo.png" 
                alt="Stella Logo" 
                className="h-24 sm:h-32 w-auto object-contain"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))'
                }}
              />
            </div>
            <h1 
              className="text-xl sm:text-2xl font-light uppercase tracking-[0.4em] text-amber-200/80 mb-2" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 300,
                textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
              }}
            >
              EXECUTIVE LOGIN
            </h1>
          </div>

          {/* Mode Toggle - Slider Switch */}
          <div className="relative flex mb-4 sm:mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
            {/* Sliding indicator background */}
            <div 
              className="absolute top-1 bottom-1 rounded-lg bg-amber-500/20 border border-amber-500/30 shadow-lg transition-all ease-in-out"
              style={{
                width: 'calc(50% - 4px)',
                left: isSignUp ? 'calc(50% + 0px)' : '4px',
                transitionDuration: '1200ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-colors duration-700 ${
                !isSignUp
                  ? 'text-amber-200'
                  : 'text-white/40'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {t('constellation.signin')}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-colors duration-700 ${
                isSignUp
                  ? 'text-amber-200'
                  : 'text-white/40'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {t('constellation.signup')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                {t('constellation.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm uppercase"
                placeholder={t('constellation.email')}
                required
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                {t('constellation.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm pr-10 uppercase"
                  placeholder={t('constellation.password')}
                  required
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && !isTransitioning && (
              <div className="animate-fadeIn">
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                  {t('auth.confirm_password')}
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm pr-10 uppercase"
                    placeholder={t('auth.confirm_password')}
                    required
                    style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-200 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-200 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-amber-500/30 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/25 text-xs sm:text-sm"
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {loading ? t('constellation.loading') : isSignUp ? t('constellation.signup') : t('constellation.signin_button')}
            </button>
          </form>

          {!isSignUp && !isTransitioning && (
            <div className="mt-4 sm:mt-6 text-center animate-fadeIn">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-amber-200/60 hover:text-amber-200 transition-colors text-xs sm:text-sm"
              >
                {t('auth.back_to_home')}
              </button>
            </div>
          )}
        </div>

        {/* Demo mode hint */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-white/30 text-[10px] sm:text-xs">
            Demo: email: demo, password: stella
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
