import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Check, X } from 'lucide-react'
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

  // Set body background to match Pricing page
  useEffect(() => {
    document.body.style.backgroundColor = '#020617' // slate-950
    return () => {
      document.body.style.backgroundColor = '' // Reset on unmount
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Constellation - Plataforma Completa para Corretores de Imóveis</title>
        <meta name="description" content="Crie seu site, gerencie leads, gere tours 3D e automatize seu CRM. Plataforma completa para corretores a partir de R$ 99/mês. Vagas limitadas para corretores fundadores." />
        
        {/* Open Graph - WhatsApp, Facebook, LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://constellation.stellareal.com.br/constellation" />
        <meta property="og:title" content="Constellation - Plataforma para Corretores" />
        <meta property="og:description" content="Site + CRM + Tours 3D + Gestão de Equipe. Tudo em uma única plataforma por R$ 99/mês." />
        <meta property="og:image" content="https://constellation.stellareal.com.br/constellation-og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Constellation - Plataforma Imobiliária" />
        <meta property="og:site_name" content="Constellation by Stella Real Estate" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter/X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@StellaRealBR" />
        <meta name="twitter:title" content="Constellation - Plataforma para Corretores" />
        <meta name="twitter:description" content="Site + CRM + Tours 3D + Gestão de Equipe. Tudo em uma única plataforma por R$ 99/mês." />
        <meta name="twitter:image" content="https://constellation.stellareal.com.br/constellation-og-image.png" />
      </Helmet>
      
      <div className="bg-slate-950 text-slate-100 min-h-screen -mt-[var(--header-height,60px)]">
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
      {/* Hero + Pricing Consolidated Section */}
      <section id="pricing-section" className="relative overflow-hidden pt-40 lg:pt-44 pb-16 lg:pb-20 scroll-mt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(100, 116, 139) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                  Constellation
                </span>
              </h1>
              
              <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
                Seu site, CRM e gestão em uma única plataforma.
              </p>
              
              <p className="text-lg text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Pare de pagar por 5 ferramentas separadas. Crie seu site, gerencie leads, acompanhe negócios e gere tours 3D—tudo por R$ 99/mês como corretor fundador.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
                <a href="https://br.trustpilot.com/review/stellareal.com.br" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/tech-icons/trustpilot-white.svg" 
                    alt="Trustpilot" 
                    className="h-7 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  />
                </a>
                <div className="flex items-center gap-2">
                  <a 
                    href="https://www.crecisp.gov.br/cidadao/buscaporcorretores" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <img 
                      src="/tech-icons/brazil-coat-of-arms.png" 
                      alt="Brasão da República Federativa do Brasil" 
                      className="h-7"
                    />
                    <span className="text-sm font-bold">
                      <span className="text-white">CRECI</span>
                      <span className="text-red-500">SP</span>
                    </span>
                  </a>
                  <span className="text-sm text-slate-300">309568</span>
                </div>
              </div>

              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-6">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </div>
                <span className="font-medium">Últimas {foundingSlotsRemaining} vagas · 50% OFF Vitalício</span>
              </div>
            </div>

            {/* Plans Title */}
            <h2 className="text-2xl md:text-3xl font-light text-white text-center mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Escolha Seu Plano
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  id: 'SOLO',
                  name: 'Pro',
                  tagline: 'Comece agora',
                  description: 'Corretor autônomo que quer seu próprio site profissional',
                  monthlyPrice: 199,
                  founderPrice: 99,
                  features: [
                    { name: '1 site profissional', included: true },
                    { name: 'Até 50 anúncios ativos', included: true },
                    { name: 'Domínio próprio (.com.br)', included: true },
                    { name: '3.000 contatos CRM', included: true },
                    { name: '2 pipelines de vendas', included: true },
                    { name: '2 tours 3D/mês', included: true },
                    { name: 'Tours extras R$200 cada', included: true },
                    { name: 'Automações básicas', included: true },
                    { name: '2 usuários', included: true },
                    { name: 'Lead scoring', included: false },
                    { name: 'Remover marca Stella', included: false },
                  ],
                  popular: false,
                  cta: 'Teste Grátis (Sem Cartão)',
                  preRegisterPrice: 'R$ 99/mês para pré-cadastrados',
                  afterLaunchPrice: 'R$ 199/mês após Janeiro'
                },
                {
                  id: 'TEAM',
                  name: 'Team',
                  tagline: 'Mais popular',
                  description: 'Pequenas equipes prontas para escalar suas operações',
                  monthlyPrice: 399,
                  founderPrice: 199,
                  features: [
                    { name: '2 sites completos', included: true },
                    { name: 'Até 150 anúncios ativos', included: true },
                    { name: 'Domínio próprio (.com.br)', included: true },
                    { name: '10.000 contatos CRM', included: true },
                    { name: 'Pipelines ilimitados', included: true },
                    { name: '5 tours 3D/mês', included: true },
                    { name: 'Tours extras R$160 cada', included: true },
                    { name: 'Automações completas', included: true },
                    { name: 'Lead scoring inteligente', included: true },
                    { name: '5 usuários + permissões', included: true },
                    { name: 'White label (sua marca)', included: true },
                    { name: 'Suporte prioritário', included: true },
                  ],
                  popular: true,
                  cta: 'Teste Grátis (Sem Cartão)',
                  preRegisterPrice: 'R$ 199/mês para pré-cadastrados',
                  afterLaunchPrice: 'R$ 399/mês após Janeiro'
                },
                {
                  id: 'BROKERAGE',
                  name: 'Brokerage',
                  tagline: 'Para imobiliárias',
                  description: 'Imobiliárias com múltiplas equipes e grande volume',
                  monthlyPrice: 999,
                  founderPrice: 499,
                  features: [
                    { name: '3 sites completos', included: true },
                    { name: 'Até 500 anúncios ativos', included: true },
                    { name: 'Múltiplos domínios', included: true },
                    { name: '50.000 contatos CRM', included: true },
                    { name: 'Pipelines ilimitados', included: true },
                    { name: '20 tours 3D/mês', included: true },
                    { name: 'Tours extras R$120 cada', included: true },
                    { name: 'Automações avançadas', included: true },
                    { name: 'Lead scoring avançado', included: true },
                    { name: '30 usuários + RBAC', included: true },
                    { name: 'White label completo', included: true },
                    { name: 'Suporte VIP + chat', included: true },
                  ],
                  popular: false,
                  cta: 'Teste Grátis (Sem Cartão)',
                  preRegisterPrice: 'R$ 499/mês para pré-cadastrados',
                  afterLaunchPrice: 'R$ 999/mês após Janeiro'
                },
                {
                  id: 'ENTERPRISE',
                  name: 'Enterprise',
                  tagline: 'Sob medida',
                  description: 'Redes e incorporadoras com operações complexas',
                  monthlyPrice: null,
                  founderPrice: null,
                  features: [
                    { name: 'Sites ilimitados', included: true },
                    { name: 'Anúncios ilimitados', included: true },
                    { name: 'Múltiplos domínios', included: true },
                    { name: 'Contatos ilimitados', included: true },
                    { name: 'Tudo ilimitado', included: true },
                    { name: 'Tours 3D sob demanda', included: true },
                    { name: 'Preços por contrato', included: true },
                    { name: 'Automações enterprise', included: true },
                    { name: 'IA e scoring avançado', included: true },
                    { name: 'Usuários ilimitados', included: true },
                    { name: 'White label completo', included: true },
                    { name: 'SLA + gerente dedicado', included: true },
                    { name: 'Acesso antecipado', included: true },
                  ],
                  popular: false,
                  cta: 'Falar com Vendas',
                },
              ].map((plan, index) => {
                const isEnterprise = plan.monthlyPrice === null
                
                return (
                  <div
                    key={index}
                    className={`relative rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 flex flex-col ${
                      plan.popular
                        ? 'bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border-blue-500/50 shadow-2xl shadow-blue-500/20'
                        : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                          Mais Popular
                        </span>
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      {'tagline' in plan && plan.tagline && !plan.popular && (
                        <span className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{plan.tagline}</span>
                      )}
                      <h3 className="text-2xl font-light mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{plan.name}</h3>
                      <p className="text-slate-400 text-sm mb-6 min-h-[40px]">{plan.description}</p>

                      <div className="mb-6 min-h-[140px] flex items-start">
                        {isEnterprise ? (
                          <div className="flex flex-col">
                            <div className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Personalizado</div>
                            <p className="text-sm text-slate-400 font-light mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              Fale com nosso time
                            </p>
                            <p className="text-xs text-emerald-400 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              Corretores fundadores mantêm 50% de desconto sobre a tabela mensal negociada
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col w-full">
                            <div className="flex flex-wrap items-baseline gap-1 mb-1">
                              <span className="text-sm text-slate-500 font-light whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Após Janeiro:
                              </span>
                              <span className="text-xl sm:text-2xl font-light text-slate-400 line-through whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                R$ {plan.monthlyPrice}
                              </span>
                              <span className="text-slate-500 font-light text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>/mês</span>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-1 mb-2">
                              <span className="text-sm text-emerald-400 font-medium whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Pré-cadastrados:
                              </span>
                              {(plan.id === 'SOLO' || plan.id === 'TEAM') ? (
                                <>
                                  <span className="text-2xl sm:text-3xl font-light text-emerald-400 whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    1 mês grátis
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-2xl sm:text-3xl font-light text-emerald-400 whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    R$ {plan.founderPrice}
                                  </span>
                                  <span className="text-emerald-300 font-light text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>/mês</span>
                                </>
                              )}
                            </div>
                            {(plan.id === 'SOLO' || plan.id === 'TEAM') ? (
                              <p className="text-xs text-slate-400 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                + R$ {plan.founderPrice}/mês após o período grátis (50% OFF vitalício)
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Garantia de preço para pré-cadastrados
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {isEnterprise ? (
                        <a
                          href="https://wa.me/5511986410429?text=Olá%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20plano%20Enterprise"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-3 rounded-lg font-semibold transition-all mb-6 bg-slate-800 hover:bg-slate-700 text-slate-100"
                        >
                          {plan.cta}
                        </a>
                      ) : (
                        <a
                          href={ConstellationUrls.signup()}
                          onClick={(e) => {
                            e.preventDefault()
                            trackStartRegistration({ source: 'pricing_card', plan: plan.id })
                            trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                              source: 'pricing_card',
                              plan: plan.id
                            })
                          }}
                          className="block w-full text-center py-3 rounded-lg font-semibold transition-all mb-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          {plan.cta}
                        </a>
                      )}

                      <div className="space-y-3 flex-grow">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span
                              className={`text-xs ${
                                feature.included ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            >
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Social Proof */}
            <div className="text-center py-6">
              <p className="text-slate-300 text-sm">
                <span className="text-emerald-400 font-bold">47 corretores</span> já garantiram sua vaga esta semana
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Veja um exemplo real: <a href="https://stellareal.com.br" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">stellareal.com.br</a> — site construído com Constellation
              </p>
            </div>

            {/* Tech Stack Logos */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <img src="/tech-icons/color/Visual_Studio_Code_1.35_icon.svg.png" alt="Visual Studio Code - ferramenta de desenvolvimento" className="h-6 object-contain" />
              <img src="/tech-icons/color/524-5240809_aws-logo-svg-white-clipart.png" alt="AWS - infraestrutura em nuvem" className="h-6 object-contain" />
              <img src="/tech-icons/color/apple-developer-og-twitter.png" alt="Apple Developer - plataforma de desenvolvimento" className="h-12 object-contain" />
              <img src="/tech-icons/color/NET_BIG.D-52893f5e.png" alt=".NET - framework de desenvolvimento" className="h-6 object-contain" />
              <img src="/tech-icons/color/pngimg.com - github_PNG65.png" alt="GitHub - controle de versão" className="h-9 object-contain invert brightness-0 invert" />
              <img src="/tech-icons/color/Stripe_Logo,_revised_2016.svg.png" alt="Stripe - processamento de pagamentos" className="h-6 object-contain" />
              <img src="/tech-icons/color/supabase-logo-wordmark--dark.png" alt="Supabase - banco de dados e autenticação" className="h-6 object-contain" />
              <div className="flex items-center gap-2">
                <img 
                  src="/tech-icons/contellation-logo.png" 
                  alt="Logo da plataforma Constellation para corretores de imóveis" 
                  className="h-10 object-contain brightness-150" 
                  style={{ filter: 'brightness(1.5) drop-shadow(0 0 24px rgba(199, 210, 254, 1)) drop-shadow(0 0 12px rgba(199, 210, 254, 0.9)) drop-shadow(0 0 8px rgba(199, 210, 254, 0.8))' }}
                />
                <span className="text-sm font-light uppercase tracking-[0.4em] text-indigo-200/80" style={{ fontFamily: 'Outfit, sans-serif' }}>CONSTELLATION</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/tech-icons/ballet-new-logo.png" alt="Logo Ballet - gerenciamento de projetos" className="h-8 object-contain" />
                <span className="text-sm font-light uppercase tracking-[0.4em] text-pink-400/90" style={{ fontFamily: 'Outfit, sans-serif' }}>BALLET</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3D Maps Video Demo Section */}
      <section className="py-12 lg:py-16 relative bg-slate-950">
        <div className="container-padded">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Explanation */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Tours 3D que vendem enquanto você dorme
                  </h3>
                  <p className="text-slate-300 mb-6 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Você grava um vídeo simples do imóvel. Nós transformamos em uma experiência 3D interativa onde seus clientes "caminham" pelo espaço de qualquer lugar do mundo, 24 horas por dia.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Reduz 80%+ das visitas improdutivas</span>
                        <p className="text-sm text-slate-400">Clientes já conhecem o imóvel antes de agendar</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Funciona em qualquer celular ou computador</span>
                        <p className="text-sm text-slate-400">Sem app, sem plugins, direto no navegador</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Entrega rápida</span>
                        <p className="text-sm text-slate-400">Seu tour pronto em até 48 horas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Demo Video */}
              <div className="relative group h-full">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/20 opacity-50 blur-2xl group-hover:opacity-75 transition duration-500" />
                <div className="relative overflow-hidden rounded-2xl border border-emerald-400/40 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.6)] ring-1 ring-emerald-400/10 h-full flex flex-col">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
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
                        Demonstração ao Vivo
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mt-1">Experiência 3D interativa em tempo real</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Statistics Section */}
      <section className="py-16 lg:py-20 relative bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container-padded">
          <div className="max-w-7xl mx-auto">
            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  80%+
                </div>
                <p className="text-slate-300 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Redução em visitas que não resultam em fechamento
                </p>
              </div>
              
              <div className="text-center p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  500%+
                </div>
                <p className="text-slate-300 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  ROI médio em tecnologia imobiliária
                </p>
              </div>
              
              <div className="text-center p-8 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  24/7
                </div>
                <p className="text-slate-300 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Tours virtuais disponíveis para seus clientes
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
              <a href="https://br.trustpilot.com/review/stellareal.com.br" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/tech-icons/trustpilot-white.svg" 
                  alt="Trustpilot" 
                  className="h-10 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                />
              </a>
              <div className="flex items-center gap-2">
                <a 
                  href="https://www.crecisp.gov.br/cidadao/buscaporcorretores" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img 
                    src="/tech-icons/brazil-coat-of-arms.png" 
                    alt="Brasão da República Federativa do Brasil" 
                    className="h-10"
                  />
                  <span className="text-lg font-bold">
                    <span className="text-white">CRECI</span>
                    <span className="text-red-500">SP</span>
                  </span>
                </a>
                <span className="text-lg text-slate-300">309568</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ballet Section - Inspired by Asana */}
      <section className="py-12 lg:py-16 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(147, 51, 234) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Ballet Logo */}
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img 
                  src="/ballet-new-logo.png" 
                  alt="Ballet" 
                  className="h-12 w-auto"
                />
                <span className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Ballet
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Não é apenas um gerenciador de tarefas.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                  É tudo que sua imobiliária precisa.
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Com Ballet, você gerencia projetos, acompanha negócios, coordena sua equipe e automatiza fluxos de trabalho—tudo em uma única plataforma integrada ao Constellation.
              </p>
            </div>

            {/* Feature Grid - Asana-inspired */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Column 1 - Where Work Connects */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Clareza e Responsabilidade
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Conecte o trabalho diário às metas da imobiliária. Mantenha todos focados no que importa com visibilidade em tempo real.
                </p>
                <ul className="space-y-2">
                  {['Quadros Kanban personalizáveis', 'Visualização de Timeline', 'Metas e OKRs integrados'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-purple-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 - Maximize Impact */}
              <div className="bg-gradient-to-br from-pink-900/30 to-slate-900/50 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/40 transition-all">
                <div className="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Maximize seu Impacto
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Aumente a eficiência em todos os departamentos com automações inteligentes e fluxos de trabalho personalizados.
                </p>
                <ul className="space-y-2">
                  {['Automações sem código', 'Templates de projetos', 'Integrações nativas'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-pink-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 - Scale with Confidence */}
              <div className="bg-gradient-to-br from-rose-900/30 to-slate-900/50 backdrop-blur-xl border border-rose-500/20 rounded-2xl p-8 hover:border-rose-500/40 transition-all">
                <div className="w-14 h-14 rounded-xl bg-rose-500/20 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Escale com Confiança
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Conecte equipes e ferramentas em toda sua organização com segurança e controle de nível enterprise.
                </p>
                <ul className="space-y-2">
                  {['Controle de permissões', 'Múltiplos workspaces', 'Histórico completo'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Use Cases Row */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 lg:p-12 mb-16">
              <h3 className="text-2xl font-light text-white mb-8 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Um sistema para cada área da sua imobiliária
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Gestão de Vendas',
                    description: 'Pipeline de negócios, acompanhamento de propostas e fechamentos',
                    icon: '💼'
                  },
                  {
                    title: 'Marketing',
                    description: 'Campanhas, calendário de conteúdo e lançamentos de imóveis',
                    icon: '📣'
                  },
                  {
                    title: 'Operações',
                    description: 'Documentação, vistorias e processos de locação',
                    icon: '⚙️'
                  },
                  {
                    title: 'Equipe',
                    description: 'Onboarding, metas individuais e avaliação de desempenho',
                    icon: '👥'
                  }
                ].map((useCase, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <h4 className="text-lg font-medium text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {useCase.title}
                    </h4>
                    <p className="text-sm text-slate-400">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <p className="text-lg text-slate-300 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Ballet está <strong className="text-purple-400">incluído em todos os planos</strong> do Constellation
              </p>
              <a
                href={ConstellationUrls.signup()}
                onClick={(e) => {
                  e.preventDefault()
                  trackStartRegistration({ source: 'ballet_section', plan: 'founding_100' })
                  trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                    source: 'ballet_section',
                    plan: 'founding_100'
                  })
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Experimente Ballet com Constellation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Constellation Platform Section - Public Facing */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Constellation Logo */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img 
                  src="/contellation-logo.png" 
                  alt="Constellation" 
                  className="h-12 w-auto"
                />
                <span className="text-3xl sm:text-4xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Constellation
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Sua presença digital completa.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                  Tudo que seus clientes veem.
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Constellation é a sua vitrine digital—desde a criação do site até a gestão de imóveis, anúncios e a experiência completa do cliente. Tudo público-facing em uma única plataforma.
              </p>
            </div>

            {/* Two Column Layout - Internal vs External */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Left - Constellation (Public) */}
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-blue-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Público-Facing
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { title: 'Sites Profissionais', desc: 'Lance um site imobiliário impressionante em minutos com nosso construtor drag-and-drop. Otimizado para mobile e pronto para SEO.' },
                    { title: 'Gestão Poderosa de Imóveis', desc: 'Gerencie todas as suas propriedades em um só lugar. Adicione fotos, vídeos, tours 3D e publique em múltiplas plataformas instantaneamente.' },
                    { title: 'Mercado de Varejo', desc: 'Liste suas propriedades no Stella Real, nossa plataforma de varejo. Obtenha exposição para milhares de potenciais compradores.' },
                    { title: 'Landing Pages', desc: 'Páginas de captura otimizadas para cada imóvel ou campanha de marketing.' },
                    { title: 'SEO Otimizado', desc: 'Posicionamento orgânico no Google com meta tags, sitemaps e estrutura otimizada.' },
                    { title: 'Experiência do Cliente', desc: 'Agendamento de visitas, chat ao vivo e WhatsApp integrado para atendimento rápido.' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">{item.title}</span>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right - Ballet (Internal) */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-purple-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Interno (Ballet)
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { title: 'Gestão de Tarefas (Kanban)', desc: 'Organize seu fluxo de trabalho com quadros Kanban. Acompanhe visitas, papelada e tarefas de fechamento sem esforço.' },
                    { title: 'CRM Integrado', desc: 'Acompanhe cada lead, cliente e negócio. Nunca perca um follow-up com lembretes automáticos e gestão de pipeline.' },
                    { title: 'Análises e Insights', desc: 'Entenda seu negócio com análises detalhadas. Acompanhe visualizações, leads, conversões e receita.' },
                    { title: 'Automações', desc: 'Fluxos de trabalho sem código para automatizar processos repetitivos.' },
                    { title: 'Gestão de Equipe', desc: 'Tarefas, metas individuais e avaliação de desempenho.' },
                    { title: 'Documentação', desc: 'Contratos, vistorias e processos centralizados em um só lugar.' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">{item.title}</span>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom message */}
            <div className="text-center">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900/50 border border-slate-700/50 rounded-full">
                <span className="text-blue-400 font-medium">Constellation</span>
                <span className="text-slate-500">+</span>
                <span className="text-purple-400 font-medium">Ballet</span>
                <span className="text-slate-500">=</span>
                <span className="text-white font-medium">Plataforma Completa</span>
              </div>
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
                Comece em Minutos
              </h2>
              <p className="text-lg text-slate-400">
                Nenhum conhecimento técnico necessário. Vamos guiá-lo em cada etapa do caminho.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Cadastre-se e Escolha Seu Plano',
                  description: 'Crie sua conta e selecione o plano que atende às suas necessidades. Comece com nosso teste gratuito.'
                },
                {
                  step: '2',
                  title: 'Construa Seu Site',
                  description: 'Use nosso construtor intuitivo para criar seu site profissional. Escolha entre templates ou comece do zero.'
                },
                {
                  step: '3',
                  title: 'Adicione Imóveis e Entre no Ar',
                  description: 'Envie suas propriedades, conecte seu domínio e comece a atrair clientes imediatamente.'
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

      {/* Final CTA */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            {/* Urgency reminder */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Preço de R$ 99/mês só até Janeiro 2026</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Últimas {foundingSlotsRemaining} vagas para Corretores Fundadores
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Garanta 50% de desconto vitalício + acesso prioritário ao lançamento em Janeiro.
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
                  <li><Link to="/creci-disclosure" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.creciDisclosure')}</Link></li>
                  <li><Link to="/politica-pld" className="text-slate-400 hover:text-white transition-colors">{t('home.footer.amlPolicy')}</Link></li>
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
                  <img src="/social-icons/tiktok-icon.png" alt="TikTok" className="h-6 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://bsky.app/profile/stellarealbrasil.bsky.social" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                  <img src="/social-icons/bluesky.svg" alt="Bluesky" className="h-6 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
                </a>
              </div>
            </div>

            {/* Constellation Logo and Branding at Bottom */}
            <div className="pt-8 mt-8 border-t border-slate-700/50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-6">
                {/* Constellation Logo */}
                <div className="flex items-center gap-3">
                  <img 
                    src="/tech-icons/contellation-logo.png" 
                    alt="Constellation" 
                    className="h-14 w-auto object-contain"
                    style={{
                      filter: 'grayscale(1) brightness(1.2)'
                    }}
                  />
                  <span 
                    className="text-xl font-light uppercase tracking-[0.3em] text-white/80" 
                    style={{ 
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    CONSTELLATION
                  </span>
                </div>
                
                {/* Divider */}
                <div className="h-10 w-px bg-slate-600/50 hidden sm:block" />
                
                {/* Stella Mary Logo */}
                <a href="https://stellareal.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <img 
                    src="/stella-logo.png" 
                    alt="Stella Mary Real Estate" 
                    className="h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </a>
              </div>
              <p className="text-slate-400 text-xs italic">Quando o valor é muito claro, as decisões são muito fáceis</p>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap justify-center items-center gap-4">
              <a href="https://br.trustpilot.com/review/stellareal.com.br" target="_blank" rel="noopener noreferrer">
                <img src="/tech-icons/trustpilot-white.svg" alt="Trustpilot" className="h-5" />
              </a>
              <div className="flex items-center gap-1">
                <a 
                  href="https://www.crecisp.gov.br/cidadao/buscaporcorretores" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <img 
                    src="/tech-icons/brazil-coat-of-arms.png" 
                    alt="Brasão da República Federativa do Brasil" 
                    className="h-5"
                  />
                  <span className="text-xs font-bold">
                    <span className="text-white">CRECI</span>
                    <span className="text-red-500">SP</span>
                  </span>
                </a>
                <span className="text-xs text-slate-300">309568</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
