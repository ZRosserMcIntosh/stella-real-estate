import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  schema?: object
}

export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://stellareal.com.br/og-image.jpg',
  ogType = 'website',
  author = 'Stella Real Estate',
  publishedTime,
  modifiedTime,
  schema
}: SEOProps) {
  const siteUrl = 'https://stellareal.com.br'
  const fullCanonicalUrl = canonicalUrl || siteUrl
  
  // Default structured data for the organization
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Stella Real Estate',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Corretora de imóveis de luxo em São Paulo especializada em apartamentos de alto padrão, coberturas e lançamentos exclusivos.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR'
    },
    areaServed: {
      '@type': 'City',
      name: 'São Paulo'
    },
    priceRange: 'Alto Padrão',
    telephone: '+55-11-XXXX-XXXX',
    sameAs: [
      'https://www.instagram.com/stellarealestate',
      'https://www.facebook.com/stellarealestate'
    ]
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Stella Real Estate" />
      <meta property="og:locale" content="pt_BR" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Portuguese" />
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  )
}
