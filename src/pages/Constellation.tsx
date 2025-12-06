import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 lg:pt-40 pb-8 lg:pb-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(100, 116, 139) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                Constellation
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
              Plataforma Completa para Corretores de Imóveis
            </p>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Crie seu site, gerencie imóveis, cultive leads e feche negócios—tudo em uma plataforma poderosa projetada especificamente para corretores e imobiliárias.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Ver Planos e Preços
              </button>
              <a
                href="https://www.stellareal.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Explorar Site Criado com Constellation
              </a>
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
                  <p className="text-slate-300 mb-6 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Transformamos seus vídeos 2D em mundos 3D totalmente exploráveis. Você grava, nós criamos uma experiência imersiva onde seus clientes podem "caminhar" pelo imóvel como se estivessem lá.
                  </p>
                  
                  <div className="text-left">
                    <p className="text-blue-400 text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Especificações Técnicas:
                    </p>
                    <ul className="text-blue-300 text-xs space-y-1 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      <li>• Estimativa de pose e mapeamento denso (~12min)</li>
                      <li>• 3D Gaussian Splatting para síntese fotorrealista (~20-38min em GPUs L4/L40S)</li>
                      <li>• Cenas web-optimized com splats tileados e compressão adaptativa</li>
                      <li>• Renderização high-FPS em browser sem plugins</li>
                      <li>• Armazenamento S3 multi-tier + entrega via CDN edge-cached</li>
                      <li>• Custos variáveis: disponibilidade GPU, consumo energético datacenter, demanda computacional</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Demo Video */}
              <div className="relative group h-full">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-emerald-500/40 opacity-75 blur-2xl group-hover:opacity-100 transition duration-500" />
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

            {/* Trustpilot Logo */}
            <div className="flex justify-center mt-8">
              <a href="https://br.trustpilot.com/review/stellareal.com.br" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/tech-icons/color/Trustpilot-Logo.png" 
                  alt="Trustpilot" 
                  className="h-10 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing-section" className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Planos Constellation
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
                Planos flexíveis para todos os tamanhos de negócio
              </p>
              <div className="inline-block bg-blue-900/30 border border-blue-500/50 rounded-lg px-6 py-3 max-w-3xl">
                <p className="text-sm text-blue-300 font-light leading-relaxed">
                  <span className="font-semibold">Importante:</span> A plataforma é atualmente somente por convite, mas será lançada EXCLUSIVAMENTE para pré-cadastrados em Janeiro. Após o lançamento, devido a limitações de GPU, aceitaremos entre 1-3 novos cadastros por semana conforme escalamos. Cadastrar-se agora garante sua vaga.
                </p>
              </div>
            </div>

            {/* Tech Stack Logos */}
            <div className="mb-12">
              <div className="flex flex-wrap items-center justify-center gap-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  id: 'SOLO',
                  name: 'Pro',
                  description: 'Para corretores independentes crescendo seus negócios',
                  monthlyPrice: 199,
                  founderPrice: 99,
                  features: [
                    { name: '1 site (ilimitado)', included: true },
                    { name: 'Até 50 anúncios ativos', included: true },
                    { name: 'Domínio personalizado', included: true },
                    { name: '3.000 contatos CRM', included: true },
                    { name: '2 pipelines', included: true },
                    { name: 'Mapas 3D incluídos', included: true, detail: '2/mês' },
                    { name: 'Mapas extras', included: true, detail: 'R$200 cada' },
                    { name: 'Automações básicas', included: true },
                    { name: '2 usuários', included: true },
                    { name: 'Lead scoring', included: false },
                    { name: 'Remover marca Stella', included: false },
                  ],
                  popular: false,
                  cta: 'Garantir Vaga Agora',
                  preRegisterPrice: 'R$ 99/mês para pré-cadastrados',
                  afterLaunchPrice: 'R$ 199/mês após Janeiro'
                },
                {
                  id: 'TEAM',
                  name: 'Team',
                  description: 'Ideal para pequenas equipes e equipes em crescimento',
                  monthlyPrice: 399,
                  founderPrice: 199,
                  features: [
                    { name: '2 sites completos', included: true },
                    { name: 'Até 150 anúncios ativos', included: true },
                    { name: 'Domínio personalizado', included: true },
                    { name: '10.000 contatos CRM', included: true },
                    { name: 'Pipelines ilimitados', included: true },
                    { name: 'Mapas 3D incluídos', included: true, detail: '5/mês' },
                    { name: 'Mapas extras', included: true, detail: 'R$160 cada' },
                    { name: 'Automações completas', included: true },
                    { name: 'Lead scoring', included: true },
                    { name: '5 usuários', included: true },
                    { name: 'Controle de permissões', included: true },
                    { name: 'Remover marca Stella', included: true },
                    { name: 'Suporte prioritário', included: true },
                  ],
                  popular: true,
                  cta: 'Garantir Vaga Agora',
                  preRegisterPrice: 'R$ 199/mês para pré-cadastrados',
                  afterLaunchPrice: 'R$ 399/mês após Janeiro'
                },
                {
                  id: 'BROKERAGE',
                  name: 'Brokerage',
                  description: 'Para imobiliárias estabelecidas com múltiplas equipes',
                  monthlyPrice: 999,
                  founderPrice: 499,
                  features: [
                    { name: '3 sites completos', included: true },
                    { name: 'Até 500 anúncios ativos', included: true },
                    { name: 'Domínio personalizado', included: true },
                    { name: '50.000 contatos CRM', included: true },
                    { name: 'Pipelines ilimitados', included: true },
                    { name: 'Mapas 3D incluídos', included: true, detail: '20/mês' },
                    { name: 'Mapas extras', included: true, detail: 'R$120 cada' },
                    { name: 'Automações avançadas', included: true },
                    { name: 'Lead scoring avançado', included: true },
                    { name: '30 usuários', included: true },
                    { name: 'RBAC completo', included: true },
                    { name: 'White label', included: true },
                    { name: 'Suporte prioritário + chat', included: true },
                  ],
                  popular: false,
                  cta: 'Chegando T2 2026',
                },
                {
                  id: 'ENTERPRISE',
                  name: 'Enterprise',
                  description: 'Soluções personalizadas para grandes operações',
                  monthlyPrice: null,
                  founderPrice: null,
                  features: [
                    { name: 'Sites ilimitados', included: true },
                    { name: 'Anúncios ilimitados', included: true },
                    { name: 'Múltiplos domínios', included: true },
                    { name: 'Contatos ilimitados', included: true },
                    { name: 'Tudo ilimitado', included: true },
                    { name: 'Mapas 3D customizados', included: true },
                    { name: 'Preços por contrato', included: true },
                    { name: 'Automações enterprise', included: true },
                    { name: 'IA e scoring avançado', included: true },
                    { name: 'Usuários ilimitados', included: true },
                    { name: 'White label completo', included: true },
                    { name: 'SLA + CSM dedicado', included: true },
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
                              <span className="text-2xl sm:text-3xl font-light text-emerald-400 whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                R$ {plan.founderPrice}
                              </span>
                              <span className="text-emerald-300 font-light text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>/mês</span>
                            </div>
                            <p className="text-xs text-slate-400 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              Garantia de preço para pré-cadastrados
                            </p>
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
                              {'detail' in feature && feature.detail && (
                                <span className="ml-1 text-slate-400">({feature.detail})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Founder Pricing Explanation */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-emerald-900/20 via-green-900/20 to-emerald-900/20 border border-emerald-500/30 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-light text-emerald-300 mb-4 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Como Funciona o Preço para Corretores Fundadores
                </h3>
                <p className="text-slate-300 text-base leading-relaxed mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Os valores acima são os <strong className="text-white">preços mensais públicos previstos</strong> para cada plano após o lançamento em janeiro de 2026.
                </p>
                <p className="text-slate-300 text-base leading-relaxed mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Se você entrar agora como <strong className="text-emerald-300">Corretor Fundador</strong> por apenas <strong className="text-emerald-300">R$ 99</strong>, você:
                </p>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Garante acesso assim que a plataforma lançar em <strong className="text-white">janeiro de 2026</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Ganha <strong className="text-emerald-300">3 meses grátis</strong> a partir do lançamento (escolha qualquer plano)</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Depois dos 3 meses grátis, paga apenas <strong className="text-emerald-300">50% do valor mensal público</strong> do plano escolhido</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>O desconto de <strong className="text-emerald-300">50% é permanente</strong> enquanto sua assinatura permanecer ativa</span>
                  </li>
                </ul>
                <p className="text-center text-sm text-slate-400 italic" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Esta oferta é exclusiva para os primeiros 100 corretores que garantirem sua vaga agora.
                </p>
              </div>
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
      </section>

      {/* Ballet Section - Inspired by Asana */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
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

      {/* Key Benefits */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Tudo que Você Precisa para Ter Sucesso
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Do seu primeiro anúncio até escalar sua imobiliária, Constellation cresce com você
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Sites Profissionais',
                  description: 'Lance um site imobiliário impressionante em minutos com nosso construtor de arrastar e soltar. Otimizado para mobile e pronto para SEO.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: 'Gestão Poderosa de Imóveis',
                  description: 'Gerencie todas as suas propriedades em um só lugar. Adicione fotos, vídeos, tours 3D e publique em múltiplas plataformas instantaneamente.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )
                },
                {
                  title: 'CRM Integrado',
                  description: 'Acompanhe cada lead, cliente e negócio. Nunca perca um follow-up com lembretes automáticos e gestão de pipeline.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: 'Gestão de Tarefas (Balé)',
                  description: 'Organize seu fluxo de trabalho com quadros Kanban. Acompanhe visitas, papelada e tarefas de fechamento sem esforço.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                },
                {
                  title: 'Mercado de Varejo',
                  description: 'Liste suas propriedades no Stella Real, nossa plataforma de varejo. Obtenha exposição para milhares de potenciais compradores.',
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: 'Análises e Insights',
                  description: 'Entenda seu negócio com análises detalhadas. Acompanhe visualizações, leads, conversões e receita.',
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
                <h4 className="text-white font-semibold mb-4">Produto</h4>
                <ul className="space-y-2">
                  <li><Link to="/constellation" className="text-slate-400 hover:text-white transition-colors">Recursos</Link></li>
                  <li><Link to="/precos" className="text-slate-400 hover:text-white transition-colors">Preços</Link></li>
                  <li><Link to="/sub/stellareal" className="text-slate-400 hover:text-white transition-colors">Plataforma de Varejo</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li><Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">Sobre</Link></li>
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">Contato</Link></li>
                  <li><Link to="/institucional" className="text-slate-400 hover:text-white transition-colors">Institucional</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacidade" className="text-slate-400 hover:text-white transition-colors">Privacidade</Link></li>
                  <li><Link to="/termos" className="text-slate-400 hover:text-white transition-colors">Termos</Link></li>
                  <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">Cookies</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Suporte</h4>
                <ul className="space-y-2">
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">Central de Ajuda</Link></li>
                  <li><Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors">Entrar</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
              <p>© 2025 Stella Real Estate. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
