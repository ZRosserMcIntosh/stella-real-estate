import React, { useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConstellationUrls } from '../../utils/constellationUrl';

export default function MobileLogins() {
  const navigate = useNavigate();
  const { session, isDemo, loading: authLoading } = useAuth();

  // Static background stars - memoized to prevent regeneration on re-renders
  // MUST be called before any conditional returns to follow Rules of Hooks
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
  }, []);

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
  }, []);

  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (!authLoading && (session || isDemo)) {
      // Check if it's a constellation user (has constellation-related metadata)
      // For now, redirect to Constellation dashboard as that's the main use case
      const dashboardUrl = ConstellationUrls.dashboard();
      
      // If it's a full URL (cross-domain), use window.location
      if (dashboardUrl.startsWith('http')) {
        window.location.href = dashboardUrl;
      } else {
        navigate(dashboardUrl, { replace: true });
      }
    }
  }, [authLoading, session, isDemo, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505] flex items-center justify-center">
        <div className="text-amber-200/60 text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        html, body {
          background: linear-gradient(to bottom, #050505, #080606, #050505) !important;
          background-attachment: fixed;
          min-height: 100vh;
        }
      `}</style>
      <div className="relative min-h-screen bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505] flex items-center justify-center px-4 py-8">
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

        {/* Login Options Card */}
        <div className="relative z-10 w-full max-w-sm">
          <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 transition-all duration-500 ease-in-out">
            {/* Stella Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/stella-logo.png" 
                  alt="Stella Logo" 
                  className="h-20 w-auto object-contain"
                  style={{
                    filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))'
                  }}
                />
              </div>
              <h1 
                className="text-base font-light uppercase tracking-[0.4em] text-amber-200/80" 
                style={{ 
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 300,
                  textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
                }}
              >
                ENTRAR
              </h1>
            </div>

            {/* Login Options */}
            <div className="space-y-3 animate-fadeIn">
              <Link
                to="/sub/constellation/login"
                className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <img 
                    src="/contellation-logo.png" 
                    alt="Constellation" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-sm font-light uppercase tracking-[0.3em] text-indigo-200/80 group-hover:text-indigo-200" 
                    style={{ 
                      fontFamily: 'Outfit, sans-serif',
                      textShadow: '0 0 15px rgba(129, 140, 248, 0.4), 0 0 30px rgba(129, 140, 248, 0.15)'
                    }}
                  >
                    CONSTELLATION
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">Para corretores</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>

              <Link
                to="/admin/login"
                className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-xl p-4 transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <img 
                    src="/stella-favicon.png" 
                    alt="Stella" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-sm font-light uppercase tracking-[0.3em] text-amber-200/80 group-hover:text-amber-200" 
                    style={{ 
                      fontFamily: 'Outfit, sans-serif',
                      textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
                    }}
                  >
                    STELLA REAL TEAM
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">Para equipe e administradores</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>

              <Link
                to="/admin"
                className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-400/80 group-hover:text-purple-400">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-sm font-light uppercase tracking-[0.3em] text-purple-200/80 group-hover:text-purple-200" 
                    style={{ 
                      fontFamily: 'Outfit, sans-serif',
                      textShadow: '0 0 15px rgba(192, 132, 252, 0.4), 0 0 30px rgba(192, 132, 252, 0.15)'
                    }}
                  >
                    CLIENT LOGIN
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">Para clientes e investidores</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-purple-400/50 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs text-amber-200/60 hover:text-amber-200 transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                </svg>
                Voltar ao Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
