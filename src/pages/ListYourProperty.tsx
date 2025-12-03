import React from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle, Mail, CheckCircle2, Award, TrendingUp, Camera, Users, Home, Sparkles, Clock } from 'lucide-react'
import SEO from '../components/SEO'

export default function ListYourProperty() {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  // SEO content by language
  const seoContent = {
    pt: {
      title: "Anuncie Seu Imóvel de Luxo | Venda com a Stella Real Estate",
      description: "Quer vender seu imóvel de luxo em São Paulo? A Stella Real Estate é especializada na venda de apartamentos de alto padrão, coberturas e casas exclusivas. Avaliação gratuita, marketing premium e atendimento personalizado.",
      keywords: "vender imóvel luxo São Paulo, anunciar apartamento alto padrão, vender cobertura SP, avaliar imóvel de luxo, corretora venda imóveis premium, como vender imóvel caro",
      canonical: "https://stellareal.com.br/anuncie-seu-imovel"
    },
    en: {
      title: "List Your Luxury Property | Sell with Stella Real Estate",
      description: "Want to sell your luxury property in São Paulo? Stella Real Estate specializes in selling high-end apartments, penthouses and exclusive homes. Free evaluation, premium marketing and personalized service.",
      keywords: "sell luxury property São Paulo, list high-end apartment, sell penthouse SP, luxury property evaluation, premium real estate broker, how to sell expensive property",
      canonical: "https://stellareal.com.br/list-your-property"
    },
    es: {
      title: "Publica Tu Propiedad de Lujo | Vende con Stella Real Estate",
      description: "¿Quieres vender tu propiedad de lujo en São Paulo? Stella Real Estate se especializa en la venta de apartamentos de alto nivel, áticos y casas exclusivas. Evaluación gratuita, marketing premium y servicio personalizado.",
      keywords: "vender propiedad lujo São Paulo, publicar apartamento alto nivel, vender ático SP, evaluar propiedad de lujo, corredor venta propiedades premium, cómo vender propiedad cara",
      canonical: "https://stellareal.com.br/publica-tu-propiedad"
    }
  }

  const currentSeo = seoContent[currentLang as keyof typeof seoContent] || seoContent.pt

  // WhatsApp message by language
  const whatsappMessages = {
    pt: "Olá%20Stella%2C%20gostaria%20de%20anunciar%20meu%20imóvel",
    en: "Hello%20Stella%2C%20I%20would%20like%20to%20list%20my%20property",
    es: "Hola%20Stella%2C%20me%20gustaría%20publicar%20mi%20propiedad"
  }

  // Email subjects by language
  const emailSubjects = {
    pt: "Anunciar%20Imóvel",
    en: "List%20Property",
    es: "Publicar%20Propiedad"
  }

  // Email bodies by language
  const emailBodies = {
    pt: "Olá%20Stella%2C%0A%0AGostaria%20de%20anunciar%20meu%20imóvel.%0A%0AInformações%20do%20imóvel%3A%0A-%20Tipo%3A%20%0A-%20Localização%3A%20%0A-%20Metragem%3A%20%0A-%20Preço%20desejado%3A%20%0A%0AObrigado!",
    en: "Hello%20Stella%2C%0A%0AI%20would%20like%20to%20list%20my%20property.%0A%0AProperty%20details%3A%0A-%20Type%3A%20%0A-%20Location%3A%20%0A-%20Size%3A%20%0A-%20Desired%20price%3A%20%0A%0AThank%20you!",
    es: "Hola%20Stella%2C%0A%0AMe%20gustaría%20publicar%20mi%20propiedad.%0A%0ADetalles%20de%20la%20propiedad%3A%0A-%20Tipo%3A%20%0A-%20Ubicación%3A%20%0A-%20Tamaño%3A%20%0A-%20Precio%20deseado%3A%20%0A%0A¡Gracias!"
  }

  const handleWhatsAppClick = () => {
    const message = whatsappMessages[currentLang as keyof typeof whatsappMessages] || whatsappMessages.pt
    window.open(`https://wa.me/5511986410429?text=${message}`, '_blank')
  }

  const handleEmailClick = () => {
    const subject = emailSubjects[currentLang as keyof typeof emailSubjects] || emailSubjects.pt
    const body = emailBodies[currentLang as keyof typeof emailBodies] || emailBodies.pt
    window.location.href = `mailto:stellamary@creci.org.br?subject=${subject}&body=${body}`
  }

  const benefits = [
    {
      icon: Camera,
      title: t('pages.listYourProperty.benefits.photography.title'),
      description: t('pages.listYourProperty.benefits.photography.description')
    },
    {
      icon: TrendingUp,
      title: t('pages.listYourProperty.benefits.marketing.title'),
      description: t('pages.listYourProperty.benefits.marketing.description')
    },
    {
      icon: Award,
      title: t('pages.listYourProperty.benefits.evaluation.title'),
      description: t('pages.listYourProperty.benefits.evaluation.description')
    },
    {
      icon: Users,
      title: t('pages.listYourProperty.benefits.service.title'),
      description: t('pages.listYourProperty.benefits.service.description')
    },
    {
      icon: Home,
      title: t('pages.listYourProperty.benefits.visits.title'),
      description: t('pages.listYourProperty.benefits.visits.description')
    },
    {
      icon: Clock,
      title: t('pages.listYourProperty.benefits.speed.title'),
      description: t('pages.listYourProperty.benefits.speed.description')
    }
  ]

  const steps = [
    {
      number: '01',
      title: t('pages.listYourProperty.howItWorks.step1.title'),
      description: t('pages.listYourProperty.howItWorks.step1.description')
    },
    {
      number: '02',
      title: t('pages.listYourProperty.howItWorks.step2.title'),
      description: t('pages.listYourProperty.howItWorks.step2.description')
    },
    {
      number: '03',
      title: t('pages.listYourProperty.howItWorks.step3.title'),
      description: t('pages.listYourProperty.howItWorks.step3.description')
    },
    {
      number: '04',
      title: t('pages.listYourProperty.howItWorks.step4.title'),
      description: t('pages.listYourProperty.howItWorks.step4.description')
    }
  ]

  return (
    <>
      <SEO
        title={currentSeo.title}
        description={currentSeo.description}
        keywords={currentSeo.keywords}
        canonicalUrl={currentSeo.canonical}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: currentLang === 'pt' ? 'Serviço de Venda de Imóveis de Luxo' : currentLang === 'es' ? 'Servicio de Venta de Propiedades de Lujo' : 'Luxury Real Estate Sales Service',
          provider: {
            '@type': 'RealEstateAgent',
            name: 'Stella Real Estate',
            url: 'https://stellareal.com.br',
            email: 'stellamary@creci.org.br',
            telephone: '+5511986410429'
          },
          areaServed: {
            '@type': 'City',
            name: 'São Paulo',
            '@id': 'https://www.wikidata.org/wiki/Q174'
          },
          description: currentSeo.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BRL',
            description: currentLang === 'pt' ? 'Avaliação gratuita de imóvel' : currentLang === 'es' ? 'Evaluación gratuita de propiedad' : 'Free property evaluation'
          }
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 dark:from-brand-700 dark:via-brand-800 dark:to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="container-padded py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {t('pages.listYourProperty.hero.title')} <span className="text-brand-200">{t('pages.listYourProperty.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-brand-50 mb-10 max-w-2xl mx-auto">
              {t('pages.listYourProperty.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleWhatsAppClick}
                className="group w-full sm:w-auto bg-white hover:bg-brand-50 text-brand-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t('pages.listYourProperty.hero.ctaWhatsApp')}</span>
              </button>
              
              <button
                onClick={handleEmailClick}
                className="group w-full sm:w-auto bg-brand-500/20 hover:bg-brand-500/30 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t('pages.listYourProperty.hero.ctaEmail')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('pages.listYourProperty.benefits.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('pages.listYourProperty.benefits.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-brand-50 hover:to-brand-100 dark:hover:from-brand-900/20 dark:hover:to-brand-800/20 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-14 h-14 bg-brand-600 dark:bg-brand-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container-padded">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('pages.listYourProperty.howItWorks.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('pages.listYourProperty.howItWorks.subtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-brand-400 to-brand-200 dark:from-brand-600 dark:to-brand-800 -translate-x-1/2" 
                      style={{ width: 'calc(100% - 4rem)' }} 
                    />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 text-white">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('pages.listYourProperty.contact.title')}
            </h2>
            <p className="text-xl text-brand-100 mb-12">
              {t('pages.listYourProperty.contact.subtitle')}
            </p>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* WhatsApp Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/20">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('pages.listYourProperty.contact.whatsapp.title')}</h3>
                <p className="text-brand-100 mb-6">{t('pages.listYourProperty.contact.whatsapp.description')}</p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('pages.listYourProperty.contact.whatsapp.cta')}
                </button>
                <p className="text-sm text-brand-200 mt-4">{t('pages.listYourProperty.contact.whatsapp.number')}</p>
              </div>

              {/* Email Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 border border-white/20">
                <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t('pages.listYourProperty.contact.email.title')}</h3>
                <p className="text-brand-100 mb-6">{t('pages.listYourProperty.contact.email.description')}</p>
                <button
                  onClick={handleEmailClick}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('pages.listYourProperty.contact.email.cta')}
                </button>
                <p className="text-sm text-brand-200 mt-4">{t('pages.listYourProperty.contact.email.address')}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 items-center pt-8 border-t border-white/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-brand-100">{t('pages.listYourProperty.contact.badges.personalized')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-brand-100">{t('pages.listYourProperty.contact.badges.freeEvaluation')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-brand-100">{t('pages.listYourProperty.contact.badges.transparent')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
