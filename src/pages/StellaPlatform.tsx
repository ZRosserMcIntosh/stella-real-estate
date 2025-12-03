import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import UserTypeIcon from '../components/icons/UserTypeIcon'

export default function StellaPlatform() {
  const { t, i18n } = useTranslation()
  const [triggerAnimation, setTriggerAnimation] = useState(1) // Start with 1 to trigger initial animation
  const constellationCardRef = useRef<HTMLDivElement>(null)
  const balletCardRef = useRef<HTMLDivElement>(null)
  const hasShootingStarTriggered = useRef(false) // Only trigger shooting star once ever
  const hasBalletEnteredRef = useRef(false)
  const hasBalletExitedRef = useRef(false)
  const [balletSpotlightActive, setBalletSpotlightActive] = useState(false)
  const [balletSpotlightExit, setBalletSpotlightExit] = useState(false)

  // SEO metadata
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.stellareal.com.br'
  const pageUrl = `${siteUrl}/constellation`
  const logoUrl = `${siteUrl}/stella-og-image.png`
  const constellationLogoUrl = `${siteUrl}/constellation-logo.png`

  // Multilingual SEO Content
  const seoContent = useMemo(() => {
    const lang = i18n.language

    if (lang === 'en') {
      return {
        title: 'Constellation CRM - Real Estate Platform | Stella Real Estate',
        description: 'Complete real estate platform with CRM, automation, lead management, and AI. Modern technology for Brazilian realtors, brokerages, and developers. Build websites, manage listings, close deals.',
        keywords: 'real estate CRM, property management software, real estate automation, lead management system, brokerage platform, realtor tools, real estate technology, property listings CRM, real estate website builder, MLS alternative Brazil',
        ogTitle: 'Constellation - Complete Real Estate Business Platform',
        ogDescription: 'CRM, website builder, lead automation, and analytics for real estate professionals. Transform your real estate business with modern technology.',
        h1: 'Constellation Real Estate Platform',
        subtitle: 'Everything you need to build, manage, and grow your real estate business'
      }
    }

    if (lang === 'es') {
      return {
        title: 'Constellation CRM - Plataforma Inmobiliaria | Stella Real Estate',
        description: 'Plataforma inmobiliaria completa con CRM, automatización, gestión de leads e IA. Tecnología moderna para corredores, inmobiliarias y desarrolladores brasileños. Construye sitios web, gestiona propiedades.',
        keywords: 'CRM inmobiliario, software gestión propiedades, automatización inmobiliaria, sistema gestión leads, plataforma corredores, herramientas inmobiliarias, tecnología inmobiliaria, creador sitios web inmobiliarios',
        ogTitle: 'Constellation - Plataforma Completa para Negocios Inmobiliarios',
        ogDescription: 'CRM, constructor de sitios web, automatización de leads y analytics para profesionales inmobiliarios. Transforma tu negocio con tecnología moderna.',
        h1: 'Plataforma Inmobiliaria Constellation',
        subtitle: 'Todo lo que necesitas para construir, gestionar y hacer crecer tu negocio inmobiliario'
      }
    }

    // Portuguese (default)
    return {
      title: 'Constellation CRM - Plataforma Imobiliária | Stella Real Estate',
      description: 'Plataforma imobiliária completa com CRM, automação, gestão de leads e IA. Tecnologia moderna para corretores, imobiliárias e incorporadoras. Crie sites, gerencie imóveis, feche negócios.',
      keywords: 'CRM imobiliário, software gestão imóveis, automação imobiliária, sistema gestão leads, plataforma corretores, ferramentas imobiliárias, tecnologia imobiliária, criador sites imobiliários, CRM corretores Brasil, plataforma incorporadoras',
      ogTitle: 'Constellation - Plataforma Completa para Negócios Imobiliários',
      ogDescription: 'CRM, construtor de sites, automação de leads e analytics para profissionais imobiliários. Transforme seu negócio com tecnologia moderna.',
      h1: 'Plataforma Imobiliária Constellation',
      subtitle: 'Tudo que você precisa para construir, gerenciar e expandir seu negócio imobiliário'
    }
  }, [i18n.language])

  // Structured Data
  const structuredData = useMemo(() => {
    const softwareAppData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Constellation Real Estate Platform",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "CRM",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "299",
        "highPrice": "999",
        "priceCurrency": "BRL",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "billingDuration": "P1M",
          "billingIncrement": "1"
        }
      },
      "description": seoContent.description,
      "url": pageUrl,
      "creator": {
        "@type": "Organization",
        "name": "Stella Real Estate",
        "url": siteUrl
      },
      "featureList": [
        "Real Estate CRM",
        "Website Builder",
        "Lead Management",
        "Property Listing Management",
        "Task Management (Balé)",
        "Marketing Automation",
        "Analytics Dashboard",
        "Client Portal",
        "3D Virtual Tours",
        "WhatsApp Integration"
      ],
      "screenshot": logoUrl,
      "softwareVersion": "2.0",
      "releaseNotes": "Complete platform redesign with enhanced CRM, automation tools, and AI-powered features"
    }

    const productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Constellation CRM",
      "description": seoContent.description,
      "brand": {
        "@type": "Brand",
        "name": "Stella Real Estate"
      },
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "299",
        "highPrice": "999",
        "priceCurrency": "BRL",
        "url": `${siteUrl}/precos`,
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2025-12-31"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      "image": logoUrl,
      "url": pageUrl
    }

    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Stella Real Estate",
      "url": siteUrl,
      "logo": logoUrl,
      "description": "Real estate technology platform providing CRM, automation, and business tools for realtors and brokerages in Brazil",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BR",
        "addressLocality": "São Paulo"
      },
      "sameAs": [
        "https://www.linkedin.com/company/stella-real-estate",
        "https://www.instagram.com/stellarealestate"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-11-98641-0429",
        "contactType": "Customer Support",
        "availableLanguage": ["Portuguese", "English", "Spanish"],
        "areaServed": "BR"
      }
    }

    const webPageData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": seoContent.title,
      "description": seoContent.description,
      "url": pageUrl,
      "inLanguage": i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US',
      "isPartOf": {
        "@type": "WebSite",
        "name": "Stella Real Estate",
        "url": siteUrl
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Constellation Platform",
            "item": pageUrl
          }
        ]
      }
    }

    return [softwareAppData, productData, organizationData, webPageData]
  }, [seoContent, pageUrl, siteUrl, logoUrl, i18n.language])

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
        {/* Primary Meta Tags */}
        <title>{seoContent.title}</title>
        <meta name="title" content={seoContent.title} />
        <meta name="description" content={seoContent.description} />
        <meta name="keywords" content={seoContent.keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={seoContent.ogTitle} />
        <meta property="og:description" content={seoContent.ogDescription} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Constellation - Real Estate Platform by Stella" />
        <meta property="og:site_name" content="Stella Real Estate" />
        <meta property="og:locale" content={i18n.language === 'pt' ? 'pt_BR' : i18n.language === 'es' ? 'es_ES' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={seoContent.ogTitle} />
        <meta name="twitter:description" content={seoContent.ogDescription} />
        <meta name="twitter:image" content={logoUrl} />
        <meta name="twitter:image:alt" content="Constellation Platform - Real Estate CRM & Tools" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        
        {/* Language Alternates */}
        <link rel="alternate" hrefLang="pt-BR" href={`${siteUrl}/constellation`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/constellation`} />
        <link rel="alternate" hrefLang="es" href={`${siteUrl}/es/constellation`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/constellation`} />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(data)}
          </script>
        ))}
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

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          20% {
            opacity: 0.5;
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2));
          }
          30% {
            opacity: 1;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
          }
          60% {
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
          }
          75% {
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
          }
          95% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
          }
          100% {
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }

        .hero-shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shootingStar linear infinite;
        }
      `}</style>
      <section className="relative overflow-hidden -mt-20 pt-24 md:pt-32 pb-12 md:pb-16 bg-slate-950">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }, (_, i) => ({
            id: i,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: Math.random() * 100,
            left: Math.random() * 100,
            animationDelay: Math.random() * 10,
            animationDuration: Math.random() * 3 + 2,
            opacity: Math.random() * 0.4 + 0.2,
          })).map((star) => (
            <div
              key={`static-${star.id}`}
              className="star"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
                opacity: star.opacity,
              }}
            />
          ))}

          {/* Shooting stars */}
          {Array.from({ length: 10 }, (_, i) => ({
            id: i,
            delay: 0,
            duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6),
            left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80,
            top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50,
            width: 100 * (0.7 + Math.random() * 0.6),
            opacity: 0.7 + Math.random() * 0.6,
          })).map((star) => (
            <div
              key={`shooting-${star.id}`}
              className="hero-shooting-star"
              style={{
                width: `${star.width}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20 text-center">
          {/* Constellation Logo */}
          <div className="flex justify-center mb-8 md:mb-10 relative">
            {/* Subtle glow effect background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl"></div>
            </div>
            <img 
              src="/contellation-logo.png" 
              alt="Constellation Logo" 
              className="h-28 sm:h-36 md:h-48 w-auto relative z-10"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 30px rgba(139, 92, 246, 0.2))',
              }}
            />
            {/* Shooting Star Effect - streaks from top-right to bottom-left */}
            {triggerAnimation > 0 && (
              <div key={triggerAnimation} className="shooting-star-container fixed inset-0 pointer-events-none z-50">
                <div className="shooting-star"></div>
              </div>
            )}
          </div>
          
          <div 
            className="text-xl sm:text-2xl md:text-3xl font-light uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-indigo-200 mb-6 md:mb-8 mt-1 px-4" 
            style={{ 
              fontFamily: 'Outfit, sans-serif',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
            }}
          >
            CONSTELLATION
          </div>
          <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
            {t('stellaPlatform.hero.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light text-slate-200 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('stellaPlatform.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Hero 3D Video Showcase - THE ULTIMATE */}
      <section className="relative py-16 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr] lg:gap-12 items-center">
            {/* Video on Left - Shows FIRST on mobile */}
            <div className="relative group order-1 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 mb-4 shadow-lg shadow-emerald-500/20">
                {t('stellaPlatform.video3d.badge')}
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/20 opacity-50 blur-2xl group-hover:opacity-75 transition duration-500" />
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
            
            {/* Content on Right - Shows SECOND on mobile */}
            <div className="order-2 lg:order-2">
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
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/precos"
              className="group relative inline-flex items-center gap-2 rounded-full border-2 border-indigo-400/30 bg-indigo-950/40 backdrop-blur-sm px-8 py-4 text-base font-semibold text-indigo-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/50 hover:bg-indigo-900/50 hover:text-white hover:shadow-2xl"
              style={{
                boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.25), 0 0 15px rgba(99, 102, 241, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px -10px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.3), 0 0 50px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(99, 102, 241, 0.25), 0 0 15px rgba(99, 102, 241, 0.15)';
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">{t('stellaPlatform.pillars.ctaButtons.explorePrices')}</span>
              <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="/"
              className="group relative inline-flex items-center gap-2 rounded-full border-2 border-indigo-400/40 bg-slate-800/60 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/60 hover:bg-slate-700/70 hover:shadow-2xl"
              style={{
                boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.2), 0 0 15px rgba(99, 102, 241, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px -10px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.3), 0 0 50px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(99, 102, 241, 0.2), 0 0 15px rgba(99, 102, 241, 0.1)';
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">{t('stellaPlatform.pillars.ctaButtons.viewSite')}</span>
              <svg className="relative w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Powered by Constellation Proof */}
          <div className="mt-12 mb-12">
            <div className="bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-indigo-900/20 border border-indigo-500/30 rounded-xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-300 font-semibold text-sm uppercase tracking-wider">Powered by Constellation</span>
              </div>
              <p className="text-slate-300 text-base text-center mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Este site que você está navegando agora foi construído e roda na plataforma Constellation.
              </p>
              <p className="text-slate-400 text-sm text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Veja em primeira mão a qualidade, performance e recursos que sua imobiliária terá ao usar a Constellation.
              </p>
            </div>
          </div>

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
            {/* CONSTELLATION text - styled like BALLET on /precos */}
            <div className="flex justify-center mb-2">
              <span className="text-xl font-light uppercase tracking-[0.4em] text-indigo-400/90" style={{ fontFamily: 'Outfit, sans-serif' }}>CONSTELLATION</span>
            </div>
            <h3 className="mt-3 text-2xl font-light text-white text-center relative z-20" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.pillars.constelacao.title')}</h3>
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
            {/* BALLET text - styled like on /precos */}
            <div className="flex justify-center mb-2">
              <span className="text-xl font-light uppercase tracking-[0.4em] text-pink-400/90" style={{ fontFamily: 'Outfit, sans-serif' }}>BALLET</span>
            </div>
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
          <h2 className="text-3xl font-light text-white sm:text-4xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.stack.title')}</h2>
          <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.stack.subtitle')}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Constellation (External) */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300/80 mb-3">{t('stellaPlatform.stack.constellationExternal')}</div>
                  <div className="grid gap-6">
                    {/* Native Client Apps */}
                    <div className="rounded-2xl border border-indigo-600/40 bg-gradient-to-br from-indigo-500/15 to-slate-900/70 p-5 shadow-lg shadow-indigo-500/10 transition hover:border-indigo-400/60 hover:shadow-indigo-500/20">
                      <div className="flex items-start gap-3 mb-3">
                        <img src="/ios.png" alt="iOS" className="h-8 w-8 object-contain" />
                        <img src="/andriod-white.png" alt="Android" className="h-8 w-8 object-contain" />
                        <h3 className="text-lg font-semibold text-white flex-1">
                          {t('stellaPlatform.mobile.clientApps.title')}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-300">{t('stellaPlatform.mobile.clientApps.description')}</p>
                    </div>

                    {/* Apple Wallet */}
                    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-slate-600/60 hover:bg-slate-900/90">
                      <div className="flex items-start gap-3 mb-3">
                        <img src="/apple-wallet.svg" alt="Apple Wallet" className="h-8 w-8" />
                        <h3 className="text-lg font-semibold text-white flex-1">
                          {t('stellaPlatform.mobile.appleWallet.title')}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-300">{t('stellaPlatform.mobile.appleWallet.description')}</p>
                    </div>

                    {/* Constellation Web Studio */}
                    <div className="rounded-2xl border border-emerald-600/40 bg-gradient-to-br from-emerald-500/15 to-slate-900/70 p-5 shadow-lg shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-emerald-500/20">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {t('stellaPlatform.stack.webStudio.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.pillars.sites.description')}</p>
                    </div>

                    {/* Market Statistics - NEW */}
                    <div className="rounded-2xl border border-cyan-600/40 bg-gradient-to-br from-cyan-500/15 to-slate-900/70 p-5 shadow-lg shadow-cyan-500/10 transition hover:border-cyan-400/60 hover:shadow-cyan-500/20">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {t('stellaPlatform.stack.marketStats.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.marketStats.description')}</p>
                    </div>

                    {/* Analytics */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {t('stellaPlatform.stack.analytics.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.analytics.description')}</p>
                    </div>

                    {/* API */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('stellaPlatform.stack.api.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.api.description')}</p>
                    </div>
                  </div>
                </div>

                {/* Ballet (Internal) */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-pink-200/80 mb-3">{t('stellaPlatform.stack.balletInternal')}</div>
                  <div className="grid gap-6">
                    {/* Team Management - NEW */}
                    <div className="rounded-2xl border border-emerald-600/40 bg-gradient-to-br from-emerald-500/15 to-slate-900/70 p-5 shadow-lg shadow-emerald-500/10 transition hover:border-emerald-400/60 hover:shadow-emerald-500/20">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {t('stellaPlatform.stack.teamManagement.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.teamManagement.description')}</p>
                    </div>

                    {/* Deal Room - NEW */}
                    <div className="rounded-2xl border border-amber-600/40 bg-gradient-to-br from-amber-500/15 to-slate-900/70 p-5 shadow-lg shadow-amber-500/10 transition hover:border-amber-400/60 hover:shadow-amber-500/20">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {t('stellaPlatform.stack.dealRoom.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.dealRoom.description')}</p>
                    </div>

                    {/* Document Vault - EXPANDED */}
                    <div className="rounded-2xl border border-purple-600/40 bg-gradient-to-br from-purple-500/15 to-slate-900/70 p-5 shadow-lg shadow-purple-500/10 transition hover:border-purple-400/60 hover:shadow-purple-500/20">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {t('stellaPlatform.stack.docVault.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.docVaultExpanded.description')}</p>
                    </div>

                    {/* Social Studio */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <img src="/admin-icons/iphone.png" alt="" className="w-5 h-5" />
                        {t('stellaPlatform.stack.socialStudio.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.socialStudio.description')}</p>
                    </div>

                    {/* Calendar */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('stellaPlatform.stack.calendar.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.calendar.description')}</p>
                    </div>

                    {/* Unified Login */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {t('stellaPlatform.stack.unifiedLogin.title')}
                      </h3>
                      <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.unifiedLogin.description')}</p>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </section>

      <section id="beta" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-light text-white sm:text-4xl" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{t('stellaPlatform.beta.title')}</h2>
        <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.beta.subtitle')}</p>
        <div className="mt-8 flex justify-center gap-3 text-xs text-slate-200">
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
          <a
            href="https://api.whatsapp.com/send/?phone=5511986410429&text=Hi%2C+I%27m+interested+in+the+Constellation+Platform+beta&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/60 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
          >
            {t('stellaPlatform.beta.talkStrategists')}
          </a>
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
                      <h4 className={`text-xs font-bold text-${color}-300 uppercase tracking-wider`}>
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
