import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
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

  // SEO metadata
  const siteUrl = window.location.origin
  const pageUrl = `${siteUrl}/plataforma-stella`
  const logoUrl = `${siteUrl}/contellation-logo.png`
  const pageTitle = 'Plataforma Stella - Tecnologia Imobiliária Completa'
  const pageDescription = 'A Plataforma Stella oferece soluções integradas de CRM, automação de tarefas, gestão de leads e muito mais para profissionais do mercado imobiliário.'

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
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Stella Real Estate" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={logoUrl} />
        
        {/* WhatsApp specific */}
        <meta property="og:image:alt" content="Stella Platform - Constellation Logo" />
        
        {/* Additional SEO */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>
      
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
            --star-end-x: 0%;
            --star-end-y: 90%;
            /* Steeper tail angle for mobile to match the travel angle */
            --tail-angle: -55deg;
          }
        }
        
        /* Smaller mobile screens (iPhone SE, etc) */
        @media (max-width: 430px) {
          .shooting-star {
            --star-start-x: 92%;
            --star-start-y: 8%;
            --star-end-x: 0%;
            --star-end-y: 80%;
            --tail-angle: -55deg;
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
        
        @keyframes shadowFadeIn {
          0% {
            opacity: 0;
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 0.35;
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
        
        .shadow-fade-in {
          animation: shadowFadeIn 2s ease-out forwards;
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
          
          <div className="text-2xl font-light uppercase tracking-[0.4em] text-indigo-200/80 mb-12 mt-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            CONSTELLATION
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
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
            <Link
              to="/precos"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/50 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
            >
              {t('stellaPlatform.hero.reserveBeta')}
            </Link>
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
              {/* Horizontal Elliptical Spotlight from Left - 5x wider than tall, positioned at bottom */}
              {balletSpotlightActive && (
                <div 
                  className={balletSpotlightExit ? 'spotlight-exit-left absolute pointer-events-none z-0' : 'spotlight-merge-left absolute pointer-events-none z-0'}
                  style={{
                    width: '350px',
                    height: '70px',
                    top: '85%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(ellipse, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0.35) 30%, rgba(236,72,153,0.12) 50%, transparent 70%)',
                    filter: 'blur(30px)',
                    borderRadius: '50%',
                  }}
                />
              )}
              
              {/* Horizontal Elliptical Spotlight from Right - 5x wider than tall, positioned at bottom */}
              {balletSpotlightActive && (
                <div 
                  className={balletSpotlightExit ? 'spotlight-exit-right absolute pointer-events-none z-0' : 'spotlight-merge-right absolute pointer-events-none z-0'}
                  style={{
                    width: '350px',
                    height: '70px',
                    top: '85%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(ellipse, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0.35) 30%, rgba(236,72,153,0.12) 50%, transparent 70%)',
                    filter: 'blur(30px)',
                    borderRadius: '50%',
                  }}
                />
              )}
              
              {/* Logo Shadow from Left - actual logo flattened and cast up and to the right */}
              {balletSpotlightActive && !balletSpotlightExit && (
                <img 
                  src="/ballet-new-logo.png" 
                  alt="" 
                  className="shadow-fade-in absolute pointer-events-none z-0"
                  style={{
                    height: '96px',
                    width: 'auto',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-45%, -8%) scaleY(0.2) scaleX(1.2) skewX(-8deg)',
                    opacity: 0,
                    filter: 'blur(3px) brightness(0)',
                  }}
                />
              )}
              
              {/* Logo Shadow from Right - actual logo flattened and cast up and to the right */}
              {balletSpotlightActive && !balletSpotlightExit && (
                <img 
                  src="/ballet-new-logo.png" 
                  alt="" 
                  className="shadow-fade-in absolute pointer-events-none z-0"
                  style={{
                    height: '96px',
                    width: 'auto',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-45%, -8%) scaleY(0.2) scaleX(1.2) skewX(-8deg)',
                    opacity: 0,
                    filter: 'blur(3px) brightness(0)',
                  }}
                />
              )}
              
              <img 
                src="/ballet-new-logo.png" 
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

      {/* Constellation Stack Section - Two Column Layout */}
      <section className="bg-slate-900/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-white sm:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
              Constellation Platform for Unstoppable Operators
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
              A unified technology stack combining external client-facing tools and internal business operations
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Constellation External Column */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Constellation (External)
              </h3>
              <div className="space-y-5">
                {/* Unified Login */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Unified Login</h4>
                      <p className="mt-2 text-sm text-slate-300">One login, infinite possibilities. Access all tools with enterprise-grade security.</p>
                    </div>
                  </div>
                </div>

                {/* Social Studio */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Social Studio</h4>
                      <p className="mt-2 text-sm text-slate-300">Create, schedule, and publish content across all platforms with AI-powered optimization.</p>
                    </div>
                  </div>
                </div>

                {/* Native Client Apps */}
                <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/70 p-6 shadow-lg shadow-indigo-500/20 transition hover:border-indigo-300/60">
                  <div className="flex items-start gap-4">
                    <div className="flex gap-3">
                      <img src="/ios.png" alt="iOS" className="h-10 w-10 object-contain" />
                      <img src="/andriod-white.png" alt="Android" className="h-10 w-10 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Native Client Apps</h4>
                      <p className="mt-2 text-sm text-indigo-200">iOS & Android apps for clients to browse properties, schedule tours, and communicate.</p>
                    </div>
                  </div>
                </div>

                {/* Apple Wallet */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <img src="/apple-wallet.svg" alt="Apple Wallet" className="h-10 w-10 shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">Apple Wallet Business Card</h4>
                      <p className="mt-2 text-sm text-slate-300">Digital business cards and property access passes in Apple Wallet.</p>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Smart Calendar</h4>
                      <p className="mt-2 text-sm text-slate-300">Automated scheduling for tours, appointments, and open houses with client sync.</p>
                    </div>
                  </div>
                </div>

                {/* Site Management On The Go - Constelação */}
                <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-slate-900/70 p-6 shadow-lg shadow-indigo-500/20 transition hover:border-indigo-300/60">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Constelação Mobile</h4>
                      <p className="mt-2 text-sm text-indigo-200">Manage your constellation website on the go with mobile editing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ballet Internal Column */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Ballet (Internal)
              </h3>
              <div className="space-y-5">
                {/* Supernova Site Builder */}
                <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/70 p-6 shadow-lg shadow-emerald-500/20 transition hover:border-emerald-300/60">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Supernova Site Builder</h4>
                      <p className="mt-2 text-sm text-emerald-200">No-code website builder for stunning property listings and agent portfolios.</p>
                    </div>
                  </div>
                </div>

                {/* Team Management */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Team Management</h4>
                      <p className="mt-2 text-sm text-slate-300">Manage agents, assign leads, track performance, and set permissions.</p>
                    </div>
                  </div>
                </div>

                {/* Deal Room */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Deal Room</h4>
                      <p className="mt-2 text-sm text-slate-300">Centralized deal pipeline, transaction management, and commission tracking.</p>
                    </div>
                  </div>
                </div>

                {/* Document Vault */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Document Vault</h4>
                      <p className="mt-2 text-sm text-slate-300">Secure storage for contracts, compliance docs, and transaction records.</p>
                    </div>
                  </div>
                </div>

                {/* Market Statistics */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Market Statistics</h4>
                      <p className="mt-2 text-sm text-slate-300">Real-time market data, pricing analytics, and neighborhood insights.</p>
                    </div>
                  </div>
                </div>

                {/* Analytics & Reports */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Analytics & Reports</h4>
                      <p className="mt-2 text-sm text-slate-300">Business intelligence dashboards with customizable reports and KPI tracking.</p>
                    </div>
                  </div>
                </div>

                {/* Ballet Mobile - Site Management On The Go */}
                <div className="rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-slate-900/70 p-6 shadow-lg shadow-purple-500/20 transition hover:border-purple-300/60">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Ballet Mobile</h4>
                      <p className="mt-2 text-sm text-purple-200">Manage your CRM and internal operations on the go with mobile access.</p>
                    </div>
                  </div>
                </div>

                {/* Developer API */}
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-lg shadow-black/30 transition hover:border-purple-300/60 hover:bg-slate-900/90">
                  <div className="flex items-start gap-4">
                    <svg className="h-10 w-10 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Developer API</h4>
                      <p className="mt-2 text-sm text-slate-300">RESTful API for custom integrations and third-party tools.</p>
                    </div>
                  </div>
                </div>
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
          <Link
            to="/precos"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
          >
            {t('stellaPlatform.beta.joinShortlist')}
          </Link>
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
              The All-In-One Real Estate Platform
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Anticipated Delivery Schedule
            </p>
          </div>

          {/* Phase Rollout */}
          <div className="mb-16">
            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                { key: 'realtors', phaseNum: 1, color: 'blue' },
                { key: 'retailAggregation', phaseNum: 2, color: 'emerald' },
                { key: 'developers', phaseNum: 3, color: 'orange' },
                { key: 'architects', phaseNum: 4, color: 'pink' },
                { key: 'designers', phaseNum: 5, color: 'purple' },
                { key: 'rentalManagers', phaseNum: 6, color: 'cyan' },
                { key: 'insurance', phaseNum: 7, color: 'amber' }
              ].map(({ key, phaseNum, color }) => (
                <div key={key} className={`group relative overflow-hidden rounded-xl border border-${color}-500/30 bg-gradient-to-br from-${color}-600/10 via-slate-900/50 to-slate-950 p-6 hover:border-${color}-500/60 transition-all duration-300`}>
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold text-${color}-300 uppercase tracking-wider`}>
                        PHASE {phaseNum}
                      </span>
                      <span className="text-slate-600">•</span>
                      <h4 className="text-lg font-semibold text-white">
                        {t(`stellaPlatform.ecosystem.pendingServices.${key}.title`)}
                      </h4>
                    </div>
                    <div className={`px-3 py-1 rounded-lg bg-${color}-500/10 border border-${color}-400/30`}>
                      <p className={`text-xs font-bold text-${color}-300`}>
                        {t(`stellaPlatform.ecosystem.pendingServices.${key}.deliveryDate`)}
                      </p>
                    </div>
                  </div>

                  {/* Account Types */}
                  <div className="mb-4">
                    <p className={`text-xs text-${color}-400 font-semibold uppercase tracking-wider mb-2`}>
                      {t('stellaPlatform.ecosystem.accountTypesLabel')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.accountTypes`).map((type, idx) => (
                        <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg bg-${color}-500/15 border border-${color}-400/40 text-${color}-200 font-medium`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs text-${color}-300 font-semibold mb-2 uppercase tracking-wider`}>
                        MVP Features
                      </p>
                      <ul className="space-y-1.5">
                        {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.phase1`).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className={`text-${color}-400 mt-0.5`}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">
                        {t('stellaPlatform.ecosystem.pendingLabel')}
                      </p>
                      <ul className="space-y-1.5">
                        {getTranslationArray(`stellaPlatform.ecosystem.pendingServices.${key}.pending`).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="text-slate-600 mt-0.5">○</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
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
            <Link
              to="/precos"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
            >
              {t('stellaPlatform.ecosystem.cta.joinWaitlist')}
            </Link>
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
