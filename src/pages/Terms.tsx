import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-950 -mt-20 pt-20">
      {/* Hero Section */}
      <div className="container-padded py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header with Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/20 dark:border-blue-500/30 rounded-full">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Legal Agreement</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Termos de Uso
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
            <strong>Última atualização:</strong> 5 de novembro de 2025
          </p>

          {/* Introduction Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12">
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              Estes Termos de Uso ("Termos") regem o acesso e uso dos sites, aplicativos, ferramentas e serviços operados pela <strong>Stella Mary Lima Barbosa</strong>, CNPJ <strong>53.152.795/0001-10</strong>, com sede em <strong>[ENDEREÇO COMPLETO]</strong> ("Stella", "nós", "nosso" ou "conosco"). Ao acessar ou usar nossos serviços, você concorda com estes Termos e com nossa <Link to="/privacidade" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">Política de Privacidade</Link> e Política de Cookies.
            </p>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed mt-4">
              Se você usar a Stella em nome de uma empresa, você declara que está autorizado a vincular essa entidade e que essa entidade aceita estes Termos.
            </p>
          </div>

          {/* Consumer Note */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-12">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Nota para Consumidores (Brasil)</h3>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                  Nada nestes Termos limita os direitos concedidos aos consumidores sob o <strong>Código de Defesa do Consumidor (CDC)</strong>. Para consumidores, aplicam-se as regras de jurisdição do CDC.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Índice
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: 1, title: 'Definições' },
                { num: 2, title: 'Elegibilidade e Tipos de Conta' },
                { num: 3, title: 'Verificação de Status Profissional (CRECI)' },
                { num: 4, title: 'Seu Conteúdo e Licenças' },
                { num: 5, title: 'Listagens, Precisão e Regras do Setor' },
                { num: 6, title: 'Envio e Compartilhamento de Leads' },
                { num: 7, title: 'Uso Aceitável' },
                { num: 8, title: 'Captura de Mídia, Processamento 3D e Segurança' },
                { num: 9, title: 'Serviços e Integrações de Terceiros' },
                { num: 10, title: 'Comunicações; Preferências de Marketing' },
                { num: 11, title: 'Taxas e Serviços Pagos' },
                { num: 12, title: 'Propriedade Intelectual' },
                { num: 13, title: 'Notificação e Remoção (Relatar Infrações)' },
                { num: 14, title: 'Privacidade' },
                { num: 15, title: 'Serviços Beta' },
                { num: 16, title: 'Isenções de Responsabilidade' },
                { num: 17, title: 'Limitação de Responsabilidade' },
                { num: 18, title: 'Indenização' },
                { num: 19, title: 'Suspensão e Rescisão' },
                { num: 20, title: 'Alterações aos Serviços e a estes Termos' },
                { num: 21, title: 'Lei Aplicável e Foro' },
                { num: 22, title: 'Cessão' },
                { num: 23, title: 'Acordo Integral; Ausência de Renúncia; Separabilidade' },
                { num: 24, title: 'Idioma' },
                { num: 25, title: 'Contato' },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {item.num}
                  </div>
                  <span className="text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm font-medium">
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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Definições</h2>
              </div>
              
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong>Serviços:</strong> O ecossistema Stella incluindo o site institucional, construtor de sites, CRM Constellation, recursos de automação, formulários de leads, captura e processamento de mídia (por exemplo, conversão de vídeo 2D em tours 3D) e APIs ou integrações relacionadas.</li>
                <li><strong>Usuário:</strong> Qualquer pessoa que visita, registra-se ou usa os Serviços.</li>
                <li><strong>Usuário Profissional:</strong> Profissionais imobiliários licenciados (por exemplo, corretores/agentes com <strong>CRECI</strong>) e empresas (imobiliárias, administradoras de imóveis, incorporadoras) e seus funcionários/contratados.</li>
                <li><strong>Conta Empresarial:</strong> Uma conta administrada por uma entidade legal (por exemplo, imobiliária ou incorporadora).</li>
                <li><strong>Conteúdo:</strong> Qualquer informação, dados, texto, imagens, vídeo, áudio, plantas baixas, tours 3D, feedback ou materiais carregados, publicados, enviados ou de outra forma fornecidos através dos Serviços.</li>
                <li><strong>Conteúdo Gerado pelo Usuário (UGC):</strong> Conteúdo fornecido pelos Usuários, incluindo materiais de listagem e mídia.</li>
                <li><strong>Serviços Beta:</strong> Recursos de pré-lançamento ou teste identificados como "Beta", "Preview" ou similar.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Elegibilidade e Tipos de Conta</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você deve ter <strong>18 anos ou mais</strong> para usar os Serviços. Certos recursos (listagem, CRM, construtor de sites) requerem uma <strong>conta registrada</strong> e, para Usuários Profissionais, validação do <strong>CRECI</strong> e/ou um <strong>código de convite do empregador</strong>.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Os tipos de conta podem incluir: (a) visitante; (b) usuário final/varejo (comprador, locatário, proprietário); (c) Usuário Profissional (corretor/agente individual); (d) administradores de Conta Empresarial (imobiliária/incorporadora); (e) funcionários da empresa via código de convite. Você concorda em fornecer informações precisas e mantê-las atualizadas.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades em sua conta. Use senhas fortes; habilite a autenticação multifator quando disponível.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Verificação de Status Profissional (CRECI)</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Para desbloquear recursos profissionais (por exemplo, publicar listagens, acessar o construtor de sites, CRM avançado), podemos solicitar e verificar seu <strong>CRECI</strong> ou outras credenciais com conselhos competentes ou fontes públicas. Podemos negar ou revogar o acesso se a verificação falhar ou se suspeitarmos de uso indevido.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Seu Conteúdo e Licenças</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4.1 Você possui seu conteúdo</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Exceto pelo material que fornecemos, <strong>você mantém a propriedade</strong> do UGC que você envia aos Serviços.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4.2 Licença que você concede à Stella</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Para operar e melhorar os Serviços, você concede à Stella uma <strong>licença não exclusiva, mundial, livre de royalties, transferível e sublicenciável</strong> para <strong>hospedar, armazenar, reproduzir, processar, adaptar, publicar, executar, exibir e distribuir</strong> seu UGC <strong>apenas</strong> para:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 mt-4">
                <li>fornecer, manter e melhorar os Serviços (incluindo converter vídeo 2D em <strong>tours 3D</strong>, gerar miniaturas/renderizações, otimizar mídia, entrega de conteúdo e pesquisa/indexação);</li>
                <li>operar recursos como páginas de listagem, compartilhamento de leads com anunciantes, sites de empresas construídos na Stella e visualizações públicas/incorporadas que você habilita;</li>
                <li>cumprir obrigações legais e fazer cumprir políticas.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Esta licença dura enquanto o conteúdo estiver disponível nos Serviços e <strong>por um período razoável depois</strong> para permitir cache técnico, backups ou retenção de registros necessária.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4.3 Exibições de marketing para suas próprias listagens</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Se você habilitar recursos promocionais para uma listagem, você autoriza a Stella a <strong>exibir, promover ou destacar</strong> a listagem e sua mídia dentro das superfícies da Stella (por exemplo, páginas de categoria, newsletters) conforme configurado por você/empresa.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4.4 Nome, imagem e semelhança; direitos de propriedade e de terceiros</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você deve ter todos os direitos e <strong>consentimentos</strong> necessários (por exemplo, direitos de imagem/voz de pessoas que aparecem, permissões de acesso à propriedade, uso de marcas/logos) para qualquer conteúdo que você enviar. Não carregue conteúdo que revele dados pessoais de terceiros sem uma base legal.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4.5 Direitos morais</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Na medida permitida por lei, você <strong>consente</strong> com edições/transformações técnicas (por exemplo, compressão, transcodificação, reconstrução 3D) necessárias para fornecer os Serviços. Nada neste documento renuncia a direitos morais irrenunciáveis sob a lei brasileira.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  5
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Listagens, Precisão e Regras do Setor</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Usuários Profissionais e Empresas são <strong>responsáveis</strong> pela precisão e legalidade das listagens (endereço, metragem, preço, disponibilidade, fotos/vídeos, plantas baixas, status de "lançamento", etc.). Inclua divulgações obrigatórias e respeite as regras de publicidade do <strong>COFECI/CRECI</strong> e requisitos da lei do consumidor (por exemplo, "imagens meramente ilustrativas" onde aplicável). Você deve atualizar ou remover prontamente o conteúdo que se torne impreciso.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                A Stella <strong>não é parte</strong> de qualquer transação imobiliária e não garante preço, disponibilidade, financiamento ou fechamento. Ferramentas como pontuações, recomendações ou estimativas são <strong>ilustrativas</strong> e não uma avaliação, conselho financeiro ou jurídico.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  6
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Envio e Compartilhamento de Leads</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Quando um usuário final envia um <strong>lead</strong> (por exemplo, formulário de interesse, botão de contato, clique no WhatsApp), você autoriza a Stella a <strong>compartilhar os dados do lead</strong> com o anunciante relevante (Usuário Profissional/Empresa) para acompanhamento. Os anunciantes devem respeitar as leis aplicáveis (consumidor, privacidade, regras anti-spam/WhatsApp Business) e honrar solicitações de cancelamento.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  7
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Uso Aceitável</h2>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Você concorda em NÃO:
                </h3>
                <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                  <li>• violar leis, direitos de terceiros (incluindo PI, privacidade, publicidade) ou regras de conselhos;</li>
                  <li>• carregar conteúdo ilegal, difamatório, odioso, pornográfico, explorador ou inapropriado;</li>
                  <li>• <strong>raspar</strong>, coletar ou usar meios automatizados sem autorização por escrito;</li>
                  <li>• tentar fazer <strong>engenharia reversa</strong>, contornar controles de acesso ou interferir com a segurança;</li>
                  <li>• enviar <strong>spam</strong> ou marketing não solicitado; enviar mensagens em massa para leads sem consentimento adequado;</li>
                  <li>• capturar mídia em espaços privados sem autorização; ou capturar dados sensíveis de terceiros;</li>
                  <li>• usar indevidamente códigos de convite ou se passar por outros.</li>
                </ul>
                <p className="text-orange-800 dark:text-orange-200 mt-4">
                  Podemos remover conteúdo ou suspender contas por violações.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  8
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Captura de Mídia, Processamento 3D e Segurança</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Recursos que convertem <strong>vídeo 2D em tours 3D</strong> são fornecidos em uma base <strong>como estão</strong> e podem conter artefatos. Você deve seguir as instruções do proprietário do imóvel, cumprir as regras de segurança e evitar áreas que apresentem risco. Não confie em saídas 3D para decisões estruturais, de engenharia ou de segurança.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  9
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Serviços e Integrações de Terceiros</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Os Serviços podem incluir componentes de terceiros (por exemplo, mapas, análises, WhatsApp Business, telefonia, gateways de pagamento). O uso desses componentes pode estar sujeito a termos e políticas de terceiros. A Stella não é responsável por serviços de terceiros e não controla sua disponibilidade.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  10
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Comunicações; Preferências de Marketing</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Podemos enviar comunicações <strong>transacionais</strong> (sistema, segurança, faturamento, alterações nos Termos/Políticas).
                Comunicações de marketing (e-mail, chamadas, WhatsApp) seguirão suas preferências e requisitos legais; você pode <strong>cancelar</strong> a qualquer momento (sujeito a restrições de canal). Algumas mensagens operacionais são necessárias para os Serviços.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  11
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Taxas e Serviços Pagos</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Alguns recursos são pagos. Preços, planos e limites são descritos na compra ou em um <strong>Formulário de Pedido</strong>. Salvo indicação em contrário, as taxas são <strong>não reembolsáveis</strong> uma vez iniciado o período de faturamento. Impostos e retenções são de sua responsabilidade, a menos que declaremos o contrário.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Para Contas Empresariais, termos comerciais adicionais podem ser regidos por um <strong>Contrato Mestre de Assinatura (MSA)</strong>. Se houver conflito entre estes Termos e um MSA executado, o MSA prevalece para os produtos assinados.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Podemos suspender ou limitar os Serviços por taxas não pagas.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  12
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Propriedade Intelectual</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Os Serviços, incluindo software, design e marcas, são de propriedade da Stella ou de seus licenciadores e são protegidos por lei. Exceto pelos direitos limitados expressamente concedidos, nós <strong>reservamos todos os direitos</strong>. Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte dos Serviços.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Se fornecermos software/SDKs, você recebe uma <strong>licença limitada, revogável, intransferível</strong> para usá-los apenas para acessar os Serviços de acordo com estes Termos.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                <strong>Feedback:</strong> Se você fornecer ideias ou sugestões, você concede à Stella uma <strong>licença perpétua, irrevogável, mundial, livre de royalties</strong> para usá-las sem restrição.
              </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  13
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Notificação e Remoção (Relatar Infrações)</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Se você acredita que o conteúdo viola direitos ou a lei, envie uma notificação para <strong>[E-MAIL DE CONTATO JURÍDICO/ABUSO]</strong> com:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 mt-4">
                <li>• identificação do conteúdo e sua localização (URL),</li>
                <li>• base da reclamação e evidências de apoio,</li>
                <li>• suas informações de contato, e</li>
                <li>• uma declaração de que sua notificação é precisa.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Podemos notificar o uploader e, quando apropriado, remover ou restringir o conteúdo. Notificações falsas ou abusivas podem resultar em responsabilidade.
              </p>
            </section>

            {/* Section 14 */}
            <section id="section-14" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  14
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Privacidade</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Nossa <Link to="/privacidade" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium">Política de Privacidade</Link> explica como coletamos e processamos dados pessoais, incluindo para compartilhamento de leads e processamento de mídia. A <strong>Política de Cookies</strong> explica o uso e as escolhas de cookies.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  15
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Serviços Beta</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Serviços Beta são fornecidos <strong>"como estão"</strong>, podem ser instáveis e podem mudar ou terminar a qualquer momento. O uso pode estar sujeito a termos adicionais. Não use Betas para fluxos de trabalho críticos de produção.
              </p>
            </section>

            {/* Section 16 */}
            <section id="section-16" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  16
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Isenções de Responsabilidade</h2>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  Os Serviços são fornecidos <strong>"como estão"</strong> e <strong>"conforme disponíveis"</strong>. Na medida máxima permitida por lei, renunciamos a todas as garantias, expressas ou implícitas, incluindo comercialização, adequação a uma finalidade específica e não violação. Não garantimos operação ininterrupta ou sem erros ou a precisão de listagens ou saídas (incluindo reconstruções 3D ou sugestões).
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section id="section-17" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  17
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Limitação de Responsabilidade</h2>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Na medida mais ampla permitida por lei, a Stella <strong>não será responsável</strong> por danos indiretos, incidentais, especiais, consequenciais, exemplares ou punitivos, perda de lucros, dados, boa vontade ou interrupção de negócios.
                </p>
                
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                  Exceto por valores que a lei não permite limitar (por exemplo, certos direitos do consumidor), nossa responsabilidade agregada decorrente de ou relacionada aos Serviços não excederá o <strong>maior de</strong>: (a) os valores que você nos pagou pelos Serviços nos <strong>12 meses</strong> anteriores ao evento que deu origem à reclamação; ou (b) <strong>R$ [VALOR]</strong>. Limites diferentes podem se aplicar sob um MSA executado.
                </p>
                
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 font-medium">
                  As proteções ao consumidor sob o CDC prevalecem se e na medida aplicáveis.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section id="section-18" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  18
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Indenização</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você <strong>indenizará e isentará a Stella e suas afiliadas de responsabilidade</strong> por reclamações, danos, perdas, responsabilidades, custos e despesas (incluindo honorários advocatícios razoáveis) decorrentes de ou relacionados a: (a) seu Conteúdo; (b) sua violação destes Termos ou da lei; ou (c) suas interações e transações com terceiros (incluindo clientes finais).
              </p>
            </section>

            {/* Section 19 */}
            <section id="section-19" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  19
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Suspensão e Rescisão</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você pode parar de usar os Serviços a qualquer momento e solicitar a exclusão da conta sujeita à retenção legal/contratual. Podemos suspender ou encerrar o acesso se você violar estes Termos, deixar de pagar taxas ou se exigido por lei ou risco.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                Após a rescisão, as Seções que por natureza devem sobreviver (por exemplo, 4, 6, 10–18, 21) <strong>sobreviverão</strong>.
              </p>
            </section>

            {/* Section 20 */}
            <section id="section-20" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  20
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Alterações aos Serviços e a estes Termos</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Podemos modificar os Serviços ou estes Termos para refletir mudanças legais, técnicas ou comerciais. Quando fizermos alterações materiais, forneceremos notificação (por exemplo, e-mail ou no produto). O uso continuado após as alterações entrarem em vigor constitui aceitação.
              </p>
            </section>

            {/* Section 21 */}
            <section id="section-21" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  21
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Lei Aplicável e Foro</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Estes Termos são regidos pela <strong>lei brasileira</strong>.
              </p>
              
              <ul className="space-y-3 text-slate-700 dark:text-slate-300 mt-4">
                <li>• Para <strong>consumidores</strong>, o foro será o tribunal do domicílio do consumidor, conforme previsto pelo CDC.</li>
                <li>• Para <strong>Usuários não consumidores</strong> (por exemplo, empresas), as partes elegem a <strong>Comarca de São Paulo, Capital</strong>, como foro exclusivo, com exclusão de qualquer outro, por mais privilegiado que seja.</li>
              </ul>
            </section>

            {/* Section 22 */}
            <section id="section-22" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  22
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Cessão</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Você não pode ceder ou transferir estes Termos sem nosso consentimento prévio por escrito. Podemos ceder estes Termos (por exemplo, em uma fusão, aquisição ou reorganização corporativa).
              </p>
            </section>

            {/* Section 23 */}
            <section id="section-23" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  23
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Acordo Integral; Ausência de Renúncia; Separabilidade</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Estes Termos, juntamente com qualquer Formulário de Pedido, MSA, Política de Privacidade e Política de Cookies aplicáveis, constituem o acordo integral entre você e a Stella em relação aos Serviços. A falha em fazer cumprir uma disposição não é uma renúncia. Se alguma disposição for considerada inexequível, o restante permanece em vigor.
              </p>
            </section>

            {/* Section 24 */}
            <section id="section-24" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  24
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Idioma</h2>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Se estes Termos forem fornecidos em <strong>Português e Inglês</strong>, a <strong>versão em Português</strong> prevalecerá para Usuários no Brasil.
              </p>
            </section>

            {/* Section 25 - Contact */}
            <section id="section-25" className="scroll-mt-20 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  25
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white m-0">Contato</h2>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white"><strong>Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">Suporte/Jurídico: <strong>[E-MAIL]</strong></p>
                      <p className="text-slate-700 dark:text-slate-200 mt-1">DPO/Privacidade: <strong>[NOME DO DPO] – [E-MAIL DO DPO]</strong></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <div>
                      <p className="text-slate-700 dark:text-slate-200">
                        Relatar Infrações: <strong>[E-MAIL DE CONTATO JURÍDICO/ABUSO]</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Dúvidas sobre os Termos?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nossa equipe jurídica está disponível para esclarecer qualquer questão relacionada aos nossos Termos de Uso.
            </p>
            <a
              href="mailto:[E-MAIL]"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Entrar em Contato
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
