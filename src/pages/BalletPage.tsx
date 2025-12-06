import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Check } from 'lucide-react'
import ConstellationHeader from '../components/ConstellationHeader'
import { ConstellationUrls } from '../utils/constellationUrl'
import { trackStartRegistration, trackPurchaseEventWithRedirect } from '../utils/analytics'

export default function BalletPage() {
  const { t, i18n } = useTranslation()

  // Force Portuguese language on constellation subdomain
  useEffect(() => {
    if (i18n.language !== 'pt') {
      i18n.changeLanguage('pt')
    }
  }, [i18n])

  // Set body background
  useEffect(() => {
    document.body.style.backgroundColor = '#020617' // slate-950
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Ballet - Gerenciamento de Projetos Grátis | Constellation</title>
        <meta name="description" content="Ballet é o sistema de gerenciamento de projetos e tarefas incluído gratuitamente em todos os planos Constellation. Organize sua imobiliária com quadros Kanban, automações e muito mais." />
        <meta property="og:title" content="Ballet - Gerenciamento de Projetos Grátis | Constellation" />
        <meta property="og:description" content="Sistema completo de gestão de projetos para imobiliárias, incluído gratuitamente no Constellation." />
        <link rel="canonical" href="https://constellation.stellareal.com.br/ballet" />
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white">
        <ConstellationHeader />

        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-slate-950 to-slate-950" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(147, 51, 234) 1px, transparent 0)', 
              backgroundSize: '48px 48px' 
            }} />
          </div>
          
          <div className="container-padded relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Ballet Logo */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <img 
                  src="/ballet-new-logo.png" 
                  alt="Ballet" 
                  className="h-16 w-auto"
                />
                <span className="text-4xl sm:text-5xl font-light text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Ballet
                </span>
              </div>

              {/* Free Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-sm mb-8">
                <span className="font-bold text-purple-400">100% GRÁTIS</span>
                <span>com sua conta Constellation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Não é apenas um gerenciador de tarefas.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                  É tudo que sua imobiliária precisa.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Com Ballet, você gerencia projetos, acompanha negócios, coordena sua equipe e automatiza fluxos de trabalho—tudo em uma única plataforma integrada ao Constellation.
              </p>

              <a
                href={ConstellationUrls.signup()}
                onClick={(e) => {
                  e.preventDefault()
                  trackStartRegistration({ source: 'ballet_hero', plan: 'founding_100' })
                  trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                    source: 'ballet_hero',
                    plan: 'founding_100'
                  })
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Começar Grátis com Constellation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 relative">
          <div className="container-padded">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {/* Column 1 - Clarity */}
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

                {/* Column 2 - Impact */}
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

                {/* Column 3 - Scale */}
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

              {/* Use Cases */}
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

              {/* Pricing Comparison */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 lg:p-12 mb-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Compare com outras ferramentas
                  </h3>
                  <p className="text-slate-400">Ballet oferece funcionalidades comparáveis às maiores ferramentas do mercado</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                    <p className="text-slate-500 text-sm mb-2">Asana Business</p>
                    <p className="text-2xl font-light text-slate-400 line-through">US$ 24.99/usuário/mês</p>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-xl">
                    <p className="text-slate-500 text-sm mb-2">Monday.com Pro</p>
                    <p className="text-2xl font-light text-slate-400 line-through">US$ 16/usuário/mês</p>
                  </div>
                  <div className="text-center p-6 bg-purple-500/20 border border-purple-500/40 rounded-xl">
                    <p className="text-purple-400 text-sm mb-2 font-medium">Ballet</p>
                    <p className="text-3xl font-light text-purple-300">GRÁTIS</p>
                    <p className="text-sm text-purple-400 mt-1">com Constellation</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-slate-300 mb-6">
                    <strong className="text-purple-400">Economia de até R$ 500/mês</strong> em ferramentas de gestão para uma equipe de 5 pessoas
                  </p>
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center py-12">
                <p className="text-lg text-slate-300 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Ballet está <strong className="text-purple-400">incluído em todos os planos</strong> do Constellation
                </p>
                <p className="text-sm text-slate-500 mb-8">
                  Sem custo adicional. Sem limites de usuários baseados em preço.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href={ConstellationUrls.signup()}
                    onClick={(e) => {
                      e.preventDefault()
                      trackStartRegistration({ source: 'ballet_cta', plan: 'founding_100' })
                      trackPurchaseEventWithRedirect(ConstellationUrls.signup(), {
                        source: 'ballet_cta',
                        plan: 'founding_100'
                      })
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <span>Começar com Constellation</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a
                    href="/constellation"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20"
                  >
                    Ver Planos e Preços
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container-padded">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src="/ballet-new-logo.png" alt="Ballet" className="h-8" />
                <span className="text-slate-400">+</span>
                <img 
                  src="/tech-icons/contellation-logo.png" 
                  alt="Constellation" 
                  className="h-8 brightness-150"
                  style={{ filter: 'brightness(1.5)' }}
                />
              </div>
              <p className="text-slate-500 text-sm">
                Ballet é parte da plataforma Constellation · © {new Date().getFullYear()} Stella Mary Lima Barbosa
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
