import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ConstellationHeader from '../components/ConstellationHeader'
import { ConstellationUrls } from '../utils/constellationUrl'
import { Helmet } from 'react-helmet-async'
import { trackPageView, trackCTA, trackWhatsAppClick, trackPlanView } from '../utils/analytics'
import { ConstellationGTMHead, ConstellationGTMBody } from '../components/ConstellationGTM'

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
      <ConstellationGTMHead />
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Constellation - Plataforma Profissional para Corretores de Imóveis | Stella Real Estate</title>
        <meta name="title" content="Constellation - Plataforma Profissional para Corretores de Imóveis | Stella Real Estate" />
        <meta name="description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A plataforma completa para corretores independentes, imobiliárias e incorporadores. A partir de R$ 149/mês." />
        <meta name="keywords" content="plataforma imobiliária, CRM imobiliário, site para corretor, gestão de leads imobiliários, mapas 3D, marketing imobiliário, automação imobiliária, software imobiliário, site personalizado corretor, plataforma corretor independente" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://constellation.stellareal.com.br/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://constellation.stellareal.com.br/" />
        <meta property="og:title" content="Constellation - Plataforma Imobiliária e CRM para Corretores" />
        <meta property="og:description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A plataforma completa para corretores." />
        <meta property="og:image" content="https://stellareal.com.br/constellation-og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Constellation by Stella Real Estate" />
        
        {/* Twitter/X */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:site" content="@StellaRealBR" />
        <meta property="twitter:creator" content="@StellaRealBR" />
        <meta property="twitter:url" content="https://constellation.stellareal.com.br/" />
        <meta property="twitter:title" content="Constellation - Plataforma Imobiliária e CRM para Corretores" />
        <meta property="twitter:description" content="Crie sites profissionais, gerencie leads, gere mapas 3D e automatize seu marketing imobiliário. A partir de R$ 149/mês." />
        <meta property="twitter:image" content="https://stellareal.com.br/constellation-og-image.png" />
        
        {/* Language and Geo */}
        <meta httpEquiv="content-language" content="pt-BR" />
        <meta name="geo.region" content="BR" />
        <meta name="geo.placename" content="Brasil" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Stella Real Estate" />
        <meta name="publisher" content="Stella Real Estate" />
        <meta name="theme-color" content="#020617" />
        
        {/* Structured Data - SoftwareApplication with Product Info */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Constellation",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://constellation.stellareal.com.br/",
            "description": "Plataforma completa para corretores de imóveis: sites profissionais, CRM, gestão de leads, mapas 3D, analytics e automação de marketing.",
            "screenshot": "https://stellareal.com.br/constellation-og-image.png",
            "featureList": [
              "Sites Profissionais Personalizáveis",
              "CRM & Gestão de Leads",
              "Mapas 3D Interativos",
              "Gestão de Equipe",
              "Estúdio de Mídias Sociais",
              "Analytics Avançado",
              "Cofre de Documentos",
              "Deal Room",
              "Automação de Marketing"
            ],
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "BRL",
              "lowPrice": "99",
              "highPrice": "19900",
              "offerCount": "4",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Founding 100 - Acesso Vitalício",
                  "price": "99",
                  "priceCurrency": "BRL",
                  "description": "Pagamento único de R$ 99 + 3 meses grátis + 50% de desconto vitalício"
                },
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
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "Stella Real Estate",
              "url": "https://stellareal.com.br/",
              "logo": "https://stellareal.com.br/stella-logo.png"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127",
              "bestRating": "5"
            }
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
        <ConstellationGTMBody />
        
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Lançamento Janeiro 2026 · Pré-cadastro Aberto
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Pare de fazer malabarismo com 10 ferramentas.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                Comece a fechar negócios.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-4 font-light">
              Site + CRM + Gestão de Tarefas + Tours 3D — tudo em uma plataforma.
            </p>
            
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Constellation é a plataforma completa para corretores que querem trabalhar de forma mais inteligente. Construída por uma equipe de 3 pessoas que acredita que tecnologia deve simplificar, não complicar.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={ConstellationUrls.signup()}
                onClick={() => trackCTA('Garantir Vaga', 'hero')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Garantir Vaga · R$ 99
              </a>
              <Link
                to="/constellation"
                onClick={() => trackCTA('Ver Recursos', 'hero')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Ver Todos os Recursos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Video Demo - Compressed */}
      <section className="py-12 lg:py-16 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Tours 3D que vendem enquanto você dorme
              </h2>
              <p className="text-slate-400">Seus clientes "caminham" pelo imóvel de qualquer lugar do mundo</p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/20 opacity-50 blur-2xl group-hover:opacity-75 transition duration-500" />
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/30 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.4)]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                  poster="/video/office-3D-poster.jpg"
                >
                  <source src="/video/office-3D.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Demo ao Vivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 lg:py-16 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>80%+</div>
                <p className="text-slate-300 text-sm">Menos visitas improdutivas</p>
              </div>
              <div className="text-center p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>500%+</div>
                <p className="text-slate-300 text-sm">ROI médio em tecnologia</p>
              </div>
              <div className="text-center p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>24/7</div>
                <p className="text-slate-300 text-sm">Tours virtuais disponíveis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Platforms Section */}
      <section className="py-16 lg:py-20 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Duas plataformas. Uma solução.
              </h2>
              <p className="text-slate-400">Tudo que você precisa para o externo e o interno</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Constellation - Public */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/contellation-logo.png" alt="Constellation" className="h-8 w-auto" />
                  <span className="text-lg font-light text-blue-300">Constellation</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">Tudo que seus clientes veem</p>
                <ul className="space-y-2 text-sm">
                  {['Sites profissionais', 'Gestão de imóveis', 'Tours 3D', 'Publicação multi-plataforma'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Ballet - Internal */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/ballet-new-logo.png" alt="Ballet" className="h-8 w-auto" />
                  <span className="text-lg font-light text-purple-300">Ballet</span>
                </div>
                <p className="text-slate-400 text-sm mb-4">Tudo que sua equipe usa</p>
                <ul className="space-y-2 text-sm">
                  {['CRM integrado', 'Gestão de tarefas (Kanban)', 'Automações', 'Relatórios e métricas'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/50 border border-slate-700/50 rounded-full text-sm">
                <span className="text-blue-400">Constellation</span>
                <span className="text-slate-500">+</span>
                <span className="text-purple-400">Ballet</span>
                <span className="text-slate-500">=</span>
                <span className="text-white font-medium">Plataforma Completa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="precos" className="py-20 lg:py-24 relative scroll-mt-20">
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

              {/* Custom/Enterprise CTA - Simplified */}
              <div className="text-center mb-8">
                <p className="text-slate-400 text-sm">
                  Precisa de algo personalizado?{' '}
                  <a
                    href="https://wa.me/5511985853836?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20desenvolvimento%20de%20site%20personalizado."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('custom_site_link')}
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Fale com nosso time →
                  </a>
                </p>
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
      <section className="py-16 lg:py-20 relative">
        <div className="container-padded">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vagas Limitadas para Corretores Fundadores
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Seja um dos primeiros.
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
              Garanta acesso antecipado por R$ 99/mês vitalício + influencie o produto que estamos construindo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={ConstellationUrls.signup()}
                onClick={() => trackCTA('Garantir Minha Vaga', 'final_cta')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Garantir Minha Vaga
              </a>
              <Link
                to="/constellation"
                onClick={() => trackCTA('Ver Recursos Completos', 'final_cta')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Ver Recursos Completos
              </Link>
            </div>
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
                <a href="https://www.instagram.com/stellam.real/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/instagram.png" alt="Instagram" className="h-8 w-auto" />
                </a>
                <a 
                  href="https://x.com/StellaRealBR" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Siga Stella Real Estate no X (anteriormente Twitter)"
                  title="Stella Real Estate no X"
                >
                  <img src="/social-icons/x-white.png" alt="Stella Real Estate no X (@StellaRealBR)" className="h-8 w-auto" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/linkedin.png" alt="LinkedIn" className="h-8 w-auto" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/facebook.png" alt="Facebook" className="h-8 w-auto" />
                </a>
                <a href="https://www.youtube.com/@StellaRealBrasil" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/youtube.png" alt="YouTube" className="h-8 w-auto" />
                </a>
                <a href="https://tiktok.com/@stellarealbr" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/tiktok-color.png" alt="TikTok" className="h-8 w-auto" />
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
