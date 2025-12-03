import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { fetchAllProjects } from '../../services/projects'
import type { Project } from '../../types/projects'
import { useCurrency } from '../../context/CurrencyContext'

export default function ProjectsIndex() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'high-to-low' | 'low-to-high'>('high-to-low')
  const { formatPrice } = useCurrency()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { t, i18n } = useTranslation()
  
  // SEO content based on language
  const seoContent = useMemo(() => {
    const lang = i18n.language
    
    if (lang === 'en') {
      return {
        title: 'New Real Estate Projects in Brazil | Luxury Developments | Stella Real Estate',
        description: 'Discover exclusive new real estate developments in Brazil. Browse luxury apartments, penthouses, and residential projects in São Paulo, Rio de Janeiro, and more. Premium properties from trusted developers.',
        keywords: 'new real estate projects Brazil, luxury developments Brazil, new apartments São Paulo, residential projects Rio de Janeiro, new construction Brazil, pre-launch properties, off-plan properties Brazil, luxury condos Brazil',
        ogTitle: 'New Real Estate Projects in Brazil - Stella Real Estate',
        ogDescription: 'Explore exclusive new developments and luxury projects across Brazil. Premium apartments, penthouses, and residential properties from top developers.',
        h1: 'New Real Estate Projects in Brazil',
        subtitle: 'Discover exclusive developments and luxury properties from Brazil\'s top developers. Browse pre-launch and under-construction projects with premium amenities.',
      }
    } else if (lang === 'es') {
      return {
        title: 'Nuevos Proyectos Inmobiliarios en Brasil | Desarrollos de Lujo | Stella Real Estate',
        description: 'Descubre desarrollos inmobiliarios exclusivos en Brasil. Explora apartamentos de lujo, penthouses y proyectos residenciales en São Paulo, Río de Janeiro y más. Propiedades premium de desarrolladores confiables.',
        keywords: 'nuevos proyectos inmobiliarios Brasil, desarrollos de lujo Brasil, apartamentos nuevos São Paulo, proyectos residenciales Río de Janeiro, construcción nueva Brasil, propiedades pre-lanzamiento, propiedades sobre plano Brasil',
        ogTitle: 'Nuevos Proyectos Inmobiliarios en Brasil - Stella Real Estate',
        ogDescription: 'Explora desarrollos exclusivos y proyectos de lujo en todo Brasil. Apartamentos premium, penthouses y propiedades residenciales de los mejores desarrolladores.',
        h1: 'Nuevos Proyectos Inmobiliarios en Brasil',
        subtitle: 'Descubre desarrollos exclusivos y propiedades de lujo de los mejores desarrolladores de Brasil. Explora proyectos en pre-lanzamiento y en construcción con amenidades premium.',
      }
    } else {
      // Portuguese (default)
      return {
        title: 'Lançamentos Imobiliários no Brasil | Empreendimentos de Luxo | Stella Real Estate',
        description: 'Descubra lançamentos imobiliários exclusivos no Brasil. Explore apartamentos de luxo, coberturas e projetos residenciais em São Paulo, Rio de Janeiro e mais. Imóveis premium de incorporadoras confiáveis.',
        keywords: 'lançamentos imobiliários Brasil, empreendimentos de luxo Brasil, apartamentos novos São Paulo, projetos residenciais Rio de Janeiro, construção nova Brasil, imóveis pré-lançamento, imóveis na planta Brasil, condomínios de luxo Brasil',
        ogTitle: 'Lançamentos Imobiliários no Brasil - Stella Real Estate',
        ogDescription: 'Explore empreendimentos exclusivos e projetos de luxo em todo o Brasil. Apartamentos premium, coberturas e imóveis residenciais das melhores incorporadoras.',
        h1: 'Lançamentos Imobiliários no Brasil',
        subtitle: 'Descubra empreendimentos exclusivos e imóveis de luxo das melhores incorporadoras do Brasil. Navegue por projetos em pré-lançamento e em construção com amenidades premium.',
      }
    }
  }, [i18n.language])

  // Generate structured data for SEO
  const structuredData = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.stellareal.com.br'
    
    // ItemList for all projects
    const itemListData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': seoContent.h1,
      'description': seoContent.description,
      'numberOfItems': items.length,
      'itemListElement': items.slice(0, 20).map((project, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Apartment',
          '@id': `${baseUrl}/projetos/${project.slug}`,
          'name': project.name,
          'url': `${baseUrl}/projetos/${project.slug}`,
          'description': project.description || `${project.name} - Lançamento imobiliário exclusivo`,
          'image': project.heroImageUrl || (project.media && project.media[0]?.url),
          'address': project.city && project.state ? {
            '@type': 'PostalAddress',
            'addressLocality': project.city,
            'addressRegion': project.state,
            'addressCountry': 'BR'
          } : undefined,
          'offers': typeof project.price === 'number' ? {
            '@type': 'Offer',
            'price': project.price,
            'priceCurrency': 'BRL',
            'availability': 'https://schema.org/InStock',
            'seller': {
              '@type': 'Organization',
              'name': 'Stella Real Estate'
            }
          } : undefined
        }
      }))
    }

    // WebPage structured data
    const webPageData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${baseUrl}/projetos`,
      'url': `${baseUrl}/projetos`,
      'name': seoContent.title,
      'description': seoContent.description,
      'inLanguage': i18n.language,
      'isPartOf': {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        'url': baseUrl,
        'name': 'Stella Real Estate'
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': baseUrl
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': i18n.language === 'pt' ? 'Projetos' : i18n.language === 'es' ? 'Proyectos' : 'Projects',
            'item': `${baseUrl}/projetos`
          }
        ]
      }
    }

    return [itemListData, webPageData]
  }, [items, seoContent, i18n.language])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const rows = await fetchAllProjects()
        setItems(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Sort projects by price
  const sortedItems = useMemo(() => {
    const validItems = items.filter(p => typeof p.price === 'number' && Number.isFinite(p.price))
    const invalidItems = items.filter(p => !(typeof p.price === 'number' && Number.isFinite(p.price)))
    
    validItems.sort((a, b) => {
      const priceA = a.price as number
      const priceB = b.price as number
      return sortOrder === 'high-to-low' ? priceB - priceA : priceA - priceB
    })
    
    return [...validItems, ...invalidItems]
  }, [items, sortOrder])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'pending':
      case 'draft':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoContent.title}</title>
        <meta name="title" content={seoContent.title} />
        <meta name="description" content={seoContent.description} />
        <meta name="keywords" content={seoContent.keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://www.stellareal.com.br/projetos'} />
        <meta property="og:title" content={seoContent.ogTitle} />
        <meta property="og:description" content={seoContent.ogDescription} />
        <meta property="og:image" content={items[0]?.heroImageUrl || 'https://www.stellareal.com.br/stella-og-image.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Stella Real Estate" />
        <meta property="og:locale" content={i18n.language === 'pt' ? 'pt_BR' : i18n.language === 'es' ? 'es_ES' : 'en_US'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={typeof window !== 'undefined' ? window.location.href : 'https://www.stellareal.com.br/projetos'} />
        <meta name="twitter:title" content={seoContent.ogTitle} />
        <meta name="twitter:description" content={seoContent.ogDescription} />
        <meta name="twitter:image" content={items[0]?.heroImageUrl || 'https://www.stellareal.com.br/stella-og-image.png'} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href="https://www.stellareal.com.br/projetos" />
        
        {/* Language Alternates */}
        <link rel="alternate" hrefLang="pt-BR" href="https://www.stellareal.com.br/projetos" />
        <link rel="alternate" hrefLang="en" href="https://www.stellareal.com.br/en/projetos" />
        <link rel="alternate" hrefLang="es" href="https://www.stellareal.com.br/es/projetos" />
        <link rel="alternate" hrefLang="x-default" href="https://www.stellareal.com.br/projetos" />
        
        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(data)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -mt-20 pt-20">
        {/* Hero Section with SEO Content */}
        <section className="container-padded py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {seoContent.h1}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {seoContent.subtitle}
            </p>
            {items.length > 0 && (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
                <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{items.length}</strong> {items.length === 1 ? 'empreendimento disponível' : 'empreendimentos disponíveis'}
              </p>
            )}
          </div>
        </section>
        
        {/* Content Section */}
        <section className="container-padded py-12">
        {error && (
          <div className="max-w-7xl mx-auto mb-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading projects…</p>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div className="max-w-7xl mx-auto">
            {items.length > 0 ? (
              <>
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t('pages.projects.showing')} <span className="font-semibold text-slate-900 dark:text-slate-100">{items.length}</span> {items.length === 1 ? t('pages.projects.project') : t('pages.projects.projects')}
                  </p>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="sort-order" className="text-sm text-slate-600 dark:text-slate-400">
                      {t('pages.projects.sortBy')}:
                    </label>
                    <select
                      id="sort-order"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'high-to-low' | 'low-to-high')}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    >
                      <option value="high-to-low">{t('pages.projects.priceHighToLow')}</option>
                      <option value="low-to-high">{t('pages.projects.priceLowToHigh')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedItems.map((p) => {
                    const perUnit: number | null = typeof p.price === 'number' && Number.isFinite(p.price) ? p.price : null
                    const neighborhood = p.features?.neighborhood || 'Jardim Europa'
                    const location = [neighborhood, p.city, p.state].filter(Boolean).join(', ')
                    const features = p.features || {}
                    const isHovered = hoveredId === p.id
                    const secondPhoto = (p.media || []).filter((m: any) => m.kind !== 'video_bg' && m.kind !== 'thumbnail')[0]?.url || (p.media || [])[1]?.url
                    const displayImage = isHovered && secondPhoto ? secondPhoto : p.heroImageUrl
                    
                    // Calculate area range
                    const units = features.units || []
                    const areas = units.map(u => u.areaM2).filter((a): a is number => typeof a === 'number' && Number.isFinite(a))
                    const minArea = areas.length > 0 ? Math.min(...areas) : features.areaPrivateM2 || features.areaTotalM2
                    const maxArea = areas.length > 0 ? Math.max(...areas) : features.areaPrivateM2 || features.areaTotalM2
                    const areaDisplay = minArea && maxArea && minArea !== maxArea 
                      ? `${Math.round(minArea)}-${Math.round(maxArea)} m²`
                      : minArea 
                        ? `${Math.round(minArea)} m²`
                        : null
                    
                    // Calculate bedroom range
                    const bedrooms = units.map(u => u.bedrooms).filter((b): b is number => typeof b === 'number' && Number.isFinite(b))
                    const minBed = bedrooms.length > 0 ? Math.min(...bedrooms) : features.bedrooms
                    const maxBed = bedrooms.length > 0 ? Math.max(...bedrooms) : features.bedrooms
                    const bedroomDisplay = minBed && maxBed && minBed !== maxBed
                      ? `${minBed}-${maxBed} ${t('pages.projects.bedrooms')}`
                      : minBed
                        ? `${minBed} ${minBed === 1 ? t('pages.projects.bedroom') : t('pages.projects.bedrooms')}`
                        : null
                    
                    return (
                      <Link
                        key={p.id}
                        to={`/projetos/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        onMouseEnter={() => setHoveredId(p.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={p.name}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-16 h-16 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          {p.status && (
                            <div className="absolute top-3 right-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(p.status)}`}>
                                {p.status === 'new' ? t('pages.projects.statusNew') : 
                                 p.status === 'active' ? t('pages.projects.statusActive') : 
                                 p.status === 'pending' ? t('pages.projects.statusPending') :
                                 p.status === 'draft' ? t('pages.projects.statusDraft') :
                                 p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                              </span>
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {p.name}
                          </h3>
                          
                          {location && (
                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 mb-3">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{location}</span>
                            </div>
                          )}

                          {/* Key Features - Bedrooms and Area */}
                          {(bedroomDisplay || areaDisplay) && (
                            <div className="flex items-center gap-4 mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                              {bedroomDisplay && (
                                <div className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  <span>{bedroomDisplay}</span>
                                </div>
                              )}
                              {areaDisplay && (
                                <div className="flex items-center gap-1.5">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                  <span>{areaDisplay}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Additional Features Grid */}
                          {(features.bathrooms || features.parkingSpaces) && (
                            <div className="flex items-center gap-4 mb-4 text-xs text-slate-600 dark:text-slate-400">
                              {features.bathrooms && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{features.bathrooms} {t('pages.projects.bathrooms')}</span>
                                </div>
                              )}
                              {features.parkingSpaces && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                  <span>{features.parkingSpaces} {t('pages.projects.parking')}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price */}
                          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 px-4 py-3">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                                  {t('pages.projects.startingFrom')}
                                </div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                  {formatPrice(perUnit, { fallback: t('pages.projects.contactUs') })}
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <svg className="mx-auto w-24 h-24 text-slate-300 dark:text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">{t('pages.projects.noProjects')}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t('pages.projects.checkBackSoon')}</p>
              </div>
            )}
          </div>
        )}
      </section>
      </div>
    </>
  )
}
