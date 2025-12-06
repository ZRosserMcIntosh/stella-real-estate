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
  Link as LinkIcon,
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  Home,
  Building2,
  Users,
  Phone,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  Save,
  Eye,
  Undo,
  Redo,
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Upload,
  X
} from 'lucide-react'

// Types for the editor
interface SiteSection {
  id: string
  name: string
  nameEn: string
  icon: React.ReactNode
  enabled: boolean
}

interface SiteSettings {
  siteName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  font: string
  contactEmail: string
  contactPhone: string
  whatsapp: string
  address: string
  socialLinks: {
    instagram: string
    facebook: string
    linkedin: string
    youtube: string
  }
}

export default function ConstellationSiteBuilder() {
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [activeLeftTab, setActiveLeftTab] = useState<'sections' | 'pages' | 'theme'>('sections')
  const [selectedSection, setSelectedSection] = useState<string | null>('hero')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')

  // Default sections for a real estate site
  const [sections, setSections] = useState<SiteSection[]>([
    { id: 'hero', name: 'Banner Principal', nameEn: 'Hero Banner', icon: <Home className="w-4 h-4" />, enabled: true },
    { id: 'featured', name: 'Imóveis Destaque', nameEn: 'Featured Listings', icon: <Building2 className="w-4 h-4" />, enabled: true },
    { id: 'about', name: 'Sobre Nós', nameEn: 'About Us', icon: <Users className="w-4 h-4" />, enabled: true },
    { id: 'services', name: 'Serviços', nameEn: 'Services', icon: <Layers className="w-4 h-4" />, enabled: true },
    { id: 'testimonials', name: 'Depoimentos', nameEn: 'Testimonials', icon: <FileText className="w-4 h-4" />, enabled: false },
    { id: 'contact', name: 'Contato', nameEn: 'Contact', icon: <Phone className="w-4 h-4" />, enabled: true },
  ])

  // Site settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: '',
    logo: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    font: 'Inter',
    contactEmail: '',
    contactPhone: '',
    whatsapp: '',
    address: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: '',
    }
  })

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
          <div className="px-4">
            <div className="flex items-center justify-between h-12">
              {/* Left - Toggle & Site URL */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                  className={`p-2 rounded-lg transition-all ${leftPanelOpen ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  title={isPt ? 'Alternar painel esquerdo' : 'Toggle left panel'}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="hidden sm:flex items-center gap-2">
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

              {/* Center - Device Preview Toggle + Undo/Redo */}
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-1">
                  <button
                    className="p-2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-30"
                    disabled
                    title="Undo"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-30"
                    disabled
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-1.5 rounded-md transition-all ${
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
                    className={`p-1.5 rounded-md transition-all ${
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
                    className={`p-1.5 rounded-md transition-all ${
                      previewMode === 'mobile' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                    title="Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
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
                <button
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    hasUnsavedChanges 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="w-4 h-4" />
                  {isPt ? 'Salvar' : 'Save'}
                </button>
                <button
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className={`p-2 rounded-lg transition-all ${rightPanelOpen ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                  title={isPt ? 'Alternar painel direito' : 'Toggle right panel'}
                >
                  <PanelRightClose className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Three Panel Layout */}
        <div className="flex h-[calc(100vh-7rem-3rem)]">
          
          {/* Left Panel - Sections & Navigation */}
          <div className={`bg-slate-900/80 border-r border-slate-700/50 transition-all duration-300 flex flex-col ${leftPanelOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-700/50">
              <button
                onClick={() => setActiveLeftTab('sections')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                  activeLeftTab === 'sections' 
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 mx-auto mb-1" />
                {isPt ? 'Seções' : 'Sections'}
              </button>
              <button
                onClick={() => setActiveLeftTab('pages')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                  activeLeftTab === 'pages' 
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 mx-auto mb-1" />
                {isPt ? 'Páginas' : 'Pages'}
              </button>
              <button
                onClick={() => setActiveLeftTab('theme')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                  activeLeftTab === 'theme' 
                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4 mx-auto mb-1" />
                {isPt ? 'Tema' : 'Theme'}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {activeLeftTab === 'sections' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {isPt ? 'Seções do Site' : 'Site Sections'}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-indigo-400 transition-colors" title={isPt ? 'Adicionar seção' : 'Add section'}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                        selectedSection === section.id
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                          : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      <GripVertical className="w-3 h-3 text-slate-600 group-hover:text-slate-400 cursor-grab" />
                      <div className={`p-1.5 rounded ${selectedSection === section.id ? 'bg-indigo-500/20' : 'bg-slate-700/50'}`}>
                        {section.icon}
                      </div>
                      <span className="flex-1 text-left text-sm font-medium truncate">
                        {isPt ? section.name : section.nameEn}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${section.enabled ? 'bg-green-400' : 'bg-slate-600'}`} />
                    </button>
                  ))}
                </div>
              )}

              {activeLeftTab === 'pages' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {isPt ? 'Páginas' : 'Pages'}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-indigo-400 transition-colors" title={isPt ? 'Adicionar página' : 'Add page'}>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {['Home', 'Imóveis', 'Sobre', 'Contato'].map((page) => (
                    <button
                      key={page}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="flex-1 text-left text-sm font-medium">{page}</span>
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  ))}
                </div>
              )}

              {activeLeftTab === 'theme' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Cor Primária' : 'Primary Color'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) => {
                          setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteSettings.primaryColor}
                        onChange={(e) => {
                          setSiteSettings(prev => ({ ...prev, primaryColor: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Cor Secundária' : 'Secondary Color'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={siteSettings.secondaryColor}
                        onChange={(e) => {
                          setSiteSettings(prev => ({ ...prev, secondaryColor: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        className="w-10 h-10 rounded-lg border border-slate-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={siteSettings.secondaryColor}
                        onChange={(e) => {
                          setSiteSettings(prev => ({ ...prev, secondaryColor: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Fonte' : 'Font'}
                    </label>
                    <select
                      value={siteSettings.font}
                      onChange={(e) => {
                        setSiteSettings(prev => ({ ...prev, font: e.target.value }))
                        setHasUnsavedChanges(true)
                      }}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - Preview Area */}
          <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-auto">
              <div className={`mx-auto transition-all duration-300 h-full ${getPreviewWidth()}`}>
                {/* Browser Frame */}
                <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl h-full flex flex-col">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 border-b border-slate-700/50 flex-shrink-0">
                    {/* Traffic Lights */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    
                    {/* URL Bar */}
                    <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-md border border-slate-600/50">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400 truncate">
                        {siteUrl}
                      </span>
                    </div>
                  </div>

                  {/* iFrame Container */}
                  <div className="relative bg-white flex-1">
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
          </div>

          {/* Right Panel - Properties Editor */}
          <div className={`bg-slate-900/80 border-l border-slate-700/50 transition-all duration-300 flex flex-col ${rightPanelOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
            {/* Panel Header */}
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {selectedSection 
                  ? (isPt ? sections.find(s => s.id === selectedSection)?.name : sections.find(s => s.id === selectedSection)?.nameEn)
                  : (isPt ? 'Propriedades' : 'Properties')
                }
              </h3>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded transition-colors" title={isPt ? 'Duplicar' : 'Duplicate'}>
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title={isPt ? 'Excluir' : 'Delete'}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Properties Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedSection === 'hero' && (
                <div className="space-y-4">
                  {/* Section Enable Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-sm text-slate-300">{isPt ? 'Seção ativa' : 'Section active'}</span>
                    <button
                      onClick={() => {
                        setSections(prev => prev.map(s => 
                          s.id === 'hero' ? { ...s, enabled: !s.enabled } : s
                        ))
                        setHasUnsavedChanges(true)
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        sections.find(s => s.id === 'hero')?.enabled ? 'bg-green-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        sections.find(s => s.id === 'hero')?.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Hero Title */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Título Principal' : 'Main Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={isPt ? 'Encontre seu imóvel ideal' : 'Find your ideal property'}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 placeholder-slate-500"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>

                  {/* Hero Subtitle */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Subtítulo' : 'Subtitle'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isPt ? 'Descrição do seu negócio...' : 'Description of your business...'}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 placeholder-slate-500 resize-none"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>

                  {/* Hero Background */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Imagem de Fundo' : 'Background Image'}
                    </label>
                    <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-6 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {isPt ? 'Arraste ou clique para enviar' : 'Drag or click to upload'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG até 5MB</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Texto do Botão' : 'Button Text'}
                    </label>
                    <input
                      type="text"
                      placeholder={isPt ? 'Ver Imóveis' : 'View Properties'}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-sm text-slate-300 placeholder-slate-500"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                </div>
              )}

              {selectedSection && selectedSection !== 'hero' && (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    {isPt 
                      ? 'Selecione elementos no preview para editar' 
                      : 'Select elements in the preview to edit'}
                  </p>
                </div>
              )}

              {!selectedSection && (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">
                    {isPt 
                      ? 'Selecione uma seção para editar' 
                      : 'Select a section to edit'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
