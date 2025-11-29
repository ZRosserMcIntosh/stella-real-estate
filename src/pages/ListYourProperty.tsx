import React from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

export default function ListYourProperty() {
  const { t } = useTranslation()
  return (
    <>
      <SEO
        title="Anuncie Seu Imóvel de Luxo | Venda com a Stella Real Estate"
        description="Quer vender seu imóvel de luxo em São Paulo? A Stella Real Estate é especializada na venda de apartamentos de alto padrão, coberturas e casas exclusivas. Avaliação gratuita, marketing premium e atendimento personalizado. Anuncie seu imóvel conosco."
        keywords="vender imóvel luxo São Paulo, anunciar apartamento alto padrão, vender cobertura SP, avaliar imóvel de luxo, corretora venda imóveis premium, como vender imóvel caro"
        canonicalUrl="https://stellareal.com.br/list-your-property"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Serviço de Venda de Imóveis de Luxo',
          provider: {
            '@type': 'RealEstateAgent',
            name: 'Stella Real Estate',
            url: 'https://stellareal.com.br'
          },
          areaServed: {
            '@type': 'City',
            name: 'São Paulo'
          },
          description: 'Serviço especializado de venda de imóveis de luxo em São Paulo com avaliação gratuita e marketing premium'
        }}
      />
      <section className="container-padded py-16">
        <h1 className="text-2xl font-bold">{t('pages.listYourProperty.title')}</h1>
        <p className="mt-3 text-slate-700">Tell us about your property. Placeholder form coming soon.</p>
      </section>
    </>
  )
}
