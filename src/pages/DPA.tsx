import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DPA() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 dark:from-slate-900 dark:via-rose-950 dark:to-red-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-red-500 dark:from-rose-400 dark:to-red-400 rounded-2xl mb-6 shadow-lg shadow-rose-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Data Processing Addendum (DPA)
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Aditivo de Tratamento de Dados (LGPD)
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-rose-200 dark:border-rose-800">
            <svg className="w-4 h-4 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Última atualização: 5 de novembro de 2025</span>
          </div>
        </div>

        {/* MSA Reference */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              Este Aditivo de Tratamento de Dados ("<strong>DPA</strong>") é parte integrante do <strong>MSA</strong> celebrado entre <span className="text-rose-600 dark:text-rose-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-rose-600 dark:text-rose-400">53.152.795/0001-10</span> ("<strong>Stella</strong>" ou "<strong>Operadora</strong>"), e o cliente identificado na <strong>Ordem de Serviço/Order Form</strong> ("<strong>Cliente</strong>" ou "<strong>Controlador</strong>"). Termos não definidos aqui têm o significado atribuído no MSA.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              Este DPA estabelece as condições para o tratamento de <strong>Dados Pessoais</strong> nos termos da <strong>Lei nº 13.709/2018 (LGPD)</strong> e demais normas aplicáveis.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-rose-500 to-red-500 dark:from-rose-600 dark:to-red-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Índice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Escopo e Funções',
              '2. Objeto, Finalidade e Duração',
              '3. Tipos de Dados e Titulares',
              '4. Instruções do Controlador',
              '5. Confidencialidade e Pessoal',
              '6. Segurança da Informação',
              '7. Suboperadores',
              '8. Transferências Internacionais',
              '9. Assistência ao Controlador',
              '10. Notificação de Incidentes',
              '11. Auditorias',
              '12. Devolução e Eliminação de Dados',
              '13. Responsabilidades',
              '14. Comunicações',
              '15. Disposições Gerais',
              'Anexo I — Descrição do Tratamento',
              'Anexo II — Medidas de Segurança',
              'Anexo III — Suboperadores',
              'Anexo IV — Transferências Internacionais'
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">1</span>
              Escopo e Funções
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">1.1 Papéis</h3>
                <p className="text-slate-700 dark:text-slate-300">Para os <strong>Dados Pessoais do Cliente</strong> tratados na prestação dos Serviços, o <strong>Cliente</strong> atua como <strong>Controlador</strong> e a <strong>Stella</strong> como <strong>Operadora</strong>.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">1.2 Sujeitos envolvidos</h3>
                <p className="text-slate-700 dark:text-slate-300">Partes reconhecem que haverá também <strong>Suboperadores</strong> (fornecedores da Stella) conforme o <strong>Anexo III</strong>.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">2</span>
              Objeto, Finalidade e Duração
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">2.1 Objeto</h3>
                <p className="text-slate-700 dark:text-slate-300">Tratamento de Dados Pessoais necessário para prover os Serviços descritos no MSA/Order Form, incluindo CRM Constellation, site builder, automações, processamento de mídia (2D→3D) e integrações habilitadas.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">2.2 Finalidades</h3>
                <p className="text-slate-700 dark:text-slate-300">Hospedar, armazenar, organizar, analisar, transmitir, exibir, indexar e processar dados para (i) execução dos Serviços; (ii) segurança, prevenção a fraudes e monitoramento; (iii) suporte e melhoria; (iv) cumprimento de obrigações legais/regulatórias.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">2.3 Duração</h3>
                <p className="text-slate-700 dark:text-slate-300">Vigora durante o <strong>Prazo de Assinatura</strong> e, após o término, pelo período estritamente necessário a (i) devolução/eliminação (Seção 12) e (ii) cumprimento de obrigações legais.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">3</span>
              Tipos de Dados e Titulares
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">3.1 Dados Pessoais típicos</h3>
                <p className="text-slate-700 dark:text-slate-300">Identificadores (nome, e-mail, telefone), dados profissionais (CRECI, cargo), dados de lead e interação comercial, metadados técnicos (IP, user agent, logs), preferências, mídia (quando identificável), registros de comunicação.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">3.2 Titulares</h3>
                <p className="text-slate-700 dark:text-slate-300">Leads/consumidores, usuários do Cliente (funcionários/colaboradores), corretores e parceiros, proprietários/locatários, visitantes.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">3.3 Dados sensíveis</h3>
                <p className="text-slate-700 dark:text-slate-300">Não é finalidade da Stella tratar dados sensíveis; caso o Cliente os insira, o fará sob sua exclusiva responsabilidade e base legal, devendo configurar máscaras/controles no CRM e evitar coleta desnecessária.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">4</span>
              Instruções do Controlador
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">4.1 Instruções documentadas</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella tratará Dados Pessoais <strong>somente conforme instruções documentadas</strong> do Cliente (MSA, Order Form, configurações no produto, tickets de suporte).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">4.2 Incompatibilidade com LGPD</h3>
                <p className="text-slate-700 dark:text-slate-300">Se a Stella considerar uma instrução <strong>incompatível</strong> com a LGPD, notificará o Cliente antes de executar, salvo proibição legal.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">4.3 Obrigações legais</h3>
                <p className="text-slate-700 dark:text-slate-300">Quando legalmente obrigada a tratar dados de forma diversa (ex.: ordem de autoridade), a Stella informará o Cliente, exceto se a lei vedar.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">5</span>
              Confidencialidade e Pessoal Autorizado
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">A Stella assegura que pessoas autorizadas a tratar dados estão sujeitas a <strong>obrigações de confidencialidade</strong> e receberam <strong>treinamento</strong> adequado de privacidade e segurança.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">6</span>
              Segurança da Informação
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">6.1 Medidas técnicas e administrativas</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella manterá <strong>medidas técnicas e administrativas</strong> adequadas, considerando a natureza, o escopo e os riscos do tratamento, incluindo, entre outras, controle de acesso, registro de auditoria, criptografia em trânsito (e, quando aplicável, em repouso), segregação de ambientes, backups e gestão de vulnerabilidades, conforme <strong>Anexo II</strong>.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">6.2 Responsabilidades do Cliente</h3>
                <p className="text-slate-700 dark:text-slate-300">O Cliente é responsável por <strong>configurações</strong> sob seu controle (perfis, MFA, retenções, integrações, permissões) e pela segurança dos seus ambientes (rede/dispositivos).</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">7</span>
              Suboperadores
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">7.1 Autorização</h3>
                <p className="text-slate-700 dark:text-slate-300">O Cliente autoriza a Stella a engajar <strong>Suboperadores</strong> para suportar os Serviços, desde que submetidos a obrigações de proteção de dados <strong>não menos protetivas</strong> que as deste DPA.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">7.2 Lista e notificação</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella manterá lista atualizada de Suboperadores em <strong>[URL]</strong>, com possibilidade de <strong>notificação prévia</strong> de novas inclusões. O Cliente pode <strong>objetar</strong> por fundamento razoável de risco; as partes cooperarão para mitigar o risco ou buscar alternativa.</p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">8</span>
              Transferências Internacionais
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">8.1 Autorização</h3>
                <p className="text-slate-700 dark:text-slate-300">O Cliente autoriza transferências internacionais necessárias à prestação dos Serviços.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">8.2 Salvaguardas</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella implementará <strong>salvaguardas adequadas</strong> (cláusulas contratuais, medidas técnicas, avaliações de impacto), conforme a LGPD e orientações da <strong>ANPD</strong>, detalhadas no <strong>Anexo IV</strong>.</p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">9</span>
              Assistência ao Controlador
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">9.1 Direitos dos Titulares</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella assistirá o Cliente, <strong>na medida do possível</strong>, com ferramentas e informações para atender solicitações de titulares (acesso, correção, portabilidade, anonimização, eliminação, oposição, revisão de decisões automatizadas) dentro de prazos legais.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">9.2 Logs e registros</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella disponibilizará <strong>logs e registros</strong> relevantes para auditorias do Cliente na medida necessária e razoável (Seção 11).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">9.3 DPIA e consultas</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella auxiliará o Cliente em <strong>avaliações de impacto</strong> (DPIA) e consultas à ANPD quando relacionadas aos Serviços e ao tratamento sob responsabilidade da Stella.</p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">10</span>
              Notificação de Incidentes
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">10.1 Notificação à Stella</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella <strong>notificará sem demora injustificada</strong> o Cliente de incidente de segurança que possa acarretar risco ou dano relevante a titulares, fornecendo informações razoavelmente disponíveis (natureza, categorias de dados, titulares afetados, medidas adotadas/mitigação, contatos).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">10.2 Responsabilidade do Cliente</h3>
                <p className="text-slate-700 dark:text-slate-300">O Cliente é responsável por comunicações a titulares/ANPD quando atuar como Controlador, salvo disposição legal em contrário. A Stella apoiará com informações adicionais conforme evoluírem as investigações.</p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">11</span>
              Auditorias
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">11.1 Processo de auditoria</h3>
                <p className="text-slate-700 dark:text-slate-300">Mediante <strong>aviso prévio de 15 dias</strong>, o Cliente poderá auditar, uma vez por ano (ou em caso de incidente material), a conformidade da Stella com este DPA, por meio de: (i) relatórios de auditoria/atestados independentes (ex.: ISO/relatórios de segurança); e/ou (ii) auditoria razoável <strong>não intrusiva</strong> nas instalações/sistemas relevantes, sem acesso a segredos comerciais ou dados de outros clientes.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">11.2 Condições</h3>
                <p className="text-slate-700 dark:text-slate-300">Auditorias ocorrerão em horário comercial, sem interferir indevidamente na operação, e os custos são do Cliente, salvo achado material de não conformidade atribuível à Stella.</p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">12</span>
              Devolução e Eliminação de Dados
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">12.1 Término</h3>
                <p className="text-slate-700 dark:text-slate-300">Mediante solicitação do Cliente feita até <strong>30 dias</strong> após o término do contrato, a Stella disponibilizará <strong>exportação</strong> dos Dados Pessoais em formato comercialmente razoável.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">12.2 Eliminação</h3>
                <p className="text-slate-700 dark:text-slate-300">Após o prazo acima, a Stella <strong>eliminará</strong> ou <strong>anonimizará</strong> Dados Pessoais remanescentes em produção e rotinas de backup conforme políticas internas e obrigações legais, mantendo registros mínimos para defesa de direitos, prevenção a fraudes e cumprimento legal.</p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">13</span>
              Responsabilidades e Alocação de Riscos
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">13.1 Obrigações legais</h3>
                <p className="text-slate-700 dark:text-slate-300">Cada parte responde por suas <strong>obrigações legais</strong> sob a LGPD no papel que exerce (Controlador/Operadora).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">13.2 Limitação de responsabilidade</h3>
                <p className="text-slate-700 dark:text-slate-300">Salvo disposição legal inderrogável, a <strong>limitação de responsabilidade</strong> prevista no MSA aplica-se a este DPA.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">13.3 Responsabilidade do Cliente</h3>
                <p className="text-slate-700 dark:text-slate-300">A Stella não se responsabiliza por tratamentos realizados pelo Cliente <strong>fora</strong> das instruções/Serviços (ex.: integrações próprias, campos personalizados com dados sensíveis inseridos pelo Cliente).</p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">14</span>
              Comunicações
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-4">14.1 Contatos de privacidade</h3>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Stella (DPO/Encarregado):</strong> <strong>[NOME DO DPO] – [E-MAIL DO DPO]</strong></li>
                <li><strong>Cliente (ponto focal LGPD):</strong> <strong>[NOME] – [E-MAIL]</strong></li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">As partes manterão atualizados seus contatos para assuntos de proteção de dados.</p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">15</span>
              Disposições Gerais
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Em caso de conflito entre este DPA e o MSA, <strong>prevalecerá o DPA</strong> quanto a proteção de dados pessoais.</p>
              <p className="text-slate-700 dark:text-slate-300 mt-4">Este DPA é regido pela <strong>legislação brasileira</strong>; foro conforme o MSA.</p>
            </div>
          </section>

          {/* Annex I */}
          <section id="section-16" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">I</span>
              Anexo I — Descrição do Tratamento
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-6 rounded-r-lg">
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2">Categorias de titulares</h4>
                    <p className="text-slate-700 dark:text-slate-300">Leads/consumidores, usuários internos do Cliente, corretores, proprietários/locatários, visitantes.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2">Categorias de dados</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                      <li><strong>Identificação/contato:</strong> nome, e-mail, telefone, ID de usuário</li>
                      <li><strong>Profissionais:</strong> CRECI, empresa, cargo</li>
                      <li><strong>Comerciais:</strong> interesses de compra/locação, histórico de lead, interações no CRM</li>
                      <li><strong>Técnicos:</strong> IP, user agent, device IDs, cookies/telemetria</li>
                      <li><strong>Mídia:</strong> fotos, vídeos 2D e artefatos 3D (podendo conter dados pessoais incidentais)</li>
                      <li><strong>Comunicação:</strong> registros de e-mail/WhatsApp/telefonia (metadados e conteúdo)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2">Operações de tratamento</h4>
                    <p className="text-slate-700 dark:text-slate-300">Coleta, registro, organização, armazenamento, adaptação, recuperação, consulta, uso, transmissão, difusão (segundo configurações do Cliente), classificação, extração, correção, anonimização, eliminação.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-2">Finalidades</h4>
                    <p className="text-slate-700 dark:text-slate-300">Execução do contrato/Serviços, suporte, segurança, melhoria, conformidade legal.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Annex II */}
          <section id="section-17" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">II</span>
              Anexo II — Medidas Técnicas e Administrativas
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-6 rounded-r-lg">
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li><strong>Governança:</strong> políticas de segurança e privacidade; treinamento periódico; gestão de risco</li>
                  <li><strong>Controle de acesso:</strong> princípio do menor privilégio; MFA para acesso administrativo; segregação por papéis</li>
                  <li><strong>Criptografia:</strong> TLS 1.2+ em trânsito; criptografia em repouso quando aplicável (bancos de dados/armazenamento)</li>
                  <li><strong>Registro e monitoramento:</strong> logs de acesso e eventos; alertas; detecção de anomalias</li>
                  <li><strong>Gestão de vulnerabilidades:</strong> scans regulares; correções priorizadas por criticidade; testes de segurança</li>
                  <li><strong>Backups e continuidade:</strong> backups regulares; testes de restauração; objetivos RPO/RTO (vide SLA)</li>
                  <li><strong>Desenvolvimento seguro:</strong> revisão de código; SDLC com controles; segregação dev/test/prod</li>
                  <li><strong>Gestão de incidentes:</strong> runbooks e comunicação (vide Seção 10)</li>
                  <li><strong>Suboperadores:</strong> due diligence; contratos com cláusulas de proteção de dados; monitoramento periódico</li>
                  <li><strong>Privacidade por padrão:</strong> minimização, retenções configuráveis, masking onde cabível</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Annex III */}
          <section id="section-18" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">III</span>
              Anexo III — Suboperadores
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">(exemplos; substituir pelos reais)</p>
              <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-6 rounded-r-lg">
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li><strong>Provedores de nuvem e CDN:</strong> [ex.: AWS/Cloudflare] — hospedagem, rede, proteção</li>
                  <li><strong>Mensageria/Comunicação:</strong> [ex.: WhatsApp Business Provider, Twilio/telephony] — entrega de mensagens/voz</li>
                  <li><strong>Analytics/Experiência:</strong> [ex.: GA4, Hotjar/Clarity] — métricas e UX (se habilitados pelo Cliente)</li>
                  <li><strong>Pagamentos/Faturamento:</strong> [ex.: Stripe/Adyen/Asaas] — processamento de pagamentos e notas</li>
                  <li><strong>Suporte:</strong> [ex.: Zendesk/Intercom] — tickets e comunicações de suporte</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  A lista atualizada estará em <strong>[URL de Suboperadores]</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Annex IV */}
          <section id="section-19" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-200 dark:border-rose-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 text-white rounded-lg text-sm font-bold">IV</span>
              Anexo IV — Transferências Internacionais
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-4">Mecanismos aplicados</h3>
              <div className="bg-rose-50 dark:bg-rose-950/30 border-l-4 border-rose-500 p-6 rounded-r-lg">
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>Cláusulas contratuais e compromissos com Suboperadores</li>
                  <li>Medidas técnicas suplementares (criptografia, pseudonimização quando aplicável)</li>
                  <li>Avaliações de risco por país/provedor</li>
                  <li>Transparência ao Cliente via lista de Suboperadores e países de processamento</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-rose-500 to-red-500 dark:from-rose-600 dark:to-red-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Dúvidas sobre Proteção de Dados?
            </h2>
            <p className="text-white/90 mb-6">
              Para questões relacionadas a este DPA e proteção de dados pessoais:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>DPO/Encarregado: <strong>[NOME DO DPO] – [E-MAIL DO DPO]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
