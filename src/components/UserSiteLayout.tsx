import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { getSubdomain } from '../utils/subdomain'
import { supabase } from '../lib/supabaseClient'
import UserSite from '../pages/UserSite'
import { Phone, Mail, Building2, Sparkles, Home, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

// Reserved subdomains that should NOT use UserSiteLayout
const RESERVED_SUBDOMAINS = ['constellation', 'stellamary', 'stellareal', 'www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'store', 'ballet']

interface UserData {
  id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  creci_number?: string
  creci_uf?: string
  subdomain: string
}

interface SiteConfig {
  site_name?: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  contact_phone?: string
  contact_email?: string
  contact_whatsapp?: string
}

/**
 * UserSiteLayout wraps all routes when on a user subdomain.
 * - For the homepage (/), it renders UserSite component
 * - For other paths, it shows a "coming soon" or "not available" message
 * - This prevents user subdomains from accessing Stella's content
 */
export default function UserSiteLayout() {
  const subdomain = getSubdomain()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  // If not a user subdomain, render the normal outlet
  if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain)) {
    return <Outlet />
  }

  useEffect(() => {
    fetchSiteData()
  }, [subdomain])

  const fetchSiteData = async () => {
    try {
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

      const { data: configData } = await supabase
        .from('site_configs')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (configData) {
        setSiteConfig(configData)
      }
    } catch (err) {
      setError('Error loading site')
    } finally {
      setLoading(false)
    }
  }

  // For the homepage, render the full UserSite
  if (location.pathname === '/') {
    return <UserSite />
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-500">Carregando...</p>
        </div>
      </div>
    )
  }

  // Error state - site not found
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

  const siteName = siteConfig?.site_name || userData.full_name
  const primaryColor = siteConfig?.primary_color || '#6366f1'
  const logoUrl = siteConfig?.logo_url
  const firstName = userData.full_name?.split(' ')[0] || 'Corretor'
  const contactWhatsapp = siteConfig?.contact_whatsapp || userData.phone

  // For other paths on user subdomains, show "Coming Soon" page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">SEU LOGO</span>
                </div>
              )}
              <div>
                <h1 className="font-semibold text-slate-900">{siteName}</h1>
                {userData.creci_number && (
                  <p className="text-xs text-slate-500">CRECI {userData.creci_number}{userData.creci_uf ? `/${userData.creci_uf}` : ''}</p>
                )}
              </div>
            </a>
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

      {/* Coming Soon Content */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Building2 className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Em Breve
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Esta seção do site está sendo preparada. Em breve você poderá ver todos os imóveis e serviços disponíveis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: primaryColor }}
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </a>
          {contactWhatsapp && (
            <a
              href={`https://wa.me/55${contactWhatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Phone className="w-5 h-5" />
              Fale Conosco
            </a>
          )}
        </div>

        <div className="mt-16 p-6 bg-slate-100 rounded-2xl">
          <p className="text-sm text-slate-500">
            Site criado com{' '}
            <a 
              href="https://constellation.stellareal.com.br" 
              className="font-medium hover:underline"
              style={{ color: primaryColor }}
            >
              Constellation
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-semibold mb-1">{siteName}</p>
          {userData.creci_number && (
            <p className="text-xs text-slate-400 mb-4">CRECI {userData.creci_number}{userData.creci_uf ? `/${userData.creci_uf}` : ''}</p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Powered by</span>
            <a href="https://constellation.stellareal.com.br" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Constellation
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
