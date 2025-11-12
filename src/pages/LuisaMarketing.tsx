import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, Target, Users, BarChart3, Megaphone, PenTool, Camera, Globe, Mail } from 'lucide-react'

export default function LuisaMarketing() {
  const services = [
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: 'Marketing Digital Imobiliário',
      description: 'Estratégias completas de marketing digital focadas no mercado imobiliário, incluindo SEO, Google Ads e redes sociais.',
      features: ['SEO otimizado', 'Campanhas Google Ads', 'Gestão de redes sociais', 'Email marketing']
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: 'Branding & Design',
      description: 'Criação de identidade visual marcante para sua imobiliária, incluindo logotipo, paleta de cores e materiais.',
      features: ['Design de logotipo', 'Identidade visual', 'Material gráfico', 'Branding estratégico']
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Fotografia & Vídeo',
      description: 'Produção profissional de fotos e vídeos de imóveis com equipamento de última geração e edição premium.',
      features: ['Fotografia HDR', 'Vídeos aéreos (drone)', 'Tours virtuais 360°', 'Edição profissional']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Sites & Landing Pages',
      description: 'Desenvolvimento de sites modernos e landing pages de alta conversão para imobiliárias e corretores.',
      features: ['Design responsivo', 'Otimização conversão', 'CMS personalizado', 'Integração APIs']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Análise & Relatórios',
      description: 'Acompanhamento detalhado de métricas e KPIs com relatórios personalizados e insights acionáveis.',
      features: ['Dashboard analytics', 'Relatórios mensais', 'ROI tracking', 'Consultoria estratégica']
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Gestão de Leads',
      description: 'Sistema completo de captação, nutrição e conversão de leads qualificados para seu negócio imobiliário.',
      features: ['CRM integrado', 'Lead scoring', 'Automação marketing', 'Follow-up estratégico']
    }
  ]

  const portfolio = [
    {
      client: 'Imobiliária Premium SP',
      result: '+150% em leads qualificados',
      metric: '3 meses'
    },
    {
      client: 'Corretor Independente RJ',
      result: '+200% em visibilidade online',
      metric: '6 meses'
    },
    {
      client: 'Construtora Horizon',
      result: '500+ unidades vendidas',
      metric: '12 meses'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10" />
        <div className="container-padded relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marketing Imobiliário de Elite</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
              Luisa Marketing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Agency
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Transformamos seu negócio imobiliário com estratégias de marketing digital 
              comprovadas e criativas que geram resultados reais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Solicitar Proposta
              </Link>
              <a 
                href="#servicos" 
                className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Ver Serviços
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Projetos Realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">200+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">150%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">ROI Médio</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">5+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Soluções completas de marketing para impulsionar seu negócio imobiliário
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Results */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Resultados Comprovados
            </h2>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Alguns dos casos de sucesso que transformaram negócios imobiliários
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-3xl font-bold mb-2">{item.result}</div>
                <div className="text-purple-100 mb-4">{item.client}</div>
                <div className="text-sm text-purple-200">em {item.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
              Por Que Escolher a Luisa Marketing?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Especialização Imobiliária
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Conhecimento profundo do mercado imobiliário e suas particularidades
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Equipe Dedicada
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Profissionais experientes focados no sucesso do seu projeto
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Resultados Mensuráveis
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Métricas claras e transparentes em todos os projetos
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Soluções Personalizadas
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Estratégias sob medida para as necessidades do seu negócio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <Mail className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Pronto Para Transformar Seu Negócio?
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra como podemos ajudar você a alcançar 
              resultados extraordinários no mercado imobiliário.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Solicitar Consultoria Gratuita
              </Link>
              <a 
                href="mailto:marketing@stella.com.br" 
                className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
              >
                marketing@stella.com.br
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
