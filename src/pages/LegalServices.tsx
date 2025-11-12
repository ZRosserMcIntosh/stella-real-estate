import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, FileText, Home, Building2, Briefcase, Shield, CheckCircle2, Award, Users, BookOpen, Stamp, Copyright } from 'lucide-react'

export default function LegalServices() {
  const services = [
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Assessoria em Compra e Venda',
      description: 'Suporte jurídico completo para transações imobiliárias residenciais, garantindo segurança e tranquilidade.',
      details: [
        'Análise de documentação do imóvel',
        'Due diligence imobiliária',
        'Elaboração e revisão de contratos',
        'Verificação de ônus e pendências',
        'Acompanhamento de registro'
      ]
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Contratos de Locação',
      description: 'Elaboração e análise de contratos de locação residencial e comercial com proteção jurídica para ambas as partes.',
      details: [
        'Contratos de locação residencial',
        'Contratos de locação comercial',
        'Contratos de temporada',
        'Revisão de cláusulas',
        'Assessoria em renovação'
      ]
    },
    {
      icon: <Copyright className="w-8 h-8" />,
      title: 'Propriedade Intelectual',
      description: 'Registro e proteção de marcas, logotipos e propriedade intelectual para imobiliárias e corretores.',
      details: [
        'Registro de marca no INPI',
        'Copyright de logotipos',
        'Proteção de identidade visual',
        'Contratos de licenciamento',
        'Defesa de direitos autorais'
      ]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Direito Empresarial Imobiliário',
      description: 'Consultoria jurídica para empresas do setor imobiliário, incluindo constituição e contratos comerciais.',
      details: [
        'Constituição de imobiliárias',
        'Contratos comerciais B2B',
        'Sociedades e parcerias',
        'Compliance imobiliário',
        'Assessoria societária'
      ]
    },
    {
      icon: <Stamp className="w-8 h-8" />,
      title: 'Regularização Documental',
      description: 'Regularização de documentos imobiliários, certidões e questões cartoriais complexas.',
      details: [
        'Regularização de imóveis',
        'Usucapião',
        'Retificação de registro',
        'Averbações diversas',
        'Solução de pendências'
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'LGPD & Compliance',
      description: 'Adequação à Lei Geral de Proteção de Dados e compliance para empresas imobiliárias.',
      details: [
        'Adequação à LGPD',
        'Políticas de privacidade',
        'Termos de uso',
        'Contratos de controlador',
        'Treinamento de equipes'
      ]
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Contratos Incorporação',
      description: 'Assessoria jurídica para incorporadoras e construtoras em todos os aspectos legais do negócio.',
      details: [
        'Contratos de incorporação',
        'Patrimônio de afetação',
        'Memoriais de incorporação',
        'Convenções de condomínio',
        'Assessoria pré-entrega'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Direito Condominial',
      description: 'Consultoria e assessoria jurídica para condomínios residenciais e comerciais.',
      details: [
        'Elaboração de convenções',
        'Regimentos internos',
        'Assembleias',
        'Cobrança de taxas',
        'Mediação de conflitos'
      ]
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Consultoria Preventiva',
      description: 'Consultoria jurídica preventiva para evitar problemas futuros e garantir segurança jurídica.',
      details: [
        'Pareceres jurídicos',
        'Análise de riscos',
        'Planejamento jurídico',
        'Treinamentos',
        'Suporte contínuo'
      ]
    }
  ]

  const process = [
    {
      step: '01',
      title: 'Consulta Inicial',
      description: 'Análise do seu caso e identificação das necessidades jurídicas'
    },
    {
      step: '02',
      title: 'Proposta Personalizada',
      description: 'Elaboração de proposta com escopo de serviços e honorários'
    },
    {
      step: '03',
      title: 'Execução',
      description: 'Desenvolvimento dos trabalhos com acompanhamento transparente'
    },
    {
      step: '04',
      title: 'Entrega & Suporte',
      description: 'Entrega dos documentos e suporte pós-atendimento'
    }
  ]

  const differentials = [
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Especialização Imobiliária',
      description: 'Expertise específica no mercado imobiliário e suas particularidades'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança Jurídica',
      description: 'Atuação focada na prevenção de problemas e proteção dos seus direitos'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Atendimento Personalizado',
      description: 'Cada cliente recebe atenção individual e soluções sob medida'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Transparência',
      description: 'Comunicação clara sobre prazos, custos e andamento dos processos'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        <div className="container-padded relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dra. Stella - Advocacia Especializada</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
              Serviços
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Jurídicos Imobiliários
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Assessoria jurídica completa para todas as suas necessidades no mercado imobiliário, 
              desde transações residenciais até soluções corporativas complexas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Agendar Consulta
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
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">1000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Contratos Elaborados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">500+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Clientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">98%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Taxa de Sucesso</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">24h</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Tempo Médio Resposta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Áreas de Atuação
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Serviços jurídicos especializados para todas as necessidades do mercado imobiliário
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Um processo simples e transparente do início ao fim
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-700 dark:to-indigo-700" />
                )}
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-20">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Nossos Diferenciais
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              O que nos torna a escolha ideal para seus assuntos jurídicos imobiliários
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentials.map((item, index) => (
              <div 
                key={index}
                className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Stella */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="w-16 h-16 mx-auto mb-6 opacity-90" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sobre Dra. Stella
            </h2>
            
            <p className="text-lg text-blue-100 mb-6">
              Advogada especializada em Direito Imobiliário com ampla experiência em transações residenciais, 
              comerciais e corporativas. Formada pela [Universidade], com pós-graduação em Direito Imobiliário 
              e Direito Empresarial.
            </p>
            
            <p className="text-lg text-blue-100 mb-8">
              Com uma abordagem moderna e humanizada, Dra. Stella combina expertise técnica com atendimento 
              personalizado, garantindo soluções jurídicas eficientes e seguras para cada cliente.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                OAB/SP 123.456
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                Especialista em Direito Imobiliário
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                Pós-graduada em Direito Empresarial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Precisa de Assessoria Jurídica?
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Agende uma consulta e descubra como podemos ajudar você com segurança 
              e tranquilidade em suas questões jurídicas imobiliárias.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contato" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Agendar Consulta Gratuita
              </Link>
              <a 
                href="mailto:juridico@stella.com.br" 
                className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700"
              >
                juridico@stella.com.br
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
