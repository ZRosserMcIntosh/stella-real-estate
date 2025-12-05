import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

export default function About() {
  const { t, i18n } = useTranslation()
  const [ceoExpanded, setCeoExpanded] = useState(false)
  const [ctoExpanded, setCtoExpanded] = useState(false)
  const [advisorExpanded, setAdvisorExpanded] = useState(false)
  const currentLang = i18n.language

  // SEO content by language
  const seoContent = {
    pt: {
      title: "Sobre a Stella Real Estate | Corretora de Imóveis de Luxo em São Paulo",
      description: "Conheça a Stella Real Estate e nossa equipe de especialistas em imóveis de luxo. Com expertise no mercado imobiliário premium de São Paulo, oferecemos atendimento personalizado e exclusivo. Stella Mary Barbosa lidera nossa visão de revolucionar o setor imobiliário através de tecnologia.",
      keywords: "sobre Stella Real Estate, corretora de imóveis São Paulo, equipe imobiliária luxo, especialistas mercado premium, Stella Mary Barbosa, Rosser McIntosh, corretor imóveis alto padrão, tecnologia imobiliária Brasil, CEO Stella Real Estate, CTO Stella",
      canonical: "https://stellareal.com.br/sobre"
    },
    en: {
      title: "About Stella Real Estate | Luxury Real Estate Brokerage in São Paulo",
      description: "Meet Stella Real Estate and our team of luxury real estate experts. With expertise in São Paulo's premium real estate market, we offer personalized and exclusive service. Stella Mary Barbosa leads our vision to revolutionize the real estate sector through technology.",
      keywords: "about Stella Real Estate, São Paulo real estate brokerage, luxury real estate team, premium market experts, Stella Mary Barbosa, Rosser McIntosh, high-end real estate broker, Brazil real estate technology, CEO Stella Real Estate, CTO Stella",
      canonical: "https://stellareal.com.br/about"
    },
    es: {
      title: "Sobre Stella Real Estate | Corredora de Propiedades de Lujo en São Paulo",
      description: "Conozca Stella Real Estate y nuestro equipo de expertos en propiedades de lujo. Con experiencia en el mercado inmobiliario premium de São Paulo, ofrecemos servicio personalizado y exclusivo. Stella Mary Barbosa lidera nuestra visión de revolucionar el sector inmobiliario a través de la tecnología.",
      keywords: "sobre Stella Real Estate, corredora propiedades São Paulo, equipo inmobiliario lujo, expertos mercado premium, Stella Mary Barbosa, Rosser McIntosh, corredor propiedades alto nivel, tecnología inmobiliaria Brasil, CEO Stella Real Estate, CTO Stella",
      canonical: "https://stellareal.com.br/sobre"
    }
  }

  const currentSeo = seoContent[currentLang as keyof typeof seoContent] || seoContent.pt

  // Schema.org structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Stella Real Estate',
    url: 'https://stellareal.com.br',
    logo: 'https://stellareal.com.br/stella-logo.png',
    image: 'https://stellareal.com.br/stella-og-image.png',
    description: currentLang === 'pt' 
      ? 'Corretora especializada em imóveis de luxo e alto padrão em São Paulo, com tecnologia avançada e atendimento personalizado'
      : currentLang === 'es'
      ? 'Corredora especializada en propiedades de lujo y alto nivel en São Paulo, con tecnología avanzada y servicio personalizado'
      : 'Luxury and high-end real estate brokerage in São Paulo, with advanced technology and personalized service',
    email: 'stellamary@creci.org.br',
    telephone: '+5511986410429',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
      '@id': 'https://www.wikidata.org/wiki/Q174'
    },
    areaServed: {
      '@type': 'City',
      name: 'São Paulo',
      '@id': 'https://www.wikidata.org/wiki/Q174'
    },
    founder: {
      '@type': 'Person',
      name: 'Stella Mary Barbosa',
      jobTitle: currentLang === 'pt' ? 'Diretora Executiva' : currentLang === 'es' ? 'Directora Ejecutiva' : 'Chief Executive Officer',
      description: t('pages.about.leadership.ceo.description'),
      email: 'stellamary@creci.org.br',
      worksFor: {
        '@type': 'Organization',
        name: 'Stella Real Estate'
      }
    },
    employee: [
      {
        '@type': 'Person',
        name: 'Stella Mary Barbosa',
        jobTitle: currentLang === 'pt' ? 'Diretora Executiva & Fundadora' : currentLang === 'es' ? 'Directora Ejecutiva y Fundadora' : 'CEO & Founder',
        description: t('pages.about.leadership.ceo.shortBio'),
        image: 'https://stellareal.com.br/people/stella.jpeg',
        email: 'stellamary@creci.org.br',
        sameAs: [
          'https://www.linkedin.com/company/stella-real-estate'
        ]
      },
      {
        '@type': 'Person',
        name: 'Rosser McIntosh',
        alternateName: 'Zack McIntosh',
        jobTitle: currentLang === 'pt' ? 'Diretor de Tecnologia & Co-Fundador' : currentLang === 'es' ? 'Director de Tecnología y Cofundador' : 'CTO & Co-Founder',
        description: t('pages.about.leadership.cto.shortBio'),
        image: 'https://stellareal.com.br/people/rosser.jpg',
        sameAs: [
          'https://github.com/ZRosserMcIntosh',
          'https://www.linkedin.com/in/rosser-mcintosh'
        ]
      },
      {
        '@type': 'Person',
        name: 'Pedro Garcia',
        jobTitle: currentLang === 'pt' ? 'Consultor de Tecnologia' : currentLang === 'es' ? 'Consultor de Tecnología' : 'Technology Advisor',
        description: t('pages.about.leadership.advisor.shortBio'),
        image: 'https://stellareal.com.br/people/pedro.jpg'
      }
    ],
    knowsAbout: [
      currentLang === 'pt' ? 'Imóveis de Luxo' : currentLang === 'es' ? 'Propiedades de Lujo' : 'Luxury Real Estate',
      currentLang === 'pt' ? 'Tecnologia Imobiliária' : currentLang === 'es' ? 'Tecnología Inmobiliaria' : 'Real Estate Technology',
      currentLang === 'pt' ? 'Mercado Imobiliário Premium' : currentLang === 'es' ? 'Mercado Inmobiliario Premium' : 'Premium Real Estate Market',
      'CRM',
      currentLang === 'pt' ? 'Plataforma Constellation' : currentLang === 'es' ? 'Plataforma Constellation' : 'Constellation Platform',
      currentLang === 'pt' ? 'Automação Imobiliária' : currentLang === 'es' ? 'Automatización Inmobiliaria' : 'Real Estate Automation'
    ],
    sameAs: [
      'https://www.instagram.com/stellarealoficial',
      'https://www.linkedin.com/company/stella-real-estate',
      'https://github.com/ZRosserMcIntosh/stella-real-estate'
    ]
  }

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonicalUrl={currentSeo.canonical}
        ogType="website"
        schema={organizationSchema}
      />
      <div className="bg-white dark:bg-slate-950">
      
      {/* Breadcrumb for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://stellareal.com.br'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: currentLang === 'pt' ? 'Sobre' : currentLang === 'es' ? 'Acerca de' : 'About',
              item: currentSeo.canonical
            }
          ]
        })}
      </script>

      {/* Leadership Team */}
      <section className="container-padded py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">
          {t('pages.about.leadership.title')}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
          {t('pages.about.leadership.subtitle')}
        </p>

        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* CEO */}
          <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-950/50 dark:to-pink-950/50 aspect-square mb-6">
              <img 
                src="/people/stella.jpeg" 
                alt={`${t('pages.about.leadership.ceo.name')} - ${t('pages.about.leadership.ceo.title')} ${currentLang === 'pt' ? 'da' : currentLang === 'es' ? 'de' : 'of'} Stella Real Estate`}
                className="w-full h-full object-cover"
                loading="lazy"
                width="600"
                height="600"
              />
            </div>
            <div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('pages.about.leadership.ceo.name')}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-semibold">
                  {t('pages.about.leadership.ceo.title')}
                </p>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="mb-4">
                  {t('pages.about.leadership.ceo.shortBio')}
                </p>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    ceoExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="mb-4">
                    {t('pages.about.leadership.ceo.fullBio')}
                  </p>
                </div>
                <button
                  onClick={() => setCeoExpanded(!ceoExpanded)}
                  className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold transition-colors"
                  aria-expanded={ceoExpanded}
                  aria-label={ceoExpanded ? (currentLang === 'pt' ? 'Mostrar menos sobre Stella Mary Barbosa' : currentLang === 'es' ? 'Mostrar menos sobre Stella Mary Barbosa' : 'Show less about Stella Mary Barbosa') : (currentLang === 'pt' ? 'Ler biografia completa de Stella Mary Barbosa' : currentLang === 'es' ? 'Leer biografía completa de Stella Mary Barbosa' : 'Read full bio of Stella Mary Barbosa')}
                >
                  {ceoExpanded ? (
                    <>
                      {currentLang === 'pt' ? 'Mostrar Menos' : currentLang === 'es' ? 'Mostrar Menos' : 'Show Less'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {currentLang === 'pt' ? 'Ler Biografia Completa' : currentLang === 'es' ? 'Leer Biografía Completa' : 'Read Full Bio'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CTO */}
          <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950/50 dark:to-blue-950/50 aspect-square mb-6">
              <img 
                src="/people/rosser.jpg" 
                alt={`${t('pages.about.leadership.cto.name')} - ${t('pages.about.leadership.cto.title')} ${currentLang === 'pt' ? 'da' : currentLang === 'es' ? 'de' : 'of'} Stella Real Estate`}
                className="w-full h-full object-cover"
                loading="lazy"
                width="600"
                height="600"
              />
            </div>
            <div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('pages.about.leadership.cto.name')}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-semibold">
                  {t('pages.about.leadership.cto.title')}
                </p>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="mb-4">
                  {t('pages.about.leadership.cto.shortBio')}
                </p>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    ctoExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="mb-4">
                    {t('pages.about.leadership.cto.fullBio')}
                  </p>
                </div>
                <button
                  onClick={() => setCtoExpanded(!ctoExpanded)}
                  className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold transition-colors"
                  aria-expanded={ctoExpanded}
                  aria-label={ctoExpanded ? (currentLang === 'pt' ? 'Mostrar menos sobre Rosser McIntosh' : currentLang === 'es' ? 'Mostrar menos sobre Rosser McIntosh' : 'Show less about Rosser McIntosh') : (currentLang === 'pt' ? 'Ler biografia completa de Rosser McIntosh' : currentLang === 'es' ? 'Leer biografía completa de Rosser McIntosh' : 'Read full bio of Rosser McIntosh')}
                >
                  {ctoExpanded ? (
                    <>
                      {currentLang === 'pt' ? 'Mostrar Menos' : currentLang === 'es' ? 'Mostrar Menos' : 'Show Less'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {currentLang === 'pt' ? 'Ler Biografia Completa' : currentLang === 'es' ? 'Leer Biografía Completa' : 'Read Full Bio'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Technology Advisor */}
          <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/50 dark:to-indigo-950/50 aspect-square mb-6">
              <img 
                src="/people/pedro.jpg" 
                alt={`${t('pages.about.leadership.advisor.name')} - ${t('pages.about.leadership.advisor.title')} ${currentLang === 'pt' ? 'da' : currentLang === 'es' ? 'de' : 'of'} Stella Real Estate`}
                className="w-full h-full object-cover"
                loading="lazy"
                width="600"
                height="600"
              />
            </div>
            <div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('pages.about.leadership.advisor.name')}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-semibold">
                  {t('pages.about.leadership.advisor.title')}
                </p>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                <p className="mb-4">
                  {t('pages.about.leadership.advisor.shortBio')}
                </p>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    advisorExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="mb-4">
                    {t('pages.about.leadership.advisor.fullBio')}
                  </p>
                </div>
                <button
                  onClick={() => setAdvisorExpanded(!advisorExpanded)}
                  className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold transition-colors"
                  aria-expanded={advisorExpanded}
                  aria-label={advisorExpanded ? (currentLang === 'pt' ? 'Mostrar menos sobre Pedro Garcia' : currentLang === 'es' ? 'Mostrar menos sobre Pedro Garcia' : 'Show less about Pedro Garcia') : (currentLang === 'pt' ? 'Ler biografia completa de Pedro Garcia' : currentLang === 'es' ? 'Leer biografía completa de Pedro Garcia' : 'Read full bio of Pedro Garcia')}
                >
                  {advisorExpanded ? (
                    <>
                      {currentLang === 'pt' ? 'Mostrar Menos' : currentLang === 'es' ? 'Mostrar Menos' : 'Show Less'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      {currentLang === 'pt' ? 'Ler Biografia Completa' : currentLang === 'es' ? 'Leer Biografía Completa' : 'Read Full Bio'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story/Values (Optional - can be expanded later) */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('pages.about.story.title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pages.about.story.content')}
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
