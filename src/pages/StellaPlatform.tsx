import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UserTypeIcon from '../components/icons/UserTypeIcon'

export default function StellaPlatform() {
  const { t } = useTranslation()
  const [triggerAnimation, setTriggerAnimation] = useState(1) // Start with 1 to trigger initial animation
  const constellationCardRef = useRef<HTMLDivElement>(null)
  const balletCardRef = useRef<HTMLDivElement>(null)
  const hasShootingStarTriggered = useRef(false) // Only trigger shooting star once ever
  const hasBalletEnteredRef = useRef(false)
  const hasBalletExitedRef = useRef(false)
  const [balletSpotlightActive, setBalletSpotlightActive] = useState(false)
  const [balletSpotlightExit, setBalletSpotlightExit] = useState(false)

  // Helper function to safely get translation arrays
  const getTranslationArray = (key: string): string[] => {
    const result = t(key, { returnObjects: true })
    return Array.isArray(result) ? result as string[] : []
  }

  useEffect(() => {
    const handleScroll = () => {
      // Constellation card scroll detection - trigger shooting star only once
      if (constellationCardRef.current && !hasShootingStarTriggered.current) {
        const rect = constellationCardRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const cardCenter = rect.top + rect.height / 2
        const viewportCenter = viewportHeight / 2
        
        // Check if card center is near viewport center (within 100px tolerance)
        const isNearCenter = Math.abs(cardCenter - viewportCenter) < 100
        
        if (isNearCenter) {
          hasShootingStarTriggered.current = true
          setTriggerAnimation(prev => prev + 1)
        }
      }

      // Ballet card scroll detection
      if (balletCardRef.current) {
        const rect = balletCardRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const cardTop = rect.top
        const cardBottom = rect.bottom
        
        // Check if card is leaving the viewport (scrolled past)
        const hasScrolledPast = cardBottom < 0
        
        // Check if card is visible in viewport
        const isVisible = cardTop < viewportHeight && cardBottom > 0
        
        // Entry: Card becomes visible and hasn't entered yet
        if (isVisible && !hasBalletEnteredRef.current) {
          hasBalletEnteredRef.current = true
          hasBalletExitedRef.current = false
          setBalletSpotlightActive(true)
          setBalletSpotlightExit(false)
        } 
        // Exit: Card scrolled past bottom and hasn't exited yet
        else if (hasScrolledPast && hasBalletEnteredRef.current && !hasBalletExitedRef.current) {
          hasBalletExitedRef.current = true
          setBalletSpotlightExit(true)
          setTimeout(() => {
            setBalletSpotlightActive(false)
            setBalletSpotlightExit(false)
          }, 1000)
        } 
        // Reset: Card is back in view from top (user scrolled back up)
        else if (!isVisible && !hasScrolledPast) {
          hasBalletEnteredRef.current = false
          hasBalletExitedRef.current = false
          setBalletSpotlightActive(false)
          setBalletSpotlightExit(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseEnter = () => {
    setTriggerAnimation(prev => prev + 1)
  }

  return (
    <div className="bg-slate-950 text-slate-100">
      <style>{`
        @keyframes shootingStar {
          0% {
            left: var(--star-start-x, 100%);
            top: var(--star-start-y, 0%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: var(--star-end-x, 0%);
            top: var(--star-end-y, 66%);
            opacity: 0;
          }
        }
        
        .shooting-star {
          animation: shootingStar 0.4s ease-in 0s 1 forwards;
          width: 2px;
          height: 2px;
          position: absolute;
          --star-start-x: 100%;
          --star-start-y: 0%;
          --star-end-x: 0%;
          --star-end-y: 110%;
          --tail-angle: -33deg;
        }
        
        /* Mobile optimization: adjust travel path and tail angle for portrait screens */
        @media (max-width: 768px) {
          .shooting-star {
            /* Adjust path to be more diagonal on mobile (accounting for portrait aspect ratio) */
            --star-start-x: 95%;
            --star-start-y: 5%;
            --star-end-x: 5%;
            --star-end-y: 85%;
            /* Steeper tail angle for mobile to match the travel angle */
            --tail-angle: -65deg;
          }
        }
        
        /* Smaller mobile screens (iPhone SE, etc) */
        @media (max-width: 430px) {
          .shooting-star {
            --star-start-x: 92%;
            --star-start-y: 8%;
            --star-end-x: 8%;
            --star-end-y: 80%;
            --tail-angle: -65deg;
          }
        }
        
        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 2px;
          width: 150px;
          height: 2px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9) 30%, rgba(147, 197, 253, 0.7));
          filter: blur(1.5px);
          transform: translateY(-50%) rotate(var(--tail-angle));
          transform-origin: left center;
        }
        
        /* Shorter tail on mobile for better proportions */
        @media (max-width: 768px) {
          .shooting-star::before {
            width: 100px;
          }
        }
        
        .shooting-star::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(255, 255, 255, 1), 0 0 24px rgba(147, 197, 253, 0.8);
          filter: blur(0.5px);
          transform: translate(50%, -50%);
        }
        
        .shooting-star-container {
          animation: hideAfter 0s linear 1.3s 1 forwards;
        }
        
        @keyframes hideAfter {
          to {
            display: none;
            visibility: hidden;
          }
        }

        @keyframes spotlightMergeLeft {
          0% {
            left: -10%;
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            left: 50%;
            opacity: 1;
          }
        }
        
        @keyframes spotlightMergeRight {
          0% {
            left: 110%;
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            left: 50%;
            opacity: 1;
          }
        }

        @keyframes spotlightExitLeft {
          0% {
            left: 50%;
            opacity: 1;
          }
          100% {
            left: -10%;
            opacity: 0;
          }
        }
        
        @keyframes spotlightExitRight {
          0% {
            left: 50%;
            opacity: 1;
          }
          100% {
            left: 110%;
            opacity: 0;
          }
        }
        
        @keyframes balletPirouette {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        
        .spotlight-merge-left {
          animation: spotlightMergeLeft 2s ease-out forwards;
        }
        
        .spotlight-merge-right {
          animation: spotlightMergeRight 2s ease-out forwards;
        }

        .spotlight-exit-left {
          animation: spotlightExitLeft 1s ease-in forwards;
        }
        
        .spotlight-exit-right {
          animation: spotlightExitRight 1s ease-in forwards;
        }
        
        .ballet-pirouette {
          animation: balletPirouette 2s ease-in-out 1;
          transform-style: preserve-3d;
        }
      `}</style>
      <section className="relative overflow-hidden -mt-20 pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(146,171,255,0.28),_rgba(15,23,42,0.95))]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
          {/* Constellation Logo */}
          <div className="flex justify-center mb-6 relative">
            <img 
              src="/contellation-logo.png" 
              alt="Constellation Logo" 
              className="h-40 sm:h-52 md:h-64 w-auto opacity-95 drop-shadow-2xl"
            />
            {/* Shooting Star Effect - streaks from top-right to bottom-left */}
            {triggerAnimation > 0 && (
              <div key={triggerAnimation} className="shooting-star-container fixed inset-0 pointer-events-none z-50">
                <div className="shooting-star"></div>
              </div>
            )}
          </div>
          
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
            {t('stellaPlatform.badge')}
          </span>
          <h1 className="mt-6 text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
            {t('stellaPlatform.hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-slate-200 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('stellaPlatform.hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
            >
              {t('stellaPlatform.hero.inquire')}
            </Link>
            <a
              href="#beta"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/50 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
            >
              {t('stellaPlatform.hero.reserveBeta')}
            </a>
          </div>
        </div>
      </section>

      {/* Hero 3D Video Showcase - THE ULTIMATE */}
      <section className="relative py-16 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[0.85fr,1.15fr] lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 mb-4 shadow-lg shadow-emerald-500/20">
                {t('stellaPlatform.video3d.badge')}
              </div>
              <h2 className="text-3xl font-light text-white sm:text-4xl lg:text-5xl mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                {t('stellaPlatform.video3d.title')}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                {t('stellaPlatform.video3d.description')}
              </p>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-400/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 border border-emerald-400/40">
                  <svg className="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{t('stellaPlatform.video3d.impact.value')}</div>
                  <div className="text-xs text-emerald-200">{t('stellaPlatform.video3d.impact.description')}</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-emerald-500/40 opacity-75 blur-2xl group-hover:opacity-100 transition duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/40 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.6)] ring-1 ring-emerald-400/10">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                  poster="/video/office-3D-poster.jpg"
                >
                  <source src="/video/office-3D.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950/95 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                      {t('stellaPlatform.video3d.demo.label')}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 mt-1">{t('stellaPlatform.video3d.demo.caption')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-light text-white sm:text-4xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
            {t('stellaPlatform.metrics.title')}
          </h2>
          <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(99,102,241,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-indigo-300 mb-2">{t('stellaPlatform.metrics.productivity.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.productivity.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.productivity.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(168,85,247,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-purple-300 mb-2">{t('stellaPlatform.metrics.automation.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.automation.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.automation.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-rose-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(236,72,153,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(236,72,153,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-pink-300 mb-2">{t('stellaPlatform.metrics.satisfaction.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.satisfaction.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.satisfaction.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(34,211,238,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(34,211,238,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-4xl font-bold text-cyan-300 mb-2">{t('stellaPlatform.metrics.roi.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.roi.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.roi.description')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-light text-white sm:text-4xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.pillars.title')}</h2>
          <p className="mt-4 text-base text-slate-300">
            {t('stellaPlatform.pillars.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <article 
            ref={constellationCardRef}
            onMouseEnter={handleMouseEnter}
            className="flex h-full flex-col rounded-3xl border border-indigo-400/20 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)]"
          >
            {/* Constellation Logo */}
            <div className="flex justify-center mb-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
              </div>
              <img 
                src="/contellation-logo.png" 
                alt="Constellation Logo" 
                className="h-24 w-auto opacity-95 relative z-10"
              />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200 text-center">{t('stellaPlatform.pillars.constelacao.subtitle')}</div>
            <h3 className="mt-3 text-2xl font-light text-white text-center" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.pillars.constelacao.title')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{t('stellaPlatform.pillars.constelacao.description')}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {(t('stellaPlatform.pillars.constelacao.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article 
            ref={balletCardRef}
            className="flex h-full flex-col rounded-3xl border border-indigo-400/20 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)] relative overflow-hidden"
          >
            {/* Ballet Logo */}
            <div className="flex justify-center mb-4 relative" style={{ perspective: '1000px' }}>
              {/* Spotlight from Left */}
              {balletSpotlightActive && (
                <div 
                  className={balletSpotlightExit ? 'spotlight-exit-left absolute top-1/2 w-[250px] h-[250px] rounded-full pointer-events-none z-0' : 'spotlight-merge-left absolute top-1/2 w-[250px] h-[250px] rounded-full pointer-events-none z-0'}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(236,72,153,0.4) 30%, rgba(236,72,153,0.15) 50%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />
              )}
              
              {/* Spotlight from Right */}
              {balletSpotlightActive && (
                <div 
                  className={balletSpotlightExit ? 'spotlight-exit-right absolute top-1/2 w-[250px] h-[250px] rounded-full pointer-events-none z-0' : 'spotlight-merge-right absolute top-1/2 w-[250px] h-[250px] rounded-full pointer-events-none z-0'}
                  style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(236,72,153,0.4) 30%, rgba(236,72,153,0.15) 50%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />
              )}
              
              <img 
                src="/ballet-logo.png" 
                alt="Ballet Logo" 
                className={`h-24 w-auto opacity-95 relative z-10 ${balletSpotlightActive && !balletSpotlightExit ? 'ballet-pirouette' : ''}`}
                style={{
                  filter: balletSpotlightActive ? 'drop-shadow(0 0 15px rgba(236,72,153,0.8))' : 'none'
                }}
              />
            </div>
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200 text-center relative z-20">{t('stellaPlatform.pillars.bale.subtitle')}</div>
            <h3 className="mt-3 text-2xl font-light text-white text-center relative z-20" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.pillars.bale.title')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200 relative z-20">{t('stellaPlatform.pillars.bale.description')}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300 relative z-20">
              {(t('stellaPlatform.pillars.bale.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-slate-900/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div>
              <h2 className="text-3xl font-light text-white sm:text-4xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.stack.title')}</h2>
              <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.stack.subtitle')}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.unifiedLogin.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.unifiedLogin.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.socialStudio.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.socialStudio.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.calendar.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.calendar.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.docVault.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.docVault.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.analytics.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.analytics.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.api.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.api.description')}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent blur-3xl" />
              <div className="rounded-3xl border border-indigo-400/30 bg-slate-900/80 p-8 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.6)]">
                <h3 className="text-xl font-semibold text-white">{t('stellaPlatform.stack.checklist.title')}</h3>
                <ul className="mt-6 space-y-4 text-sm text-slate-200">
                  {(t('stellaPlatform.stack.checklist.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400"
                >
                  {t('stellaPlatform.stack.checklist.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Apps Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-white sm:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
              {t('stellaPlatform.mobile.title')}
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              {t('stellaPlatform.mobile.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 mb-12">
            {/* Client Apps Card */}
            <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/50 p-8 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.5)]">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex gap-3">
                  <img src="/ios.png" alt="iOS" className="h-12 w-12 object-contain" />
                  <img src="/andriod-white.png" alt="Android" className="h-12 w-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                    {t('stellaPlatform.mobile.clientApps.title')}
                  </h3>
                  <p className="text-sm text-indigo-200">
                    {t('stellaPlatform.mobile.clientApps.subtitle')}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {t('stellaPlatform.mobile.clientApps.description')}
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                {(t('stellaPlatform.mobile.clientApps.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apple Wallet Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
              <div className="flex items-start gap-4 mb-6">
                <img src="/apple-wallet.svg" alt="Apple Wallet" className="h-12 w-12" />
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                    {t('stellaPlatform.mobile.appleWallet.title')}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t('stellaPlatform.mobile.appleWallet.subtitle')}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {t('stellaPlatform.mobile.appleWallet.description')}
              </p>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-700/30">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  {t('stellaPlatform.mobile.appleWallet.benefit.label')}
                </div>
                <div className="text-sm text-slate-200">
                  {t('stellaPlatform.mobile.appleWallet.benefit.description')}
                </div>
              </div>
            </div>

            {/* Supernova Site Builder Card */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/50 p-8 shadow-[0_30px_80px_-30px_rgba(16,185,129,0.5)]">
              <div className="text-sm font-semibold uppercase tracking-wider text-emerald-200 text-center mb-3">{t('stellaPlatform.pillars.sites.subtitle')}</div>
              <h3 className="text-2xl font-light text-white text-center mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.pillars.sites.title')}</h3>
              <p className="text-sm leading-relaxed text-slate-200 mb-6">{t('stellaPlatform.pillars.sites.description')}</p>
              <ul className="space-y-3 text-sm text-slate-300">
                {(t('stellaPlatform.pillars.sites.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Platform Apps Coming Soon */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-slate-900/50 p-10 shadow-[0_30px_100px_-30px_rgba(168,85,247,0.5)]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-200 mb-4">
                {t('stellaPlatform.mobile.platformApps.badge')}
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                {t('stellaPlatform.mobile.platformApps.title')}
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto">
                {t('stellaPlatform.mobile.platformApps.description')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-3">
                <img src="/ios.png" alt="iOS" className="h-16 w-16 object-contain" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-purple-200">iOS</div>
                  <div className="text-xs text-slate-400">{t('stellaPlatform.mobile.platformApps.ios')}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img src="/andriod-white.png" alt="Android" className="h-16 w-16 object-contain" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-purple-200">Android</div>
                  <div className="text-xs text-slate-400">{t('stellaPlatform.mobile.platformApps.android')}</div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                {t('stellaPlatform.mobile.platformApps.modules')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="beta" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-light text-white sm:text-4xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.beta.title')}</h2>
        <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.beta.subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-200">
          {(t('stellaPlatform.beta.badges', { returnObjects: true }) as string[]).map((badge, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 px-4 py-2">
              {badge}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:platform@stella.com?subject=Quero%20testar%20a%20Stella%20Platform"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
          >
            {t('stellaPlatform.beta.joinShortlist')}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/60 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
          >
            {t('stellaPlatform.beta.talkStrategists')}
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-500">{t('stellaPlatform.beta.footer')}</p>
      </section>

      {/* Constellation Ecosystem Section */}
      <section className="relative py-24 overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 mb-6">
              {t('stellaPlatform.ecosystem.badge')}
            </span>
            <h2 className="text-4xl font-light text-white sm:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
              {t('stellaPlatform.ecosystem.title')}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('stellaPlatform.ecosystem.subtitle')}
            </p>
          </div>

          {/* Core Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-8 shadow-[0_20px_80px_-20px_rgba(59,130,246,0.3)]">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-400/20 border border-blue-400/40">
                  <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.ecosystem.coreFeatures.ai.title')}</h3>
                  <p className="text-xs text-blue-200 mt-1">{t('stellaPlatform.ecosystem.coreFeatures.ai.subtitle')}</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                {t('stellaPlatform.ecosystem.coreFeatures.ai.description')}
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 mt-1">•</span>
                  <span><span className="font-semibold text-blue-300">{t('stellaPlatform.ecosystem.coreFeatures.ai.investor')}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 mt-1">•</span>
                  <span><span className="font-semibold text-blue-300">{t('stellaPlatform.ecosystem.coreFeatures.ai.family')}</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 mt-1">•</span>
                  <span><span className="font-semibold text-blue-300">{t('stellaPlatform.ecosystem.coreFeatures.ai.firstTime')}</span></span>
                </li>
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-900/20 p-8 shadow-[0_20px_80px_-20px_rgba(168,85,247,0.3)]">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-400/20 border border-purple-400/40">
                  <svg className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.ecosystem.coreFeatures.socialProof.title')}</h3>
                  <p className="text-xs text-purple-200 mt-1">{t('stellaPlatform.ecosystem.coreFeatures.socialProof.subtitle')}</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                {t('stellaPlatform.ecosystem.coreFeatures.socialProof.description')}
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-300 mt-1">🔥</span>
                  <span>{t('stellaPlatform.ecosystem.coreFeatures.socialProof.offer')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-300 mt-1">👀</span>
                  <span>{t('stellaPlatform.ecosystem.coreFeatures.socialProof.views')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-300 mt-1">❤️</span>
                  <span>{t('stellaPlatform.ecosystem.coreFeatures.socialProof.instagram')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 8 User Types Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-light text-white mb-8 text-center" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.ecosystem.userTypes.title')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/15 to-blue-900/10 p-6 hover:border-blue-500/60 transition">
                <div className="mb-3 text-blue-400">
                  <UserTypeIcon type="user" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.independentRealtors.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.independentRealtors.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600/15 to-emerald-900/10 p-6 hover:border-emerald-500/60 transition">
                <div className="mb-3 text-emerald-400">
                  <UserTypeIcon type="building" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.brokerages.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.brokerages.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-600/15 to-orange-900/10 p-6 hover:border-orange-500/60 transition">
                <div className="mb-3 text-orange-400">
                  <UserTypeIcon type="construction" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.developers.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.developers.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-600/15 to-pink-900/10 p-6 hover:border-pink-500/60 transition">
                <div className="mb-3 text-pink-400">
                  <UserTypeIcon type="palette" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.architects.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.architects.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-600/15 to-cyan-900/10 p-6 hover:border-cyan-500/60 transition">
                <div className="mb-3 text-cyan-400">
                  <UserTypeIcon type="house" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.strManagers.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.strManagers.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/15 to-indigo-900/10 p-6 hover:border-indigo-500/60 transition">
                <div className="mb-3 text-indigo-400">
                  <UserTypeIcon type="houses" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.propertyOwners.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.propertyOwners.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-600/15 to-red-900/10 p-6 hover:border-red-500/60 transition">
                <div className="mb-3 text-red-400">
                  <UserTypeIcon type="key" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.strOwners.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.strOwners.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-600/15 to-amber-900/10 p-6 hover:border-amber-500/60 transition">
                <div className="mb-3 text-amber-400">
                  <UserTypeIcon type="shopping" className="w-10 h-10" />
                </div>
                <h4 className="font-semibold text-white mb-3">{t('stellaPlatform.ecosystem.userTypes.shoppers.title')}</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(t('stellaPlatform.ecosystem.userTypes.shoppers.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pending Services */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
              { key: 'realtors', icon: '👤', titleKey: 'stellaPlatform.ecosystem.pendingServices.realtors.title', phaseNum: 1 },
              { key: 'developers', icon: '🏗️', titleKey: 'stellaPlatform.ecosystem.pendingServices.developers.title', phaseNum: 2 },
              { key: 'architects', icon: '🎨', titleKey: 'stellaPlatform.ecosystem.pendingServices.architects.title', phaseNum: 3 },
              { key: 'rentalManagers', icon: '🏠', titleKey: 'stellaPlatform.ecosystem.pendingServices.rentalManagers.title', phaseNum: 4 },
              { key: 'owners', icon: '🏘️', titleKey: 'stellaPlatform.ecosystem.pendingServices.owners.title', phaseNum: 5 },
              { key: 'buyers', icon: '🛍️', titleKey: 'stellaPlatform.ecosystem.pendingServices.buyers.title', phaseNum: 6 },
              { key: 'insurance', icon: '🛡️', titleKey: 'stellaPlatform.ecosystem.pendingServices.insurance.title', phaseNum: 7 }
            ].map(({ key, icon, titleKey, phaseNum }) => (
              <div key={key} className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-slate-200 font-semibold text-lg flex items-center gap-2">
                    <span>{icon}</span> {t(titleKey)}
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                    {t(`stellaPlatform.ecosystem.pendingServices.${key}.deliveryDate`)}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-blue-400 font-semibold mb-1">{t('stellaPlatform.ecosystem.phaseLabel')} {phaseNum} (MVP):</p>
                    <ul className="space-y-1 ml-2 text-slate-300">
                      {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.phase1`).map((item, idx) => (
                        <li key={idx}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold mb-1">{t('stellaPlatform.ecosystem.pendingLabel')}:</p>
                    <ul className="space-y-1 ml-2 text-slate-400">
                      {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.pending`).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Why Stella */}
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-light text-white mb-8" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.ecosystem.whyStella.title')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { key: 'aggregated', emoji: '✓' },
                { key: 'narratives', emoji: '✨' },
                { key: 'socialProof', emoji: '🔥' },
                { key: 'ecosystem', emoji: '🎯' },
                { key: 'str', emoji: '🏠' },
                { key: 'users', emoji: '🌐' }
              ].map(({ key, emoji }) => (
                <div key={key} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-400/40">
                    <span className="text-blue-300 font-bold">{emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{t(`stellaPlatform.ecosystem.whyStella.${key}.title`)}</h4>
                    <p className="text-sm text-slate-300">{t(`stellaPlatform.ecosystem.whyStella.${key}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seguro Fiança Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/40 px-4 py-2 rounded-full mb-6">
                <span className="text-2xl">🛡️</span>
                <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Julho 2027</span>
              </div>
              <h3 className="text-4xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Seguro Fiança que Redefine o Mercado
              </h3>
              <p className="text-lg font-light text-slate-300 mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Vamos substituir todo o seguro fiança convencional com uma experiência que faz os locadores se perguntarem como viveram sem isso.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-8">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-semibold text-white mb-3">Cotação & Aprovação em 60 Segundos</h4>
                <p className="text-slate-300 mb-4">
                  Open Finance + IA para avaliar estabilidade de renda instantaneamente. Score portátil que segue o inquilino. 
                  Proprietários veem banda A-D simples. Sem burocracia, sem espera.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>✓ Conexão Open Finance em um clique</li>
                  <li>✓ Análise de renda, buffers e volatilidade via IA</li>
                  <li>✓ RentScore portátil entre prédios</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8">
                <div className="text-4xl mb-4">💸</div>
                <h4 className="text-xl font-semibold text-white mb-3">Pix Imediato em Sinistros</h4>
                <p className="text-slate-300 mb-4">
                  Um toque no WhatsApp → Pix instantâneo para o proprietário. Fazemos verificação/cobrança depois. 
                  O SLA não é promessa, é o produto. Meta: 60 segundos.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>✓ Reconhecimento de sinistro em {'<'}2h</li>
                  <li>✓ Pagamento garantido no mesmo dia útil</li>
                  <li>✓ SLA perdido? Crédito automático no prêmium</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8">
                <div className="text-4xl mb-4">📅</div>
                <h4 className="text-xl font-semibold text-white mb-3">Rent Day Guarantee</h4>
                <p className="text-slate-300 mb-4">
                  Proprietário escolhe o dia (ex: dia 1). Pagamos nesse dia todo mês, independente do inquilino. 
                  Nós absorvemos a variação. Sleep tax = 0.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>✓ Escolha seu dia de pagamento fixo</li>
                  <li>✓ Receba sempre nesse dia, sem exceção</li>
                  <li>✓ Eliminamos estresse de atraso</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30 rounded-2xl p-8">
                <div className="text-4xl mb-4">🏠</div>
                <h4 className="text-xl font-semibold text-white mb-3">Vacancy Shield + Despejo Concierge</h4>
                <p className="text-slate-300 mb-4">
                  Inquilino sai cedo? Pagamos 1 mês + verba marketing + fotos pro. Despejo necessário? 
                  Advogados pré-selecionados, processo digital, pacote de re-locação.
                </p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>✓ Proteção contra vacância inesperada</li>
                  <li>✓ Processo de despejo sem drama</li>
                  <li>✓ Re-locação prioritária integrada</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-2xl p-8 text-center">
              <h4 className="text-2xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Nossa Meta: Fazer o Seguro Fiança Convencional Obsoleto
              </h4>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Quando lançarmos em Q3 2027, proprietários mudarão pela certeza do SLA. Inquilinos aceitarão pela 
                portabilidade do score. Concorrentes ficarão discutindo brochures enquanto transferimos Pix.
              </p>
              <Link
                to="/seguro-fianca"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Saiba Mais sobre Seguro Fiança
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem CTA */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h3 className="text-3xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
            {t('stellaPlatform.ecosystem.cta.title')}
          </h3>
          <p className="text-lg text-slate-300 mb-8">
            {t('stellaPlatform.ecosystem.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:platform@stella.com?subject=Interest%20in%20Stella%20Platform%20Ecosystem"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
            >
              {t('stellaPlatform.ecosystem.cta.joinWaitlist')}
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/60 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
            >
              {t('stellaPlatform.ecosystem.cta.scheduleDemo')}
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            {t('stellaPlatform.ecosystem.cta.footer')}
          </p>
        </div>
      </section>
    </div>
  )
}
