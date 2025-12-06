import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import TemplatePicker, { TEMPLATES } from '../../components/constellation/TemplatePicker'
import SiteSettingsModal, { SiteSettingsData } from '../../components/constellation/SiteSettingsModal'
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
  X,
  Sparkles,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  BarChart3,
  MessageCircle
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
  favicon: string
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
  
  // Main top-level tab
  const [activeMainTab, setActiveMainTab] = useState<'designer' | 'settings' | 'listings'>('designer')
  
  // Template and settings modals
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('stella')
  
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')
  const isEs = i18n.language?.startsWith('es')

  // Default sections for a real estate site
  const [sections, setSections] = useState<SiteSection[]>([
    { id: 'hero', name: 'Banner Principal', nameEn: 'Hero Banner', icon: <Home className="w-4 h-4" />, enabled: true },
    { id: 'featured', name: 'Imóveis Destaque', nameEn: 'Featured Listings', icon: <Building2 className="w-4 h-4" />, enabled: true },
    { id: 'about', name: 'Sobre Nós', nameEn: 'About Us', icon: <Users className="w-4 h-4" />, enabled: true },
    { id: 'services', name: 'Serviços', nameEn: 'Services', icon: <Layers className="w-4 h-4" />, enabled: true },
    { id: 'testimonials', name: 'Depoimentos', nameEn: 'Testimonials', icon: <FileText className="w-4 h-4" />, enabled: false },
    { id: 'contact', name: 'Contato', nameEn: 'Contact', icon: <Phone className="w-4 h-4" />, enabled: true },
  ])

  // Site settings - will be loaded from site_configs table
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: '',
    logo: '',
    favicon: '',
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

  // Full site settings for the modal
  const [fullSiteSettings, setFullSiteSettings] = useState<SiteSettingsData>({
    siteName: '',
    brandName: '',
    siteTagline: '',
    siteDescription: '',
    logoUrl: '',
    faviconUrl: '',
    creciNumber: '',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    darkMode: false,
    contactEmail: '',
    contactPhone: '',
    contactWhatsapp: '',
    contactAddress: '',
    contactCity: '',
    contactState: '',
    socialInstagram: '',
    socialFacebook: '',
    socialLinkedin: '',
    socialYoutube: '',
    socialTiktok: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImageUrl: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    customCss: '',
    customHeadHtml: '',
  })

  // Site config from database
  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [saving, setSaving] = useState(false)

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
      // Fetch member data
      const { data: memberDataResult, error: memberError } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      if (memberDataResult) {
        setMemberData(memberDataResult)
        
        // Also fetch site config
        if (memberDataResult.subdomain) {
          await fetchSiteConfig(memberDataResult.subdomain)
        }
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const fetchSiteConfig = async (subdomain: string) => {
    try {
      const { data, error } = await supabase
        .from('site_configs')
        .select('*')
        .eq('subdomain', subdomain)
        .single()

      if (data) {
        setSiteConfig(data)
        // Update local state from database
        setSiteSettings({
          siteName: data.site_name || '',
          logo: data.logo_url || '',
          favicon: data.favicon_url || '',
          primaryColor: data.primary_color || '#6366f1',
          secondaryColor: data.secondary_color || '#8b5cf6',
          font: data.font_heading || 'Inter',
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          whatsapp: data.contact_whatsapp || '',
          address: data.contact_address || '',
          socialLinks: {
            instagram: data.social_instagram || '',
            facebook: data.social_facebook || '',
            linkedin: data.social_linkedin || '',
            youtube: data.social_youtube || '',
          }
        })
        // Update template
        if (data.template_id) {
          setSelectedTemplate(data.template_id)
        }
        // Update full site settings for the modal
        setFullSiteSettings({
          siteName: data.site_name || '',
          brandName: data.brand_name || '',
          siteTagline: data.site_tagline || '',
          siteDescription: data.site_description || '',
          logoUrl: data.logo_url || '',
          faviconUrl: data.favicon_url || '',
          creciNumber: data.creci_number || '',
          primaryColor: data.primary_color || '#6366f1',
          secondaryColor: data.secondary_color || '#8b5cf6',
          accentColor: data.accent_color || '#06b6d4',
          fontHeading: data.font_heading || 'Inter',
          fontBody: data.font_body || 'Inter',
          darkMode: data.dark_mode || false,
          contactEmail: data.contact_email || '',
          contactPhone: data.contact_phone || '',
          contactWhatsapp: data.contact_whatsapp || '',
          contactAddress: data.contact_address || '',
          contactCity: data.contact_city || '',
          contactState: data.contact_state || '',
          socialInstagram: data.social_instagram || '',
          socialFacebook: data.social_facebook || '',
          socialLinkedin: data.social_linkedin || '',
          socialYoutube: data.social_youtube || '',
          socialTiktok: data.social_tiktok || '',
          metaTitle: data.meta_title || '',
          metaDescription: data.meta_description || '',
          metaKeywords: (data.meta_keywords || []).join(', '),
          ogImageUrl: data.og_image_url || '',
          googleAnalyticsId: data.google_analytics_id || '',
          facebookPixelId: data.facebook_pixel_id || '',
          customCss: data.custom_css || '',
          customHeadHtml: data.custom_head_html || '',
        })
        // Update sections from database
        if (data.sections) {
          const dbSections = data.sections as any[]
          setSections(prev => prev.map(section => {
            const dbSection = dbSections.find((s: any) => s.id === section.id)
            return dbSection ? { ...section, enabled: dbSection.enabled } : section
          }))
        }
      } else if (error && error.code === 'PGRST116') {
        // No config exists yet - create one
        console.log('No site config found, will create on first save')
      }
    } catch (err) {
      console.error('Error fetching site config:', err)
    }
  }

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setShowTemplatePicker(false)
    setHasUnsavedChanges(true)
    // Update colors based on selected template
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSiteSettings(prev => ({
        ...prev,
        primaryColor: template.colorScheme.primary,
        secondaryColor: template.colorScheme.secondary,
      }))
      setFullSiteSettings(prev => ({
        ...prev,
        primaryColor: template.colorScheme.primary,
        secondaryColor: template.colorScheme.secondary,
        accentColor: template.colorScheme.accent,
      }))
    }
  }

  // Handle settings save from modal
  const handleSettingsSave = async (settings: SiteSettingsData) => {
    setFullSiteSettings(settings)
    // Also update the local siteSettings for backward compatibility
    setSiteSettings({
      siteName: settings.siteName,
      logo: settings.logoUrl,
      favicon: settings.faviconUrl,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      font: settings.fontHeading,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      whatsapp: settings.contactWhatsapp,
      address: settings.contactAddress,
      socialLinks: {
        instagram: settings.socialInstagram,
        facebook: settings.socialFacebook,
        linkedin: settings.socialLinkedin,
        youtube: settings.socialYoutube,
      }
    })
    setHasUnsavedChanges(true)
    setShowSettings(false)
  }

  // Handle inline settings changes in Settings tab
  const handleFullSettingsChange = (field: keyof SiteSettingsData, value: string) => {
    setFullSiteSettings(prev => ({
      ...prev,
      [field]: value
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    if (!memberData?.subdomain || !session?.user?.id) return
    
    setSaving(true)
    
    try {
      const configData = {
        user_id: session.user.id,
        subdomain: memberData.subdomain,
        template_id: selectedTemplate,
        site_name: fullSiteSettings.siteName || siteSettings.siteName || memberData.full_name,
        brand_name: fullSiteSettings.brandName,
        site_tagline: fullSiteSettings.siteTagline,
        site_description: fullSiteSettings.siteDescription,
        logo_url: fullSiteSettings.logoUrl || siteSettings.logo,
        favicon_url: fullSiteSettings.faviconUrl || siteSettings.favicon,
        creci_number: fullSiteSettings.creciNumber,
        primary_color: fullSiteSettings.primaryColor || siteSettings.primaryColor,
        secondary_color: fullSiteSettings.secondaryColor || siteSettings.secondaryColor,
        accent_color: fullSiteSettings.accentColor,
        font_heading: fullSiteSettings.fontHeading || siteSettings.font,
        font_body: fullSiteSettings.fontBody || siteSettings.font,
        dark_mode: fullSiteSettings.darkMode,
        contact_email: fullSiteSettings.contactEmail || siteSettings.contactEmail || memberData.email,
        contact_phone: fullSiteSettings.contactPhone || siteSettings.contactPhone || memberData.phone,
        contact_whatsapp: fullSiteSettings.contactWhatsapp || siteSettings.whatsapp,
        contact_address: fullSiteSettings.contactAddress || siteSettings.address,
        contact_city: fullSiteSettings.contactCity,
        contact_state: fullSiteSettings.contactState,
        social_instagram: fullSiteSettings.socialInstagram || siteSettings.socialLinks.instagram,
        social_facebook: fullSiteSettings.socialFacebook || siteSettings.socialLinks.facebook,
        social_linkedin: fullSiteSettings.socialLinkedin || siteSettings.socialLinks.linkedin,
        social_youtube: fullSiteSettings.socialYoutube || siteSettings.socialLinks.youtube,
        social_tiktok: fullSiteSettings.socialTiktok,
        meta_title: fullSiteSettings.metaTitle,
        meta_description: fullSiteSettings.metaDescription,
        meta_keywords: fullSiteSettings.metaKeywords ? fullSiteSettings.metaKeywords.split(',').map(k => k.trim()) : [],
        og_image_url: fullSiteSettings.ogImageUrl,
        google_analytics_id: fullSiteSettings.googleAnalyticsId,
        facebook_pixel_id: fullSiteSettings.facebookPixelId,
        custom_css: fullSiteSettings.customCss,
        custom_head_html: fullSiteSettings.customHeadHtml,
        sections: sections.map(s => ({ id: s.id, enabled: s.enabled, order: sections.indexOf(s) + 1, config: {} })),
        is_published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('site_configs')
        .upsert(configData, { 
          onConflict: 'subdomain',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Error saving site config:', error)
        alert(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
      } else {
        setHasUnsavedChanges(false)
        // Refresh the preview
        handleRefresh()
      }
    } catch (err) {
      console.error('Error:', err)
      alert(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
    } finally {
      setSaving(false)
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
        {/* Top-Level Tabs */}
        <div className="sticky top-28 z-50 bg-slate-900 border-b border-slate-700/50">
          <div className="flex items-center justify-center gap-1 p-2">
            <button
              onClick={() => setActiveMainTab('designer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeMainTab === 'designer'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{isPt ? 'Designer' : isEs ? 'Diseñador' : 'Designer'}</span>
            </button>
            <button
              onClick={() => setActiveMainTab('settings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeMainTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{isPt ? 'Configurações' : isEs ? 'Configuración' : 'Settings'}</span>
            </button>
            <button
              onClick={() => setActiveMainTab('listings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                activeMainTab === 'listings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{isPt ? 'Imóveis' : isEs ? 'Inmuebles' : 'Listings'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar - only show in designer mode */}
        {activeMainTab === 'designer' && (
        <div className="sticky top-[7.5rem] z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
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
                {/* Template Picker Button */}
                <button
                  onClick={() => setShowTemplatePicker(true)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all border border-slate-700/50 hover:border-indigo-500/50"
                  title={isPt ? 'Escolher Template' : 'Choose Template'}
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-xs font-medium">{isPt ? 'Template' : 'Template'}</span>
                </button>
                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(true)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all border border-slate-700/50 hover:border-indigo-500/50"
                  title={isPt ? 'Configurações do Site' : 'Site Settings'}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-medium">{isPt ? 'Configurações' : 'Settings'}</span>
                </button>
                <div className="hidden sm:block w-px h-6 bg-slate-700/50" />
                <button
                  onClick={handleRefresh}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                  title={isPt ? 'Atualizar' : 'Refresh'}
                >
                  <RefreshCw className={`w-4 h-4 ${iframeLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleSave}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    hasUnsavedChanges 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  } ${saving ? 'opacity-50 cursor-wait' : ''}`}
                  disabled={!hasUnsavedChanges || saving}
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? (isPt ? 'Salvando...' : 'Saving...') : (isPt ? 'Salvar' : 'Save')}
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
        )}

        {/* Settings Tab Content */}
        {activeMainTab === 'settings' && (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {isPt ? 'Configurações do Site' : isEs ? 'Configuración del Sitio' : 'Site Settings'}
              </h2>
              
              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="border-b border-slate-700/50 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-indigo-400" />
                    {isPt ? 'Informações de Contato' : isEs ? 'Información de Contacto' : 'Contact Information'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <MessageCircle className="w-4 h-4 inline mr-2 text-green-500" />
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={fullSiteSettings.contactWhatsapp || ''}
                        onChange={(e) => handleFullSettingsChange('contactWhatsapp', e.target.value)}
                        placeholder="+55 11 99999-9999"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {isPt ? 'Número que aparecerá nos botões de contato' : isEs ? 'Número que aparecerá en los botones de contacto' : 'Number that will appear on contact buttons'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2 text-blue-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={fullSiteSettings.contactEmail || ''}
                        onChange={(e) => handleFullSettingsChange('contactEmail', e.target.value)}
                        placeholder="contato@exemplo.com"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2 text-slate-400" />
                        {isPt ? 'Telefone' : isEs ? 'Teléfono' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={fullSiteSettings.contactPhone || ''}
                        onChange={(e) => handleFullSettingsChange('contactPhone', e.target.value)}
                        placeholder="+55 11 3333-3333"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2 text-red-400" />
                        {isPt ? 'Endereço' : isEs ? 'Dirección' : 'Address'}
                      </label>
                      <input
                        type="text"
                        value={fullSiteSettings.contactAddress || ''}
                        onChange={(e) => handleFullSettingsChange('contactAddress', e.target.value)}
                        placeholder={isPt ? 'Rua Exemplo, 123 - São Paulo' : 'Example Street, 123'}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="border-b border-slate-700/50 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-400" />
                    {isPt ? 'Redes Sociais' : isEs ? 'Redes Sociales' : 'Social Media'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Instagram className="w-4 h-4 inline mr-2 text-pink-400" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={fullSiteSettings.socialInstagram || ''}
                        onChange={(e) => handleFullSettingsChange('socialInstagram', e.target.value)}
                        placeholder="https://instagram.com/seuperfil"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Facebook className="w-4 h-4 inline mr-2 text-blue-500" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={fullSiteSettings.socialFacebook || ''}
                        onChange={(e) => handleFullSettingsChange('socialFacebook', e.target.value)}
                        placeholder="https://facebook.com/suapagina"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Linkedin className="w-4 h-4 inline mr-2 text-blue-400" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={fullSiteSettings.socialLinkedin || ''}
                        onChange={(e) => handleFullSettingsChange('socialLinkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/seuperfil"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        <Youtube className="w-4 h-4 inline mr-2 text-red-500" />
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={fullSiteSettings.socialYoutube || ''}
                        onChange={(e) => handleFullSettingsChange('socialYoutube', e.target.value)}
                        placeholder="https://youtube.com/@seucanal"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info Section */}
                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    {isPt ? 'Informações Profissionais' : isEs ? 'Información Profesional' : 'Professional Info'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        CRECI
                      </label>
                      <input
                        type="text"
                        value={fullSiteSettings.creciNumber || ''}
                        onChange={(e) => handleFullSettingsChange('creciNumber', e.target.value)}
                        placeholder="CRECI 123456-F"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {isPt ? 'Seu número de registro no CRECI' : isEs ? 'Su número de registro en CRECI' : 'Your CRECI registration number'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isPt ? 'Nome da Empresa/Marca' : isEs ? 'Nombre de la Empresa/Marca' : 'Company/Brand Name'}
                      </label>
                      <input
                        type="text"
                        value={fullSiteSettings.siteName || ''}
                        onChange={(e) => handleFullSettingsChange('siteName', e.target.value)}
                        placeholder={isPt ? 'Sua Imobiliária' : 'Your Real Estate'}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      saving 
                        ? 'bg-slate-700/50 text-slate-400 cursor-wait' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? (isPt ? 'Salvando...' : isEs ? 'Guardando...' : 'Saving...') : (isPt ? 'Salvar Configurações' : isEs ? 'Guardar Configuración' : 'Save Settings')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings Tab Content */}
        {activeMainTab === 'listings' && (
          <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {isPt ? 'Meus Imóveis' : isEs ? 'Mis Inmuebles' : 'My Listings'}
                </h2>
                <Link
                  to="/dashboard/listings/create"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {isPt ? 'Adicionar Imóvel' : isEs ? 'Agregar Inmueble' : 'Add Listing'}
                </Link>
              </div>
              <p className="text-slate-400">
                {isPt 
                  ? 'Gerencie seus imóveis aqui. Os imóveis adicionados aparecerão automaticamente no seu site.' 
                  : isEs 
                    ? 'Administre sus inmuebles aquí. Los inmuebles agregados aparecerán automáticamente en su sitio.'
                    : 'Manage your listings here. Added listings will automatically appear on your site.'}
              </p>
              <div className="mt-6">
                <Link
                  to="/dashboard/listings"
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isPt ? 'Ver todos os imóveis' : isEs ? 'Ver todos los inmuebles' : 'View all listings'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Three Panel Layout (Designer Mode) */}
        {activeMainTab === 'designer' && (
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

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      {isPt ? 'Logo' : 'Logo'}
                    </label>
                    {siteSettings.logo ? (
                      <div className="relative">
                        <img 
                          src={siteSettings.logo} 
                          alt="Logo" 
                          className="w-full h-20 object-contain bg-slate-800/50 rounded-lg border border-slate-600/50"
                        />
                        <button
                          onClick={() => {
                            setSiteSettings(prev => ({ ...prev, logo: '' }))
                            setHasUnsavedChanges(true)
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-4 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">
                          {isPt ? 'Arraste ou clique' : 'Drag or click'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, SVG</p>
                      </div>
                    )}
                    <input
                      type="text"
                      value={siteSettings.logo}
                      onChange={(e) => {
                        setSiteSettings(prev => ({ ...prev, logo: e.target.value }))
                        setHasUnsavedChanges(true)
                      }}
                      placeholder={isPt ? 'Ou cole URL da imagem' : 'Or paste image URL'}
                      className="w-full mt-2 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 placeholder-slate-500"
                    />
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Favicon
                    </label>
                    <p className="text-xs text-slate-500 mb-2">
                      {isPt ? 'Ícone que aparece na aba do navegador' : 'Icon that appears in the browser tab'}
                    </p>
                    {siteSettings.favicon ? (
                      <div className="relative inline-block">
                        <img 
                          src={siteSettings.favicon} 
                          alt="Favicon" 
                          className="w-12 h-12 object-contain bg-slate-800/50 rounded-lg border border-slate-600/50"
                        />
                        <button
                          onClick={() => {
                            setSiteSettings(prev => ({ ...prev, favicon: '' }))
                            setHasUnsavedChanges(true)
                          }}
                          className="absolute -top-1 -right-1 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-4 text-center hover:border-indigo-500/50 transition-colors cursor-pointer w-24">
                        <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">32x32px</p>
                      </div>
                    )}
                    <input
                      type="text"
                      value={siteSettings.favicon}
                      onChange={(e) => {
                        setSiteSettings(prev => ({ ...prev, favicon: e.target.value }))
                        setHasUnsavedChanges(true)
                      }}
                      placeholder={isPt ? 'Ou cole URL do favicon' : 'Or paste favicon URL'}
                      className="w-full mt-2 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 placeholder-slate-500"
                    />
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
        )}
      </div>

      {/* Template Picker Modal */}
      <TemplatePicker
        isOpen={showTemplatePicker}
        onClose={() => setShowTemplatePicker(false)}
        selectedTemplate={selectedTemplate}
        onSelect={handleTemplateSelect}
        isPt={isPt}
      />

      {/* Site Settings Modal */}
      <SiteSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={fullSiteSettings}
        onSave={handleSettingsSave}
        saving={saving}
        isPt={isPt}
      />
    </>
  )
}
