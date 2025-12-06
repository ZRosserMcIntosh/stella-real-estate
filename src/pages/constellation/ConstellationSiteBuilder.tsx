import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { 
  Globe, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Settings,
  ArrowLeft,
  Maximize2,
  Link as LinkIcon
} from 'lucide-react'

export default function ConstellationSiteBuilder() {
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')

  useEffect(() => {
    if (authLoading) return
    
    if (!session) {
      navigate(ConstellationUrls.login(), { replace: true })
      return
    }

    fetchMemberData()
  }, [session, authLoading])

  const fetchMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      if (data) {
        setMemberData(data)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setIframeLoading(true)
    setIframeKey(prev => prev + 1)
  }

  const siteUrl = memberData?.subdomain 
    ? `https://${memberData.subdomain}.stellareal.com.br`
    : null

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-[375px]'
      case 'tablet': return 'max-w-[768px]'
      default: return 'max-w-full'
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Construtor de Sites - Constellation</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConstellationAuthHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400">{isPt ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </>
    )
  }

  // No subdomain set - prompt user to set one
  if (!memberData?.subdomain) {
    return (
      <>
        <Helmet>
          <title>Construtor de Sites - Constellation</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConstellationAuthHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                {isPt ? 'Configure seu Subdomínio' : 'Set Up Your Subdomain'}
              </h1>
              <p className="text-slate-300 mb-6">
                {isPt 
                  ? 'Você precisa escolher um subdomínio para seu site antes de continuar.'
                  : 'You need to choose a subdomain for your site before continuing.'}
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                {isPt ? 'Ir para o Dashboard' : 'Go to Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{memberData.subdomain}.stellareal.com.br - Construtor de Sites</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      
      <div className="min-h-screen bg-slate-950 pt-28">
        {/* Toolbar */}
        <div className="sticky top-28 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
          <div className="container-padded">
            <div className="flex items-center justify-between h-14">
              {/* Left - Site URL */}
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-600/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-slate-300 font-medium">
                      {memberData.subdomain}.stellareal.com.br
                    </span>
                  </div>
                  <a
                    href={siteUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                    title={isPt ? 'Abrir em nova aba' : 'Open in new tab'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Center - Device Preview Toggle */}
              <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md transition-all ${
                    previewMode === 'desktop' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-md transition-all ${
                    previewMode === 'tablet' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md transition-all ${
                    previewMode === 'mobile' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Right - Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                  title={isPt ? 'Atualizar' : 'Refresh'}
                >
                  <RefreshCw className={`w-4 h-4 ${iframeLoading ? 'animate-spin' : ''}`} />
                </button>
                <a
                  href={siteUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all text-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                  {isPt ? 'Tela Cheia' : 'Full Screen'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-4 md:p-8 bg-slate-950">
          <div className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
            {/* Browser Frame */}
            <div className="bg-slate-800 rounded-t-xl border border-slate-700/50 overflow-hidden shadow-2xl">
              {/* Browser Top Bar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/80 border-b border-slate-700/50">
                {/* Traffic Lights */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                {/* URL Bar */}
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-md border border-slate-600/50">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-400 truncate">
                    {siteUrl}
                  </span>
                </div>
              </div>

              {/* iFrame Container */}
              <div className="relative bg-white" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                      <p className="text-slate-600 text-sm">{isPt ? 'Carregando seu site...' : 'Loading your site...'}</p>
                    </div>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={siteUrl!}
                  className="w-full h-full border-0"
                  onLoad={() => setIframeLoading(false)}
                  title={`Preview of ${memberData.subdomain}.stellareal.com.br`}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Site Info Footer */}
        <div className="border-t border-slate-800/50 bg-slate-900/30 py-6">
          <div className="container-padded">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">
                    {isPt ? 'Site ativo' : 'Site active'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-slate-400">
                    {memberData.subdomain}.stellareal.com.br
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all text-sm"
                >
                  <Settings className="w-4 h-4" />
                  {isPt ? 'Configurações' : 'Settings'}
                </Link>
                <a
                  href={siteUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {isPt ? 'Visitar Site' : 'Visit Site'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
