import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Check, X } from 'lucide-react'
import FoundingCheckout from '../components/FoundingCheckout'

export default function Pricing() {
  const { t } = useTranslation()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // SEO metadata
  const siteUrl = window.location.origin
  const pageUrl = `${siteUrl}/precos`
  const pageTitle = 'Preços - Plataforma Stella'
  const pageDescription = 'Escolha o plano perfeito para o seu negócio imobiliário. Planos flexíveis para corretores, imobiliárias e incorporadores.'

  // Founding 100 countdown logic - starts at 99/100, decreases linearly until Dec 31, 2025
  const calculateFoundingSlots = () => {
    const startDate = new Date('2025-11-14T00:00:00')
    const endDate = new Date('2025-12-31T23:59:59')
    const now = new Date()
    
    // If past end date, return 0
    if (now >= endDate) return 0
    
    // If before start date, return 99
    if (now < startDate) return 99
    
    // Calculate linear decrease from 99 to 1
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()
    const progress = elapsed / totalDuration
    
    // Start at 99, decrease to 1 (never reach 0 until after Dec 31)
    const slotsRemaining = Math.max(1, Math.ceil(99 - (progress * 98)))
    
    return slotsRemaining
  }

  const foundingSlotsRemaining = calculateFoundingSlots()

  const plans = [
    {
      id: 'SOLO',
      name: 'Pro',
      description: 'Para corretores independentes crescendo seus negócios',
      monthlyPrice: 299,
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
      cta: 'Começar Agora',
    },
    {
      id: 'TEAM',
      name: 'Team',
      description: 'Ideal para pequenas equipes e equipes em crescimento',
      monthlyPrice: 499,
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
      cta: 'Começar Agora',
    },
    {
      id: 'BROKERAGE',
      name: 'Brokerage',
      description: 'Para imobiliárias estabelecidas com múltiplas equipes',
      monthlyPrice: 999,
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
  ]

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) {
      return { price: null, period: 'mês' }
    }
    return { price: plan.monthlyPrice, period: 'mês' }
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen -mt-[var(--header-height,60px)] pt-[var(--header-height,60px)]">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/stella-logo-variation.png`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={`${siteUrl}/stella-logo-variation.png`} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950 to-slate-950"></div>
        
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's',
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Escolha o Plano Perfeito
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Potencialize seu negócio imobiliário com a tecnologia Constellation. 
              Planos flexíveis para todos os tamanhos de negócio.
            </p>

            {/* Founding 100 Banner */}
            {foundingSlotsRemaining > 0 && (
              <div className="mb-8 max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-emerald-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <h3 className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Founding 100 – Constellation Prime
                      </h3>
                    </div>
                    <p className="text-slate-200 mb-4 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Seja um dos primeiros 100 membros fundadores. Pré-venda exclusiva com benefícios vitalícios.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 2.970</div>
                        <div className="text-sm text-slate-300">Pagamento único</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>24 meses</div>
                        <div className="text-sm text-slate-300">Plano Team grátis</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>75% OFF</div>
                        <div className="text-sm text-slate-300">Desconto vitalício</div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 text-left">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">Plano Team completo por 24 meses (valor R$ 11.976)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">10 mapas 3D incluídos por mês (5 extras permanentes)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">75% desconto vitalício após os 24 meses</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">Mapas 3D extras por R$ 10 (sempre, vs R$ 160+)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">Badge de Founding Partner + acesso antecipado a novos recursos</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-center justify-center">
                      <button
                        onClick={() => setCheckoutOpen(true)}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/50 text-lg"
                      >
                        Garantir Minha Vaga
                      </button>
                      <div className="text-center">
                        <div className="text-sm text-emerald-300 font-semibold mb-2">
                          Apenas {foundingSlotsRemaining} vagas restantes de 100
                        </div>
                        <div className="text-xs text-slate-500 font-light max-w-md mx-auto">
                          A partir de 1º de janeiro, aceitaremos no máximo 3 a 5 novas contas por semana, dependendo de capacidade GPU, demanda de servidor, processamento computacional distribuído e outros fatores técnicos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const { price, period } = getPrice(plan)
            const isEnterprise = price === null
            
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
                        <p className="text-sm text-slate-400 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          Fale com nosso time
                        </p>
                      </div>
                    ) : price === 0 ? (
                      <div>
                        <div className="text-3xl font-light text-slate-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          Grátis
                        </div>
                      </div>
                    ) : (plan.id === 'SOLO' || plan.id === 'TEAM') ? (
                      <div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-light text-slate-500 line-through" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            R$ {price}
                          </span>
                          <span className="text-slate-500 font-light text-sm line-through" style={{ fontFamily: 'Outfit, sans-serif' }}>/{period}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-4xl font-light text-emerald-400 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            R$ 0
                          </span>
                          <span className="text-sm text-emerald-300 font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {plan.id === 'SOLO' ? 'por 1 ano' : 'por 2 anos'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            R$ {price}
                          </span>
                          <span className="text-slate-400 font-light text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>/{period}</span>
                        </div>
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
                  ) : (plan.id === 'SOLO' || plan.id === 'TEAM') ? (
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="block w-full text-center py-3 rounded-lg font-semibold transition-all mb-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg"
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full text-center py-3 rounded-lg font-semibold transition-all mb-6 bg-slate-800 hover:bg-slate-700 text-slate-100"
                    >
                      {plan.cta}
                    </Link>
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

        {/* 3D Map Packages */}
        <div className="mt-16">
          {/* Tech Stack Logos */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <img src="/tech-icons/color/Amazon_Web_Services_Logo.svg.png" alt="AWS" className="h-6 object-contain" />
              <img src="/tech-icons/color/apple-developer-og-twitter.png" alt="Apple" className="h-6 object-contain" />
              <img src="/tech-icons/color/NET_BIG.D-52893f5e.png" alt=".NET" className="h-6 object-contain" />
              <img src="/tech-icons/color/pngimg.com - github_PNG65.png" alt="GitHub" className="h-6 object-contain invert brightness-0 invert" />
              <img src="/tech-icons/color/Stripe_Logo,_revised_2016.svg.png" alt="Stripe" className="h-6 object-contain" />
              <img src="/tech-icons/color/supabase-logo-wordmark--dark.png" alt="Supabase" className="h-6 object-contain" />
              <img src="/tech-icons/color/Visual_Studio_Code_1.35_icon.svg.png" alt="VS Code" className="h-6 object-contain" />
            </div>
          </div>

          <h2 className="text-3xl font-light text-center mb-8 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Pacotes de Mapas 3D em Massa
          </h2>
          
          {/* Explanation Section with Video */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Left: Explanation */}
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <p className="text-slate-300 mb-6 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Transformamos seus vídeos 2D em mundos 3D totalmente exploráveis. Você grava, nós criamos uma experiência imersiva onde seus clientes podem "caminhar" pelo imóvel como se estivessem lá.
                  </p>
                  
                  <div className="text-left">
                    <p className="text-blue-400 text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Especificações Técnicas:
                    </p>
                    <ul className="text-slate-400 text-xs space-y-2 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      <li>• <span className="text-slate-300">Estimativa de pose e mapeamento denso</span> (~12min)</li>
                      <li>• <span className="text-slate-300">3D Gaussian Splatting</span> para síntese fotorrealista (~20-38min em GPUs L4/L40S)</li>
                      <li>• Cenas web-optimized com splats tileados e compressão adaptativa</li>
                      <li>• Renderização high-FPS em browser sem plugins</li>
                      <li>• Armazenamento S3 multi-tier + entrega via CDN edge-cached</li>
                      <li>• Custos variáveis: disponibilidade GPU, consumo energético datacenter, demanda computacional</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: Demo Video */}
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
                        Demonstração ao Vivo
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mt-1">Experiência 3D interativa em tempo real</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Individual Maps */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all">
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Individual</h3>
              <p className="text-slate-400 text-xs mb-4">Mapas sob demanda</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>1 mapa</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 100</div>
                <p className="text-xs text-slate-400 mt-2">Por mapa • Sem compromisso</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 transition-all text-sm"
              >
                Solicitar
              </Link>
            </div>

            {/* 10 Maps */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-blue-700/50 p-6 hover:border-blue-600/50 transition-all">
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Pacote 10</h3>
              <p className="text-slate-400 text-xs mb-4">Para pequenos projetos</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-blue-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>10 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 500</div>
                <p className="text-xs text-slate-400 mt-2">R$ 50 por mapa • Economia de 50%</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all text-sm"
              >
                Solicitar Proposta
              </Link>
            </div>

            {/* 100 Maps */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-slate-900/40 border border-cyan-700/50 p-6 hover:border-cyan-600/50 transition-all">
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Pacote 100</h3>
              <p className="text-slate-400 text-xs mb-4">Para imobiliárias ativas</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-cyan-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>100 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 3.000</div>
                <p className="text-xs text-slate-400 mt-2">R$ 30 por mapa • Economia de 70%</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all text-sm"
              >
                Solicitar Proposta
              </Link>
            </div>

            {/* 1 Kilomóvel */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-emerald-900/40 border border-emerald-500/50 p-6 shadow-xl shadow-emerald-500/10">
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>1 Kilomóvel</h3>
              <p className="text-slate-300 text-xs mb-4">Grandes lançamentos</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-emerald-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>1.000 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 20.000</div>
                <p className="text-xs text-slate-400 mt-2">R$ 20 por mapa • Válido 12 meses</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-sm"
              >
                Solicitar Proposta
              </Link>
            </div>

            {/* 5 Kilomóveis */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-900/40 via-cyan-900/40 to-emerald-900/40 border border-emerald-500/50 p-6 shadow-2xl shadow-emerald-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Melhor Custo
                </span>
              </div>
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>5 Kilomóveis</h3>
              <p className="text-slate-300 text-xs mb-4">Incorporadoras e portais</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-emerald-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>5.000 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 75.000</div>
                <p className="text-xs text-slate-400 mt-2">R$ 15 por mapa • Válido 18 meses</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-sm"
              >
                Solicitar Proposta
              </Link>
            </div>

            {/* Dekamóveis */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-purple-900/40 border border-purple-500/50 p-6 shadow-2xl shadow-purple-500/20">
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Dekamóveis</h3>
              <p className="text-slate-300 text-xs mb-4">Grandes operações</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-purple-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>10.000 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>~R$ 10/mapa</div>
                <p className="text-xs text-slate-400 mt-2">Preço variável baseado em disponibilidade de GPU, custos de energia do datacenter, e demanda de processamento. Contrato personalizado.</p>
              </div>
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all text-sm"
              >
                Solicitar Cotação
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
        <div className="space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Posso mudar de plano a qualquer momento?</h3>
            <p className="text-slate-400">
              Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.
            </p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Existe período de teste gratuito?</h3>
            <p className="text-slate-400">
              Sim, oferecemos 14 dias de teste gratuito em todos os planos. Não é necessário cartão de crédito para começar.
            </p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">O que acontece se eu exceder o limite de leads?</h3>
            <p className="text-slate-400">
              Entraremos em contato para discutir um upgrade do plano. Nunca bloqueamos seus leads sem aviso prévio.
            </p>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Os preços incluem impostos?</h3>
            <p className="text-slate-400">
              Os preços exibidos não incluem impostos. Os impostos aplicáveis serão adicionados no checkout de acordo com sua localização.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ainda tem dúvidas?</h2>
          <p className="text-slate-300 mb-8 text-lg">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano para seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Fale Conosco
            </Link>
            <Link
              to="/plataforma-stella"
              className="px-8 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
            >
              Ver Plataforma
            </Link>
          </div>
        </div>
      </div>

      {/* Founding Checkout Modal */}
      <FoundingCheckout
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false)
          // Optionally show success message or redirect
        }}
      />
    </div>
  )
}
