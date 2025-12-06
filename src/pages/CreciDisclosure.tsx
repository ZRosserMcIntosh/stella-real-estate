import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Shield, Award, FileCheck, Building2, Users, Phone, Mail, ExternalLink, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export default function CreciDisclosure() {
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')

  const lastUpdated = '6 de dezembro de 2025'

  return (
    <>
      <Helmet>
        <title>{isPt ? 'Divulgação CRECI - Stella Real Estate' : 'CRECI Disclosure - Stella Real Estate'}</title>
        <meta name="description" content={isPt 
          ? 'Informações completas sobre o registro CRECI da Stella Real Estate. Transparência e conformidade com a legislação imobiliária brasileira.'
          : 'Complete information about Stella Real Estate CRECI registration. Transparency and compliance with Brazilian real estate legislation.'
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.stellareal.com.br/creci-disclosure" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-16">
          <div className="container-padded">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">{isPt ? 'Documento Oficial' : 'Official Document'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isPt ? 'Divulgação CRECI' : 'CRECI Disclosure'}
              </h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                {isPt 
                  ? 'Transparência e conformidade com as normas do Conselho Regional de Corretores de Imóveis'
                  : 'Transparency and compliance with the Regional Council of Real Estate Brokers regulations'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-padded py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Quick Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">CRECI-SP</h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">309568</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isPt ? 'Registro Individual Ativo' : 'Active Individual Registration'}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{isPt ? 'Status' : 'Status'}</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{isPt ? 'Regular' : 'Active'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isPt ? 'Anuidade em dia' : 'Annual fees current'}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{isPt ? 'Jurisdição' : 'Jurisdiction'}</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">São Paulo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isPt ? 'Estado de São Paulo' : 'State of São Paulo'}
                </p>
              </div>
            </div>

            {/* Official Information */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-4 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-indigo-600" />
                  {isPt ? 'Informações Oficiais do Registro' : 'Official Registration Information'}
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isPt ? 'Nome Completo' : 'Full Name'}
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                      Stella Mary Lima Barbosa
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isPt ? 'Número CRECI' : 'CRECI Number'}
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                      CRECI 309568-F (Corretor de Imóveis)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      CNPJ
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                      53.152.795/0001-10
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isPt ? 'Conselho Regional' : 'Regional Council'}
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                      CRECI-SP (2ª Região)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isPt ? 'Tipo de Registro' : 'Registration Type'}
                    </label>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                      {isPt ? 'Pessoa Física - Corretor de Imóveis' : 'Individual - Real Estate Broker'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {isPt ? 'Situação Cadastral' : 'Registration Status'}
                    </label>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {isPt ? 'Regular e Ativa' : 'Regular and Active'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-600 pt-6">
                  <a 
                    href="https://www.crecisp.gov.br/cidadao/buscaporcorretores"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isPt ? 'Verificar no Site do CRECI-SP' : 'Verify on CRECI-SP Website'}
                  </a>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                    {isPt 
                      ? 'Você pode verificar a autenticidade deste registro diretamente no site oficial do CRECI-SP.'
                      : 'You can verify the authenticity of this registration directly on the official CRECI-SP website.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Framework Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-4 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-600" />
                  {isPt ? 'Marco Legal e Regulatório' : 'Legal and Regulatory Framework'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <h3>{isPt ? 'O que é o CRECI?' : 'What is CRECI?'}</h3>
                <p>
                  {isPt 
                    ? 'O Conselho Regional de Corretores de Imóveis (CRECI) é o órgão responsável pela fiscalização e regulamentação do exercício da profissão de corretor de imóveis no Brasil. Todo profissional que atua na intermediação de compra, venda ou locação de imóveis deve possuir registro ativo no CRECI de sua região.'
                    : 'The Regional Council of Real Estate Brokers (CRECI) is the body responsible for overseeing and regulating the practice of real estate brokerage in Brazil. Every professional who works in the intermediation of purchase, sale, or rental of properties must have an active registration with the CRECI in their region.'
                  }
                </p>

                <h3>{isPt ? 'Legislação Aplicável' : 'Applicable Legislation'}</h3>
                <ul>
                  <li>
                    <strong>Lei nº 6.530/1978</strong> - {isPt 
                      ? 'Regulamenta a profissão de corretor de imóveis e disciplina o funcionamento de seus órgãos de fiscalização'
                      : 'Regulates the real estate broker profession and disciplines the operation of its supervisory bodies'
                    }
                  </li>
                  <li>
                    <strong>Decreto nº 81.871/1978</strong> - {isPt 
                      ? 'Regulamenta a Lei nº 6.530, estabelecendo as atribuições do corretor de imóveis'
                      : 'Regulates Law No. 6,530, establishing the duties of the real estate broker'
                    }
                  </li>
                  <li>
                    <strong>Resolução COFECI nº 1.336/2014</strong> - {isPt 
                      ? 'Código de Ética dos Corretores de Imóveis'
                      : 'Code of Ethics for Real Estate Brokers'
                    }
                  </li>
                  <li>
                    <strong>Resolução COFECI nº 1.471/2019</strong> - {isPt 
                      ? 'Dispõe sobre a publicidade e o marketing imobiliário'
                      : 'Provides for advertising and real estate marketing'
                    }
                  </li>
                  <li>
                    <strong>Lei nº 9.613/1998</strong> - {isPt 
                      ? 'Dispõe sobre os crimes de lavagem de dinheiro (aplicável ao setor imobiliário)'
                      : 'Provides for money laundering crimes (applicable to the real estate sector)'
                    }
                  </li>
                </ul>

                <h3>{isPt ? 'Obrigações do Corretor de Imóveis' : 'Real Estate Broker Obligations'}</h3>
                <p>
                  {isPt 
                    ? 'De acordo com a legislação brasileira, o corretor de imóveis registrado no CRECI deve:'
                    : 'According to Brazilian legislation, the real estate broker registered with CRECI must:'
                  }
                </p>
                <ul>
                  <li>{isPt ? 'Exercer a profissão com zelo, discrição e probidade' : 'Practice the profession with diligence, discretion, and integrity'}</li>
                  <li>{isPt ? 'Prestar ao cliente todos os esclarecimentos sobre o negócio' : 'Provide the client with all clarifications about the transaction'}</li>
                  <li>{isPt ? 'Responsabilizar-se por atos profissionais' : 'Take responsibility for professional acts'}</li>
                  <li>{isPt ? 'Manter sigilo sobre informações confidenciais' : 'Maintain confidentiality of sensitive information'}</li>
                  <li>{isPt ? 'Comunicar operações suspeitas ao COAF' : 'Report suspicious transactions to COAF'}</li>
                  <li>{isPt ? 'Manter cadastro atualizado de clientes e operações' : 'Keep updated records of clients and transactions'}</li>
                  <li>{isPt ? 'Identificar todos os envolvidos em transações imobiliárias' : 'Identify all parties involved in real estate transactions'}</li>
                </ul>

                <h3>{isPt ? 'Direitos do Consumidor' : 'Consumer Rights'}</h3>
                <p>
                  {isPt 
                    ? 'Ao contratar os serviços de um corretor de imóveis registrado, você tem direito a:'
                    : 'When hiring the services of a registered real estate broker, you are entitled to:'
                  }
                </p>
                <ul>
                  <li>{isPt ? 'Informações claras e precisas sobre o imóvel' : 'Clear and accurate information about the property'}</li>
                  <li>{isPt ? 'Transparência sobre comissões e honorários' : 'Transparency about commissions and fees'}</li>
                  <li>{isPt ? 'Documentação regular do imóvel' : 'Regular property documentation'}</li>
                  <li>{isPt ? 'Proteção contra práticas abusivas' : 'Protection against abusive practices'}</li>
                  <li>{isPt ? 'Denunciar irregularidades ao CRECI' : 'Report irregularities to CRECI'}</li>
                </ul>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-300 m-0">
                        {isPt ? 'Atenção: Corretores sem CRECI' : 'Warning: Brokers without CRECI'}
                      </h4>
                      <p className="text-amber-700 dark:text-amber-400 mt-2 mb-0">
                        {isPt 
                          ? 'A intermediação de negócios imobiliários por pessoa não inscrita no CRECI caracteriza exercício ilegal da profissão, conforme Lei nº 6.530/1978. Sempre verifique a situação cadastral do corretor antes de fechar qualquer negócio.'
                          : 'Real estate brokerage by a person not registered with CRECI constitutes illegal practice of the profession, according to Law No. 6,530/1978. Always verify the broker\'s registration status before closing any deal.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Specializations */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-4 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  {isPt ? 'Serviços e Áreas de Atuação' : 'Services and Areas of Activity'}
                </h2>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {isPt ? 'Serviços Oferecidos' : 'Services Offered'}
                    </h3>
                    <ul className="space-y-3">
                      {[
                        isPt ? 'Compra e venda de imóveis residenciais' : 'Purchase and sale of residential properties',
                        isPt ? 'Compra e venda de imóveis comerciais' : 'Purchase and sale of commercial properties',
                        isPt ? 'Locação residencial e comercial' : 'Residential and commercial rentals',
                        isPt ? 'Administração de imóveis' : 'Property management',
                        isPt ? 'Avaliação de imóveis' : 'Property valuation',
                        isPt ? 'Consultoria imobiliária' : 'Real estate consulting',
                        isPt ? 'Intermediação em lançamentos' : 'New development sales',
                        isPt ? 'Assessoria em financiamento imobiliário' : 'Mortgage advisory',
                      ].map((service, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {isPt ? 'Áreas Geográficas de Atuação' : 'Geographic Areas of Activity'}
                    </h3>
                    <ul className="space-y-3">
                      {[
                        'São Paulo - Capital',
                        'Grande São Paulo',
                        'Litoral Paulista',
                        'Interior de São Paulo',
                        isPt ? 'Região Metropolitana de Campinas' : 'Campinas Metropolitan Area',
                        isPt ? 'Vale do Paraíba' : 'Paraíba Valley',
                        isPt ? 'Atendimento Nacional (mediante parceria)' : 'Nationwide service (through partnerships)',
                      ].map((area, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  {isPt ? 'Entre em Contato' : 'Contact Us'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-indigo-200 text-sm">{isPt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</p>
                        <p className="font-semibold">+55 (11) 91234-5678</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-indigo-200 text-sm">Email</p>
                        <p className="font-semibold">stellamary@creci.org.br</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-indigo-200 text-sm">{isPt ? 'Endereço' : 'Address'}</p>
                        <p className="font-semibold">São Paulo - SP, Brasil</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6 mt-6">
                  <h3 className="font-bold mb-4">{isPt ? 'Denúncias e Reclamações' : 'Complaints and Reports'}</h3>
                  <p className="text-indigo-100 mb-4">
                    {isPt 
                      ? 'Caso tenha alguma reclamação ou denúncia sobre a atuação profissional, você pode entrar em contato diretamente com o CRECI-SP:'
                      : 'If you have any complaints or reports about professional conduct, you can contact CRECI-SP directly:'
                    }
                  </p>
                  <a 
                    href="https://www.crecisp.gov.br/ouvidoria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-medium rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isPt ? 'Ouvidoria CRECI-SP' : 'CRECI-SP Ombudsman'}
                  </a>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 pb-8">
              <p>{isPt ? 'Última atualização' : 'Last updated'}: {lastUpdated}</p>
              <p className="mt-2">
                <Link to="/politica-pld" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  {isPt ? 'Ver nossa Política de Prevenção à Lavagem de Dinheiro' : 'View our Anti-Money Laundering Policy'}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
