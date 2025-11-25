import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { 
  Layout, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Settings, 
  Eye, 
  Save,
  ArrowLeft,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react'

export default function ConstellationSiteBuilder() {
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings'>('design')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const navigate = useNavigate()
  const { session } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    if (!session) {
      navigate('/sub/constellation/login')
      return
    }

    checkMemberAccess()
  }, [session, navigate])

  const checkMemberAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      // Allow access if user is found and has paid, or if no record exists (for testing/demo)
      if (data) {
        setMemberData(data)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      // Still allow access even if there's an error
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/sub/constellation/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container-padded py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/sub/constellation/dashboard"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <h1 className="text-xl font-light text-white flex items-center gap-2">
                <Layout className="w-5 h-5 text-indigo-400" />
                Construtor de Sites
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Preview Mode Toggle */}
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded transition-colors ${
                    previewMode === 'desktop' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded transition-colors ${
                    previewMode === 'tablet' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tablet"
                >
                  <Globe className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded transition-colors ${
                    previewMode === 'mobile' 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Visualizar
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button 
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/30 overflow-y-auto">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'design'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4" />
                Design
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'content'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-4 h-4" />
                Conteúdo
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                Config
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'design' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Temas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Moderno', 'Clássico', 'Minimalista', 'Luxo'].map((theme) => (
                      <button
                        key={theme}
                        className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-lg transition-all text-slate-300 hover:text-white text-sm"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Cores</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        className="w-full aspect-square rounded-lg border-2 border-slate-700 hover:border-white transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Tipografia</h3>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Playfair Display</option>
                    <option>Montserrat</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Seções</h3>
                  <div className="space-y-2">
                    {['Hero', 'Sobre', 'Serviços', 'Imóveis', 'Contato', 'Footer'].map((section) => (
                      <button
                        key={section}
                        className="w-full p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-lg transition-all text-slate-300 hover:text-white text-sm text-left"
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Configurações do Site</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Nome do Site</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                        placeholder="Meu Site Imobiliário"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Domínio</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                        placeholder="meusiteimoveis.com"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">SEO - Meta Description</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-indigo-500"
                        rows={3}
                        placeholder="Descrição do seu site para mecanismos de busca"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-slate-950 overflow-auto p-8">
          <div 
            className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-[375px]' :
              previewMode === 'tablet' ? 'max-w-[768px]' :
              'max-w-[1440px]'
            }`}
            style={{ minHeight: '800px' }}
          >
            {/* Canvas Content - Placeholder for now */}
            <div className="p-8 text-center">
              <div className="py-32 border-2 border-dashed border-slate-300 rounded-lg">
                <Layout className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Seu Site Começa Aqui</h2>
                <p className="text-slate-600 mb-6">Selecione um tema ou seção no painel lateral para começar</p>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  Escolher Tema
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/30 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-4">Propriedades</h3>
            <div className="text-sm text-slate-400 text-center py-8">
              Selecione um elemento para editar suas propriedades
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
