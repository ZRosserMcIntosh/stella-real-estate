import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Cookies() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-950 -mt-20 pt-20">
      {/* Hero Section */}
      <div className="container-padded py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header with Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/30 rounded-full">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Cookie Management</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Política de Cookies
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
            <strong>Última atualização:</strong> 5 de novembro de 2025
          </p>

          {/* Introduction Box */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-12">
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              Esta Política de Cookies explica como <strong>Stella Mary Lima Barbosa</strong>, CNPJ <strong>53.152.795/0001-10</strong>, com sede em <strong>[ENDEREÇO COMPLETO]</strong> ("Stella", "nós", "nosso"), utiliza cookies e tecnologias similares em nossos sites, aplicativos e serviços (coletivamente, os "Serviços").
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
              Ao continuar usando os Serviços após ver o banner de cookies, suas escolhas serão aplicadas conforme descrito abaixo. Para detalhes sobre dados pessoais, consulte nossa <Link to="/privacidade" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline font-medium">Política de Privacidade</Link>.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Índice
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: 1, title: 'O que são cookies e tecnologias similares' },
                { num: 2, title: 'Como classificamos os cookies' },
                { num: 3, title: 'Cookies de terceiros' },
                { num: 4, title: 'Tabela de cookies' },
                { num: 5, title: 'Consentimento, registro e revogação' },
                { num: 6, title: 'Como gerenciar cookies no navegador' },
                { num: 7, title: 'Retenção e períodos de expiração' },
                { num: 8, title: 'Transferências internacionais' },
                { num: 9, title: 'Base legal e interesses legítimos' },
                { num: 10, title: 'Atualizações desta Política' },
                { num: 11, title: 'Contato' },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold">
                    {item.num}
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-sm font-medium">
                    {item.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">O que são cookies e tecnologias similares</h2>
              </div>
              
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong>Cookies</strong> são pequenos arquivos armazenados no seu navegador ou dispositivo que permitem funcionalidades e recordam certas informações.</li>
                <li><strong>Tecnologias similares</strong> incluem local storage, pixels, web beacons, SDKs (em apps) e identificadores de dispositivo.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Como classificamos os cookies</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                Usamos quatro categorias. Apenas os <strong>essenciais</strong> são estritamente necessários para o funcionamento do site e não dependem de consentimento.
              </p>

              {/* Category Cards */}
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                
                {/* Essential */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 m-0">Essenciais</h3>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    Autenticação, segurança, prevenção a fraudes, balanceamento de carga, itens técnicos de entrega de conteúdo.
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Base legal: execução do contrato/legítimo interesse.
                  </p>
                </div>

                {/* Functional */}
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100 m-0">Funcionais</h3>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    Preferências como idioma, fuso horário, layout, acessibilidade.
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Base legal: consentimento (quando exigido).
                  </p>
                </div>

                {/* Analytics */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 m-0">Medição/Desempenho</h3>
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    Estatísticas de uso para melhorar produtos, depurar erros e medir performance.
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                    Base legal: consentimento (quando exigido).
                  </p>
                </div>

                {/* Marketing */}
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 m-0">Marketing/Publicidade</h3>
                  </div>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                    Mensurar campanhas, limitar frequência, criar públicos (quando habilitado), remarketing.
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                    Base legal: consentimento.
                  </p>
                </div>

              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mt-6 not-prose">
                <p className="text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Você pode <strong>gerenciar seu consentimento</strong> a qualquer momento no <strong>Centro de Preferências de Cookies</strong> (link no banner/rodapé).
                  </span>
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Cookies de terceiros</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Algumas funcionalidades são fornecidas por terceiros (por exemplo, analytics, mapas, hospedagem de vídeos, publicidade e atendimento). Ao interagir com esses recursos, esses terceiros podem definir cookies próprios e tratar dados conforme suas políticas de privacidade. Mantemos uma <strong>lista de subprocessadores/terceiros</strong> atualizada em <strong>[URL]</strong>.
              </p>
            </section>

            {/* Section 4 - Cookie Table */}
            <section id="section-4" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Tabela de cookies</h2>
              </div>
              
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6 not-prose">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Nota:</strong> Substitua/ajuste pelos cookies realmente usados em produção. <strong>Duração</strong> é contada a partir do momento de definição/atualização do cookie.
                </p>
              </div>

              <div className="overflow-x-auto not-prose">
                <table className="w-full border-collapse bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Nome do cookie</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Domínio/Fornecedor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Finalidade</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Categoria</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Duração</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">st_session</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">stella.[domínio]</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Manter sessão do usuário logado; rotação segura</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Essencial</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Sessão</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">XSRF-TOKEN</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">stella.[domínio]</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Proteção contra CSRF em formulários</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Essencial</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">2 horas</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">cf_bm</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Cloudflare</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Diferenciar tráfego humano/bot; proteção</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Essencial</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">30 min</td>
                    </tr>
                    <tr className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-blue-600 dark:text-blue-400">cf_clearance</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Cloudflare</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Acessar conteúdo após desafio anti-bot</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">Essencial</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Até 1 ano</td>
                    </tr>
                    <tr className="hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-green-600 dark:text-green-400">st_locale</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">stella.[domínio]</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Salvar idioma e região</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">Funcional</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">6 meses</td>
                    </tr>
                    <tr className="hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-green-600 dark:text-green-400">st_theme</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">stella.[domínio]</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Preferência de tema/contraste</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">Funcional</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">6 meses</td>
                    </tr>
                    <tr className="hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-amber-600 dark:text-amber-400">_ga / _ga_*</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Google Analytics 4</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Métricas de uso agregadas</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">Medição</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">13 meses</td>
                    </tr>
                    <tr className="hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-amber-600 dark:text-amber-400">_gid</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Google Analytics 4</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Diferenciar usuários por dia</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">Medição</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">24 horas</td>
                    </tr>
                    <tr className="hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-purple-600 dark:text-purple-400">_fbp</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Meta</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Atribuição de campanhas/remarketing (se habilitado)</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">Marketing</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">90 dias</td>
                    </tr>
                    <tr className="hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-purple-600 dark:text-purple-400">_gcl_au</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Google Ads</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Atribuição de anúncios (se habilitado)</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">Marketing</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">90 dias</td>
                    </tr>
                    <tr className="hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-purple-600 dark:text-purple-400">ttclid</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">TikTok Ads</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Atribuição de cliques (se habilitado)</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">Marketing</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">30 dias</td>
                    </tr>
                    <tr className="hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-purple-600 dark:text-purple-400">_uetsid / _uetvid</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Microsoft Advertising</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Atribuição e públicos (se habilitado)</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">Marketing</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">1 dia / 13 meses</td>
                    </tr>
                    <tr className="hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-amber-600 dark:text-amber-400">hjSession* / hjFirstSeen</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Hotjar</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Análises de experiência (se habilitado)</td>
                      <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-xs font-medium">Medição</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Sessão / 30 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  5
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Consentimento, registro e revogação</h2>
              </div>
              
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li>Exibimos um <strong>banner de consentimento</strong> na primeira visita (e periodicamente). Você pode <strong>aceitar todas</strong>, <strong>rejeitar todas</strong> (exceto essenciais) ou <strong>personalizar</strong> por categoria.</li>
                <li>Registramos seu estado de consentimento (data, categorias ativas) para fins de comprovação.</li>
                <li>Você pode <strong>revogar</strong> ou <strong>alterar</strong> sua escolha no <strong>Centro de Preferências de Cookies</strong> a qualquer momento.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  6
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Como gerenciar cookies no navegador</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Além do nosso Centro de Preferências, você pode configurar seu navegador para bloquear/remover cookies. Isso pode afetar funcionalidades essenciais. Consulte a ajuda do seu navegador (Chrome, Edge, Firefox, Safari, etc.). Em dispositivos móveis, ajuste também as permissões/IDs de publicidade nas configurações do sistema.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  7
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Retenção e períodos de expiração</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Mantemos cookies pelo <strong>menor tempo necessário</strong> à finalidade. No quadro acima, indicamos a <strong>duração</strong> típica definida pelos fornecedores. Alguns cookies são <strong>de sessão</strong> (expiram ao fechar o navegador) e outros têm prazos fixos (por exemplo, 24 horas, 13 meses).
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  8
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Transferências internacionais</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Dados coletados via cookies podem ser processados fora do Brasil por provedores globais (p. ex., EUA/UE). Aplicamos <strong>salvaguardas</strong> contratuais e técnicas conforme a LGPD. Detalhes e lista de países/terceiros: <strong>[URL]</strong>.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  9
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Base legal e interesses legítimos</h2>
              </div>
              
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong>Essenciais:</strong> necessários para prestar o serviço solicitado (execução do contrato) e/ou para segurança e prevenção a fraudes (legítimo interesse).</li>
                <li><strong>Funcionais, Medição e Marketing:</strong> dependem de <strong>consentimento</strong> quando exigido. Você pode recusar sem prejuízo das funcionalidades essenciais.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  10
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Atualizações desta Política</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Podemos atualizar esta Política e a tabela de cookies para refletir mudanças técnicas/legais. A data no topo indica a versão vigente. Em alterações relevantes, poderemos exibir novo aviso/bandeira.
              </p>
            </section>

            {/* Section 11 - Contact */}
            <section id="section-11" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                  11
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Contato</h2>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Controlador: <strong>Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Encarregado(a)/DPO: <strong>[NOME DO DPO] – [E-MAIL DO DPO]</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Canal de privacidade: <strong>[URL/EMAIL]</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Gerenciar Preferências de Cookies</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Você pode alterar suas preferências de cookies a qualquer momento através do nosso Centro de Preferências.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Abrir Centro de Preferências
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
