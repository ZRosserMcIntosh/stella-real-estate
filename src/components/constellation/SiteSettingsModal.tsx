import React, { useState, useEffect } from 'react'
import { 
  X, Save, Building2, Palette, Globe, Share2, 
  Mail, Phone, MapPin, Image as ImageIcon, 
  FileText, Search, BarChart3, Code, 
  Instagram, Facebook, Linkedin, Youtube,
  Upload, Trash2, Eye, Moon, Sun
} from 'lucide-react'

interface SiteSettingsData {
  // Branding
  siteName: string
  brandName: string
  siteTagline: string
  siteDescription: string
  logoUrl: string
  faviconUrl: string
  creciNumber: string

  // Theme
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  darkMode: boolean

  // Contact
  contactEmail: string
  contactPhone: string
  contactWhatsapp: string
  contactAddress: string
  contactCity: string
  contactState: string

  // Social
  socialInstagram: string
  socialFacebook: string
  socialLinkedin: string
  socialYoutube: string
  socialTiktok: string

  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImageUrl: string

  // Analytics
  googleAnalyticsId: string
  facebookPixelId: string

  // Advanced
  customCss: string
  customHeadHtml: string
}

interface SiteSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: SiteSettingsData
  onSave: (settings: SiteSettingsData) => void
  saving?: boolean
  isPt?: boolean
}

const FONTS = [
  { id: 'Inter', name: 'Inter', category: 'Modern' },
  { id: 'Outfit', name: 'Outfit', category: 'Modern' },
  { id: 'Poppins', name: 'Poppins', category: 'Modern' },
  { id: 'Montserrat', name: 'Montserrat', category: 'Modern' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'Serif' },
  { id: 'Lora', name: 'Lora', category: 'Serif' },
  { id: 'DM Sans', name: 'DM Sans', category: 'Clean' },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'Modern' },
]

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

type TabId = 'branding' | 'theme' | 'contact' | 'social' | 'seo' | 'analytics' | 'advanced'

export default function SiteSettingsModal({
  isOpen,
  onClose,
  settings: initialSettings,
  onSave,
  saving = false,
  isPt = true
}: SiteSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('branding')
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings])

  const updateSetting = <K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    onSave(settings)
    setHasChanges(false)
  }

  const tabs: { id: TabId; label: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'branding', label: 'Marca', labelEn: 'Branding', icon: <Building2 className="w-4 h-4" /> },
    { id: 'theme', label: 'Visual', labelEn: 'Theme', icon: <Palette className="w-4 h-4" /> },
    { id: 'contact', label: 'Contato', labelEn: 'Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 'social', label: 'Redes Sociais', labelEn: 'Social', icon: <Share2 className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', labelEn: 'SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', labelEn: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'advanced', label: 'Avançado', labelEn: 'Advanced', icon: <Code className="w-4 h-4" /> },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative flex w-full max-w-4xl h-[90vh] m-auto bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-slate-800/50 border-r border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <h2 className="font-semibold text-white">
              {isPt ? 'Configurações' : 'Settings'}
            </h2>
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab.icon}
                {isPt ? tab.label : tab.labelEn}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-lg font-semibold text-white">
              {tabs.find(t => t.id === activeTab)?.[isPt ? 'label' : 'labelEn']}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Nome do Site' : 'Site Name'}
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'Minha Imobiliária' : 'My Real Estate'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Nome da Marca' : 'Brand Name'}
                  </label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => updateSetting('brandName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'Seu nome ou empresa' : 'Your name or company'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Slogan' : 'Tagline'}
                  </label>
                  <input
                    type="text"
                    value={settings.siteTagline}
                    onChange={(e) => updateSetting('siteTagline', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'Seu corretor de confiança' : 'Your trusted realtor'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Descrição do Site' : 'Site Description'}
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                    placeholder={isPt ? 'Uma breve descrição do seu negócio...' : 'A brief description of your business...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Número do CRECI' : 'CRECI Number'}
                  </label>
                  <input
                    type="text"
                    value={settings.creciNumber}
                    onChange={(e) => updateSetting('creciNumber', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="CRECI 123456-F"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Logo (URL)' : 'Logo (URL)'}
                    </label>
                    <input
                      type="url"
                      value={settings.logoUrl}
                      onChange={(e) => updateSetting('logoUrl', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Favicon (URL)' : 'Favicon (URL)'}
                    </label>
                    <input
                      type="url"
                      value={settings.faviconUrl}
                      onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Cor Primária' : 'Primary Color'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Cor Secundária' : 'Secondary Color'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Cor de Destaque' : 'Accent Color'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => updateSetting('accentColor', e.target.value)}
                        className="w-12 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => updateSetting('accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Fonte dos Títulos' : 'Heading Font'}
                    </label>
                    <select
                      value={settings.fontHeading}
                      onChange={(e) => updateSetting('fontHeading', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      {FONTS.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Fonte do Corpo' : 'Body Font'}
                    </label>
                    <select
                      value={settings.fontBody}
                      onChange={(e) => updateSetting('fontBody', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      {FONTS.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div 
                      onClick={() => updateSetting('darkMode', !settings.darkMode)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode ? 'left-7' : 'left-1'}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {settings.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                      <span className="text-sm font-medium text-slate-300">
                        {isPt ? 'Modo Escuro por Padrão' : 'Dark Mode by Default'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSetting('contactEmail', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="contato@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {isPt ? 'Telefone' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) => updateSetting('contactPhone', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={settings.contactWhatsapp}
                    onChange={(e) => updateSetting('contactWhatsapp', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="5511999999999"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {isPt ? 'Formato: código do país + DDD + número (sem espaços)' : 'Format: country code + area code + number (no spaces)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {isPt ? 'Endereço' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={settings.contactAddress}
                    onChange={(e) => updateSetting('contactAddress', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'Rua, número, bairro' : 'Street, number, neighborhood'}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Cidade' : 'City'}
                    </label>
                    <input
                      type="text"
                      value={settings.contactCity}
                      onChange={(e) => updateSetting('contactCity', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {isPt ? 'Estado' : 'State'}
                    </label>
                    <select
                      value={settings.contactState}
                      onChange={(e) => updateSetting('contactState', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    >
                      <option value="">{isPt ? 'Selecione...' : 'Select...'}</option>
                      {BRAZILIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Instagram className="w-4 h-4 inline mr-2" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={settings.socialInstagram}
                    onChange={(e) => updateSetting('socialInstagram', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://instagram.com/seuusuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Facebook className="w-4 h-4 inline mr-2" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={settings.socialFacebook}
                    onChange={(e) => updateSetting('socialFacebook', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://facebook.com/suapagina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={settings.socialLinkedin}
                    onChange={(e) => updateSetting('socialLinkedin', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://linkedin.com/in/seuperfil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Youtube className="w-4 h-4 inline mr-2" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={settings.socialYoutube}
                    onChange={(e) => updateSetting('socialYoutube', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://youtube.com/@seucanal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    TikTok
                  </label>
                  <input
                    type="url"
                    value={settings.socialTiktok}
                    onChange={(e) => updateSetting('socialTiktok', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://tiktok.com/@seuusuario"
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Título SEO' : 'SEO Title'}
                  </label>
                  <input
                    type="text"
                    value={settings.metaTitle}
                    onChange={(e) => updateSetting('metaTitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'Título que aparece no Google' : 'Title that appears on Google'}
                    maxLength={60}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.metaTitle.length}/60 {isPt ? 'caracteres' : 'characters'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Descrição SEO' : 'SEO Description'}
                  </label>
                  <textarea
                    value={settings.metaDescription}
                    onChange={(e) => updateSetting('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                    placeholder={isPt ? 'Descrição que aparece no Google' : 'Description that appears on Google'}
                    maxLength={160}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.metaDescription.length}/160 {isPt ? 'caracteres' : 'characters'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Palavras-chave' : 'Keywords'}
                  </label>
                  <input
                    type="text"
                    value={settings.metaKeywords}
                    onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder={isPt ? 'imóveis, casas, apartamentos, corretor' : 'properties, houses, apartments, realtor'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'Imagem de Compartilhamento (OG Image)' : 'Share Image (OG Image)'}
                  </label>
                  <input
                    type="url"
                    value={settings.ogImageUrl}
                    onChange={(e) => updateSetting('ogImageUrl', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {isPt ? 'Tamanho recomendado: 1200x630px' : 'Recommended size: 1200x630px'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-indigo-300">
                    {isPt 
                      ? 'Adicione seus códigos de rastreamento para monitorar visitantes e conversões.'
                      : 'Add your tracking codes to monitor visitors and conversions.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Google Analytics 4 (GA4) ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={settings.facebookPixelId}
                    onChange={(e) => updateSetting('facebookPixelId', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="1234567890123456"
                  />
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-300">
                    {isPt 
                      ? '⚠️ Cuidado! Código incorreto pode quebrar seu site.'
                      : '⚠️ Be careful! Incorrect code can break your site.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'CSS Personalizado' : 'Custom CSS'}
                  </label>
                  <textarea
                    value={settings.customCss}
                    onChange={(e) => updateSetting('customCss', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
                    placeholder=".my-class { color: red; }"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {isPt ? 'HTML no <head>' : 'HTML in <head>'}
                  </label>
                  <textarea
                    value={settings.customHeadHtml}
                    onChange={(e) => updateSetting('customHeadHtml', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 resize-none"
                    placeholder="<script>...</script>"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-slate-700/50 bg-slate-800/30">
            <p className="text-sm text-slate-400">
              {hasChanges && (isPt ? 'Alterações não salvas' : 'Unsaved changes')}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                {isPt ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                  hasChanges && !saving
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isPt ? 'Salvar' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { SiteSettingsData }
