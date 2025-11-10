import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SLA() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-orange-950 dark:to-amber-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-400 rounded-2xl mb-6 shadow-lg shadow-orange-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Service Level Agreement (SLA)
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Uptime Commitments, Support Tiers, and Service Credits
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-orange-200 dark:border-orange-800">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Última atualização: 5 de novembro de 2025</span>
          </div>
        </div>

        {/* MSA Reference */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              Este SLA faz parte do <strong>MSA</strong> entre <span className="text-orange-600 dark:text-orange-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-orange-600 dark:text-orange-400">53.152.795/0001-10</span> ("<strong>Stella</strong>"), e o <strong>Cliente</strong> identificado na Ordem de Serviço/Contrato Comercial ("<strong>Order Form</strong>"). Termos não definidos aqui têm o significado do MSA.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Índice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Escopo',
              '2. Definições',
              '3. Compromissos de Disponibilidade',
              '4. Créditos de Serviço',
              '5. Suporte e Prioridades',
              '6. Exclusões',
              '7. Janelas de Manutenção',
              '8. Metodologia de Medição',
              '9. Pipeline de Mídia e 2D→3D',
              '10. Backups, RPO/RTO',
              '11. Processo para Solicitar Crédito',
              '12. Limitações',
              '13. Comunicação de Incidentes',
              '14. Alterações deste SLA',
              '15. Lei Aplicável e Foro',
              'Anexo A — Endpoints Críticos',
              'Anexo B — Tabela de Serviços'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="text-white/90 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-white/60 group-hover:text-white/80 font-mono text-sm">→</span>
                <span className="text-sm">{item}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">1</span>
              Escopo
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Este SLA define metas de <strong>disponibilidade</strong>, <strong>manutenção</strong>, <strong>métricas de medição</strong>, <strong>créditos de serviço</strong> e <strong>processo de solicitação</strong> para os serviços assinados pelo Cliente. Salvo indicação em contrário, os créditos são o <strong>único e exclusivo</strong> remédio por indisponibilidade coberta.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">2</span>
              Definições
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong>Mês de Serviço:</strong> período de cobrança mensal aplicável ao serviço.</li>
                <li><strong>Serviço Afetado:</strong> o produto/módulo específico indisponível (ex.: Constellation CRM, Site Builder, API).</li>
                <li><strong>Indisponibilidade / Downtime:</strong> período em que, por causas da Stella, o Serviço Afetado está inacessível ou com taxa de erro <strong>≥ 5%</strong> (HTTP 5xx/timeout) <strong>por 5 minutos contínuos</strong> ou mais, conforme monitoramento de referência.</li>
                <li><strong>Janela de Manutenção Programada:</strong> janela com aviso prévio para mudanças planejadas.</li>
                <li>
                  <strong>Porcentagem de Disponibilidade Mensal (PDM):</strong>
                  <div className="bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 p-4 rounded-r-lg mt-2">
                    <p className="font-mono text-sm">
                      PDM = (Minutos Totais do Mês − Minutos de Indisponibilidade) / Minutos Totais do Mês × 100%
                    </p>
                  </div>
                  <p className="mt-2">Exceções listadas na Seção 6 <strong>não</strong> contam como Indisponibilidade.</p>
                </li>
                <li><strong>Monitoramento de Referência:</strong> medições a partir de <strong>pontos externos</strong> e de <strong>telemetria interna</strong> da Stella (múltiplas regiões), prevalecendo nossa telemetria em caso de conflito de dados.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">3</span>
              Compromissos de Disponibilidade
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Escolhidos no <strong>Order Form</strong>. Se nenhum plano for indicado, aplica-se <strong>Standard</strong>.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-100 dark:bg-orange-900/30">
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Plano</th>
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Meta de PDM (por mês)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Standard</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">99,90%</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Premium</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">99,95%</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Enterprise</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">99,99% *</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                * Enterprise pode exigir arquitetura dedicada/regional e requisitos adicionais.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">4</span>
              Créditos de Serviço
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Aplicáveis quando a <strong>PDM</strong> do Serviço Afetado ficar <strong>abaixo</strong> da meta do plano no Mês de Serviço.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-orange-100 dark:bg-orange-900/30">
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Faixa de PDM no mês</th>
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Crédito (sobre a mensalidade do Serviço Afetado)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Abaixo da meta até ≥ 99,0%</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">10%</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">≥ 98,0% e &lt; 99,0%</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">25%</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">&lt; 98,0%</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Teto:</strong> créditos totais em um Mês de Serviço limitados a <strong>50%</strong> da mensalidade do Serviço Afetado. Créditos <strong>não são reembolsáveis</strong> em dinheiro; abatem faturas futuras. Não se aplicam a períodos de teste/gratuitos ou a Betas.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">5</span>
              Suporte e Prioridades
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                As metas de <strong>tempo de resposta</strong> e <strong>horários de atendimento</strong> constam da <strong>Política de Suporte</strong>: <strong>[URL DA POLÍTICA DE SUPORTE]</strong>.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-2">Em linhas gerais (exemplo; ajuste na política):</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>P1 (parada total em produção):</strong> Standard até 2h (24x7 melhor esforço), Premium 1h (24x7), Enterprise 30 min (24x7).</li>
                <li><strong>P2 (degradação severa):</strong> próximo dia útil.</li>
                <li><strong>P3/P4 (dúvidas/melhorias):</strong> conforme fila.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                Estes tempos de resposta <strong>não</strong> geram crédito SLA (créditos são apenas por disponibilidade), salvo se a Política de Suporte dispuser o contrário.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">6</span>
              Exclusões (não contam como Downtime)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>a)</strong> <strong>Manutenção Programada:</strong> janelas com <strong>aviso ≥ 72 horas</strong> (Seção 7).</li>
                <li><strong>b)</strong> <strong>Manutenção Emergencial de Segurança:</strong> intervenções para mitigar risco crítico; comunicaremos no status/console quando possível.</li>
                <li><strong>c)</strong> <strong>Causas fora do controle razoável</strong> (força maior, falhas de internet ampla, DDoS além da mitigação contratada, calamidades).</li>
                <li><strong>d)</strong> <strong>Terceiros fora do escopo da Stella:</strong> WhatsApp Business/telefonia, provedores de anúncios, mapas, CDN de terceiros além do que operamos diretamente, gateways de pagamento, stores de apps e sistemas do Cliente.</li>
                <li><strong>e)</strong> <strong>Uso em desacordo</strong> com o MSA/AUP/Documentação, abuso, automações não suportadas, scraping.</li>
                <li><strong>f)</strong> <strong>Credenciais e rede do Cliente</strong> (erros de DNS, VPN/firewall).</li>
                <li><strong>g)</strong> <strong>Betas/Previews, ambientes de sandbox</strong>, recursos marcados "Sem SLA" e <strong>planos gratuitos</strong>.</li>
                <li><strong>h)</strong> Janelas regulatórias/legais impostas por autoridades.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">7</span>
              Janelas de Manutenção
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Programada (padrão):</strong> domingos, <strong>01:00–03:00 BRT (UTC-3)</strong>. Normalmente sem indisponibilidade; quando houver risco, avisaremos com <strong>≥ 72 horas</strong> no <strong>status page</strong> e/ou console.
                </li>
                <li>
                  <strong>Emergencial:</strong> a qualquer momento para correções críticas de segurança/estabilidade; avisaremos no status/console tão logo possível.
                </li>
                <li>
                  Podemos ajustar a janela com aviso prévio.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">8</span>
              Metodologia de Medição
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Medimos disponibilidade <strong>por Serviço Afetado</strong> (ex.: CRM, Site Builder, API pública).</li>
                <li>Uma falha conta como Downtime quando <strong>p95</strong> de chamadas válidas falha (5xx/timeout) <strong>por ≥ 5 min</strong> para <strong>múltiplas regiões</strong> ou quando o endpoint crítico (login, criação de lead, render de página) está indisponível para a maioria dos usuários.</li>
                <li><strong>Degradação parcial</strong> (lentidão acima do normal, feature não crítica) não caracteriza downtime salvo se resultar nas condições acima.</li>
                <li>O tempo conta do <strong>registro do evento</strong> até a <strong>restauração confirmada</strong>.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">9</span>
              Pipeline de Mídia e 2D→3D (informativo)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Processamento de mídia, filas e reconstruções 2D→3D são <strong>jobs assíncronos</strong> sujeitos a volume, tamanho e complexidade do material.</li>
                <li>Metas de throughput são <strong>indicativas</strong> e não geram crédito: p.ex., <strong>início de processamento p95 &lt; 15 min</strong> após upload; tempos de conclusão variam.</li>
                <li>Quotas de <strong>créditos de processamento</strong> e limites por plano constam do Order Form/Documentação.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">10</span>
              Backups, RPO/RTO
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Backups</strong> regulares dos dados core de produção.</li>
                <li><strong>Objetivos</strong> (não geradores de crédito): <strong>RPO ≤ 24 horas</strong>; <strong>RTO ≤ 24 horas</strong> para restauração de serviço após incidente de dados em ambiente multi-tenant.</li>
                <li>RPO/RTO podem não se aplicar a dados de terceiros/integrações ou a mídia bruta não selecionada para backup.</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">11</span>
              Processo para Solicitar Crédito
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Para receber crédito, o Cliente deve:</p>
              <ol className="space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside">
                <li>Enviar solicitação para <strong>[E-MAIL DE SUPORTE/CONTA]</strong> dentro de <strong>30 dias</strong> após o fim do Mês de Serviço afetado;</li>
                <li>Incluir: datas/horas UTC-3 (BRT), Serviço Afetado, IDs de incidente (se houver), impacto percebido;</li>
                <li>Estar <strong>adimplente</strong> (sem faturas vencidas).</li>
              </ol>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                Após validação, o crédito é aplicado na fatura subsequente. A falta de solicitação no prazo constitui <strong>renúncia</strong> ao crédito daquele mês.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">12</span>
              Limitações
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Créditos <strong>não são cumulativos</strong> para o mesmo período/serviço acima do teto de 50%.</li>
                <li>Créditos para múltiplos Serviços Afetados são avaliados <strong>separadamente</strong>.</li>
                <li>Créditos não se aplicam quando o Cliente descumprir o MSA/AUP ou estiver em atraso.</li>
                <li>Exceto quando previsto no MSA, créditos <strong>não</strong> dão direito a rescisão e <strong>não</strong> convertem em reembolso em dinheiro.</li>
              </ul>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">13</span>
              Comunicação de Incidentes e Status
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Publicaremos atualizações em <strong>[URL DA STATUS PAGE]</strong> e/ou no console administrativo.</li>
                <li>Para <strong>P1</strong>, comunicaremos início, progresso e encerramento do incidente; <strong>post-mortem</strong> poderá ser disponibilizado para planos Premium/Enterprise mediante solicitação.</li>
              </ul>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">14</span>
              Alterações deste SLA
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Podemos atualizar este SLA para refletir mudanças técnicas ou legais. Alterações materiais serão notificadas no console/e-mail com antecedência razoável. A versão vigente é identificada pela data no topo.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">15</span>
              Lei Aplicável e Foro
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Regido pela <strong>legislação brasileira</strong>. Foro eleito conforme o <strong>MSA</strong>.
              </p>
            </div>
          </section>

          {/* Annex A */}
          <section id="section-16" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">A</span>
              Anexo A — Tabela de Endpoints Críticos
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">(exemplo; ajustar conforme a arquitetura)</p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li><strong>Autenticação:</strong> <code className="text-xs">/auth/login</code>, <code className="text-xs">/auth/refresh</code></li>
                  <li><strong>Leads:</strong> <code className="text-xs">/leads/create</code>, webhooks de entrada</li>
                  <li><strong>Listagens/Páginas públicas:</strong> renderização SSR/Edge do Site Builder</li>
                  <li><strong>CRM:</strong> criação/atualização de negócios, tarefas e contatos</li>
                  <li><strong>API Pública (se aplicável):</strong> <code className="text-xs">/v1/*</code> rotas marcadas como "core"</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Annex B */}
          <section id="section-17" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200 dark:border-orange-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg text-sm font-bold">B</span>
              Anexo B — Tabela de Serviços
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">(exemplo; ajustar conforme os serviços oferecidos)</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-orange-100 dark:bg-orange-900/30">
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Serviço</th>
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Coberto por SLA?</th>
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Janelas</th>
                      <th className="border border-orange-300 dark:border-orange-700 px-4 py-3 text-left text-slate-900 dark:text-white">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Constellation CRM</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Sim</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Dom 01:00–03:00 BRT</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Multi-tenant</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Site Builder (render público)</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Sim</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Dom 01:00–03:00 BRT</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">CDN gerenciada por Stella</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">API Pública</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Sim</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Dom 01:00–03:00 BRT</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Rate limits por plano</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Pipeline 2D→3D</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Parcial (sem crédito)</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Variável</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Jobs assíncronos</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Integrações WhatsApp/Telefonia</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Não</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">N/A</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Sujeito a terceiros</td>
                    </tr>
                    <tr className="hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors">
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 font-semibold text-slate-900 dark:text-white">Ambientes Sandbox/Dev</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Não</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">N/A</td>
                      <td className="border border-orange-200 dark:border-orange-800 px-4 py-3 text-slate-700 dark:text-slate-300">Sem SLA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Dúvidas sobre este SLA?
            </h2>
            <p className="text-white/90 mb-6">
              Para questões sobre este Service Level Agreement, entre em contato:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Suporte/Conta: <strong>[E-MAIL DE SUPORTE/CONTA]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
