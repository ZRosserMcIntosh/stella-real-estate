import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

export default function About() {
  const { t } = useTranslation()
  const [ceoExpanded, setCeoExpanded] = useState(false)
  const [ctoExpanded, setCtoExpanded] = useState(false)

  return (
    <>
      <SEO
        title="Sobre a Stella Real Estate | Corretora de Imóveis de Luxo em São Paulo"
        description="Conheça a Stella Real Estate e nossa equipe de especialistas em imóveis de luxo. Com anos de experiência no mercado imobiliário premium de São Paulo, oferecemos atendimento personalizado e exclusivo para compradores e vendedores de imóveis de alto padrão."
        keywords="sobre Stella Real Estate, corretora de imóveis São Paulo, equipe imobiliária luxo, especialistas mercado premium, Stella Mary Barbosa, corretor imóveis alto padrão"
        canonicalUrl="https://stellareal.com.br/about"
        ogType="profile"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Stella Real Estate',
          url: 'https://stellareal.com.br',
          description: 'Corretora especializada em imóveis de luxo e alto padrão em São Paulo',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'São Paulo',
            addressRegion: 'SP',
            addressCountry: 'BR'
          },
          founder: {
            '@type': 'Person',
            name: 'Stella Mary Barbosa',
            jobTitle: 'CEO & Founder'
          },
          employee: [
            {
              '@type': 'Person',
              name: 'Stella Mary Barbosa',
              jobTitle: 'CEO & Founder',
              description: 'Especialista em imóveis de luxo com anos de experiência no mercado imobiliário premium de São Paulo'
            },
            {
              '@type': 'Person',
              name: 'Rosser McIntosh',
              jobTitle: 'CTO & Co-Founder',
              description: 'Especialista em tecnologia imobiliária e desenvolvimento de plataformas digitais'
            }
          ]
        }}
      />
      <div className="bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 -mt-20 pt-20">
        <div className="container-padded py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            {t('pages.about.title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('pages.about.subtitle')}
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="container-padded py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-4">
          {t('pages.about.leadership.title')}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
          {t('pages.about.leadership.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* CEO */}
          <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-950/50 dark:to-pink-950/50 aspect-square mb-6">
              <img 
                src="/people/stella.jpeg" 
                alt="Stella Mary Barbosa" 
                className="w-full h-full object-cover"
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
                >
                  {ceoExpanded ? (
                    <>
                      Show Less
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Read Full Bio
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
                src="/people/rosser.jpeg" 
                alt="Z. Rosser McIntosh" 
                className="w-full h-full object-cover"
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
                >
                  {ctoExpanded ? (
                    <>
                      Show Less
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Read Full Bio
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
