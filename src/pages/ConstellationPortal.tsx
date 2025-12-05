import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ConstellationHeader from '../components/ConstellationHeader'
import { ConstellationUrls } from '../utils/constellationUrl'
import { Helmet } from 'react-helmet-async'
import { trackPageView, trackCTA, trackWhatsAppClick, trackPlanView } from '../utils/analytics'

export default function ConstellationPortal() {
  const { t, i18n } = useTranslation()
  
  // Force Portuguese language on constellation subdomain
  useEffect(() => {
    if (i18n.language !== 'pt') {
      i18n.changeLanguage('pt')
    }
  }, [i18n])

  // Track page view on load
  useEffect(() => {
    trackPageView(window.location.pathname, 'Constellation Portal - Home')
  }, [])
  
  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10, // Random delay up to 10s for staggered twinkling
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds per twinkle
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

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Constellation - Plataforma Profissional para Corretores de Imóveis | Stella Real Estate</title>
        <meta name="title" content="Constellation - Plataforma Profissional para Corretores de Imóveis | Stella Real Estate" />
        <meta name="description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A plataforma completa para corretores independentes, imobiliárias e incorporadores. A partir de R$ 149/mês." />
        <meta name="keywords" content="plataforma imobiliária, CRM imobiliário, site para corretor, gestão de leads imobiliários, mapas 3D, marketing imobiliário, automação imobiliária, software imobiliário, site personalizado corretor, plataforma corretor independente" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://stellareal.com.br/constellation" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stellareal.com.br/constellation" />
        <meta property="og:title" content="Constellation - Plataforma Profissional para Corretores de Imóveis" />
        <meta property="og:description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A plataforma completa para corretores." />
        <meta property="og:image" content="https://stellareal.com.br/tech-icons/contellation-logo.png" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Constellation by Stella Real Estate" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://stellareal.com.br/constellation" />
        <meta property="twitter:title" content="Constellation - Plataforma Profissional para Corretores de Imóveis" />
        <meta property="twitter:description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A partir de R$ 149/mês." />
        <meta property="twitter:image" content="https://stellareal.com.br/tech-icons/contellation-logo.png" />
        
        {/* Language and Geo */}
        <meta httpEquiv="content-language" content="pt-BR" />
        <meta name="geo.region" content="BR" />
        <meta name="geo.placename" content="Brasil" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Stella Real Estate" />
        <meta name="publisher" content="Stella Real Estate" />
        <meta name="theme-color" content="#020617" />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Constellation by Stella Real Estate",
            "url": "https://stellareal.com.br/constellation",
            "logo": "https://stellareal.com.br/tech-icons/contellation-logo.png",
            "description": "Plataforma profissional completa para corretores de imóveis com sites, CRM, mapas 3D e automação de marketing.",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "BR"
            },
            "sameAs": [
              "https://instagram.com",
              "https://linkedin.com",
              "https://facebook.com"
            ]
          })}
        </script>
        
        {/* Structured Data - SoftwareApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Constellation",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": [
              {
                "@type": "Offer",
                "name": "Plano Solo",
                "price": "147",
                "priceCurrency": "BRL",
                "billingDuration": "P1M",
                "description": "1 Site, 50 Anúncios, 3K Contatos, 2 Mapas 3D/mês"
              },
              {
                "@type": "Offer",
                "name": "Plano Team",
                "price": "397",
                "priceCurrency": "BRL",
                "billingDuration": "P1M",
                "description": "2 Sites, 150 Anúncios, 10K Contatos, 5 Mapas 3D/mês"
              },
              {
                "@type": "Offer",
                "name": "Plano Brokerage",
                "price": "997",
                "priceCurrency": "BRL",
                "billingDuration": "P1M",
                "description": "3 Sites, 500 Anúncios, 50K Contatos, 20 Mapas 3D/mês"
              },
              {
                "@type": "Offer",
                "name": "Site Personalizado",
                "price": "19900",
                "priceCurrency": "BRL",
                "description": "Desenvolvimento totalmente personalizado com entrega em 30 dias"
              }
            ],
            "description": "Plataforma completa para corretores de imóveis: sites profissionais, CRM, gestão de leads, mapas 3D, analytics e automação de marketing.",
            "featureList": [
              "Sites Profissionais",
              "CRM & Gestão de Leads",
              "Mapas 3D Interativos",
              "Gestão de Equipe",
              "Estúdio de Mídias Sociais",
              "Analytics Avançado",
              "Cofre de Documentos",
              "Deal Room",
              "Automação de Marketing"
            ],
            "screenshot": "https://stellareal.com.br/tech-icons/contellation-logo.png"
          })}
        </script>
        
        {/* Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://stellareal.com.br/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Plataforma",
                "item": "https://stellareal.com.br/constellation"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Preços",
                "item": "https://stellareal.com.br/precos"
              }
            ]
          })}
        </script>
      </Helmet>

      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1;
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

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shootingStar linear infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950">
        {/* Constellation Header */}
        <ConstellationHeader />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 pt-32">
          {/* Animated stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {staticStars.map((star) => (
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
            {shootingStars.map((star) => (
              <div
                key={`shooting-${star.id}`}
                className="shooting-star"
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
        
        <div className="container-padded relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {t('constellation.hero.badge')}
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                Constellation
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
              {t('constellation.hero.title')}
            </p>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('constellation.hero.description')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://stellareal.com.br/constellation"
                onClick={() => trackCTA('Saiba Mais', 'hero')}
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Saiba Mais
              </a>
              <a
                href={ConstellationUrls.login()}
                onClick={() => trackCTA('Entrar', 'hero')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                {t('constellation.hero.sign_in')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('constellation.benefits.title')}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {t('constellation.benefits.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Sites Profissionais',
                  description: 'Construtor drag-and-drop com templates de luxo. Lance sites imobiliários incríveis em minutos com SEO e suporte multi-idioma.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: 'CRM & Gestão de Leads',
                  description: 'Gerencie milhares de contatos com pipelines automatizados, pontuação de leads e follow-ups inteligentes. Nunca perca uma oportunidade.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Mapas 3D de Imóveis',
                  description: 'Mapas 3D interativos incluídos em todos os planos. Mostre propriedades com visualizações impressionantes que vendem.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  )
                },
                {
                  title: 'Gestão de Equipe',
                  description: 'Organogramas, permissões baseadas em função, rastreamento de equipamentos e documentos de conformidade. Gerencie toda estrutura da sua imobiliária.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Estúdio de Mídias Sociais',
                  description: 'Agende posts, crie conteúdo e gerencie sua presença social. Apps nativos iOS e Android mantêm você conectado.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: 'Analytics & Insights',
                  description: 'Estatísticas de mercado, dashboards de performance e inteligência de dados. Tome decisões mais inteligentes com insights em tempo real.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: 'Cofre de Documentos',
                  description: 'Gestão segura de documentos com controle de versão e compartilhamento em equipe. Mantenha todos arquivos organizados e acessíveis.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                {
                  title: 'Deal Room',
                  description: 'Gestão de transações e rastreamento de pipeline de negócios. Feche mais negócios com workflows organizados e colaboração.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: 'Automação de Marketing',
                  description: 'Campanhas de email automatizadas, nutrição de leads e workflows inteligentes. Faça marketing mais inteligente, não mais difícil.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('constellation.how_it_works.title')}
              </h2>
              <p className="text-lg text-slate-400">
                {t('constellation.how_it_works.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: t('constellation.how_it_works.steps.step1.title'),
                  description: t('constellation.how_it_works.steps.step1.description')
                },
                {
                  step: '2',
                  title: t('constellation.how_it_works.steps.step2.title'),
                  description: t('constellation.how_it_works.steps.step2.description')
                },
                {
                  step: '3',
                  title: t('constellation.how_it_works.steps.step3.title'),
                  description: t('constellation.how_it_works.steps.step3.description')
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gradient-to-br from-brand-500/10 to-indigo-500/10 border border-brand-500/30 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg className="w-8 h-8 text-brand-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-brand-600/20 to-indigo-600/20 border border-brand-500/30 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {t('constellation.pricing.title')}
                </h2>
                <p className="text-xl text-slate-300">
                  {t('constellation.pricing.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {[
                  { 
                    plan: 'Pro', 
                    price: 'R$ 149', 
                    features: ['1 Site', '50 Anúncios', '3K Contatos', '2 Mapas 3D/mês'] 
                  },
                  { 
                    plan: 'Team', 
                    price: 'R$ 249', 
                    popular: true, 
                    features: ['2 Sites', '150 Anúncios', '10K Contatos', '5 Mapas 3D/mês', 'Lead Scoring'] 
                  },
                  { 
                    plan: 'Brokerage', 
                    price: 'R$ 499', 
                    features: ['3 Sites', '500 Anúncios', '50K Contatos', '20 Mapas 3D/mês', 'Suporte Prioritário'] 
                  }
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border ${
                      tier.popular ? 'border-brand-500 ring-2 ring-brand-500/50' : 'border-slate-700/50'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold rounded-full">
                          {t('constellation.pricing.most_popular')}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">{tier.plan}</h3>
                    <div className="text-3xl font-bold text-brand-400 mb-4">{tier.price}<span className="text-sm text-slate-400">/{t('constellation.pricing.per_month')}</span></div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-brand-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Custom/Enterprise Tier */}
              <div className="max-w-4xl mx-auto mb-8 px-4">
                <div className="relative bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-indigo-500/50">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Personalizado
                    </span>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Site Totalmente Personalizado</h3>
                    <p className="text-slate-300 text-xs sm:text-sm">Desenvolvimento dedicado com entrega garantida em 30 dias</p>
                  </div>
                  <div className="text-center mb-6">
                    <div className="text-3xl sm:text-4xl font-bold text-indigo-300">
                      <span className="text-sm sm:text-lg text-slate-400">A partir de </span>
                      R$ 19.900
                      <span className="text-xs sm:text-sm text-slate-400 block mt-1">Pagamento único</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Design 100% personalizado
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Desenvolvedor dedicado
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Recursos ilimitados
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Entrega garantida em 30 dias
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Suporte premium vitalício
                      </li>
                      <li className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-indigo-400" />
                        Treinamento personalizado
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <a
                      href="https://wa.me/5511985853836?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20desenvolvimento%20de%20site%20personalizado."
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        trackWhatsAppClick('custom_site_tier');
                        trackPlanView('Site Personalizado', 19900);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-xs sm:text-base w-full sm:w-auto"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="truncate">Falar com o Diretor de Tecnologia</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/precos"
                  onClick={() => trackCTA('Ver Todos os Planos', 'pricing_section')}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  {t('constellation.pricing.view_all_plans')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('constellation.cta.title')}
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {t('constellation.cta.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/precos"
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                {t('constellation.cta.start_trial')}
              </Link>
              <Link
                to="/contato"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                {t('constellation.cta.schedule_demo')}
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-6">
              {t('constellation.cta.no_credit_card')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12">
        <div className="container-padded">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              
              {/* Legal Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('home.footer.legalTitle')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/privacidade" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.privacyPolicy')}</Link></li>
                  <li><Link to="/termos" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.termsOfUse')}</Link></li>
                  <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.cookiePolicy')}</Link></li>
                  <li><Link to="/msa" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.masterSubscriptionAgreement')}</Link></li>
                  <li><Link to="/sla" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.serviceLevelAgreement')}</Link></li>
                  <li><Link to="/dpa" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.dataProcessingAddendum')}</Link></li>
                  <li><Link to="/aup" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.acceptableUsePolicy')}</Link></li>
                  <li><Link to="/politica-suporte" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.supportPolicy')}</Link></li>
                  <li><Link to="/termos-beta" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.betaTerms')}</Link></li>
                  <li><Link to="/termos-api" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.apiTerms')}</Link></li>
                  <li><Link to="/termos-indicacao" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.referralTerms')}</Link></li>
                  <li><Link to="/juridico" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.legal')}</Link></li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('home.footer.companyTitle')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.aboutUs')}</Link></li>
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">{t('header.nav.contact')}</Link></li>
                  <li><Link to="/institucional" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.institutional')}</Link></li>
                  <li><Link to="/investidores" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.investors')}</Link></li>
                  <li><Link to="/luisa-marketing" className="text-slate-400 hover:text-white transition-colors">Luisa Marketing Agency</Link></li>
                  <li><Link to="/servicos-juridicos" className="text-slate-400 hover:text-white transition-colors">Serviços Jurídicos</Link></li>
                  <li><Link to="/seguro-fianca" className="text-slate-400 hover:text-white transition-colors">Seguro Fiança</Link></li>
                  <li><Link to="/criar-site" className="text-slate-400 hover:text-white transition-colors">Criar meu site</Link></li>
                </ul>
              </div>

              {/* Services Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('home.footer.servicesTitle')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/anuncie-seu-imovel" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.listProperty')}</Link></li>
                  <li><Link to="/constellation" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.constellationPlatform')}</Link></li>
                  <li><Link to="/precos" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.pricing')}</Link></li>
                  <li><Link to="/curso/creci" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.creciCourse')}</Link></li>
                  <li><Link to="/consumidores" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.consumers')}</Link></li>
                  <li><Link to="/corretores-independentes" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.independentAgents')}</Link></li>
                  <li><Link to="/empresas-imobiliarias" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.brokerageCompanies')}</Link></li>
                  <li><Link to="/incorporadores" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.propertyDevelopers')}</Link></li>
                  <li><Link to="/gestores-longo-prazo" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.longTermManagers')}</Link></li>
                  <li><Link to="/gestores-curto-prazo" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.shortTermManagers')}</Link></li>
                  <li><Link to="/parceiros-financiamento" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.financingPartners')}</Link></li>
                  <li><Link to="/inspecoes-avaliacoes" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.inspectionsAppraisals')}</Link></li>
                </ul>
              </div>

              {/* Admin & Support Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('home.footer.adminTitle')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/admin" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.admin')}</Link></li>
                  <li><Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors">{t('header.nav.employeeLogin')}</Link></li>
                  <li><a href={ConstellationUrls.login()} className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.sign_in')}</a></li>
                  <li><Link to="/sub/stellareal" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.retail_platform')}</Link></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Stella Mary Lima Barbosa · CNPJ: 53.152.795/0001-10 · CRECI 309568 · {t('home.footer.copyright')}</p>
            </div>

            {/* Social Media Icons */}
            <div className="pt-6 flex justify-center">
              <div className="flex items-center gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/instagram.png" alt="Instagram" className="h-8 w-auto" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/x-white.png" alt="X (Twitter)" className="h-8 w-auto" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/linkedin.png" alt="LinkedIn" className="h-8 w-auto" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/facebook.png" alt="Facebook" className="h-8 w-auto" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/youtube.png" alt="YouTube" className="h-8 w-auto" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/tiktok.png" alt="TikTok" className="h-8 w-auto" />
                </a>
              </div>
            </div>

            {/* Constellation Logo and Branding at Bottom */}
            <div className="pt-8 mt-8 border-t border-slate-700/50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/tech-icons/contellation-logo.png" 
                  alt="Constellation" 
                  className="h-16 w-auto object-contain"
                  style={{
                    filter: 'grayscale(1) brightness(1.2)'
                  }}
                />
                <span 
                  className="text-2xl font-light uppercase tracking-[0.3em] text-white/80" 
                  style={{ 
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  CONSTELLATION
                </span>
              </div>
              <p className="text-slate-400 text-xs italic">Quando o valor é muito claro, as decisões são muito fáceis</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
