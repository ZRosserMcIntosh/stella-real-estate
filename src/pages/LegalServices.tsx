import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, FileText, Home, Building2, Briefcase, Shield, CheckCircle2, Award, Users, BookOpen, Stamp, Copyright, Sparkles, TrendingUp, Gavel, Lightbulb, Banknote } from 'lucide-react'

export default function LegalServices() {
  const services = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Contract Drafting & Preventive Advisory',
      tagline: 'Avoid problems before they exist.',
      description: 'Drafting and reviewing purchase, sale, lease, assignment, and promise contracts.',
      details: [
        'Custom clauses for foreign investors and bilingual (PT/EN) contracts',
        'Full property verification (registry, encumbrances, IPTU, occupancy permit)',
        'Instant draft generation through our Constellation platform',
        'Manual legal review following automated drafts',
        'Auto-fill contracts with verified property and user data'
      ],
      smartFeature: 'Smart feature: Auto-fill contracts with verified property and user data for instant previews and faster closings.'
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: 'Property Regularization',
      tagline: 'A property isn\'t safe until it\'s regularized.',
      description: 'Correction of property records and registrations.',
      details: [
        'Recording new constructions, subdivisions, and area adjustments',
        'Support with incorporation filings and compliance (Law 4.591/64)',
        'Legalization for properties acquired through judicial or extrajudicial auctions',
        'Correction of registry discrepancies',
        'Title consolidation and documentation update'
      ]
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Lease & Condominium Legal Support',
      tagline: 'Protect yourself from tenant risks and conflicts.',
      description: 'Lease contract drafting and review (residential and commercial).',
      details: [
        'Eviction actions, rent collection, and enforcement against guarantors',
        'Legal management for condominiums: collections, disputes, and assembly support',
        'Mediation between landlords and tenants before litigation',
        'Integrated with AI Fiança tenant scoring and rent guarantee automation'
      ],
      smartFeature: '💡 Integrated with AI Fiança: Combine our legal vetting with AI-based tenant scoring and rent guarantee automation.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Due Diligence & Investor Consulting',
      tagline: 'Invest with confidence — we handle the legal groundwork.',
      description: 'Comprehensive legal audits for property and project acquisitions.',
      details: [
        'Identification of hidden risks, irregularities, and pending liabilities',
        'Structuring of holding companies and special-purpose entities (SPEs)',
        'Legal support for foreign investors: CPF issuance, visa compliance, and registration with RGI',
        'Tax consulting for capital gains, ITBI, and rental income',
        'Interactive due diligence checklist in Constellation dashboard'
      ],
      smartFeature: '💡 Tech feature: Interactive due diligence checklist inside Constellation — see what\'s cleared, pending, or flagged in real time.'
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: 'Litigation & Legal Defense',
      tagline: 'When conflict is inevitable, we fight for you.',
      description: 'Possession actions, usucapião, reinstatement, and compulsory transfer.',
      details: [
        'Litigation involving developers, builders, and brokers',
        'Defense in foreclosure, auction, and property seizure cases',
        'Representation in contractual and condominium disputes',
        'Track case status, hearing dates, and progress in your client dashboard'
      ],
      smartFeature: '💡 Transparency built-in: Track case status, hearing dates, and progress directly in your client dashboard.'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Development & Incorporation Advisory',
      tagline: 'Legal precision from foundation to final delivery.',
      description: 'Legal structuring for developments (SPE, SCP, or consortium models).',
      details: [
        'Preparation and registration of incorporation documents, condominium bylaws, and memorials',
        'Support throughout the sales and delivery process',
        'Drafting of exclusive brokerage and partnership agreements',
        'Compliance with Law 4.591/64 and condominium regulations'
      ]
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'LegalTech & Automation',
      tagline: 'The future of real estate law — now.',
      description: 'Automatic draft generation with human validation.',
      details: [
        'Contract renewal alerts and term management',
        'Secure document storage, e-signatures, and ICP-Brasil authentication',
        'Integration with national digital notary systems (e-Notariado, e-Cartório)',
        'Real-time legal document tracking and version control'
      ]
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: 'Plans & Packages',
      tagline: 'Choose the level of protection you need.',
      description: 'Flexible plans designed for every client type.',
      details: [
        'Basic Plan — Contract drafting, document review, and consultations on demand',
        'Premium Plan — Ongoing legal monitoring for active leases and property portfolios',
        'Corporate Plan — Full legal support for developers, brokerages, and management companies',
        'International Plan — Complete bilingual advisory for foreign clients'
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
      <section className="relative overflow-hidden -mt-20 pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
        <div className="container-padded relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dra. Stella - Advocacia Especializada</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Serviços Jurídicos Imobiliários
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
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                
                {service.tagline && (
                  <p className="text-sm italic text-blue-600 dark:text-blue-400 mb-3 font-medium">
                    {service.tagline}
                  </p>
                )}
                
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-4">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                {service.smartFeature && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{service.smartFeature}</span>
                    </p>
                  </div>
                )}
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
