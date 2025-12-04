import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Check, X } from 'lucide-react'
import { trackStartRegistration, trackPurchaseEventWithRedirect } from '../utils/analytics'
import { ConstellationUrls } from '../utils/constellationUrl'

/**
 * SEO OPTIMIZATIONS IMPLEMENTED (Virgil's Checklist):
 * ✅ 1) Meta title: "Planos e Preços da Constellation | Plataforma para Corretores de Imóveis"
 * ✅ 2) Meta description: R$ 99 pré-lançamento, 3 meses grátis, 50% OFF vitalício
 * ✅ 3) Exactly one H1: "Planos e preços da Constellation para corretores de imóveis"
 * ✅ 4) SEO-friendly intro paragraph explaining the page and linking to /constellation
 * ✅ 5) FAQ section with H2 "Perguntas frequentes sobre a Constellation e seus planos"
 *      and H3 questions covering R$99 offer, 3 free months, 50% lifetime discount
 * ✅ 6) Internal links to Constellation product page and Stella Real site
 * ✅ 7) Meaningful alt text on all images (tech stack, Constellation logo)
 * ✅ 8) <html lang="pt-BR"> set via Helmet
 * ✅ 9) Schema.org JSON-LD markup for SoftwareApplication with pricing offers
 * ✅ 10) Proper heading hierarchy: H1 → H2 (sections) → H3 (plan names, FAQ questions)
 * 
 * Keywords targeted:
 * - Primary: "plataforma para corretores de imóveis"
 * - Secondary: "plataforma imobiliária", "corretores de imóveis", "planos e preços"
 * - Long-tail: "site para corretores", "CRM imobiliário", "automação imobiliária"
 */

export default function Pricing() {
  const { t } = useTranslation()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Set body background to match page
  useEffect(() => {
    document.body.style.backgroundColor = '#020617' // slate-950
    return () => {
      document.body.style.backgroundColor = '' // Reset on unmount
    }
  }, [])

  // SEO metadata
  const siteUrl = window.location.origin
  const pageUrl = `${siteUrl}/precos`
  const pageTitle = 'Planos e Preços da Constellation | Plataforma para Corretores de Imóveis'
  const pageDescription = 'Conheça os planos da Constellation, plataforma imobiliária para corretores de imóveis. Pré-lançamento por R$ 99, 3 meses grátis e 50% OFF vitalício.'

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
      founderPrice: 149.50,
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
      cta: 'Disponível no Lançamento',
    },
    {
      id: 'TEAM',
      name: 'Team',
      description: 'Ideal para pequenas equipes e equipes em crescimento',
      monthlyPrice: 499,
      founderPrice: 249.50,
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
      cta: 'Disponível no Lançamento',
    },
    {
      id: 'BROKERAGE',
      name: 'Brokerage',
      description: 'Para imobiliárias estabelecidas com múltiplas equipes',
      monthlyPrice: 999,
      founderPrice: 499.50,
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
  ]

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === null) {
      return { price: null, period: 'mês' }
    }
    return { price: plan.monthlyPrice, period: 'mês' }
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen -mt-[var(--header-height,60px)]">
      <Helmet>
        {/* Language */}
        <html lang="pt-BR" />
        
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/stella-og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={pageUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={`${siteUrl}/stella-og-image.png`} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Schema.org Structured Data */}
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
                "name": "Constellation Founding 100",
                "price": "99.00",
                "priceCurrency": "BRL",
                "description": "Pré-lançamento: R$ 99 uma vez, 3 meses grátis, 50% OFF vitalício nos planos mensais"
              },
              {
                "@type": "Offer",
                "name": "Constellation Pro",
                "price": "299.00",
                "priceCurrency": "BRL",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "299.00",
                  "priceCurrency": "BRL",
                  "billingPeriod": "P1M"
                }
              },
              {
                "@type": "Offer",
                "name": "Constellation Team",
                "price": "499.00",
                "priceCurrency": "BRL",
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": "499.00",
                  "priceCurrency": "BRL",
                  "billingPeriod": "P1M"
                }
              }
            ],
            "areaServed": {
              "@type": "Country",
              "name": "BR"
            },
            "description": "Plataforma imobiliária completa para corretores de imóveis com CRM, automação, gestão de leads e criação de sites profissionais"
          })}
        </script>
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height,60px)+6rem)] pb-16">
          {/* SEO H1 and Introduction */}
          <div className="mb-12 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Planos e preços da Constellation para corretores de imóveis
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <Link to="/constellation" className="text-indigo-400 hover:text-indigo-300 underline">Plataforma imobiliária completa</Link> para corretores e imobiliárias. Pré-lançamento: <span className="text-emerald-400 font-semibold">R$ 99</span>, 3 meses grátis e <span className="text-emerald-400 font-semibold">50% OFF vitalício</span>. <a href="https://www.stellareal.com.br" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Veja o site da Stella Real</a> construído com a Constellation.
            </p>
          </div>

          {/* Pre-Launch Notice */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-400/30 rounded-xl p-6 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <span className="text-indigo-200 font-semibold text-lg uppercase tracking-wider">Pré-Lançamento</span>
              </div>
              <h2 className="text-white text-xl font-light mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Lançamento Oficial: <span className="text-indigo-300 font-semibold">Janeiro 2026</span>
              </h2>
              <p className="text-slate-300 text-base mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Potencialize seu negócio imobiliário com a tecnologia Constellation.
              </p>
              <p className="text-slate-400 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Garanta seu lugar como membro fundador. Planos flexíveis para todos os tamanhos de negócio.
              </p>
            </div>
          </div>

          {/* Founding 100 Banner */}
          {foundingSlotsRemaining > 0 && (
            <div className="mb-8 max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-emerald-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                  <div className="relative">
                    {/* Launch Date Badge */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/40 rounded-full">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-emerald-200 font-semibold text-sm uppercase tracking-wider">Lançamento Janeiro 2026</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Founding 100 – oferta de pré-lançamento
                      </h2>
                    </div>
                    <p className="text-slate-200 mb-2 font-light text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Seja um dos primeiros 100 membros fundadores. Pré-venda exclusiva com benefícios vitalícios.
                    </p>
                    <p className="text-emerald-300 mb-6 font-medium text-center text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Pagamento único de R$ 99 agora. Sem mensalidades até todos os serviços estarem online em Janeiro 2026.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>R$ 99</div>
                        <div className="text-sm text-slate-300">Pagamento único</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>3 meses</div>
                        <div className="text-sm text-slate-300">Grátis em todos planos</div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
                        <div className="text-3xl font-light text-emerald-300 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>50% OFF</div>
                        <div className="text-sm text-slate-300">Permanente após lançamento</div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6 text-left">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">Primeiro acesso quando lançar em Janeiro 2026</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">3 meses grátis em todos os planos após lançamento</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">50% desconto permanente em qualquer plano após os 3 meses grátis</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200">10 mapas 3D incluídos por mês (5 extras permanentes)</span>
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
                      <a
                        href={ConstellationUrls.signup()}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('🔗 Constellation signup URL:', ConstellationUrls.signup());
                          // Track both the standard registration event and the purchase conversion event
                          trackStartRegistration({ source: 'pricing_page', plan: 'founding_100' });
                          trackPurchaseEventWithRedirect(ConstellationUrls.signup(), { 
                            source: 'pricing_page', 
                            plan: 'founding_100' 
                          });
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/50 text-lg text-center"
                      >
                        Garantir Minha Vaga
                      </a>
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

        {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Planos Constellation (Pro, Team, Brokerage, Enterprise)
        </h2>
        
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
                            Preço público:
                          </span>
                          <span className="text-xl sm:text-2xl font-light text-slate-400 line-through whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            R$ {price}
                          </span>
                          <span className="text-slate-500 font-light text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>/mês</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-1 mb-2">
                          <span className="text-sm text-emerald-400 font-medium whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Corretores fundadores:
                          </span>
                          <span className="text-2xl sm:text-3xl font-light text-emerald-400 whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            R$ {typeof plan.founderPrice === 'number' ? plan.founderPrice.toFixed(2) : plan.founderPrice}
                          </span>
                          <span className="text-emerald-300 font-light text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>/mês</span>
                        </div>
                        <p className="text-xs text-slate-400 font-light leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          50% OFF permanente, após 3 meses grátis a partir do lançamento
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
                    <button
                      disabled
                      className="block w-full text-center py-3 rounded-lg font-semibold transition-all mb-6 bg-slate-800/50 text-slate-400 cursor-not-allowed border border-slate-700/50"
                    >
                      {plan.cta}
                    </button>
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
        <div className="mt-12 max-w-4xl mx-auto">
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

        {/* 3D Map Packages */}
        <div className="mt-16">
          {/* Tech Stack Logos */}
          <div className="mb-8">
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
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-slate-950/30 border border-slate-500/30 rounded-lg shadow-lg shadow-slate-500/10">
                <p className="text-xs font-semibold text-slate-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-300">{t('pricing.maps3d.roi.timeSavings', { hours: '7.5' })}</p>
                <p className="text-xs text-slate-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '350', max: '400' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((375 / 100) * 100).toFixed(0) })}</p>
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
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-blue-950/30 border border-blue-500/30 rounded-lg shadow-lg shadow-blue-500/20">
                <p className="text-xs font-semibold text-blue-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-300">{t('pricing.maps3d.roi.timeSavings', { hours: '75' })}</p>
                <p className="text-xs text-blue-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '3.500', max: '4.000' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((3750 / 500) * 100).toFixed(0) })}</p>
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
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/20">
                <p className="text-xs font-semibold text-cyan-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-300">{t('pricing.maps3d.roi.timeSavings', { hours: '750' })}</p>
                <p className="text-xs text-cyan-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '35.000', max: '40.000' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((37500 / 3000) * 100).toFixed(0) })}</p>
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
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg shadow-lg shadow-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-200">{t('pricing.maps3d.roi.timeSavings', { hours: '7.500' })}</p>
                <p className="text-xs text-emerald-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '350.000', max: '400.000' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((375000 / 20000) * 100).toFixed(0) })}</p>
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
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg shadow-lg shadow-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-200">{t('pricing.maps3d.roi.timeSavings', { hours: '37.500' })}</p>
                <p className="text-xs text-emerald-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '1.750.000', max: '2.000.000' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((1875000 / 75000) * 100).toFixed(0) })}</p>
              </div>
              
              <Link
                to="/contato"
                className="block w-full text-center py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-sm"
              >
                Solicitar Proposta
              </Link>
            </div>

            {/* Enterprise (formerly Dekamóveis) */}
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-purple-900/40 border border-purple-500/50 p-6 shadow-2xl shadow-purple-500/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  First 100: Enterprise Pricing
                </span>
              </div>
              <h3 className="text-xl font-light mb-2 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Enterprise</h3>
              <p className="text-slate-300 text-xs mb-4">Grandes operações</p>
              <div className="mb-4">
                <div className="text-3xl font-light text-purple-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>10.000 mapas</div>
                <div className="text-2xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>~R$ 10/mapa</div>
                <p className="text-xs text-slate-400 mt-2">Preço variável baseado em disponibilidade de GPU, custos de energia do datacenter, e demanda de processamento. Contrato personalizado.</p>
              </div>
              
              {/* ROI Estimate */}
              <div className="mb-4 p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg shadow-lg shadow-purple-500/20">
                <p className="text-xs font-semibold text-purple-300 mb-1">{t('pricing.maps3d.roi.title')}</p>
                <p className="text-xs text-slate-200">{t('pricing.maps3d.roi.timeSavings', { hours: '75.000' })}</p>
                <p className="text-xs text-purple-100 font-semibold">{t('pricing.maps3d.roi.costSavings', { min: '3.500.000', max: '4.000.000' })}</p>
                <p className="text-xs text-emerald-300 font-bold">{t('pricing.maps3d.roi.roiPercentage', { roi: ((3750000 / 100000) * 100).toFixed(0) })}</p>
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
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Perguntas frequentes sobre a Constellation e seus planos
        </h2>
        <div className="space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">Como funciona a oferta de pré-lançamento por R$ 99?</h3>
            <p className="text-slate-300 leading-relaxed">
              A oferta de pré-lançamento é exclusiva para os primeiros 100 corretores fundadores. Por R$ 99 (pagamento único), você garante acesso à plataforma Constellation quando lançarmos em janeiro de 2026. Após o lançamento, você recebe 3 meses de uso totalmente gratuito para conhecer e integrar a plataforma ao seu negócio imobiliário. Depois dos 3 meses grátis, você paga apenas 50% do valor mensal público do plano que escolher, e esse desconto de 50% é vitalício enquanto sua assinatura permanecer ativa.
            </p>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">Quando terei acesso à plataforma Constellation?</h3>
            <p className="text-slate-300 leading-relaxed">
              O lançamento oficial da Constellation está previsto para janeiro de 2026. Todos os corretores fundadores que garantirem sua vaga por R$ 99 receberão acesso completo à plataforma imobiliária assim que ela for lançada. Você será notificado por email com todas as instruções de acesso e onboarding.
            </p>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">O que acontece depois dos 3 meses grátis?</h3>
            <p className="text-slate-300 leading-relaxed">
              Após os 3 meses de uso gratuito, você escolhe qual plano mensal melhor atende seu negócio (Pro, Team, Brokerage ou Enterprise) e paga apenas 50% do valor público. Por exemplo, o plano Pro que custa R$ 299/mês terá um custo de apenas R$ 149,50/mês para corretores fundadores. Esse desconto permanente de 50% é mantido vitaliciamente enquanto você permanecer como cliente ativo da plataforma.
            </p>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">Posso mudar de plano depois do lançamento?</h3>
            <p className="text-slate-300 leading-relaxed">
              Sim! Como corretor fundador, você pode fazer upgrade ou downgrade entre os planos a qualquer momento. O desconto de 50% se aplica a qualquer plano que você escolher. As mudanças entram em vigor no próximo ciclo de cobrança mensal, dando total flexibilidade para adaptar a plataforma conforme seu negócio imobiliário cresce.
            </p>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3 text-white">A Constellation é indicada para quais tipos de corretores e imobiliárias?</h3>
            <p className="text-slate-300 leading-relaxed">
              A plataforma Constellation foi desenvolvida para atender desde corretores autônomos até grandes imobiliárias e incorporadoras. Oferecemos planos para corretores independentes (Pro), pequenas equipes (Team), imobiliárias de médio porte (Brokerage) e grandes operações (Enterprise). A plataforma inclui CRM completo, automação de marketing, gestão de leads, criação de sites profissionais, mapas 3D de imóveis, e integração com principais portais imobiliários do Brasil. É ideal para profissionais que querem modernizar sua operação e oferecer uma experiência digital de alto nível para seus clientes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-12 text-center">
          <p className="text-3xl font-light mb-4 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Ainda tem dúvidas?</p>
          <p className="text-slate-300 mb-8 text-lg">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano para seu negócio imobiliário.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contato"
              className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Fale Conosco
            </Link>
            <Link
              to="/constellation"
              className="px-8 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
            >
              Ver Plataforma
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}