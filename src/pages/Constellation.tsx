import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import ConstellationHeader from '../components/ConstellationHeader'
import { ConstellationUrls } from '../utils/constellationUrl'
import { trackStartRegistration, trackPurchaseEventWithRedirect } from '../utils/analytics'

export default function Constellation() {
  const { t, i18n } = useTranslation()
  const [showStickyCTA, setShowStickyCTA] = useState(false)

  // Force Portuguese language on constellation subdomain
  useEffect(() => {
    if (i18n.language !== 'pt') {
      i18n.changeLanguage('pt')
    }
  }, [i18n])

  // Calculate founding slots remaining
  const calculateFoundingSlots = () => {
    const startDate = new Date('2025-11-14T00:00:00')
    const endDate = new Date('2025-12-31T23:59:59')
    const now = new Date()
    
    if (now >= endDate) return 0
    if (now < startDate) return 99
    
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()
    const progress = elapsed / totalDuration
    
    return Math.max(1, Math.ceil(99 - (progress * 98)))
  }

  const foundingSlotsRemaining = calculateFoundingSlots()

  // Show sticky CTA after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 600 // Approximate hero section height
      setShowStickyCTA(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Constellation Header */}
      <ConstellationHeader />

      {/* Sticky Floating CTA */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <a
          href={ConstellationUrls.signup()}
          onClick={(e) => {
            e.preventDefault()
            trackStartRegistration({ source: 'sticky_cta', plan: 'founding_100' })
            trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
              source: 'sticky_cta',
              plan: 'founding_100'
            })
          }}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-2xl shadow-emerald-500/50 hover:scale-105"
        >
          <span>Garantir Acesso</span>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">R$ 99</span>
        </a>
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(100, 116, 139) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              The Platform for Real Estate Professionals
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                Constellation
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
              Your Complete Real Estate Business Platform
            </p>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Build your website, manage listings, nurture leads, and close deals—all in one powerful platform designed specifically for realtors and brokerages.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={ConstellationUrls.signup()}
                onClick={(e) => {
                  e.preventDefault()
                  trackStartRegistration({ source: 'hero_cta', plan: 'founding_100' })
                  trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                    source: 'hero_cta',
                    plan: 'founding_100'
                  })
                }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Garantir Acesso - R$ 99
              </a>
              <Link
                to="/admin/login"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founding 100 Offer */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-emerald-900/40 border-2 border-emerald-500/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl shadow-emerald-500/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-sm mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Oferta Limitada
                </div>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Faça Parte dos <span className="text-emerald-300">Founding 100</span>
                </h2>
                <p className="text-xl text-slate-300 mb-2">
                  Garanta benefícios vitalícios por apenas <span className="text-emerald-300 font-semibold">R$ 99</span>
                </p>
                <p className="text-sm text-slate-400">
                  Pagamento único • Sem assinatura • Benefícios permanentes
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/30 text-center">
                  <div className="text-4xl font-light text-emerald-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 99</div>
                  <div className="text-sm text-slate-300">Pagamento único</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/30 text-center">
                  <div className="text-4xl font-light text-emerald-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>3 meses</div>
                  <div className="text-sm text-slate-300">Grátis em todos planos</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/30 text-center">
                  <div className="text-4xl font-light text-emerald-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>50% OFF</div>
                  <div className="text-sm text-slate-300">Permanente após lançamento</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Benefícios Vitalícios Inclusos:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Contato direto com nosso Diretor de Tecnologia',
                    '50% desconto permanente em qualquer plano',
                    '3 meses grátis em todos os planos após lançamento',
                    'Primeiro acesso quando lançar em Janeiro 2026',
                    '10 mapas 3D incluídos por mês (5 extras permanentes)',
                    'Mapas 3D extras por R$ 10 (sempre, vs R$ 160+)',
                    'Badge de Founding Partner + acesso antecipado a novos recursos'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <a
                  href={ConstellationUrls.signup()}
                  onClick={(e) => {
                    e.preventDefault()
                    trackStartRegistration({ source: 'founding_section', plan: 'founding_100' })
                    trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                      source: 'founding_section',
                      plan: 'founding_100'
                    })
                  }}
                  className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-bold transition-all shadow-xl shadow-emerald-500/50 hover:scale-105 text-xl"
                >
                  Garantir Acesso Agora
                </a>
                <div className="text-center">
                  <div className="text-sm text-emerald-300 font-semibold mb-2">
                    Apenas {foundingSlotsRemaining} vagas restantes de 100
                  </div>
                  <div className="text-xs text-slate-400 max-w-md">
                    A partir de 1º de janeiro, aceitaremos no máximo 3 a 5 novas contas por semana
                  </div>
                </div>
              </div>
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
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                From your first listing to scaling your brokerage, Constellation grows with you
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Professional Websites',
                  description: 'Launch a stunning real estate website in minutes with our drag-and-drop builder. Mobile-optimized and SEO-ready.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: 'Powerful Listing Management',
                  description: 'Manage all your properties in one place. Add photos, videos, 3D tours, and publish to multiple platforms instantly.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )
                },
                {
                  title: 'Integrated CRM',
                  description: 'Track every lead, client, and deal. Never miss a follow-up with automated reminders and pipeline management.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Task Management (Balé)',
                  description: 'Organize your workflow with Kanban boards. Track showings, paperwork, and closing tasks effortlessly.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                },
                {
                  title: 'Retail Marketplace',
                  description: 'List your properties on Stella Real, our retail platform. Get exposure to thousands of potential buyers.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: 'Analytics & Insights',
                  description: 'Understand your business with detailed analytics. Track views, leads, conversions, and revenue.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                Get Started in Minutes
              </h2>
              <p className="text-lg text-slate-400">
                No technical knowledge required. We'll guide you every step of the way.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Sign Up & Choose Your Plan',
                  description: 'Create your account and select the plan that fits your needs. Start with our free trial.'
                },
                {
                  step: '2',
                  title: 'Build Your Site',
                  description: 'Use our intuitive builder to create your professional website. Choose from templates or start fresh.'
                },
                {
                  step: '3',
                  title: 'Add Listings & Go Live',
                  description: 'Upload your properties, connect your domain, and start attracting clients immediately.'
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
                  Plans for Every Professional
                </h2>
                <p className="text-xl text-slate-300">
                  From solo agents to large brokerages
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    plan: 'Pro', 
                    price: 'R$ 299',
                    founderPrice: 'R$ 149',
                    description: 'Para corretores independentes',
                    features: ['1 site', '50 anúncios', '3K contatos', '2 mapas 3D/mês', '2 usuários'] 
                  },
                  { 
                    plan: 'Team', 
                    price: 'R$ 499',
                    founderPrice: 'R$ 249',
                    description: 'Para pequenas equipes',
                    popular: true, 
                    features: ['2 sites', '150 anúncios', '10K contatos', '5 mapas 3D/mês', '5 usuários', 'Lead scoring'] 
                  },
                  { 
                    plan: 'Brokerage', 
                    price: 'R$ 999',
                    founderPrice: 'R$ 499',
                    description: 'Para imobiliárias',
                    features: ['3 sites', '500 anúncios', '50K contatos', '20 mapas 3D/mês', '30 usuários', 'White label'] 
                  },
                  { 
                    plan: 'Enterprise', 
                    price: 'Personalizado',
                    founderPrice: '50% OFF vitalício',
                    description: 'Soluções personalizadas',
                    features: ['Sites ilimitados', 'Tudo ilimitado', 'Mapas 3D customizados', 'SLA + CSM dedicado'] 
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
                          MAIS POPULAR
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">{tier.plan}</h3>
                    <p className="text-slate-400 text-xs mb-3">{tier.description}</p>
                    <div className="mb-1">
                      <div className="text-lg text-slate-500 line-through">{tier.price}</div>
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{tier.founderPrice}<span className="text-sm text-slate-400">/mês</span></div>
                      <div className="text-xs text-slate-400 mb-4">Preço fundador</div>
                    </div>
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

              <div className="text-center">
                <a
                  href={ConstellationUrls.signup()}
                  onClick={(e) => {
                    e.preventDefault()
                    trackStartRegistration({ source: 'pricing_section', plan: 'founding_100' })
                    trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                      source: 'pricing_section',
                      plan: 'founding_100'
                    })
                  }}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Garantir Acesso - R$ 99
                </a>
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
              Pronto para Transformar Seu Negócio Imobiliário?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Seja um dos primeiros 100 corretores fundadores e garanta benefícios vitalícios.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={ConstellationUrls.signup()}
                onClick={(e) => {
                  e.preventDefault()
                  trackStartRegistration({ source: 'final_cta', plan: 'founding_100' })
                  trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                    source: 'final_cta',
                    plan: 'founding_100'
                  })
                }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Garantir Acesso - R$ 99
              </a>
              <Link
                to="/contato"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Falar com Equipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link to="/constellation" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/precos" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/sub/stellareal" className="text-slate-400 hover:text-white transition-colors">Retail Platform</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/institucional" className="text-slate-400 hover:text-white transition-colors">Institutional</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacidade" className="text-slate-400 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link to="/termos" className="text-slate-400 hover:text-white transition-colors">Terms</Link></li>
                  <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookies</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors">Sign In</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
              <p>© 2025 Stella Real Estate. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
