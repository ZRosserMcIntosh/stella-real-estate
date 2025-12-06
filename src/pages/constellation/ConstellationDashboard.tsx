import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { Check, X as XIcon, Sparkles, ArrowRight, Crown, Building2, Users, Zap, Globe, Link as LinkIcon, ExternalLink } from 'lucide-react'

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

interface Plan {
  id: string
  name: string
  tagline: string
  description: string
  monthlyPrice: number | null
  founderPrice: number | null
  features: { name: string; included: boolean }[]
  popular: boolean
  icon: React.ReactNode
}

const plans: Plan[] = [
  {
    id: 'PRO',
    name: 'Pro',
    tagline: 'Comece agora',
    description: 'Corretor autônomo que quer seu próprio site profissional',
    monthlyPrice: 199,
    founderPrice: 99,
    features: [
      { name: '1 site profissional', included: true },
      { name: 'Até 50 anúncios ativos', included: true },
      { name: 'Domínio próprio (.com.br)', included: true },
      { name: '3.000 contatos CRM', included: true },
      { name: '2 pipelines de vendas', included: true },
      { name: '2 tours 3D/mês', included: true },
      { name: 'Automações básicas', included: true },
      { name: '2 usuários', included: true },
    ],
    popular: false,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 'TEAM',
    name: 'Team',
    tagline: 'Mais popular',
    description: 'Pequenas equipes prontas para escalar suas operações',
    monthlyPrice: 399,
    founderPrice: 199,
    features: [
      { name: '2 sites completos', included: true },
      { name: 'Até 150 anúncios ativos', included: true },
      { name: 'Domínio próprio (.com.br)', included: true },
      { name: '10.000 contatos CRM', included: true },
      { name: 'Pipelines ilimitados', included: true },
      { name: '5 tours 3D/mês', included: true },
      { name: 'Automações completas', included: true },
      { name: '5 usuários + permissões', included: true },
      { name: 'White label (sua marca)', included: true },
    ],
    popular: true,
    icon: <Users className="w-6 h-6" />,
  },
  {
    id: 'BROKERAGE',
    name: 'Brokerage',
    tagline: 'Para imobiliárias',
    description: 'Imobiliárias com múltiplas equipes e grande volume',
    monthlyPrice: 999,
    founderPrice: 499,
    features: [
      { name: '3 sites completos', included: true },
      { name: 'Até 500 anúncios ativos', included: true },
      { name: 'Múltiplos domínios', included: true },
      { name: '50.000 contatos CRM', included: true },
      { name: 'Pipelines ilimitados', included: true },
      { name: '20 tours 3D/mês', included: true },
      { name: '30 usuários + RBAC', included: true },
      { name: 'White label completo', included: true },
      { name: 'Suporte VIP', included: true },
    ],
    popular: false,
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    tagline: 'Sob medida',
    description: 'Redes e incorporadoras com operações complexas',
    monthlyPrice: null,
    founderPrice: null,
    features: [
      { name: 'Sites ilimitados', included: true },
      { name: 'Anúncios ilimitados', included: true },
      { name: 'Contatos ilimitados', included: true },
      { name: 'Usuários ilimitados', included: true },
      { name: 'Tours 3D sob demanda', included: true },
      { name: 'SLA + gerente dedicado', included: true },
    ],
    popular: false,
    icon: <Crown className="w-6 h-6" />,
  },
]

export default function ConstellationDashboard() {
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [subdomain, setSubdomain] = useState('')
  const [subdomainInput, setSubdomainInput] = useState('')
  const [subdomainError, setSubdomainError] = useState('')
  const [subdomainSaving, setSubdomainSaving] = useState(false)
  const [subdomainSuccess, setSubdomainSuccess] = useState(false)
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

      if (error) {
        console.error('Error fetching member data:', error)
        setLoading(false)
        return
      }

      setMemberData(data)
      setSelectedPlan(data?.selected_plan || null)
      setSubdomain(data?.subdomain || '')
      setSubdomainInput(data?.subdomain || '')
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  // Validate subdomain format
  const validateSubdomain = (value: string): string | null => {
    if (!value) return isPt ? 'Subdomínio é obrigatório' : 'Subdomain is required'
    if (value.length < 3) return isPt ? 'Mínimo 3 caracteres' : 'Minimum 3 characters'
    if (value.length > 30) return isPt ? 'Máximo 30 caracteres' : 'Maximum 30 characters'
    if (/^[0-9-]/.test(value)) return isPt ? 'Deve começar com letra' : 'Must start with a letter'
    if (/[-]$/.test(value)) return isPt ? 'Não pode terminar com hífen' : 'Cannot end with a hyphen'
    if (/--/.test(value)) return isPt ? 'Não use hífens consecutivos' : 'No consecutive hyphens'
    if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(value) && value.length > 2) {
      return isPt ? 'Use apenas letras minúsculas, números e hífens' : 'Use only lowercase letters, numbers and hyphens'
    }
    if (value.length === 3 && !/^[a-z][a-z0-9]{2}$|^[a-z][a-z0-9]-?[a-z0-9]$/.test(value)) {
      return isPt ? 'Use apenas letras minúsculas, números e hífens' : 'Use only lowercase letters, numbers and hyphens'
    }
    // Reserved subdomains
    const reserved = ['admin', 'api', 'app', 'www', 'mail', 'ftp', 'constellation', 'stella', 'stellareal', 'test', 'demo', 'blog', 'help', 'support']
    if (reserved.includes(value)) return isPt ? 'Este subdomínio está reservado' : 'This subdomain is reserved'
    return null
  }

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setSubdomainInput(value)
    setSubdomainError('')
    setSubdomainSuccess(false)
  }

  const handleSaveSubdomain = async () => {
    const error = validateSubdomain(subdomainInput)
    if (error) {
      setSubdomainError(error)
      return
    }

    setSubdomainSaving(true)
    setSubdomainError('')

    try {
      // Check if subdomain is already taken
      const { data: existing } = await supabase
        .from('founding_members')
        .select('id')
        .eq('subdomain', subdomainInput)
        .neq('user_id', session?.user?.id)
        .single()

      if (existing) {
        setSubdomainError(isPt ? 'Este subdomínio já está em uso' : 'This subdomain is already taken')
        setSubdomainSaving(false)
        return
      }

      const { error } = await supabase
        .from('founding_members')
        .update({ 
          subdomain: subdomainInput,
          subdomain_set_at: new Date().toISOString()
        })
        .eq('user_id', session?.user?.id)

      if (error) {
        console.error('Error saving subdomain:', error)
        setSubdomainError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
      } else {
        setSubdomain(subdomainInput)
        setMemberData((prev: any) => ({ ...prev, subdomain: subdomainInput }))
        setSubdomainSuccess(true)
        setTimeout(() => setSubdomainSuccess(false), 3000)
        
        // Create default site config with genericized template
        const defaultSiteConfig = {
          user_id: session?.user?.id,
          subdomain: subdomainInput,
          site_name: memberData?.full_name || 'Meu Site Imobiliário',
          logo_url: null,
          favicon_url: null,
          primary_color: '#6366f1',
          secondary_color: '#8b5cf6',
          font_heading: 'Inter',
          font_body: 'Inter',
          contact_email: memberData?.email || null,
          contact_phone: memberData?.phone || null,
          contact_whatsapp: memberData?.phone || null,
          contact_address: null,
          social_instagram: null,
          social_facebook: null,
          social_linkedin: null,
          social_youtube: null,
          hero_title: isPt ? 'Encontre seu imóvel ideal' : 'Find your ideal property',
          hero_subtitle: isPt ? 'Profissionalismo e dedicação para realizar seu sonho' : 'Professionalism and dedication to make your dream come true',
          hero_cta_text: isPt ? 'Ver Imóveis' : 'View Properties',
          about_title: isPt ? 'Sobre Nós' : 'About Us',
          about_text: isPt 
            ? 'Somos especialistas no mercado imobiliário, oferecendo as melhores oportunidades de compra, venda e locação de imóveis. Nossa missão é ajudar você a encontrar o imóvel perfeito para suas necessidades.'
            : 'We are specialists in the real estate market, offering the best opportunities for buying, selling and renting properties. Our mission is to help you find the perfect property for your needs.',
          sections: [
            { id: 'hero', enabled: true, order: 1, config: {} },
            { id: 'featured', enabled: true, order: 2, config: {} },
            { id: 'about', enabled: true, order: 3, config: {} },
            { id: 'services', enabled: true, order: 4, config: {} },
            { id: 'testimonials', enabled: false, order: 5, config: {} },
            { id: 'contact', enabled: true, order: 6, config: {} },
          ],
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        // Insert default site config (ignore if already exists)
        const { error: configError } = await supabase
          .from('site_configs')
          .upsert(defaultSiteConfig, { 
            onConflict: 'subdomain',
            ignoreDuplicates: true 
          })
        
        if (configError) {
          console.log('Note: Could not create default site config:', configError)
          // Non-critical error, don't show to user
        } else {
          console.log('Default site config created for:', subdomainInput)
        }
      }
    } catch (err) {
      console.error('Error:', err)
      setSubdomainError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
    } finally {
      setSubdomainSaving(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'ENTERPRISE') {
      // Open WhatsApp for enterprise inquiries
      window.open('https://wa.me/5511985853836?text=Olá! Tenho interesse no plano Enterprise da Constellation.', '_blank')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('founding_members')
        .update({ 
          selected_plan: planId,
          plan_selected_at: new Date().toISOString()
        })
        .eq('user_id', session?.user?.id)

      if (error) {
        console.error('Error updating plan:', error)
        alert('Erro ao selecionar plano. Tente novamente.')
      } else {
        setSelectedPlan(planId)
        setMemberData((prev: any) => ({ ...prev, selected_plan: planId }))
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Erro ao selecionar plano. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate(ConstellationUrls.login())
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Constellation</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConstellationAuthHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400">Carregando...</p>
          </div>
        </div>
      </>
    )
  }

  const currentPlan = plans.find(p => p.id === selectedPlan)

  return (
    <>
      <Helmet>
        <title>Escolha seu Plano - Constellation Dashboard</title>
        <meta name="description" content="Escolha o plano ideal para suas necessidades. Corretores, equipes e imobiliárias." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              {isPt ? 'Membro Fundador' : 'Founding Member'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isPt ? `Olá, ${memberData?.full_name?.split(' ')[0] || 'Corretor'}!` : `Hello, ${memberData?.full_name?.split(' ')[0] || 'Realtor'}!`}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {selectedPlan ? (
                isPt 
                  ? `Você está no plano ${currentPlan?.name}. Sua plataforma está sendo preparada.`
                  : `You're on the ${currentPlan?.name} plan. Your platform is being prepared.`
              ) : (
                isPt 
                  ? 'Escolha o plano ideal para começar a usar a Constellation.'
                  : 'Choose the ideal plan to start using Constellation.'
              )}
            </p>
          </div>

          {/* Current Plan Badge */}
          {selectedPlan && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">
                  {isPt ? `Plano selecionado: ${currentPlan?.name}` : `Selected plan: ${currentPlan?.name}`}
                </span>
                <span className="text-green-400 font-bold">
                  R$ {currentPlan?.founderPrice}/mês
                </span>
              </div>
            </div>
          )}

          {/* Subdomain Configuration - Always visible */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {isPt ? 'Endereço do Seu Site' : 'Your Site Address'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isPt ? 'Escolha o subdomínio para seu site profissional' : 'Choose the subdomain for your professional site'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="flex items-center bg-slate-800/80 border border-slate-600/50 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <input
                      type="text"
                      value={subdomainInput}
                      onChange={handleSubdomainChange}
                      placeholder={isPt ? 'seusite' : 'yoursite'}
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 outline-none text-base"
                      maxLength={30}
                    />
                    <span className="px-4 py-3 bg-slate-700/50 text-slate-400 text-sm font-medium border-l border-slate-600/50">
                      .stellareal.com.br
                    </span>
                  </div>
                  {subdomainError && (
                    <p className="absolute -bottom-6 left-0 text-red-400 text-xs flex items-center gap-1">
                      <XIcon className="w-3 h-3" />
                      {subdomainError}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleSaveSubdomain}
                  disabled={subdomainSaving || subdomainInput === subdomain}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    subdomainSuccess
                      ? 'bg-green-600 text-white'
                      : subdomainInput === subdomain
                        ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } ${subdomainSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {subdomainSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : subdomainSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      {isPt ? 'Salvo!' : 'Saved!'}
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      {isPt ? 'Salvar' : 'Save'}
                    </>
                  )}
                </button>
              </div>

              {/* Show current subdomain if set */}
              {subdomain && (
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-slate-400">{isPt ? 'Seu site estará disponível em:' : 'Your site will be available at:'}</span>
                    </div>
                    <a
                      href={`https://${subdomain}.stellareal.com.br`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-indigo-300 hover:text-indigo-200 text-sm font-medium transition-all group"
                    >
                      <span>{subdomain}.stellareal.com.br</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {isPt 
                      ? 'Você poderá conectar seu próprio domínio (.com.br) depois que a plataforma for lançada.'
                      : 'You can connect your own domain (.com.br) after the platform launches.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Current Plan Details - Only visible when plan is selected */}
          {selectedPlan && currentPlan && (
            <div className="max-w-2xl mx-auto mb-10">
              <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/20 to-slate-900/80 border border-indigo-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-indigo-500/20 text-indigo-400`}>
                      {currentPlan.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {isPt ? 'Seu Plano' : 'Your Plan'}: {currentPlan.name}
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                          {isPt ? 'Ativo' : 'Active'}
                        </span>
                      </h3>
                      <p className="text-sm text-slate-400">{currentPlan.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">R$ {currentPlan.founderPrice}</div>
                    <div className="text-xs text-slate-400">/{isPt ? 'mês' : 'month'}</div>
                    <div className="text-xs text-amber-400 mt-1">
                      {isPt ? '1 mês grátis' : '1 month free'}
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 pt-4 border-t border-slate-700/50">
                  {currentPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature.name}</span>
                    </div>
                  ))}
                </div>

                {/* Upgrade Button - only show if not on the highest plan */}
                {currentPlan.id !== 'ENTERPRISE' && (
                  <div className="pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        // Scroll to plans section
                        document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Crown className="w-4 h-4" />
                      {isPt ? 'Fazer Upgrade' : 'Upgrade Plan'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Founder Pricing Banner */}
          <div className="mb-10 p-4 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <p className="text-amber-200 text-sm md:text-base">
              <span className="font-semibold">🎉 {isPt ? 'Preço de Membro Fundador' : 'Founding Member Pricing'}:</span>{' '}
              {isPt 
                ? '1 mês grátis no valor atual. Depois, você paga o preço promocional que travou hoje.'
                : '1 month free at current value. Then pay the promotional price you locked in today.'}
            </p>
          </div>

          {/* Plans Grid */}
          <div id="plans-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => {
              const isCurrentPlan = selectedPlan === plan.id
              const isEnterprise = plan.monthlyPrice === null
              
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                    isCurrentPlan
                      ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/30 to-green-900/30 border-green-500/50 shadow-2xl shadow-green-500/10'
                      : plan.popular
                        ? 'bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 border-blue-500/50 shadow-2xl shadow-blue-500/20'
                        : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {isPt ? 'Seu Plano' : 'Your Plan'}
                      </span>
                    </div>
                  )}
                  
                  {/* Popular Badge */}
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {isPt ? 'Mais Popular' : 'Most Popular'}
                      </span>
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Plan Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        isCurrentPlan ? 'bg-green-500/20 text-green-400' : 
                        plan.popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'
                      }`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-xs text-slate-400">{plan.tagline}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{plan.description}</p>

                    {/* Pricing */}
                    <div className="mb-4">
                      {isEnterprise ? (
                        <div className="text-2xl font-bold text-white">{isPt ? 'Sob consulta' : 'Custom'}</div>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">R$ {plan.founderPrice}</span>
                            <span className="text-slate-400">/mês</span>
                          </div>
                          <p className="text-xs text-slate-500 line-through">R$ {plan.monthlyPrice}/mês</p>
                          <p className="text-xs text-amber-400 mt-1">
                            {isPt ? '1 mês grátis' : '1 month free'}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{feature.name}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    {isCurrentPlan ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-green-600/30 text-green-300 rounded-xl font-medium flex items-center justify-center gap-2 cursor-default"
                      >
                        <Check className="w-5 h-5" />
                        {isPt ? 'Plano Atual' : 'Current Plan'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={saving}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            {isEnterprise ? (isPt ? 'Falar com Vendas' : 'Contact Sales') : (isPt ? 'Selecionar Plano' : 'Select Plan')}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Next Steps Section */}
          {selectedPlan && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  {isPt ? 'Próximos Passos' : 'Next Steps'}
                </h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span>{isPt ? 'Conta criada' : 'Account created'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span>{isPt ? `Plano ${currentPlan?.name} selecionado` : `${currentPlan?.name} plan selected`}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    </div>
                    <span>{isPt ? 'Estamos preparando sua plataforma personalizada' : 'We are preparing your personalized platform'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-slate-500">3</span>
                    </div>
                    <span className="text-slate-500">{isPt ? 'Notificaremos você via email quando estiver pronto' : 'We will notify you by email when ready'}</span>
                  </li>
                </ul>
                
                <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-3">
                  <Link
                    to="/site-builder"
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    {isPt ? 'Construtor de Sites' : 'Site Builder'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
                  >
                    {isPt ? 'Sair' : 'Sign Out'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
              {isPt ? 'Dúvidas sobre os planos?' : 'Questions about plans?'}{' '}
              <a 
                href="https://wa.me/5511985853836" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isPt ? 'Fale conosco via WhatsApp' : 'Contact us via WhatsApp'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
