import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Privacy() {
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')
  const isEs = i18n.language?.startsWith('es')
  
  // Multi-language content
  const content = {
    badge: isPt ? 'LGPD Compliant' : isEs ? 'Cumple LGPD' : 'LGPD Compliant',
    title: isPt ? 'Política de Privacidade' : isEs ? 'Política de Privacidad' : 'Privacy Policy',
    lastUpdated: isPt ? 'Última atualização: 5 de novembro de 2025' : isEs ? 'Última actualización: 5 de noviembre de 2025' : 'Last updated: November 5, 2025',
    toc: isPt ? 'Índice' : isEs ? 'Índice' : 'Table of Contents',
    sections: [
      { 
        num: 1, 
        title: isPt ? 'A quem se aplica' : isEs ? 'A quién se aplica' : 'Who this applies to'
      },
      { 
        num: 2, 
        title: isPt ? 'Controlador e Encarregado (DPO)' : isEs ? 'Controlador y Encargado (DPO)' : 'Controller and Data Protection Officer (DPO)'
      },
      { 
        num: 3, 
        title: isPt ? 'Quais dados pessoais coletamos' : isEs ? 'Qué datos personales recopilamos' : 'What personal data we collect'
      },
      { 
        num: 4, 
        title: isPt ? 'Para que usamos seus dados' : isEs ? 'Para qué usamos sus datos' : 'How we use your data'
      },
      { 
        num: 5, 
        title: isPt ? 'Tomada de decisão automatizada' : isEs ? 'Toma de decisiones automatizada' : 'Automated decision-making'
      },
      { 
        num: 6, 
        title: isPt ? 'Compartilhamento de dados' : isEs ? 'Compartir datos' : 'Data sharing'
      },
      { 
        num: 7, 
        title: isPt ? 'Transferências internacionais' : isEs ? 'Transferencias internacionales' : 'International transfers'
      },
      { 
        num: 8, 
        title: isPt ? 'Retenção e critérios' : isEs ? 'Retención y criterios' : 'Retention and criteria'
      },
      { 
        num: 9, 
        title: isPt ? 'Segurança da informação' : isEs ? 'Seguridad de la información' : 'Information security'
      },
      { 
        num: 10, 
        title: isPt ? 'Cookies e preferências' : isEs ? 'Cookies y preferencias' : 'Cookies and preferences'
      },
      { 
        num: 11, 
        title: isPt ? 'Direitos dos titulares' : isEs ? 'Derechos de los titulares' : 'Data subject rights'
      },
      { 
        num: 12, 
        title: isPt ? 'Responsabilidades do usuário' : isEs ? 'Responsabilidades del usuario' : 'User responsibilities'
      },
      { 
        num: 13, 
        title: isPt ? 'Crianças e adolescentes' : isEs ? 'Niños y adolescentes' : 'Children and minors'
      },
      { 
        num: 14, 
        title: isPt ? 'Links de terceiros' : isEs ? 'Enlaces de terceros' : 'Third-party links'
      },
      { 
        num: 15, 
        title: isPt ? 'Alterações desta Política' : isEs ? 'Cambios a esta Política' : 'Changes to this Policy'
      },
      { 
        num: 16, 
        title: isPt ? 'Contato' : isEs ? 'Contacto' : 'Contact'
      },
      { 
        num: 17, 
        title: isPt ? 'Resumo para usuários finais' : isEs ? 'Resumen para usuarios finales' : 'Summary for end users'
      },
    ],
  }
  
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-950 -mt-20 pt-20">
        <div className="container-padded py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {content.badge}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {content.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {content.lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container-padded py-16 max-w-5xl mx-auto">
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 mb-12 border border-blue-200/50 dark:border-blue-800/30">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-0">
              {isPt 
                ? <>Esta Política de Privacidade explica como a <strong>Stella Mary Lima Barbosa</strong>, inscrita no CNPJ sob o nº <strong>53.152.795/0001-10</strong>, com sede em <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>", "<strong>nós</strong>" ou "<strong>nosso</strong>"), coleta, usa, compartilha e protege dados pessoais no ecossistema Stella — que inclui o site institucional, o construtor de sites, o CRM <strong>Constellation</strong>, ferramentas de automação, aplicativos, integrações e os recursos de captura e processamento de mídia (por exemplo, conversão de vídeos 2D em mapas 3D dos imóveis).</>
                : isEs
                ? <>Esta Política de Privacidad explica cómo <strong>Stella Mary Lima Barbosa</strong>, inscrita en el CNPJ bajo el nº <strong>53.152.795/0001-10</strong>, con sede en <strong>[DIRECCIÓN COMPLETA]</strong> ("<strong>Stella</strong>", "<strong>nosotros</strong>" o "<strong>nuestro</strong>"), recopila, utiliza, comparte y protege datos personales en el ecosistema Stella — que incluye el sitio institucional, el constructor de sitios, el CRM <strong>Constellation</strong>, herramientas de automatización, aplicaciones, integraciones y los recursos de captura y procesamiento de medios (por ejemplo, conversión de videos 2D en mapas 3D de propiedades).</>
                : <>This Privacy Policy explains how <strong>Stella Mary Lima Barbosa</strong>, registered under CNPJ <strong>53.152.795/0001-10</strong>, headquartered at <strong>[FULL ADDRESS]</strong> ("<strong>Stella</strong>", "<strong>we</strong>" or "<strong>our</strong>"), collects, uses, shares and protects personal data in the Stella ecosystem — which includes the institutional website, site builder, <strong>Constellation</strong> CRM, automation tools, applications, integrations and media capture and processing features (e.g., converting 2D videos into 3D property maps).</>
              }
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 mb-0">
              {isPt
                ? <>Esta política foi elaborada em conformidade com a <strong>Lei Geral de Proteção de Dados – LGPD (Lei nº 13.709/2018)</strong>, o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong> e demais normas aplicáveis.</>
                : isEs
                ? <>Esta política fue elaborada en conformidad con la <strong>Ley General de Protección de Datos – LGPD (Ley nº 13.709/2018)</strong>, el <strong>Marco Civil de Internet (Ley nº 12.965/2014)</strong> y demás normas aplicables.</>
                : <>This policy was prepared in compliance with the <strong>General Data Protection Law – LGPD (Law No. 13,709/2018)</strong>, the <strong>Brazilian Internet Civil Framework (Law No. 12,965/2014)</strong> and other applicable regulations.</>
              }
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 mb-0 font-semibold">
              {isPt
                ? 'Ao usar nossos serviços, você declara ter lido e compreendido esta Política.'
                : isEs
                ? 'Al usar nuestros servicios, usted declara haber leído y comprendido esta Política.'
                : 'By using our services, you declare that you have read and understood this Policy.'
              }
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 mb-12 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0 mb-6">{content.toc}</h2>
            <nav className="grid md:grid-cols-2 gap-3">
              {content.sections.map((item) => (
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
              {content.sections[0].title}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>{isPt ? <><strong>Visitantes</strong> dos nossos sites.</> : isEs ? <><strong>Visitantes</strong> de nuestros sitios.</> : <><strong>Visitors</strong> to our websites.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>{isPt ? <><strong>Usuários finais (varejo)</strong>: compradores, locatários e proprietários que interagem com anúncios e formulários.</> : isEs ? <><strong>Usuarios finales (minoristas)</strong>: compradores, inquilinos y propietarios que interactúan con anuncios y formularios.</> : <><strong>End users (retail)</strong>: buyers, renters and property owners who interact with listings and forms.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>{isPt ? <><strong>Profissionais do setor</strong>: corretores(as) autônomos(as), imobiliárias, incorporadoras/construtoras, administradores(as) de locação e gestores(as) de curta temporada.</> : isEs ? <><strong>Profesionales del sector</strong>: corredores autónomos, inmobiliarias, desarrolladores/constructoras, administradores de alquiler y gestores de corto plazo.</> : <><strong>Industry professionals</strong>: independent brokers, real estate agencies, developers/builders, rental managers and short-term property managers.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                <span>{isPt ? <><strong>Funcionários(as) e colaboradores(as)</strong> de empresas clientes que usam nossos produtos (ex.: CRM Constellation), inclusive os convidados via <strong>código de convite</strong>.</> : isEs ? <><strong>Empleados y colaboradores</strong> de empresas clientes que usan nuestros productos (ej.: CRM Constellation), incluidos los invitados vía <strong>código de invitación</strong>.</> : <><strong>Employees and collaborators</strong> of client companies using our products (e.g., Constellation CRM), including those invited via <strong>invitation code</strong>.</>}</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div id="section-2" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">2</span>
              {content.sections[1].title}
            </h2>
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-950/20 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3 mb-0">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>{isPt ? <><strong>Controlador:</strong> Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10.</> : isEs ? <><strong>Controlador:</strong> Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10.</> : <><strong>Controller:</strong> Stella Mary Lima Barbosa – CNPJ 53.152.795/0001-10.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>{isPt ? <><strong>Encarregado(a)/DPO:</strong> <strong>[NOME DO DPO]</strong> – <strong>[E-MAIL DO DPO]</strong>.</> : isEs ? <><strong>Encargado/DPO:</strong> <strong>[NOMBRE DEL DPO]</strong> – <strong>[EMAIL DEL DPO]</strong>.</> : <><strong>Data Protection Officer (DPO):</strong> <strong>[DPO NAME]</strong> – <strong>[DPO EMAIL]</strong>.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                  <span>{isPt ? <>Canal para solicitações de titulares: <strong>[E-MAIL DO DPO]</strong> ou <strong>[FORMULÁRIO/URL]</strong>.</> : isEs ? <>Canal para solicitudes de titulares: <strong>[EMAIL DEL DPO]</strong> o <strong>[FORMULARIO/URL]</strong>.</> : <>Channel for data subject requests: <strong>[DPO EMAIL]</strong> or <strong>[FORM/URL]</strong>.</>}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div id="section-3" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">3</span>
              {content.sections[2].title}
            </h2>
            
            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              {isPt ? '3.1. Dados fornecidos por você' : isEs ? '3.1. Datos proporcionados por usted' : '3.1. Data you provide'}
            </h3>
            <ul className="space-y-2">
              <li>{isPt ? <><strong>Cadastro e identidade:</strong> nome completo, e-mail, telefone, CPF (quando necessário), senha (hash), data de nascimento (quando necessário), idioma e fuso horário.</> : isEs ? <><strong>Registro e identidad:</strong> nombre completo, correo electrónico, teléfono, CPF (cuando sea necesario), contraseña (hash), fecha de nacimiento (cuando sea necesario), idioma y zona horaria.</> : <><strong>Registration and identity:</strong> full name, email, phone, CPF (when required), password (hash), date of birth (when required), language and timezone.</>}</li>
              <li>{isPt ? <><strong>Perfil profissional:</strong> <strong>CRECI</strong>, cargo/função, empresa, site, área de atuação, carteiras e preferências.</> : isEs ? <><strong>Perfil profesional:</strong> <strong>CRECI</strong>, cargo/función, empresa, sitio web, área de actuación, carteras y preferencias.</> : <><strong>Professional profile:</strong> <strong>CRECI</strong>, position/role, company, website, area of activity, portfolios and preferences.</>}</li>
              <li>{isPt ? <><strong>Dados comerciais de anúncios e imóveis:</strong> endereços, características do imóvel, preços, documentação, disponibilidade, mídia (fotos, vídeos, plantas), tour 3D, descrições e rótulos.</> : isEs ? <><strong>Datos comerciales de anuncios y propiedades:</strong> direcciones, características de la propiedad, precios, documentación, disponibilidad, medios (fotos, videos, planos), tour 3D, descripciones y etiquetas.</> : <><strong>Commercial listing and property data:</strong> addresses, property characteristics, prices, documentation, availability, media (photos, videos, floor plans), 3D tour, descriptions and labels.</>}</li>
              <li>{isPt ? <><strong>Conteúdo enviado:</strong> mensagens, comentários, campos livres, arquivos, vídeos 2D e outros materiais que podem conter dados de terceiros (você é responsável por obter as autorizações necessárias).</> : isEs ? <><strong>Contenido enviado:</strong> mensajes, comentarios, campos libres, archivos, videos 2D y otros materiales que pueden contener datos de terceros (usted es responsable de obtener las autorizaciones necesarias).</> : <><strong>Submitted content:</strong> messages, comments, free-form fields, files, 2D videos and other materials that may contain third-party data (you are responsible for obtaining necessary authorizations).</>}</li>
              <li>{isPt ? <><strong>Formulários de interesse/contato:</strong> intenção de compra/locação, faixas de preço, bairros, prazos, informações de financiamento, preferências.</> : isEs ? <><strong>Formularios de interés/contacto:</strong> intención de compra/alquiler, rangos de precio, barrios, plazos, información de financiamiento, preferencias.</> : <><strong>Interest/contact forms:</strong> purchase/rental intent, price ranges, neighborhoods, timelines, financing information, preferences.</>}</li>
            </ul>

            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              {isPt ? '3.2. Dados coletados automaticamente' : isEs ? '3.2. Datos recopilados automáticamente' : '3.2. Automatically collected data'}
            </h3>
            <ul className="space-y-2">
              <li>{isPt ? <><strong>Dados de uso e log:</strong> IP, identificadores de dispositivo, sistema e navegador, páginas acessadas, datas/horas, duração de sessão, origem de tráfego, performance, erros.</> : isEs ? <><strong>Datos de uso y registro:</strong> IP, identificadores de dispositivo, sistema y navegador, páginas visitadas, fechas/horas, duración de sesión, origen de tráfico, rendimiento, errores.</> : <><strong>Usage and log data:</strong> IP, device identifiers, system and browser, pages accessed, dates/times, session duration, traffic source, performance, errors.</>}</li>
              <li>{isPt ? <><strong>Cookies e tecnologias similares:</strong> pixels, local storage e identificadores (veja a Seção 10).</> : isEs ? <><strong>Cookies y tecnologías similares:</strong> píxeles, almacenamiento local e identificadores (ver Sección 10).</> : <><strong>Cookies and similar technologies:</strong> pixels, local storage and identifiers (see Section 10).</>}</li>
              <li>{isPt ? <><strong>Geolocalização aproximada</strong> (derivada de IP) e, se você autorizar, localização precisa do dispositivo.</> : isEs ? <><strong>Geolocalización aproximada</strong> (derivada de IP) y, si usted lo autoriza, ubicación precisa del dispositivo.</> : <><strong>Approximate geolocation</strong> (derived from IP) and, if you authorize, precise device location.</>}</li>
            </ul>

            <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-8 mb-4">
              {isPt ? '3.3. Dados de terceiros e integrações (quando habilitadas)' : isEs ? '3.3. Datos de terceros e integraciones (cuando estén habilitadas)' : '3.3. Third-party data and integrations (when enabled)'}
            </h3>
            <ul className="space-y-2">
              <li>{isPt ? <><strong>Plataformas de anúncios e redes sociais</strong> (ex.: Google, Meta) para mensuração e remarketing.</> : isEs ? <><strong>Plataformas de anuncios y redes sociales</strong> (ej.: Google, Meta) para medición y remarketing.</> : <><strong>Advertising platforms and social networks</strong> (e.g., Google, Meta) for measurement and remarketing.</>}</li>
              <li>{isPt ? <><strong>Integrações de comunicação</strong> (ex.: e-mail, WhatsApp Business, telefonia/softphone) — contatos, histórico de conversas e metadados.</> : isEs ? <><strong>Integraciones de comunicación</strong> (ej.: correo electrónico, WhatsApp Business, telefonía/softphone) — contactos, historial de conversaciones y metadatos.</> : <><strong>Communication integrations</strong> (e.g., email, WhatsApp Business, telephony/softphone) — contacts, conversation history and metadata.</>}</li>
              <li>{isPt ? <><strong>Pagamentos e faturamento</strong> (ex.: gateways, notas fiscais) — dados transacionais (não armazenamos dados completos de cartão).</> : isEs ? <><strong>Pagos y facturación</strong> (ej.: pasarelas, facturas) — datos transaccionales (no almacenamos datos completos de tarjeta).</> : <><strong>Payments and billing</strong> (e.g., gateways, invoices) — transactional data (we do not store complete card data).</>}</li>
              <li>{isPt ? <><strong>Dados públicos</strong> e de parceiros do mercado imobiliário (ex.: verificação de <strong>CRECI</strong>, dados cadastrais públicos, bases de CEP e mapas).</> : isEs ? <><strong>Datos públicos</strong> y de socios del mercado inmobiliario (ej.: verificación de <strong>CRECI</strong>, datos catastrales públicos, bases de código postal y mapas).</> : <><strong>Public data</strong> and real estate market partner data (e.g., <strong>CRECI</strong> verification, public registry data, postal code databases and maps).</>}</li>
            </ul>

            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 mt-6 rounded">
              <p className="text-sm text-amber-900 dark:text-amber-200 mb-0">
                {isPt 
                  ? <><strong>Dados sensíveis:</strong> não solicitamos dados sensíveis (saúde, biometria etc.). Se enviados por você no conteúdo, trataremos conforme a LGPD, limitando o uso e adotando medidas de proteção.</>
                  : isEs
                  ? <><strong>Datos sensibles:</strong> no solicitamos datos sensibles (salud, biometría, etc.). Si son enviados por usted en el contenido, los trataremos conforme a la LGPD, limitando el uso y adoptando medidas de protección.</>
                  : <><strong>Sensitive data:</strong> we do not request sensitive data (health, biometrics, etc.). If submitted by you in content, we will process it in accordance with LGPD, limiting use and adopting protective measures.</>
                }
              </p>
            </div>
          </div>

          {/* Section 4 - Table */}
          <div id="section-4" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">4</span>
              {content.sections[3].title}
            </h2>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full border-collapse bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="text-left p-4 font-semibold">{isPt ? 'Finalidade' : isEs ? 'Finalidad' : 'Purpose'}</th>
                    <th className="text-left p-4 font-semibold">{isPt ? 'Exemplos' : isEs ? 'Ejemplos' : 'Examples'}</th>
                    <th className="text-left p-4 font-semibold">{isPt ? 'Base(s) legal(is)' : isEs ? 'Base(s) legal(es)' : 'Legal basis'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Criação e gestão de contas' : isEs ? 'Creación y gestión de cuentas' : 'Account creation and management'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Cadastro, login, permissões por papéis, convites, clubes de empresas' : isEs ? 'Registro, inicio de sesión, permisos por roles, invitaciones, clubes de empresas' : 'Registration, login, role-based permissions, invitations, company clubs'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Execução de contrato' : isEs ? 'Ejecución de contrato' : 'Contract performance'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Verificação profissional' : isEs ? 'Verificación profesional' : 'Professional verification'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Validação de CRECI para habilitar recursos de corretor(a) e exibir em anúncios' : isEs ? 'Validación de CRECI para habilitar recursos de corredor(a) y mostrar en anuncios' : 'CRECI validation to enable broker features and display in listings'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Legítimo interesse; cumprimento de obrigação regulatória quando aplicável' : isEs ? 'Interés legítimo; cumplimiento de obligación regulatoria cuando corresponda' : 'Legitimate interest; regulatory compliance when applicable'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Prestação dos serviços' : isEs ? 'Prestación de servicios' : 'Service delivery'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Publicar anúncios, gerenciar leads no CRM, site builder, automações' : isEs ? 'Publicar anuncios, gestionar leads en CRM, constructor de sitios, automatizaciones' : 'Publish listings, manage leads in CRM, site builder, automations'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Execução de contrato' : isEs ? 'Ejecución de contrato' : 'Contract performance'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Processamento de mídia com IA' : isEs ? 'Procesamiento de medios con IA' : 'AI media processing'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Converter vídeos 2D em mapas/"tours" 3D, geração de miniaturas, otimização' : isEs ? 'Convertir videos 2D en mapas/"tours" 3D, generación de miniaturas, optimización' : 'Convert 2D videos to 3D maps/tours, thumbnail generation, optimization'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Execução de contrato; legítimo interesse' : isEs ? 'Ejecución de contrato; interés legítimo' : 'Contract performance; legitimate interest'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Atendimento e suporte' : isEs ? 'Atención y soporte' : 'Customer service and support'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Suporte técnico, treinamento, comunicação sobre incidentes' : isEs ? 'Soporte técnico, capacitación, comunicación sobre incidentes' : 'Technical support, training, incident communication'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Execução de contrato; legítimo interesse' : isEs ? 'Ejecución de contrato; interés legítimo' : 'Contract performance; legitimate interest'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Marketing e personalização' : isEs ? 'Marketing y personalización' : 'Marketing and personalization'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Newsletters, remarketing, recomendação de imóveis/conteúdos' : isEs ? 'Boletines, remarketing, recomendación de propiedades/contenidos' : 'Newsletters, remarketing, property/content recommendations'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Consentimento (quando exigido); legítimo interesse' : isEs ? 'Consentimiento (cuando se requiera); interés legítimo' : 'Consent (when required); legitimate interest'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Medição, análise e melhoria' : isEs ? 'Medición, análisis y mejora' : 'Measurement, analysis and improvement'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Analytics, testes, estatísticas, prevenção a erros e fraudes' : isEs ? 'Analíticas, pruebas, estadísticas, prevención de errores y fraudes' : 'Analytics, testing, statistics, error and fraud prevention'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Legítimo interesse' : isEs ? 'Interés legítimo' : 'Legitimate interest'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Segurança e conformidade' : isEs ? 'Seguridad y cumplimiento' : 'Security and compliance'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Auditoria, logs, prevenção a fraudes/abusos, cumprimento legal' : isEs ? 'Auditoría, registros, prevención de fraudes/abusos, cumplimiento legal' : 'Audit, logs, fraud/abuse prevention, legal compliance'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Cumprimento de obrigação legal; legítimo interesse' : isEs ? 'Cumplimiento de obligación legal; interés legítimo' : 'Legal obligation compliance; legitimate interest'}</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{isPt ? 'Faturamento e cobranças' : isEs ? 'Facturación y cobros' : 'Billing and collections'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Emissão de notas, gestão de pagamentos' : isEs ? 'Emisión de facturas, gestión de pagos' : 'Invoice issuance, payment management'}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{isPt ? 'Execução de contrato; cumprimento legal' : isEs ? 'Ejecución de contrato; cumplimiento legal' : 'Contract performance; legal compliance'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 p-4 mt-6 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-200 mb-0">
                {isPt 
                  ? <><strong>Treinamento de modelos de IA:</strong> não utilizamos <strong>conteúdo do cliente</strong> (por ex., fotos/vídeos de imóveis, conversas, leads) para treinar modelos externos. Poderemos usar <strong>dados agregados e anonimizados</strong> para estatísticas e melhoria de produtos. Se pretendermos usar dados pessoais identificáveis para melhoria algorítmica, pediremos <strong>seu consentimento explícito</strong>.</>
                  : isEs
                  ? <><strong>Entrenamiento de modelos de IA:</strong> no utilizamos <strong>contenido del cliente</strong> (por ej., fotos/videos de propiedades, conversaciones, leads) para entrenar modelos externos. Podremos usar <strong>datos agregados y anonimizados</strong> para estadísticas y mejora de productos. Si pretendemos usar datos personales identificables para mejora algorítmica, solicitaremos <strong>su consentimiento explícito</strong>.</>
                  : <><strong>AI model training:</strong> we do not use <strong>customer content</strong> (e.g., property photos/videos, conversations, leads) to train external models. We may use <strong>aggregated and anonymized data</strong> for statistics and product improvement. If we intend to use identifiable personal data for algorithmic improvement, we will request <strong>your explicit consent</strong>.</>
                }
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div id="section-5" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">5</span>
              {content.sections[4].title}
            </h2>
            <p>
              {isPt 
                ? <>Usamos algoritmos para <strong>classificar leads</strong>, <strong>sugerir imóveis</strong>, detectar <strong>spam/fraude</strong> e priorizar atividades no CRM. Você pode solicitar <strong>revisão de decisões tomadas exclusivamente por meios automatizados</strong> que afetem seus interesses, conforme a LGPD, pelos canais do DPO.</>
                : isEs
                ? <>Usamos algoritmos para <strong>clasificar leads</strong>, <strong>sugerir propiedades</strong>, detectar <strong>spam/fraude</strong> y priorizar actividades en el CRM. Puede solicitar <strong>revisión de decisiones tomadas exclusivamente por medios automatizados</strong> que afecten sus intereses, conforme a la LGPD, a través de los canales del DPO.</>
                : <>We use algorithms to <strong>classify leads</strong>, <strong>suggest properties</strong>, detect <strong>spam/fraud</strong> and prioritize activities in the CRM. You may request <strong>review of decisions made exclusively by automated means</strong> that affect your interests, in accordance with LGPD, through DPO channels.</>
              }
            </p>
          </div>

          {/* Section 6 */}
          <div id="section-6" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">6</span>
              {content.sections[5].title}
            </h2>
            <p>{isPt ? 'Compartilhamos dados pessoais somente quando necessário e proporcional:' : isEs ? 'Compartimos datos personales solo cuando es necesario y proporcional:' : 'We share personal data only when necessary and proportional:'}</p>
            <ul className="space-y-2 mt-4">
              <li>{isPt ? <><strong>Com empresas clientes e parceiros do setor</strong> (ex.: corretoras, incorporadoras): quando você <strong>envia um lead</strong> ou interage com um anúncio, seus dados de contato e interesse são <strong>compartilhados com o anunciante</strong> para atendimento.</> : isEs ? <><strong>Con empresas clientes y socios del sector</strong> (ej.: inmobiliarias, desarrolladores): cuando usted <strong>envía un lead</strong> o interactúa con un anuncio, sus datos de contacto e interés se <strong>comparten con el anunciante</strong> para atención.</> : <><strong>With client companies and industry partners</strong> (e.g., brokerages, developers): when you <strong>submit a lead</strong> or interact with a listing, your contact and interest data is <strong>shared with the advertiser</strong> for follow-up.</>}</li>
              <li>{isPt ? <><strong>Operadores/fornecedores</strong> que tratam dados em nosso nome (hospedagem em nuvem, processamento de mídia/IA, e-mail, mensageria, analytics, pagamentos, suporte).</> : isEs ? <><strong>Operadores/proveedores</strong> que tratan datos en nuestro nombre (hospedaje en la nube, procesamiento de medios/IA, correo electrónico, mensajería, analytics, pagos, soporte).</> : <><strong>Operators/vendors</strong> who process data on our behalf (cloud hosting, media/AI processing, email, messaging, analytics, payments, support).</>}</li>
              <li>{isPt ? <><strong>Integrações ativadas por você</strong> (ex.: Google, Meta, WhatsApp Business, telefonia, mapas).</> : isEs ? <><strong>Integraciones activadas por usted</strong> (ej.: Google, Meta, WhatsApp Business, telefonía, mapas).</> : <><strong>Integrations enabled by you</strong> (e.g., Google, Meta, WhatsApp Business, telephony, maps).</>}</li>
              <li>{isPt ? <><strong>Autoridades públicas</strong> para cumprimento de obrigação legal ou requisições válidas.</> : isEs ? <><strong>Autoridades públicas</strong> para cumplimiento de obligación legal o solicitudes válidas.</> : <><strong>Public authorities</strong> for legal obligation compliance or valid requests.</>}</li>
              <li>{isPt ? <><strong>Operações societárias</strong> (fusão, aquisição, reorganização), sujeitos a confidencialidade.</> : isEs ? <><strong>Operaciones societarias</strong> (fusión, adquisición, reorganización), sujetas a confidencialidad.</> : <><strong>Corporate transactions</strong> (merger, acquisition, reorganization), subject to confidentiality.</>}</li>
            </ul>
            <p className="mt-4">
              {isPt 
                ? <>Não vendemos dados pessoais. Para publicidade, podemos <strong>compartilhar identificadores online</strong> com plataformas de mídia, conforme seus consentimentos e configurações de cookies.</>
                : isEs
                ? <>No vendemos datos personales. Para publicidad, podemos <strong>compartir identificadores en línea</strong> con plataformas de medios, conforme a sus consentimientos y configuraciones de cookies.</>
                : <>We do not sell personal data. For advertising, we may <strong>share online identifiers</strong> with media platforms, according to your consents and cookie settings.</>
              }
            </p>
          </div>

          {/* Sections 7-17 continue with similar styling... */}
          {/* I'll create the remaining sections with consistent formatting */}

          {/* Section 7 */}
          <div id="section-7" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">7</span>
              {content.sections[6].title}
            </h2>
            <p>
              {isPt 
                ? <>Seus dados podem ser processados fora do Brasil por provedores de nuvem e serviços globais. Adotamos <strong>salvaguardas</strong> exigidas pela LGPD (cláusulas contratuais, padrões de segurança e minimização). Você pode solicitar informações sobre os países e os mecanismos aplicados via DPO.</>
                : isEs
                ? <>Sus datos pueden ser procesados fuera de Brasil por proveedores de nube y servicios globales. Adoptamos <strong>salvaguardas</strong> requeridas por la LGPD (cláusulas contractuales, estándares de seguridad y minimización). Puede solicitar información sobre los países y mecanismos aplicados a través del DPO.</>
                : <>Your data may be processed outside Brazil by cloud providers and global services. We adopt <strong>safeguards</strong> required by LGPD (contractual clauses, security standards and minimization). You may request information about countries and mechanisms applied via the DPO.</>
              }
            </p>
          </div>

          {/* Section 8 */}
          <div id="section-8" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">8</span>
              {content.sections[7].title}
            </h2>
            <p>
              {isPt 
                ? <>Mantemos os dados <strong>pelo tempo necessário</strong> ao cumprimento das finalidades desta Política e de obrigações legais/contratuais. Exemplos:</>
                : isEs
                ? <>Mantenemos los datos <strong>por el tiempo necesario</strong> para cumplir con los propósitos de esta Política y obligaciones legales/contractuales. Ejemplos:</>
                : <>We retain data <strong>for as long as necessary</strong> to fulfill the purposes of this Policy and legal/contractual obligations. Examples:</>
              }
            </p>
            <ul className="space-y-2 mt-4">
              <li>{isPt ? <><strong>Conta e configurações:</strong> enquanto a conta estiver ativa e por até <strong>[X anos]</strong> após encerramento, para obrigações legais e defesa jurídica.</> : isEs ? <><strong>Cuenta y configuraciones:</strong> mientras la cuenta esté activa y hasta <strong>[X años]</strong> después del cierre, para obligaciones legales y defensa jurídica.</> : <><strong>Account and settings:</strong> while the account is active and up to <strong>[X years]</strong> after closure, for legal obligations and legal defense.</>}</li>
              <li>{isPt ? <><strong>Leads, negócios e registros do CRM:</strong> prazo do contrato e <strong>[X anos]</strong> após o término (prazos prescricionais).</> : isEs ? <><strong>Leads, negocios y registros del CRM:</strong> plazo del contrato y <strong>[X años]</strong> después del término (plazos prescriptivos).</> : <><strong>Leads, deals and CRM records:</strong> contract term and <strong>[X years]</strong> after termination (statute of limitations).</>}</li>
              <li>{isPt ? <><strong>Logs de acesso e segurança:</strong> pelo prazo mínimo exigido em lei e/ou <strong>[6 a 24 meses]</strong>.</> : isEs ? <><strong>Registros de acceso y seguridad:</strong> por el plazo mínimo requerido por ley y/o <strong>[6 a 24 meses]</strong>.</> : <><strong>Access and security logs:</strong> for the minimum period required by law and/or <strong>[6 to 24 months]</strong>.</>}</li>
              <li>{isPt ? <><strong>Mídias e tours 3D:</strong> enquanto o anúncio estiver ativo e pelo período operacional necessário após a remoção (<strong>backups/replicações</strong>).</> : isEs ? <><strong>Medios y tours 3D:</strong> mientras el anuncio esté activo y por el período operacional necesario después de la eliminación (<strong>respaldos/replicaciones</strong>).</> : <><strong>Media and 3D tours:</strong> while the listing is active and for the operational period needed after removal (<strong>backups/replications</strong>).</>}</li>
            </ul>
            <p className="mt-4">{isPt ? <>Quando possível, dados são <strong>anonimizados</strong> para uso estatístico.</> : isEs ? <>Cuando sea posible, los datos se <strong>anonimizan</strong> para uso estadístico.</> : <>When possible, data is <strong>anonymized</strong> for statistical use.</>}</p>
          </div>

          {/* Section 9 */}
          <div id="section-9" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">9</span>
              {content.sections[8].title}
            </h2>
            <p>
              {isPt 
                ? <>Adotamos <strong>medidas técnicas e administrativas</strong> compatíveis com a natureza das atividades: criptografia em trânsito e repouso (quando aplicável), controles de acesso por perfil, autenticação reforçada, registro de auditoria, segregação de ambientes, backups e testes.</>
                : isEs
                ? <>Adoptamos <strong>medidas técnicas y administrativas</strong> compatibles con la naturaleza de las actividades: cifrado en tránsito y reposo (cuando corresponda), controles de acceso por perfil, autenticación reforzada, registro de auditoría, segregación de ambientes, respaldos y pruebas.</>
                : <>We adopt <strong>technical and administrative measures</strong> compatible with the nature of activities: encryption in transit and at rest (when applicable), role-based access controls, enhanced authentication, audit logging, environment segregation, backups and testing.</>
              }
            </p>
            <p className="mt-4">
              {isPt 
                ? <>Apesar dos esforços, <strong>nenhum</strong> sistema é 100% seguro. Em caso de <strong>incidente de segurança</strong> com risco relevante, comunicaremos você e a <strong>ANPD</strong>, observadas as exigências legais.</>
                : isEs
                ? <>A pesar de los esfuerzos, <strong>ningún</strong> sistema es 100% seguro. En caso de <strong>incidente de seguridad</strong> con riesgo relevante, le comunicaremos a usted y a la <strong>ANPD</strong>, observando los requisitos legales.</>
                : <>Despite efforts, <strong>no</strong> system is 100% secure. In case of a <strong>security incident</strong> with relevant risk, we will notify you and the <strong>ANPD</strong>, observing legal requirements.</>
              }
            </p>
          </div>

          {/* Section 10 */}
          <div id="section-10" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">10</span>
              {content.sections[9].title}
            </h2>
            <p>{isPt ? 'Usamos cookies e tecnologias similares para:' : isEs ? 'Usamos cookies y tecnologías similares para:' : 'We use cookies and similar technologies for:'}</p>
            <ul className="space-y-2 mt-4">
              <li>{isPt ? <><strong>Essenciais:</strong> autenticação, segurança, conteúdo do carrinho/fluxos críticos.</> : isEs ? <><strong>Esenciales:</strong> autenticación, seguridad, contenido del carrito/flujos críticos.</> : <><strong>Essential:</strong> authentication, security, cart content/critical flows.</>}</li>
              <li>{isPt ? <><strong>Desempenho/Analytics:</strong> entender uso e melhorar o produto.</> : isEs ? <><strong>Rendimiento/Analytics:</strong> entender el uso y mejorar el producto.</> : <><strong>Performance/Analytics:</strong> understand usage and improve the product.</>}</li>
              <li>{isPt ? <><strong>Funcionais:</strong> lembrar preferências (idioma, fuso, layout).</> : isEs ? <><strong>Funcionales:</strong> recordar preferencias (idioma, zona horaria, diseño).</> : <><strong>Functional:</strong> remember preferences (language, timezone, layout).</>}</li>
              <li>{isPt ? <><strong>Publicidade:</strong> medir campanhas e fazer remarketing.</> : isEs ? <><strong>Publicidad:</strong> medir campañas y hacer remarketing.</> : <><strong>Advertising:</strong> measure campaigns and do remarketing.</>}</li>
            </ul>
            <p className="mt-4">
              {isPt 
                ? <>Você pode gerenciar preferências no nosso <strong>banner/centro de cookies</strong> e no navegador. Bloquear certos cookies pode afetar funcionalidades.</>
                : isEs
                ? <>Puede gestionar preferencias en nuestro <strong>banner/centro de cookies</strong> y en el navegador. Bloquear ciertas cookies puede afectar funcionalidades.</>
                : <>You can manage preferences in our <strong>cookie banner/center</strong> and in your browser. Blocking certain cookies may affect functionality.</>
              }
            </p>
          </div>

          {/* Section 11 */}
          <div id="section-11" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">11</span>
              {content.sections[10].title}
            </h2>
            <p>{isPt ? 'Nos termos da LGPD, você pode:' : isEs ? 'Según los términos de la LGPD, usted puede:' : 'Under LGPD, you may:'}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {(isPt ? [
                "Solicitar confirmação de tratamento e acesso aos dados",
                "Pedir correção de dados incompletos, inexatos ou desatualizados",
                "Requerer a anonimização, bloqueio ou eliminação de dados desnecessários",
                "Solicitar a portabilidade a outro fornecedor",
                "Obter informações sobre compartilhamentos",
                "Solicitar a eliminação de dados tratados com base no consentimento",
                "Revogar o consentimento",
                "Opor-se a tratamentos baseados em legítimo interesse",
                "Solicitar revisão de decisões automatizadas",
              ] : isEs ? [
                "Solicitar confirmación de tratamiento y acceso a los datos",
                "Pedir corrección de datos incompletos, inexactos o desactualizados",
                "Requerir la anonimización, bloqueo o eliminación de datos innecesarios",
                "Solicitar la portabilidad a otro proveedor",
                "Obtener información sobre comparticiones",
                "Solicitar la eliminación de datos tratados con base en el consentimiento",
                "Revocar el consentimiento",
                "Oponerse a tratamientos basados en interés legítimo",
                "Solicitar revisión de decisiones automatizadas",
              ] : [
                "Request confirmation of processing and access to data",
                "Request correction of incomplete, inaccurate or outdated data",
                "Request anonymization, blocking or deletion of unnecessary data",
                "Request portability to another provider",
                "Obtain information about data sharing",
                "Request deletion of data processed based on consent",
                "Revoke consent",
                "Object to processing based on legitimate interest",
                "Request review of automated decisions",
              ]).map((right, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{right}</span>
                </div>
              ))}
            </div>
            <p className="mt-6">
              {isPt 
                ? <>Envie sua solicitação ao <strong>DPO</strong> (Seção 2). Responderemos <strong>nos prazos legais</strong> e poderemos solicitar comprovação de identidade.</>
                : isEs
                ? <>Envíe su solicitud al <strong>DPO</strong> (Sección 2). Responderemos <strong>en los plazos legales</strong> y podremos solicitar comprobación de identidad.</>
                : <>Send your request to the <strong>DPO</strong> (Section 2). We will respond <strong>within legal timeframes</strong> and may request identity verification.</>
              }
            </p>
          </div>

          {/* Section 12 */}
          <div id="section-12" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">12</span>
              {content.sections[11].title}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span>{isPt ? <><strong>Conteúdos e mídias</strong> enviados (fotos, vídeos 2D, tours 3D, plantas) <strong>não devem violar direitos de terceiros</strong>. Se houver pessoas identificáveis, obtenha as autorizações necessárias.</> : isEs ? <><strong>Contenidos y medios</strong> enviados (fotos, videos 2D, tours 3D, planos) <strong>no deben violar derechos de terceros</strong>. Si hay personas identificables, obtenga las autorizaciones necesarias.</> : <><strong>Content and media</strong> submitted (photos, 2D videos, 3D tours, floor plans) <strong>must not violate third-party rights</strong>. If identifiable persons appear, obtain necessary authorizations.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span>{isPt ? <><strong>Dados de terceiros</strong> incluídos no CRM (contatos/leads) devem ter <strong>base legal</strong> adequada definida por você/cliente empresarial, que atuará como <strong>controlador</strong> desses dados no uso do Constellation; a Stella atuará, nessa hipótese, como <strong>operadora</strong>.</> : isEs ? <><strong>Datos de terceros</strong> incluidos en el CRM (contactos/leads) deben tener <strong>base legal</strong> adecuada definida por usted/cliente empresarial, que actuará como <strong>controlador</strong> de esos datos en el uso de Constellation; Stella actuará, en esa hipótesis, como <strong>operadora</strong>.</> : <><strong>Third-party data</strong> included in the CRM (contacts/leads) must have an appropriate <strong>legal basis</strong> defined by you/business client, who will act as <strong>controller</strong> of such data when using Constellation; Stella will act, in this case, as <strong>processor</strong>.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span>{isPt ? <><strong>CRECI e dados profissionais</strong>: mantenha suas informações corretas e atualizadas.</> : isEs ? <><strong>CRECI y datos profesionales</strong>: mantenga su información correcta y actualizada.</> : <><strong>CRECI and professional data</strong>: keep your information correct and up-to-date.</>}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">⚠</span>
                <span>{isPt ? <><strong>Segurança de conta</strong>: guarde suas credenciais e ative autenticação de dois fatores quando disponível.</> : isEs ? <><strong>Seguridad de cuenta</strong>: guarde sus credenciales y active autenticación de dos factores cuando esté disponible.</> : <><strong>Account security</strong>: protect your credentials and enable two-factor authentication when available.</>}</span>
              </li>
            </ul>
          </div>

          {/* Section 13 */}
          <div id="section-13" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">13</span>
              {content.sections[12].title}
            </h2>
            <p>
              {isPt 
                ? <>Nossos serviços <strong>não são direcionados a menores de 18 anos</strong>. Caso identifiquemos dados de menores sem as autorizações legais, adotaremos medidas para exclusão.</>
                : isEs
                ? <>Nuestros servicios <strong>no están dirigidos a menores de 18 años</strong>. Si identificamos datos de menores sin las autorizaciones legales, adoptaremos medidas para su eliminación.</>
                : <>Our services are <strong>not directed to minors under 18 years of age</strong>. If we identify data of minors without legal authorizations, we will take measures for deletion.</>
              }
            </p>
          </div>

          {/* Section 14 */}
          <div id="section-14" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">14</span>
              {content.sections[13].title}
            </h2>
            <p>
              {isPt 
                ? <>Podemos conter links/integrar serviços de terceiros. Cada terceiro possui sua própria política. <strong>Não somos responsáveis</strong> por práticas de privacidade desses sites/serviços.</>
                : isEs
                ? <>Podemos contener enlaces/integrar servicios de terceros. Cada tercero posee su propia política. <strong>No somos responsables</strong> por prácticas de privacidad de esos sitios/servicios.</>
                : <>We may contain links to/integrate third-party services. Each third party has its own policy. <strong>We are not responsible</strong> for privacy practices of those sites/services.</>
              }
            </p>
          </div>

          {/* Section 15 */}
          <div id="section-15" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">15</span>
              {content.sections[14].title}
            </h2>
            <p>
              {isPt 
                ? <>Podemos atualizar esta Política para refletir mudanças legais, técnicas ou operacionais. Publicaremos a versão vigente com a data de atualização no topo. Mudanças relevantes poderão ser comunicadas por e-mail ou aviso no serviço.</>
                : isEs
                ? <>Podemos actualizar esta Política para reflejar cambios legales, técnicos u operativos. Publicaremos la versión vigente con la fecha de actualización en la parte superior. Los cambios relevantes podrán ser comunicados por correo electrónico o aviso en el servicio.</>
                : <>We may update this Policy to reflect legal, technical or operational changes. We will publish the current version with the update date at the top. Relevant changes may be communicated by email or service notice.</>
              }
            </p>
          </div>

          {/* Section 16 - Contact */}
          <div id="section-16" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">16</span>
              {content.sections[15].title}
            </h2>
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800/30">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {isPt 
                  ? 'Dúvidas, solicitações de direitos e comunicações sobre privacidade:'
                  : isEs
                  ? 'Dudas, solicitudes de derechos y comunicaciones sobre privacidad:'
                  : 'Questions, rights requests and privacy communications:'
                }
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-slate-900 dark:text-white font-semibold">{isPt ? '[NOME DO DPO]' : isEs ? '[NOMBRE DEL DPO]' : '[DPO NAME]'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:[E-MAIL DO DPO]" className="text-indigo-600 dark:text-indigo-400 hover:underline">{isPt ? '[E-MAIL DO DPO]' : isEs ? '[EMAIL DEL DPO]' : '[DPO EMAIL]'}</a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-slate-700 dark:text-slate-300">{isPt ? '[ENDEREÇO COMPLETO]' : isEs ? '[DIRECCIÓN COMPLETA]' : '[FULL ADDRESS]'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a href="[URL]" className="text-indigo-600 dark:text-indigo-400 hover:underline">{isPt ? '[FORMULÁRIO/URL]' : isEs ? '[FORMULARIO/URL]' : '[FORM/URL]'}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 17 - Summary */}
          <div id="section-17" className="scroll-mt-20">
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">17</span>
              {content.sections[16].title}
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800/30">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 mt-0">{isPt ? 'Versão Resumida' : isEs ? 'Versión Resumida' : 'Summary Version'}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Coletamos dados para <strong>operar o serviço</strong>, <strong>exibir e gerenciar anúncios</strong>, <strong>conectar interessados</strong> e <strong>melhorar a experiência</strong>.</> : isEs ? <>Recopilamos datos para <strong>operar el servicio</strong>, <strong>mostrar y gestionar anuncios</strong>, <strong>conectar interesados</strong> y <strong>mejorar la experiencia</strong>.</> : <>We collect data to <strong>operate the service</strong>, <strong>display and manage listings</strong>, <strong>connect interested parties</strong> and <strong>improve the experience</strong>.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Usamos <strong>IA</strong> para transformar vídeos em <strong>tours 3D</strong> e <strong>classificar leads</strong>; você pode pedir <strong>revisão</strong> de decisões automatizadas.</> : isEs ? <>Usamos <strong>IA</strong> para transformar videos en <strong>tours 3D</strong> y <strong>clasificar leads</strong>; puede solicitar <strong>revisión</strong> de decisiones automatizadas.</> : <>We use <strong>AI</strong> to transform videos into <strong>3D tours</strong> and <strong>classify leads</strong>; you can request <strong>review</strong> of automated decisions.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Compartilhamos dados <strong>com o anunciante</strong> quando você envia um <strong>lead</strong>, e com <strong>fornecedores</strong> que operam o serviço.</> : isEs ? <>Compartimos datos <strong>con el anunciante</strong> cuando usted envía un <strong>lead</strong>, y con <strong>proveedores</strong> que operan el servicio.</> : <>We share data <strong>with the advertiser</strong> when you submit a <strong>lead</strong>, and with <strong>vendors</strong> that operate the service.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Você tem <strong>direitos LGPD</strong> (acesso, correção, exclusão, portabilidade, oposição, revogação).</> : isEs ? <>Usted tiene <strong>derechos LGPD</strong> (acceso, corrección, eliminación, portabilidad, oposición, revocación).</> : <>You have <strong>LGPD rights</strong> (access, correction, deletion, portability, objection, revocation).</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Preferências de <strong>cookies</strong> podem ser gerenciadas no banner.</> : isEs ? <>Las preferencias de <strong>cookies</strong> pueden gestionarse en el banner.</> : <><strong>Cookie</strong> preferences can be managed in the banner.</>}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                  <span>{isPt ? <>Contate <strong>[E-MAIL DO DPO]</strong> para qualquer assunto de privacidade.</> : isEs ? <>Contacte <strong>[EMAIL DEL DPO]</strong> para cualquier asunto de privacidad.</> : <>Contact <strong>[DPO EMAIL]</strong> for any privacy matter.</>}</span>
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
            {isPt ? 'Dúvidas sobre privacidade?' : isEs ? '¿Dudas sobre privacidad?' : 'Questions about privacy?'}
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            {isPt 
              ? 'Entre em contato com nosso Encarregado de Proteção de Dados (DPO) para esclarecer qualquer questão sobre como tratamos seus dados pessoais.'
              : isEs
              ? 'Póngase en contacto con nuestro Delegado de Protección de Datos (DPO) para aclarar cualquier cuestión sobre cómo tratamos sus datos personales.'
              : 'Contact our Data Protection Officer (DPO) to clarify any questions about how we process your personal data.'
            }
          </p>
          <a
            href="mailto:[E-MAIL DO DPO]"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isPt ? 'Contatar DPO' : isEs ? 'Contactar DPO' : 'Contact DPO'}
          </a>
        </div>
      </section>
    </div>
  )
}
