import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabaseClient'
import { getSubdomain } from '../utils/subdomain'
import { Phone, Mail, MapPin, Building2, Home, Sparkles } from 'lucide-react'

interface UserData {
  id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  creci_number?: string
  creci_uf?: string
  subdomain: string
  selected_plan?: string
}

interface SiteConfig {
  id: string
  subdomain: string
  site_name?: string
  site_tagline?: string
  site_description?: string
  logo_url?: string
  cover_image_url?: string
  primary_color?: string
  secondary_color?: string
  font_heading?: string
  font_body?: string
  contact_email?: string
  contact_phone?: string
  contact_whatsapp?: string
  contact_address?: string
  social_instagram?: string
  social_facebook?: string
  social_linkedin?: string
  social_youtube?: string
  hero_title?: string
  hero_subtitle?: string
  hero_background_url?: string
  hero_cta_text?: string
  about_title?: string
  about_description?: string
  sections?: any[]
  is_published?: boolean
}

export default function UserSite() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const subdomain = getSubdomain()

  useEffect(() => {
    if (!subdomain) {
      setError('Subdomain not found')
      setLoading(false)
      return
    }

    fetchSiteData()
  }, [subdomain])

  const fetchSiteData = async () => {
    try {
      // First, fetch user data from founding_members
      const { data: memberData, error: memberError } = await supabase
        .from('founding_members')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (memberError || !memberData) {
        setError('Site not found')
        setLoading(false)
        return
      }

      setUserData(memberData)

      // Then, fetch site config (user's customizations)
      const { data: configData, error: configError } = await supabase
        .from('site_configs')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (configData) {
        setSiteConfig(configData)
      }
      // It's okay if no config exists - we'll use defaults from userData

    } catch (err) {
      console.error('Error loading site:', err)
      setError('Error loading site')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
            <Building2 className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Site não encontrado</h1>
          <p className="text-slate-400 mb-6">
            O site que você está procurando não existe ou ainda não foi configurado.
          </p>
          <a
            href="https://constellation.stellareal.com.br"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Criar meu site grátis
          </a>
        </div>
      </div>
    )
  }

  const firstName = userData.full_name?.split(' ')[0] || 'Corretor'
  
  // Use siteConfig values if available, otherwise fall back to userData
  const siteName = siteConfig?.site_name || userData.full_name
  const siteTitle = siteName ? `${siteName} - Corretor de Imóveis` : 'Corretor de Imóveis'
  const siteDescription = siteConfig?.site_description || `Encontre o imóvel ideal com ${userData.full_name}. Atendimento personalizado e as melhores oportunidades do mercado.`
  const heroTitle = siteConfig?.hero_title || 'Encontre o imóvel dos seus sonhos'
  const heroSubtitle = siteConfig?.hero_subtitle || siteDescription
  const primaryColor = siteConfig?.primary_color || '#6366f1'
  const contactPhone = siteConfig?.contact_phone || userData.phone
  const contactEmail = siteConfig?.contact_email || userData.email
  const contactWhatsapp = siteConfig?.contact_whatsapp || contactPhone
  const logoUrl = siteConfig?.logo_url

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${subdomain}.stellareal.com.br`} />
        <link rel="canonical" href={`https://${subdomain}.stellareal.com.br`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${siteConfig?.secondary_color || '#8b5cf6'})` }}>
                    {firstName.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="font-semibold text-slate-900">{siteName}</h1>
                  {userData.creci_number && (
                    <p className="text-xs text-slate-500">CRECI {userData.creci_number}/{userData.creci_uf}</p>
                  )}
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#imoveis" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Imóveis</a>
                <a href="#sobre" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Sobre</a>
                <a href="#contato" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Contato</a>
              </nav>
              {contactWhatsapp && (
                <a
                  href={`https://wa.me/55${contactWhatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm mb-6"
                style={{ 
                  backgroundColor: `${primaryColor}10`, 
                  borderColor: `${primaryColor}30`, 
                  color: primaryColor 
                }}
              >
                <Home className="w-4 h-4" />
                {userData.company_name || 'Corretor de Imóveis'}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                {heroTitle.split(' ').map((word, i) => 
                  word.toLowerCase() === 'sonhos' || word.toLowerCase() === 'ideal' 
                    ? <span key={i} style={{ color: primaryColor }}>{word} </span> 
                    : word + ' '
                )}
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#imoveis"
                  className="px-8 py-4 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  {siteConfig?.hero_cta_text || 'Ver Imóveis'}
                </a>
                <a
                  href="#contato"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl border border-slate-200"
                >
                  Entrar em Contato
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Listings Placeholder */}
        <section id="imoveis" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Imóveis em Destaque</h2>
              <p className="text-slate-600">Os melhores imóveis selecionados para você</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder cards - will be replaced with actual listings */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-700 mb-2">Em breve</h3>
                  <p className="text-sm text-slate-500">Novos imóveis sendo adicionados</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Sobre</h2>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                {firstName.charAt(0)}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">{userData.full_name}</h3>
              {userData.creci_number && (
                <p className="text-indigo-600 font-medium mb-4">CRECI {userData.creci_number}/{userData.creci_uf}</p>
              )}
              {userData.company_name && (
                <p className="text-slate-600 mb-6">{userData.company_name}</p>
              )}
              <p className="text-slate-600 leading-relaxed">
                Corretor de imóveis especializado em ajudar você a encontrar o imóvel perfeito. 
                Com atendimento personalizado e conhecimento do mercado local, estou aqui para 
                tornar sua jornada imobiliária mais fácil e segura.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contato" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Entre em Contato</h2>
              <p className="text-slate-600 mb-8">
                Estou pronto para ajudar você a encontrar o imóvel ideal. Entre em contato!
              </p>
              <div className="space-y-4">
                {contactWhatsapp && (
                  <a
                    href={`https://wa.me/55${contactWhatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    WhatsApp: {contactPhone}
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-medium transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {contactEmail}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain brightness-0 invert" />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${siteConfig?.secondary_color || '#8b5cf6'})` }}
                  >
                    {firstName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{siteName}</p>
                  {userData.creci_number && (
                    <p className="text-xs text-slate-400">CRECI {userData.creci_number}/{userData.creci_uf}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Powered by</span>
                <a href="https://constellation.stellareal.com.br" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Constellation
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
