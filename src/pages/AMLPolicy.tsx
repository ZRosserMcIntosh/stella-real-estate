import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  Shield, AlertTriangle, FileCheck, Search, Users, Building2, 
  Eye, FileText, Phone, Mail, ExternalLink, CheckCircle, 
  XCircle, AlertCircle, Scale, Landmark, Clock, Lock
} from 'lucide-react'

export default function AMLPolicy() {
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')

  const lastUpdated = '6 de dezembro de 2025'

  return (
    <>
      <Helmet>
        <title>{isPt 
          ? 'Política de Prevenção à Lavagem de Dinheiro (PLD) - Stella Real Estate' 
          : 'Anti-Money Laundering (AML) Policy - Stella Real Estate'
        }</title>
        <meta name="description" content={isPt 
          ? 'Política completa de prevenção à lavagem de dinheiro e financiamento ao terrorismo da Stella Real Estate, em conformidade com COAF e legislação brasileira.'
          : 'Complete anti-money laundering and terrorist financing prevention policy of Stella Real Estate, in compliance with COAF and Brazilian legislation.'
        } />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.stellareal.com.br/politica-pld" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-white py-16">
          <div className="container-padded">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full mb-6 border border-amber-500/30">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">{isPt ? 'Documento de Conformidade' : 'Compliance Document'}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {isPt 
                  ? 'Política de Prevenção à Lavagem de Dinheiro' 
                  : 'Anti-Money Laundering Policy'
                }
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {isPt 
                  ? 'Programa de Prevenção à Lavagem de Dinheiro e Financiamento ao Terrorismo (PLD/FT)'
                  : 'Program for Prevention of Money Laundering and Terrorist Financing (AML/CFT)'
                }
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <Landmark className="w-4 h-4" />
                  {isPt ? 'COAF Resolução nº 36/2021' : 'COAF Resolution No. 36/2021'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-slate-400">
                  <Scale className="w-4 h-4" />
                  {isPt ? 'Lei nº 9.613/1998' : 'Law No. 9,613/1998'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-padded py-12">
          <div className="max-w-4xl mx-auto">

            {/* Introduction */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-amber-50 dark:bg-amber-900/20 px-8 py-4 border-b border-amber-200 dark:border-amber-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  {isPt ? '1. Introdução e Objetivo' : '1. Introduction and Purpose'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <p>
                  {isPt 
                    ? 'A Stella Real Estate ("Empresa") estabelece esta Política de Prevenção à Lavagem de Dinheiro e Financiamento ao Terrorismo (PLD/FT) em cumprimento às exigências legais e regulatórias brasileiras, com o objetivo de prevenir que seus serviços sejam utilizados para fins ilícitos.'
                    : 'Stella Real Estate ("Company") establishes this Anti-Money Laundering and Terrorist Financing Prevention Policy (AML/CFT) in compliance with Brazilian legal and regulatory requirements, with the objective of preventing its services from being used for illicit purposes.'
                  }
                </p>
                <p>
                  {isPt 
                    ? 'Esta política aplica-se a todas as operações imobiliárias intermediadas pela Empresa, incluindo compra, venda, locação e administração de imóveis, bem como a todos os colaboradores, parceiros e prestadores de serviços.'
                    : 'This policy applies to all real estate transactions intermediated by the Company, including purchase, sale, rental, and property management, as well as to all employees, partners, and service providers.'
                  }
                </p>

                <h3>{isPt ? 'Base Legal' : 'Legal Basis'}</h3>
                <ul>
                  <li><strong>Lei nº 9.613/1998</strong> - {isPt ? 'Lei de Lavagem de Dinheiro' : 'Money Laundering Law'}</li>
                  <li><strong>Lei nº 12.683/2012</strong> - {isPt ? 'Atualização da Lei de Lavagem de Dinheiro' : 'Update to Money Laundering Law'}</li>
                  <li><strong>Lei nº 13.260/2016</strong> - {isPt ? 'Lei Antiterrorismo' : 'Anti-Terrorism Law'}</li>
                  <li><strong>Resolução COAF nº 36/2021</strong> - {isPt ? 'Regulamenta o setor imobiliário' : 'Regulates the real estate sector'}</li>
                  <li><strong>Resolução COFECI nº 1.336/2014</strong> - {isPt ? 'Código de Ética dos Corretores' : 'Brokers Code of Ethics'}</li>
                  <li><strong>Circular BACEN nº 3.978/2020</strong> - {isPt ? 'Procedimentos PLD/FT' : 'AML/CFT Procedures'}</li>
                </ul>
              </div>
            </div>

            {/* Know Your Customer - KYC */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {isPt ? '2. Conheça Seu Cliente (KYC)' : '2. Know Your Customer (KYC)'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <p>
                  {isPt 
                    ? 'Antes de iniciar qualquer relacionamento comercial ou operação imobiliária, a Empresa adota procedimentos rigorosos de identificação e verificação de clientes.'
                    : 'Before initiating any business relationship or real estate transaction, the Company adopts rigorous customer identification and verification procedures.'
                  }
                </p>

                <h3>{isPt ? '2.1 Identificação de Pessoa Física' : '2.1 Individual Identification'}</h3>
                <p>{isPt ? 'Para pessoas físicas, são coletados e verificados:' : 'For individuals, the following are collected and verified:'}</p>
                <ul>
                  <li>{isPt ? 'Nome completo conforme documento de identificação' : 'Full name as per identification document'}</li>
                  <li>{isPt ? 'CPF (Cadastro de Pessoa Física)' : 'CPF (Individual Taxpayer Registry)'}</li>
                  <li>{isPt ? 'RG ou documento de identificação com foto' : 'ID or photo identification document'}</li>
                  <li>{isPt ? 'Data de nascimento e nacionalidade' : 'Date of birth and nationality'}</li>
                  <li>{isPt ? 'Endereço residencial completo com comprovante' : 'Complete residential address with proof'}</li>
                  <li>{isPt ? 'Profissão e fonte de renda' : 'Profession and source of income'}</li>
                  <li>{isPt ? 'Telefone e e-mail de contato' : 'Contact phone and email'}</li>
                  <li>{isPt ? 'Estado civil e regime de bens (se aplicável)' : 'Marital status and property regime (if applicable)'}</li>
                  <li>{isPt ? 'Identificação de Pessoa Politicamente Exposta (PEP)' : 'Politically Exposed Person (PEP) identification'}</li>
                </ul>

                <h3>{isPt ? '2.2 Identificação de Pessoa Jurídica' : '2.2 Legal Entity Identification'}</h3>
                <p>{isPt ? 'Para pessoas jurídicas, são coletados e verificados:' : 'For legal entities, the following are collected and verified:'}</p>
                <ul>
                  <li>{isPt ? 'Razão social e nome fantasia' : 'Corporate name and trade name'}</li>
                  <li>{isPt ? 'CNPJ (Cadastro Nacional de Pessoa Jurídica)' : 'CNPJ (National Legal Entity Registry)'}</li>
                  <li>{isPt ? 'Contrato social ou estatuto atualizado' : 'Updated articles of incorporation or bylaws'}</li>
                  <li>{isPt ? 'Ata de eleição da diretoria atual' : 'Minutes of current board election'}</li>
                  <li>{isPt ? 'Documentos dos representantes legais e procuradores' : 'Documents of legal representatives and attorneys-in-fact'}</li>
                  <li>{isPt ? 'Identificação dos beneficiários finais (ownership superior a 25%)' : 'Identification of ultimate beneficial owners (ownership over 25%)'}</li>
                  <li>{isPt ? 'Comprovante de endereço da sede' : 'Proof of headquarters address'}</li>
                  <li>{isPt ? 'Faturamento anual e atividade principal' : 'Annual revenue and main activity'}</li>
                </ul>

                <h3>{isPt ? '2.3 Pessoa Politicamente Exposta (PEP)' : '2.3 Politically Exposed Person (PEP)'}</h3>
                <p>
                  {isPt 
                    ? 'São consideradas Pessoas Politicamente Expostas aquelas que desempenham ou desempenharam, nos últimos 5 anos, cargos, empregos ou funções públicas relevantes no Brasil ou em outros países, assim como seus familiares e pessoas de seu relacionamento próximo.'
                    : 'Politically Exposed Persons are those who hold or have held, in the last 5 years, relevant public positions, jobs, or functions in Brazil or other countries, as well as their family members and close associates.'
                  }
                </p>
                <p>
                  {isPt 
                    ? 'Operações envolvendo PEPs requerem aprovação especial e monitoramento reforçado.'
                    : 'Transactions involving PEPs require special approval and enhanced monitoring.'
                  }
                </p>

                <h3>{isPt ? '2.4 Beneficiário Final' : '2.4 Ultimate Beneficial Owner'}</h3>
                <p>
                  {isPt 
                    ? 'Identificamos todas as pessoas físicas que, em última instância, possuem, controlam ou exercem influência significativa sobre o cliente pessoa jurídica, especialmente aquelas com participação societária igual ou superior a 25%.'
                    : 'We identify all individuals who ultimately own, control, or exercise significant influence over the legal entity client, especially those with ownership interest equal to or greater than 25%.'
                  }
                </p>
              </div>
            </div>

            {/* Due Diligence */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-purple-50 dark:bg-purple-900/20 px-8 py-4 border-b border-purple-200 dark:border-purple-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-600" />
                  {isPt ? '3. Diligência Devida (Due Diligence)' : '3. Due Diligence'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <h3>{isPt ? '3.1 Diligência Padrão' : '3.1 Standard Due Diligence'}</h3>
                <p>{isPt ? 'Aplicada a todas as operações, inclui:' : 'Applied to all transactions, includes:'}</p>
                <ul>
                  <li>{isPt ? 'Validação de documentos de identificação' : 'Validation of identification documents'}</li>
                  <li>{isPt ? 'Verificação da regularidade do CPF/CNPJ junto à Receita Federal' : 'Verification of CPF/CNPJ status with Federal Revenue'}</li>
                  <li>{isPt ? 'Consulta a listas restritivas nacionais e internacionais' : 'Consultation of national and international restrictive lists'}</li>
                  <li>{isPt ? 'Análise da compatibilidade entre renda declarada e valor da operação' : 'Analysis of compatibility between declared income and transaction value'}</li>
                </ul>

                <h3>{isPt ? '3.2 Diligência Reforçada' : '3.2 Enhanced Due Diligence'}</h3>
                <p>{isPt ? 'Aplicada em situações de maior risco, incluindo:' : 'Applied in higher-risk situations, including:'}</p>
                <ul>
                  <li>{isPt ? 'Operações de valor igual ou superior a R$ 100.000,00' : 'Transactions valued at R$ 100,000.00 or more'}</li>
                  <li>{isPt ? 'Clientes classificados como PEP' : 'Clients classified as PEP'}</li>
                  <li>{isPt ? 'Operações envolvendo países de alto risco (lista GAFI/FATF)' : 'Transactions involving high-risk countries (FATF list)'}</li>
                  <li>{isPt ? 'Pagamentos em espécie' : 'Cash payments'}</li>
                  <li>{isPt ? 'Operações com estrutura incomum ou sem justificativa econômica' : 'Transactions with unusual structure or without economic justification'}</li>
                  <li>{isPt ? 'Clientes com informações incompletas ou inconsistentes' : 'Clients with incomplete or inconsistent information'}</li>
                </ul>

                <div className="bg-slate-100 dark:bg-slate-700/50 rounded-xl p-6 mt-4">
                  <h4 className="font-bold text-slate-900 dark:text-white m-0 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    {isPt ? 'Medidas de Diligência Reforçada' : 'Enhanced Due Diligence Measures'}
                  </h4>
                  <ul className="m-0 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      {isPt ? 'Obtenção de documentação adicional sobre origem dos recursos' : 'Obtaining additional documentation on source of funds'}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      {isPt ? 'Pesquisa em mídia adversa e bases públicas' : 'Research in adverse media and public databases'}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      {isPt ? 'Aprovação de gestor sênior para prosseguimento' : 'Senior manager approval to proceed'}
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      {isPt ? 'Monitoramento contínuo da operação' : 'Continuous monitoring of the transaction'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Suspicious Operations */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 px-8 py-4 border-b border-red-200 dark:border-red-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  {isPt ? '4. Operações Suspeitas e Comunicação ao COAF' : '4. Suspicious Operations and COAF Reporting'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <p>
                  {isPt 
                    ? 'A Empresa monitora continuamente as operações em busca de sinais de alerta (red flags) que possam indicar lavagem de dinheiro ou financiamento ao terrorismo.'
                    : 'The Company continuously monitors transactions for warning signs (red flags) that may indicate money laundering or terrorist financing.'
                  }
                </p>

                <h3>{isPt ? '4.1 Sinais de Alerta (Red Flags)' : '4.1 Warning Signs (Red Flags)'}</h3>
                
                <h4>{isPt ? 'Relacionados ao Cliente:' : 'Client-Related:'}</h4>
                <ul>
                  <li>{isPt ? 'Relutância em fornecer informações ou documentos' : 'Reluctance to provide information or documents'}</li>
                  <li>{isPt ? 'Informações inconsistentes ou contraditórias' : 'Inconsistent or contradictory information'}</li>
                  <li>{isPt ? 'Uso de documentos falsos ou adulterados' : 'Use of false or altered documents'}</li>
                  <li>{isPt ? 'Cliente com histórico criminal relacionado a crimes financeiros' : 'Client with criminal history related to financial crimes'}</li>
                  <li>{isPt ? 'Cliente representado por terceiros sem justificativa clara' : 'Client represented by third parties without clear justification'}</li>
                </ul>

                <h4>{isPt ? 'Relacionados à Operação:' : 'Transaction-Related:'}</h4>
                <ul>
                  <li>{isPt ? 'Operações com valores incompatíveis com a capacidade financeira' : 'Transactions with values incompatible with financial capacity'}</li>
                  <li>{isPt ? 'Pagamentos em espécie de valores elevados' : 'High-value cash payments'}</li>
                  <li>{isPt ? 'Múltiplas operações fracionadas para evitar comunicação' : 'Multiple fractioned transactions to avoid reporting'}</li>
                  <li>{isPt ? 'Compra e venda rápida do mesmo imóvel' : 'Quick purchase and sale of the same property'}</li>
                  <li>{isPt ? 'Preços muito acima ou abaixo do valor de mercado' : 'Prices well above or below market value'}</li>
                  <li>{isPt ? 'Operações sem justificativa econômica ou comercial' : 'Transactions without economic or commercial justification'}</li>
                  <li>{isPt ? 'Desistência após solicitação de documentos' : 'Withdrawal after document request'}</li>
                </ul>

                <h4>{isPt ? 'Relacionados ao Pagamento:' : 'Payment-Related:'}</h4>
                <ul>
                  <li>{isPt ? 'Pagamento por terceiros não relacionados à operação' : 'Payment by third parties unrelated to the transaction'}</li>
                  <li>{isPt ? 'Uso de múltiplas contas bancárias' : 'Use of multiple bank accounts'}</li>
                  <li>{isPt ? 'Transferências de/para países de alto risco' : 'Transfers from/to high-risk countries'}</li>
                  <li>{isPt ? 'Pagamento por meio de criptomoedas' : 'Payment through cryptocurrencies'}</li>
                  <li>{isPt ? 'Uso de empresas de fachada ou offshore' : 'Use of shell companies or offshore entities'}</li>
                </ul>

                <h3>{isPt ? '4.2 Comunicações Obrigatórias ao COAF' : '4.2 Mandatory COAF Reports'}</h3>
                
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-6">
                  <p className="font-bold text-red-800 dark:text-red-300 m-0 mb-4">
                    {isPt ? 'Operações que devem ser comunicadas:' : 'Transactions that must be reported:'}
                  </p>
                  <ul className="m-0 space-y-2">
                    <li className="flex items-start gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt 
                        ? 'Pagamento ou recebimento em espécie de valor igual ou superior a R$ 100.000,00'
                        : 'Cash payment or receipt of R$ 100,000.00 or more'
                      }
                    </li>
                    <li className="flex items-start gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt 
                        ? 'Operação suspeita, independentemente do valor'
                        : 'Suspicious transaction, regardless of value'
                      }
                    </li>
                    <li className="flex items-start gap-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt 
                        ? 'Operação com pessoa listada em sanções internacionais'
                        : 'Transaction with person on international sanctions lists'
                      }
                    </li>
                  </ul>
                </div>

                <h3>{isPt ? '4.3 Prazo para Comunicação' : '4.3 Reporting Deadline'}</h3>
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <p className="m-0">
                    {isPt 
                      ? 'As comunicações ao COAF devem ser realizadas no prazo máximo de 24 horas após a identificação da operação suspeita ou atípica.'
                      : 'Reports to COAF must be made within a maximum of 24 hours after the identification of the suspicious or atypical transaction.'
                    }
                  </p>
                </div>

                <h3>{isPt ? '4.4 Sigilo das Comunicações' : '4.4 Confidentiality of Reports'}</h3>
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl">
                  <Lock className="w-8 h-8 text-slate-600" />
                  <p className="m-0">
                    {isPt 
                      ? 'É vedado dar ciência ao cliente ou a terceiros sobre a realização de comunicação ao COAF, sob pena de responsabilização civil e criminal (Lei nº 9.613/1998, Art. 10).'
                      : 'It is prohibited to inform the client or third parties about reports made to COAF, under penalty of civil and criminal liability (Law No. 9,613/1998, Art. 10).'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Record Keeping */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-green-50 dark:bg-green-900/20 px-8 py-4 border-b border-green-200 dark:border-green-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  {isPt ? '5. Manutenção de Registros' : '5. Record Keeping'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <p>
                  {isPt 
                    ? 'A Empresa mantém registros completos de todas as operações e informações de clientes, em conformidade com a legislação aplicável.'
                    : 'The Company maintains complete records of all transactions and client information, in compliance with applicable legislation.'
                  }
                </p>

                <h3>{isPt ? '5.1 Documentos Mantidos' : '5.1 Documents Maintained'}</h3>
                <ul>
                  <li>{isPt ? 'Cadastro completo de clientes e representantes' : 'Complete client and representative records'}</li>
                  <li>{isPt ? 'Cópias de documentos de identificação' : 'Copies of identification documents'}</li>
                  <li>{isPt ? 'Comprovantes de operações realizadas' : 'Proof of completed transactions'}</li>
                  <li>{isPt ? 'Contratos e instrumentos jurídicos' : 'Contracts and legal instruments'}</li>
                  <li>{isPt ? 'Correspondências e comunicações relevantes' : 'Relevant correspondence and communications'}</li>
                  <li>{isPt ? 'Análises de risco e due diligence' : 'Risk analyses and due diligence'}</li>
                  <li>{isPt ? 'Registros de treinamentos de funcionários' : 'Employee training records'}</li>
                </ul>

                <h3>{isPt ? '5.2 Prazo de Guarda' : '5.2 Retention Period'}</h3>
                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-6">
                  <p className="font-bold text-green-800 dark:text-green-300 m-0 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {isPt ? 'Mínimo de 5 anos' : 'Minimum of 5 years'}
                  </p>
                  <p className="text-green-700 dark:text-green-400 mt-2 mb-0">
                    {isPt 
                      ? 'Todos os registros são mantidos por no mínimo 5 (cinco) anos após o término da relação comercial ou da conclusão da operação, conforme Art. 10 da Lei nº 9.613/1998.'
                      : 'All records are maintained for at least 5 (five) years after the end of the business relationship or completion of the transaction, as per Art. 10 of Law No. 9,613/1998.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Training */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 px-8 py-4 border-b border-indigo-200 dark:border-indigo-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  {isPt ? '6. Treinamento e Capacitação' : '6. Training and Capacity Building'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <p>
                  {isPt 
                    ? 'A Empresa promove programas contínuos de treinamento e capacitação para garantir que todos os colaboradores compreendam e apliquem esta política.'
                    : 'The Company promotes continuous training and capacity building programs to ensure that all employees understand and apply this policy.'
                  }
                </p>

                <h3>{isPt ? '6.1 Programa de Treinamento' : '6.1 Training Program'}</h3>
                <ul>
                  <li>{isPt ? 'Treinamento inicial para novos colaboradores' : 'Initial training for new employees'}</li>
                  <li>{isPt ? 'Reciclagem anual obrigatória' : 'Mandatory annual refresher'}</li>
                  <li>{isPt ? 'Atualizações sobre mudanças regulatórias' : 'Updates on regulatory changes'}</li>
                  <li>{isPt ? 'Casos práticos e estudos de caso' : 'Practical cases and case studies'}</li>
                  <li>{isPt ? 'Avaliação de conhecimentos' : 'Knowledge assessment'}</li>
                </ul>

                <h3>{isPt ? '6.2 Conteúdo Programático' : '6.2 Program Content'}</h3>
                <ul>
                  <li>{isPt ? 'Legislação de PLD/FT aplicável ao setor imobiliário' : 'AML/CFT legislation applicable to real estate sector'}</li>
                  <li>{isPt ? 'Procedimentos de identificação e verificação de clientes' : 'Customer identification and verification procedures'}</li>
                  <li>{isPt ? 'Identificação de operações suspeitas' : 'Identification of suspicious transactions'}</li>
                  <li>{isPt ? 'Procedimentos internos de comunicação' : 'Internal reporting procedures'}</li>
                  <li>{isPt ? 'Consequências do descumprimento' : 'Consequences of non-compliance'}</li>
                </ul>
              </div>
            </div>

            {/* Penalties */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
              <div className="bg-slate-100 dark:bg-slate-700/50 px-8 py-4 border-b border-slate-200 dark:border-slate-600">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-slate-600" />
                  {isPt ? '7. Penalidades e Consequências' : '7. Penalties and Consequences'}
                </h2>
              </div>
              <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                <h3>{isPt ? '7.1 Penalidades Administrativas' : '7.1 Administrative Penalties'}</h3>
                <p>
                  {isPt 
                    ? 'O descumprimento das obrigações de PLD/FT pode resultar nas seguintes penalidades administrativas (Lei nº 9.613/1998, Art. 12):'
                    : 'Failure to comply with AML/CFT obligations may result in the following administrative penalties (Law No. 9,613/1998, Art. 12):'
                  }
                </p>
                <ul>
                  <li><strong>{isPt ? 'Advertência' : 'Warning'}</strong></li>
                  <li><strong>{isPt ? 'Multa' : 'Fine'}</strong> - {isPt ? 'De R$ 20.000 até R$ 20.000.000 por infração' : 'From R$ 20,000 up to R$ 20,000,000 per violation'}</li>
                  <li><strong>{isPt ? 'Inabilitação temporária' : 'Temporary disqualification'}</strong> - {isPt ? 'Até 10 anos' : 'Up to 10 years'}</li>
                  <li><strong>{isPt ? 'Cassação ou suspensão' : 'Revocation or suspension'}</strong> - {isPt ? 'Da autorização para funcionamento' : 'Of operating authorization'}</li>
                </ul>

                <h3>{isPt ? '7.2 Penalidades Penais' : '7.2 Criminal Penalties'}</h3>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <p className="font-bold text-red-800 dark:text-red-300 m-0 mb-3">
                    {isPt ? 'Crime de Lavagem de Dinheiro (Lei nº 9.613/1998, Art. 1º):' : 'Money Laundering Crime (Law No. 9,613/1998, Art. 1):'}
                  </p>
                  <ul className="m-0 space-y-2 text-red-700 dark:text-red-400">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt ? 'Reclusão de 3 a 10 anos' : 'Imprisonment from 3 to 10 years'}
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt ? 'Multa' : 'Fine'}
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0 mt-1" />
                      {isPt ? 'Perda de bens e valores' : 'Forfeiture of assets and values'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  {isPt ? '8. Contato e Denúncias' : '8. Contact and Reports'}
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">{isPt ? 'Responsável PLD/FT' : 'AML/CFT Officer'}</h3>
                    <div className="space-y-3">
                      <p className="text-slate-300">{isPt ? 'Para questões sobre esta política:' : 'For questions about this policy:'}</p>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span>compliance@stellareal.com.br</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <span>+55 (11) 91234-5678</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4">{isPt ? 'Órgãos Reguladores' : 'Regulatory Bodies'}</h3>
                    <div className="space-y-3">
                      <a 
                        href="https://www.gov.br/coaf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        COAF - Conselho de Controle de Atividades Financeiras
                      </a>
                      <a 
                        href="https://www.crecisp.gov.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        CRECI-SP - Conselho Regional de Corretores de Imóveis
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6 mt-6">
                  <p className="text-slate-400 text-sm">
                    {isPt 
                      ? 'Esta política é revisada anualmente ou sempre que houver alterações regulatórias relevantes. A versão atualizada está sempre disponível em nosso site.'
                      : 'This policy is reviewed annually or whenever there are relevant regulatory changes. The updated version is always available on our website.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 pb-8">
              <p>{isPt ? 'Última atualização' : 'Last updated'}: {lastUpdated}</p>
              <p className="mt-2">
                <Link to="/creci-disclosure" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  {isPt ? 'Ver nossa Divulgação CRECI' : 'View our CRECI Disclosure'}
                </Link>
                {' · '}
                <Link to="/privacidade" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
