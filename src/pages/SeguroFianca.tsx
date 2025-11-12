import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Zap, Clock, CheckCircle2, Star, MessageCircle, CreditCard, Award, Users, TrendingUp, AlertTriangle, FileText } from 'lucide-react'

export default function SeguroFianca() {
  const { t } = useTranslation()
  
  const micDropFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Adiantamento em 60 Segundos",
      description: "Um toque no WhatsApp → Pix instantâneo. Verificação depois, pagamento agora.",
      highlight: "Express Tier"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Despejo Concierge",
      description: "Advogados pré-selecionados, processo digital, checklist de saída, pacote de re-locação.",
      highlight: "Sem Drama"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Vacancy Shield",
      description: "Inquilino sai cedo? Pagamos 1 mês + verba de marketing + fotos profissionais.",
      highlight: "Proteção Total"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Rent Day Guarantee",
      description: "Escolha o dia (ex: dia 1). Te pagamos sempre nesse dia, independente do inquilino.",
      highlight: "Sleep Tax = 0"
    }
  ]

  const stats = [
    { value: "60s", label: "Tempo de Adiantamento", sublabel: "Meta Express Tier" },
    { value: "98%", label: "Taxa de Aprovação", sublabel: "Open Finance + AI" },
    { value: "24h", label: "Payout Garantido", sublabel: "SLA com dentes" },
    { value: "R$500", label: "Crédito se não cotarmos", sublabel: "em 5 minutos" }
  ]

  const underwritingFeatures = [
    {
      title: "Open Finance + RentScore",
      description: "Score portável que segue o inquilino. Proprietários veem banda A-D simples."
    },
    {
      title: "Context Pricing",
      description: "Prédios/proprietários mais seguros pagam menos. Recompensamos bons ecossistemas."
    },
    {
      title: "Roommate Split Intelligence",
      description: "Caps individuais e lógica de cobrança. Ninguém paga pela bagunça dos outros."
    }
  ]

  const preventionFeatures = [
    {
      title: "Autopilot + Smoothing",
      description: "Pix agendado, opções de parcelamento, 'hardship slider' para 2-4x sem inadimplência."
    },
    {
      title: "Micro-Adiantamento",
      description: "Empréstimo pequeno quando o salário atrasar. Mais barato que um sinistro."
    },
    {
      title: "Nudges Inteligentes",
      description: "WhatsApp direto: 'Pagar 40% agora | 60% no dia 15'. Menos palavras, mais toques."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section - Extended gradient behind header */}
      <section className="relative overflow-hidden -mt-20 pt-20">
        {/* Extended gradient background that goes behind the header */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        
        <div className="container-padded relative py-20 md:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('seguroFianca.badge')}</span>
            </div>
            
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">{t('seguroFianca.hero.comingSoon')}</span>
            </div>
            
            <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-7xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              {t('seguroFianca.hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('seguroFianca.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
              >
                {t('seguroFianca.hero.getQuote')}
              </Link>
            </div>

            {/* Founders' Cohort CTA */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-6 py-3 rounded-full border border-amber-200 dark:border-amber-700">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {t('seguroFianca.hero.foundersCohort')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mic-Drop Features */}
      <section className="py-20">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Features que Derrubam o Microfone
            </h2>
            <p className="text-lg font-light text-slate-900 dark:text-white max-w-3xl mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Cada feature foi projetada para fazer você se perguntar: "Como eu vivia sem isso?"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {micDropFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    {feature.icon}
                  </div>
                  
                  <div>
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full mb-3">
                      {feature.highlight}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Damage + Utility Wrap */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">+ Damage & Utility Wrap</h3>
            <p className="text-lg text-purple-100 mb-4">
              Add-on opcional: cobrimos utilities não pagas + danos ao imóvel com baseline de IA 
              do vídeo de entrada
            </p>
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-semibold">AI Baseline • Cobrança Inteligente • Zero Surpresas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Underwriting Flex */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Underwriting que Aprova Sem Estourar Perdas
            </h2>
            <p className="text-lg font-light text-slate-900 dark:text-white max-w-2xl mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
              IA + Open Finance + contexto = aprovações que fazem sentido
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {underwritingFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention > Payout */}
      <section className="py-20">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Prevenção {'>'}  Pagamento
            </h2>
            <p className="text-lg font-light text-slate-900 dark:text-white max-w-2xl mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Perdas menores, humanos mais felizes. Evitamos problemas antes que aconteçam.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {preventionFeatures.map((feature, index) => (
              <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              SLAs Duros com Dentes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl font-bold text-blue-300 mb-2">&lt;2h</div>
                <div className="font-semibold mb-2">Reconhecimento de Sinistro</div>
                <div className="text-sm text-blue-100">Express Tier</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl font-bold text-green-300 mb-2">Mesmo Dia</div>
                <div className="font-semibold mb-2">Pagamento Garantido</div>
                <div className="text-sm text-green-100">Business hours</div>
              </div>
            </div>
            
            <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30">
              <p className="text-lg font-semibold text-yellow-100">
                <strong>Perdemos um SLA?</strong> Crédito automático no prêmium. 
                Colocamos dinheiro onde está nossa boca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution & Perks */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Distribuição que Multiplica
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Badge "Guaranteed Listing"</strong>
                    <p className="text-slate-600 dark:text-slate-400">Boost CTR e velocidade de locação em todos os portais</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Políticas de Prédio/Grupo</strong>
                    <p className="text-slate-600 dark:text-slate-400">Incorporadoras onboardam inventário inteiro com bandas de pré-aprovação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Agent Mode</strong>
                    <p className="text-slate-600 dark:text-slate-400">Links de pré-aprovação compartilháveis. Feche negócio na visita.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
                Brand & Benefícios
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Selo "Rent Day—Guaranteed by Constellation"</strong>
                    <p className="text-slate-600 dark:text-slate-400">Em toda fatura/email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Fidelidade do Proprietário</strong>
                    <p className="text-slate-600 dark:text-slate-400">Prêmium reduz a cada renovação com baixa sinistralidade</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Upside do Inquilino</strong>
                    <p className="text-slate-600 dark:text-slate-400">Streaks de pontualidade reduzem próximo prêmium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Pronto para o Cheat Code?
            </h2>
            
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Proprietários mudarão pela certeza do SLA. Inquilinos aceitarão pela portabilidade. 
              Concorrentes ficarão discutindo brochures enquanto transferimos Pix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Cotação Express (60s - Em Breve)
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">WhatsApp Integration</div>
                <div className="text-blue-200">Sinistros e pagamentos via WhatsApp</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">Open Finance</div>
                <div className="text-blue-200">Análise instantânea e score portável</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-semibold">MGA + Resseguro</div>
                <div className="text-blue-200">Controlamos UX, aprendemos mais rápido</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
