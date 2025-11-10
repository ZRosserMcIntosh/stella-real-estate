import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Privacy() {
  const { t } = useTranslation()
  
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-950 -mt-20 pt-20">
        <div className="container-padded py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            LGPD Compliant
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Política de Privacidade
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Última atualização: 5 de novembro de 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-padded py-16 max-w-5xl mx-auto">
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 mb-12 border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-0">
              Esta Política de Privacidade explica como a <strong>Stella Mary Lima Barbosa</strong>, inscrita no CNPJ sob o nº <strong>53.152.795/0001-10</strong>, com sede em <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>", "<strong>nós</strong>" ou "<strong>nosso</strong>"), coleta, usa, compartilha e protege dados pessoais no ecossistema Stella — que inclui o site institucional, o construtor de sites, o CRM <strong>Constellation</strong>, ferramentas de automação, aplicativos, integrações e os recursos de captura e processamento de mídia (por exemplo, conversão de vídeos 2D em mapas 3D dos imóveis).
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 mb-0">
              Esta política foi elaborada em conformidade com a <strong>Lei Geral de Proteção de Dados – LGPD (Lei nº 13.709/2018)</strong>, o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong> e demais normas aplicáveis.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 mb-0 font-semibold">
              Ao usar nossos serviços, você declara ter lido e compreendido esta Política.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 mb-12 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0 mb-6">Índice</h2>
            <nav className="grid md:grid-cols-2 gap-3">
              {[
                { num: 1, title: "A quem se aplica" },
                { num: 2, title: "Controlador e Encarregado (DPO)" },
                { num: 3, title: "Quais dados pessoais coletamos" },
                { num: 4, title: "Para que usamos seus dados" },
                { num: 5, title: "Tomada de decisão automatizada" },
                { num: 6, title: "Compartilhamento de dados" },
                { num: 7, title: "Transferências internacionais" },
                { num: 8, title: "Retenção e critérios" },
                { num: 9, title: "Segurança da informação" },
                { num: 10, title: "Cookies e preferências" },
                { num: 11, title: "Direitos dos titulares" },
                { num: 12, title: "Responsabilidades do usuário" },
                { num: 13, title: "Crianças e adolescentes" },
                { num: 14, title: "Links de terceiros" },
                { num: 15, title: "Alterações desta Política" },
                { num: 16, title: "Contato" },
                { num: 17, title: "Resumo para usuários finais" },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors group no-underline"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">
                    {item.num}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                    {item.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Section 1 */}
          <div id="section-1" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">1</span>
              A quem se aplica
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span><strong>Visitantes</strong> dos nossos sites.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span><strong>Usuários finais (varejo)</strong>: compradores, locatários e proprietários que interagem com anúncios e formulários.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span><strong>Profissionais do setor</strong>: corretores(as) autônomos(as), imobiliárias, incorporadoras/construtoras, administradores(as) de locação e gestores(as) de curta temporada.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span><strong>Funcionários(as) e colaboradores(as)</strong> de empresas clientes que usam nossos produtos (ex.: CRM Constellation), inclusive os convidados via <strong>código de convite</strong>.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div id="section-2" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">2</span>
              Controlador e Encarregado (DPO)
            </h2>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-950/20 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3 mb-0">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span><strong>Controlador:</strong> Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span><strong>Encarregado(a)/DPO:</strong> <strong>[NOME DO DPO]</strong> – <strong>[E-MAIL DO DPO]</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>Canal para solicitações de titulares: <strong>[E-MAIL DO DPO]</strong> ou <strong>[FORMULÁRIO/URL]</strong>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div id="section-3" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">3</span>
              Quais dados pessoais coletamos
            </h2>
            
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">3.1. Dados fornecidos por você</h3>
            <ul className="space-y-2">
              <li><strong>Cadastro e identidade:</strong> nome completo, e-mail, telefone, CPF (quando necessário), senha (hash), data de nascimento (quando necessário), idioma e fuso horário.</li>
              <li><strong>Perfil profissional:</strong> <strong>CRECI</strong>, cargo/função, empresa, site, área de atuação, carteiras e preferências.</li>
              <li><strong>Dados comerciais de anúncios e imóveis:</strong> endereços, características do imóvel, preços, documentação, disponibilidade, mídia (fotos, vídeos, plantas), tour 3D, descrições e rótulos.</li>
              <li><strong>Conteúdo enviado:</strong> mensagens, comentários, campos livres, arquivos, vídeos 2D e outros materiais que podem conter dados de terceiros (você é responsável por obter as autorizações necessárias).</li>
              <li><strong>Formulários de interesse/contato:</strong> intenção de compra/locação, faixas de preço, bairros, prazos, informações de financiamento, preferências.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">3.2. Dados coletados automaticamente</h3>
            <ul className="space-y-2">
              <li><strong>Dados de uso e log:</strong> IP, identificadores de dispositivo, sistema e navegador, páginas acessadas, datas/horas, duração de sessão, origem de tráfego, performance, erros.</li>
              <li><strong>Cookies e tecnologias similares:</strong> pixels, local storage e identificadores (veja a Seção 10).</li>
              <li><strong>Geolocalização aproximada</strong> (derivada de IP) e, se você autorizar, localização precisa do dispositivo.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">3.3. Dados de terceiros e integrações (quando habilitadas)</h3>
            <ul className="space-y-2">
              <li><strong>Plataformas de anúncios e redes sociais</strong> (ex.: Google, Meta) para mensuração e remarketing.</li>
              <li><strong>Integrações de comunicação</strong> (ex.: e-mail, WhatsApp Business, telefonia/softphone) — contatos, histórico de conversas e metadados.</li>
              <li><strong>Pagamentos e faturamento</strong> (ex.: gateways, notas fiscais) — dados transacionais (não armazenamos dados completos de cartão).</li>
              <li><strong>Dados públicos</strong> e de parceiros do mercado imobiliário (ex.: verificação de <strong>CRECI</strong>, dados cadastrais públicos, bases de CEP e mapas).</li>
            </ul>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 mt-6 rounded">
              <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
                <strong>Dados sensíveis:</strong> não solicitamos dados sensíveis (saúde, biometria etc.). Se enviados por você no conteúdo, trataremos conforme a LGPD, limitando o uso e adotando medidas de proteção.
              </p>
            </div>
          </div>

          {/* Section 4 - Table */}
          <div id="section-4" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">4</span>
              Para que usamos seus dados (finalidades e bases legais)
            </h2>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full border-collapse bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="text-left p-4 font-semibold">Finalidade</th>
                    <th className="text-left p-4 font-semibold">Exemplos</th>
                    <th className="text-left p-4 font-semibold">Base(s) legal(is)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Criação e gestão de contas</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Cadastro, login, permissões por papéis, convites, clubes de empresas</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Execução de contrato</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Verificação profissional</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Validação de CRECI para habilitar recursos de corretor(a) e exibir em anúncios</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Legítimo interesse; cumprimento de obrigação regulatória quando aplicável</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Prestação dos serviços</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Publicar anúncios, gerenciar leads no CRM, site builder, automações</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Execução de contrato</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Processamento de mídia com IA</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Converter vídeos 2D em mapas/"tours" 3D, geração de miniaturas, otimização</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Execução de contrato; legítimo interesse</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Atendimento e suporte</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Suporte técnico, treinamento, comunicação sobre incidentes</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Execução de contrato; legítimo interesse</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Marketing e personalização</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Newsletters, remarketing, recomendação de imóveis/conteúdos</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Consentimento (quando exigido); legítimo interesse</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Medição, análise e melhoria</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Analytics, testes, estatísticas, prevenção a erros e fraudes</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Legítimo interesse</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Segurança e conformidade</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Auditoria, logs, prevenção a fraudes/abusos, cumprimento legal</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Cumprimento de obrigação legal; legítimo interesse</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">Faturamento e cobranças</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Emissão de notas, gestão de pagamentos</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">Execução de contrato; cumprimento legal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 mt-6 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-200 mb-0">
                <strong>Treinamento de modelos de IA:</strong> não utilizamos <strong>conteúdo do cliente</strong> (por ex., fotos/vídeos de imóveis, conversas, leads) para treinar modelos externos. Poderemos usar <strong>dados agregados e anonimizados</strong> para estatísticas e melhoria de produtos. Se pretendermos usar dados pessoais identificáveis para melhoria algorítmica, pediremos <strong>seu consentimento explícito</strong>.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div id="section-5" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">5</span>
              Tomada de decisão automatizada e perfilamento
            </h2>
            <p>
              Usamos algoritmos para <strong>classificar leads</strong>, <strong>sugerir imóveis</strong>, detectar <strong>spam/fraude</strong> e priorizar atividades no CRM. Você pode solicitar <strong>revisão de decisões tomadas exclusivamente por meios automatizados</strong> que afetem seus interesses, conforme a LGPD, pelos canais do DPO.
            </p>
          </div>

          {/* Section 6 */}
          <div id="section-6" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">6</span>
              Compartilhamento de dados
            </h2>
            <p>Compartilhamos dados pessoais somente quando necessário e proporcional:</p>
            <ul className="space-y-2 mt-4">
              <li><strong>Com empresas clientes e parceiros do setor</strong> (ex.: corretoras, incorporadoras): quando você <strong>envia um lead</strong> ou interage com um anúncio, seus dados de contato e interesse são <strong>compartilhados com o anunciante</strong> para atendimento.</li>
              <li><strong>Operadores/fornecedores</strong> que tratam dados em nosso nome (hospedagem em nuvem, processamento de mídia/IA, e-mail, mensageria, analytics, pagamentos, suporte).</li>
              <li><strong>Integrações ativadas por você</strong> (ex.: Google, Meta, WhatsApp Business, telefonia, mapas).</li>
              <li><strong>Autoridades públicas</strong> para cumprimento de obrigação legal ou requisições válidas.</li>
              <li><strong>Operações societárias</strong> (fusão, aquisição, reorganização), sujeitos a confidencialidade.</li>
            </ul>
            <p className="mt-4">
              Não vendemos dados pessoais. Para publicidade, podemos <strong>compartilhar identificadores online</strong> com plataformas de mídia, conforme seus consentimentos e configurações de cookies.
            </p>
          </div>

          {/* Sections 7-17 continue with similar styling... */}
          {/* I'll create the remaining sections with consistent formatting */}

          {/* Section 7 */}
          <div id="section-7" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">7</span>
              Transferências internacionais
            </h2>
            <p>
              Seus dados podem ser processados fora do Brasil por provedores de nuvem e serviços globais. Adotamos <strong>salvaguardas</strong> exigidas pela LGPD (cláusulas contratuais, padrões de segurança e minimização). Você pode solicitar informações sobre os países e os mecanismos aplicados via DPO.
            </p>
          </div>

          {/* Section 8 */}
          <div id="section-8" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">8</span>
              Retenção e critérios de retenção
            </h2>
            <p>
              Mantemos os dados <strong>pelo tempo necessário</strong> ao cumprimento das finalidades desta Política e de obrigações legais/contratuais. Exemplos:
            </p>
            <ul className="space-y-2 mt-4">
              <li><strong>Conta e configurações:</strong> enquanto a conta estiver ativa e por até <strong>[X anos]</strong> após encerramento, para obrigações legais e defesa jurídica.</li>
              <li><strong>Leads, negócios e registros do CRM:</strong> prazo do contrato e <strong>[X anos]</strong> após o término (prazos prescricionais).</li>
              <li><strong>Logs de acesso e segurança:</strong> pelo prazo mínimo exigido em lei e/ou <strong>[6 a 24 meses]</strong>.</li>
              <li><strong>Mídias e tours 3D:</strong> enquanto o anúncio estiver ativo e pelo período operacional necessário após a remoção (<strong>backups/replicações</strong>).</li>
            </ul>
            <p className="mt-4">Quando possível, dados são <strong>anonimizados</strong> para uso estatístico.</p>
          </div>

          {/* Section 9 */}
          <div id="section-9" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">9</span>
              Segurança da informação
            </h2>
            <p>
              Adotamos <strong>medidas técnicas e administrativas</strong> compatíveis com a natureza das atividades: criptografia em trânsito e repouso (quando aplicável), controles de acesso por perfil, autenticação reforçada, registro de auditoria, segregação de ambientes, backups e testes.
            </p>
            <p className="mt-4">
              Apesar dos esforços, <strong>nenhum</strong> sistema é 100% seguro. Em caso de <strong>incidente de segurança</strong> com risco relevante, comunicaremos você e a <strong>ANPD</strong>, observadas as exigências legais.
            </p>
          </div>

          {/* Section 10 */}
          <div id="section-10" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">10</span>
              Cookies, pixels e preferências
            </h2>
            <p>Usamos cookies e tecnologias similares para:</p>
            <ul className="space-y-2 mt-4">
              <li><strong>Essenciais:</strong> autenticação, segurança, conteúdo do carrinho/fluxos críticos.</li>
              <li><strong>Desempenho/Analytics:</strong> entender uso e melhorar o produto.</li>
              <li><strong>Funcionais:</strong> lembrar preferências (idioma, fuso, layout).</li>
              <li><strong>Publicidade:</strong> medir campanhas e fazer remarketing.</li>
            </ul>
            <p className="mt-4">
              Você pode gerenciar preferências no nosso <strong>banner/centro de cookies</strong> e no navegador. Bloquear certos cookies pode afetar funcionalidades.
            </p>
          </div>

          {/* Section 11 */}
          <div id="section-11" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">11</span>
              Direitos dos titulares
            </h2>
            <p>Nos termos da LGPD, você pode:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {[
                "Solicitar confirmação de tratamento e acesso aos dados",
                "Pedir correção de dados incompletos, inexatos ou desatualizados",
                "Requerer a anonimização, bloqueio ou eliminação de dados desnecessários",
                "Solicitar a portabilidade a outro fornecedor",
                "Obter informações sobre compartilhamentos",
                "Solicitar a eliminação de dados tratados com base no consentimento",
                "Revogar o consentimento",
                "Opor-se a tratamentos baseados em legítimo interesse",
                "Solicitar revisão de decisões automatizadas",
              ].map((right, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{right}</span>
                </div>
              ))}
            </div>
            <p className="mt-6">
              Envie sua solicitação ao <strong>DPO</strong> (Seção 2). Responderemos <strong>nos prazos legais</strong> e poderemos solicitar comprovação de identidade.
            </p>
          </div>

          {/* Section 12 */}
          <div id="section-12" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">12</span>
              Responsabilidades do usuário e de clientes empresariais
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span><strong>Conteúdos e mídias</strong> enviados (fotos, vídeos 2D, tours 3D, plantas) <strong>não devem violar direitos de terceiros</strong>. Se houver pessoas identificáveis, obtenha as autorizações necessárias.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span><strong>Dados de terceiros</strong> incluídos no CRM (contatos/leads) devem ter <strong>base legal</strong> adequada definida por você/cliente empresarial, que atuará como <strong>controlador</strong> desses dados no uso do Constellation; a Stella atuará, nessa hipótese, como <strong>operadora</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span><strong>CRECI e dados profissionais</strong>: mantenha suas informações corretas e atualizadas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span><strong>Segurança de conta</strong>: guarde suas credenciais e ative autenticação de dois fatores quando disponível.</span>
              </li>
            </ul>
          </div>

          {/* Section 13 */}
          <div id="section-13" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">13</span>
              Crianças e adolescentes
            </h2>
            <p>
              Nossos serviços <strong>não são direcionados a menores de 18 anos</strong>. Caso identifiquemos dados de menores sem as autorizações legais, adotaremos medidas para exclusão.
            </p>
          </div>

          {/* Section 14 */}
          <div id="section-14" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">14</span>
              Links e sites de terceiros
            </h2>
            <p>
              Podemos conter links/integrar serviços de terceiros. Cada terceiro possui sua própria política. <strong>Não somos responsáveis</strong> por práticas de privacidade desses sites/serviços.
            </p>
          </div>

          {/* Section 15 */}
          <div id="section-15" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">15</span>
              Alterações desta Política
            </h2>
            <p>
              Podemos atualizar esta Política para refletir mudanças legais, técnicas ou operacionais. Publicaremos a versão vigente com a data de atualização no topo. Mudanças relevantes poderão ser comunicadas por e-mail ou aviso no serviço.
            </p>
          </div>

          {/* Section 16 - Contact */}
          <div id="section-16" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">16</span>
              Contato
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800/30">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Dúvidas, solicitações de direitos e comunicações sobre privacidade:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-slate-900 dark:text-white font-semibold">[NOME DO DPO]</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:[E-MAIL DO DPO]" className="text-indigo-600 dark:text-indigo-400 hover:underline">[E-MAIL DO DPO]</a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-300">[ENDEREÇO COMPLETO]</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a href="[URL]" className="text-indigo-600 dark:text-indigo-400 hover:underline">[FORMULÁRIO/URL]</a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 17 - Summary */}
          <div id="section-17" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">17</span>
              Resumo para usuários finais
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800/30">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-0">Versão Resumida</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Coletamos dados para <strong>operar o serviço</strong>, <strong>exibir e gerenciar anúncios</strong>, <strong>conectar interessados</strong> e <strong>melhorar a experiência</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Usamos <strong>IA</strong> para transformar vídeos em <strong>tours 3D</strong> e <strong>classificar leads</strong>; você pode pedir <strong>revisão</strong> de decisões automatizadas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Compartilhamos dados <strong>com o anunciante</strong> quando você envia um <strong>lead</strong>, e com <strong>fornecedores</strong> que operam o serviço.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Você tem <strong>direitos LGPD</strong> (acesso, correção, exclusão, portabilidade, oposição, revogação).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Preferências de <strong>cookies</strong> podem ser gerenciadas no banner.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>Contate <strong>[E-MAIL DO DPO]</strong> para qualquer assunto de privacidade.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 py-16">
        <div className="container-padded text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Dúvidas sobre privacidade?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contato com nosso Encarregado de Proteção de Dados (DPO) para esclarecer qualquer questão sobre como tratamos seus dados pessoais.
          </p>
          <a
            href="mailto:[E-MAIL DO DPO]"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contatar DPO
          </a>
        </div>
      </section>
    </div>
  )
}
