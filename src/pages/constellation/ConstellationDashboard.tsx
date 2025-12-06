import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { Check, X as XIcon, Sparkles, ArrowRight, Crown, Building2, Users, Zap, Globe, Link as LinkIcon, ExternalLink } from 'lucide-react'

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
  color: string
}

const plans: Plan[] = [
  {
    id: 'PRO',
    name: 'Pro',
    tagline: 'Para corretores autônomos',
    description: 'Tudo que você precisa para destacar seus imóveis online',
    monthlyPrice: 97,
    founderPrice: 0,
    features: [
      { name: 'Site profissional personalizado', included: true },
      { name: 'Até 50 imóveis ativos', included: true },
      { name: 'Integração com portais', included: true },
      { name: 'CRM básico', included: true },
      { name: 'Suporte por email', included: true },
      { name: 'Equipe de corretores', included: false },
      { name: 'Relatórios avançados', included: false },
      { name: 'API personalizada', included: false },
    ],
    popular: false,
    icon: <Zap className="w-6 h-6" />,
    color: 'indigo',
  },
  {
    id: 'TEAM',
    name: 'Team',
    tagline: 'Para pequenas equipes',
    description: 'Colabore com sua equipe e multiplique resultados',
    monthlyPrice: 197,
    founderPrice: 0,
    features: [
      { name: 'Tudo do Pro', included: true },
      { name: 'Até 200 imóveis ativos', included: true },
      { name: 'Até 5 corretores', included: true },
      { name: 'CRM completo', included: true },
      { name: 'Relatórios de equipe', included: true },
      { name: 'Suporte prioritário', included: true },
      { name: 'Multi-imobiliárias', included: false },
      { name: 'API personalizada', included: false },
    ],
    popular: true,
    icon: <Users className="w-6 h-6" />,
    color: 'purple',
  },
  {
    id: 'BROKERAGE',
    name: 'Brokerage',
    tagline: 'Para imobiliárias',
    description: 'Gerencie toda sua imobiliária em um só lugar',
    monthlyPrice: 397,
    founderPrice: 0,
    features: [
      { name: 'Tudo do Team', included: true },
      { name: 'Imóveis ilimitados', included: true },
      { name: 'Corretores ilimitados', included: true },
      { name: 'Múltiplas filiais', included: true },
      { name: 'Relatórios avançados', included: true },
      { name: 'Integração contábil', included: true },
      { name: 'Gerente de conta dedicado', included: true },
      { name: 'API personalizada', included: false },
    ],
    popular: false,
    icon: <Building2 className="w-6 h-6" />,
    color: 'amber',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    tagline: 'Soluções personalizadas',
    description: 'Para grandes operações com necessidades específicas',
    monthlyPrice: null,
    founderPrice: null,
    features: [
      { name: 'Tudo do Brokerage', included: true },
      { name: 'API personalizada', included: true },
      { name: 'Integrações sob demanda', included: true },
      { name: 'SLA garantido', included: true },
      { name: 'Suporte 24/7', included: true },
      { name: 'Treinamento personalizado', included: true },
      { name: 'Customizações exclusivas', included: true },
      { name: 'White-label disponível', included: true },
    ],
    popular: false,
    icon: <Crown className="w-6 h-6" />,
    color: 'rose',
  },
]

export default function ConstellationDashboard() {
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [savingPlan, setSavingPlan] = useState(false)
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
    if (!session?.user?.email) return
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('email', session.user.email)
        .single()
      if (error) {
        console.error('Error fetching member data:', error)
      } else {
        setMemberData(data)
        setSelectedPlan(data?.selected_plan || null)
        setSubdomain(data?.subdomain || '')
        setSubdomainInput(data?.subdomain || '')
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateSubdomain = (value: string): string | null => {
    if (!value) return isPt ? 'Subdomínio é obrigatório' : 'Subdomain is required'
    if (value.length < 3) return isPt ? 'Mínimo 3 caracteres' : 'Minimum 3 characters'
    if (value.length > 30) return isPt ? 'Máximo 30 caracteres' : 'Maximum 30 characters'
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
      return isPt ? 'Use apenas letras minúsculas, números e hífens' : 'Use only lowercase letters, numbers and hyphens'
    }
    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'blog', 'shop', 'store', 'constellation', 'ballet', 'stella']
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
      const { data: existing } = await supabase
        .from('founding_members')
        .select('id')
        .eq('subdomain', subdomainInput)
        .neq('email', session?.user?.email || '')
        .single()
      if (existing) {
        setSubdomainError(isPt ? 'Este subdomínio já está em uso' : 'This subdomain is already taken')
        setSubdomainSaving(false)
        return
      }
      const { error: updateError } = await supabase
        .from('founding_members')
        .update({ subdomain: subdomainInput, subdomain_set_at: new Date().toISOString() })
        .eq('email', session?.user?.email || '')
      if (updateError) {
        setSubdomainError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
      } else {
        setSubdomain(subdomainInput)
        setSubdomainSuccess(true)
        setTimeout(() => setSubdomainSuccess(false), 3000)
      }
    } catch (err) {
      setSubdomainError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
    } finally {
      setSubdomainSaving(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'ENTERPRISE') {
      window.open('https://wa.me/5511999999999?text=Olá! Tenho interesse no plano Enterprise da Constellation.', '_blank')
      return
    }
    setSavingPlan(true)
    try {
      const { error } = await supabase
        .from('founding_members')
        .update({ selected_plan: planId, plan_selected_at: new Date().toISOString() })
        .eq('email', session?.user?.email || '')
      if (!error) {
        setSelectedPlan(planId)
      }
    } catch (err) {
      console.error('Error saving plan:', err)
    } finally {
      setSavingPlan(false)
    }
  }

  if (loading || authLoading) {
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
        <meta name="description" content="Escolha o plano ideal para suas necessidades." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              {isPt ? 'Membro Fundador' : 'Founding Member'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isPt ? \`Olá, \${memberData?.full_name?.split(' ')[0] || 'Corretor'}!\` : \`Hello, \${memberData?.full_name?.split(' ')[0] || 'Realtor'}!\`}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {selectedPlan ? (isPt ? \`Você está no plano \${currentPlan?.name}.\` : \`You're on the \${currentPlan?.name} plan.\`) : (isPt ? 'Escolha o plano ideal para começar.' : 'Choose the ideal plan to start.')}
            </p>
          </div>
          {selectedPlan && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">{isPt ? \`Plano: \${currentPlan?.name}\` : \`Plan: \${currentPlan?.name}\`}</span>
                <span className="text-green-400 font-bold">R$ {currentPlan?.founderPrice}/mês</span>
              </div>
            </div>
          )}
          {selectedPlan && (
            <div className="max-w-2xl mx-auto mb-10">
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Globe className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{isPt ? 'Endereço do Seu Site' : 'Your Site Address'}</h3>
                    <p className="text-sm text-slate-400">{isPt ? 'Escolha o subdomínio para seu site' : 'Choose the subdomain for your site'}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="flex items-center bg-slate-800/80 border border-slate-600/50 rounded-xl overflow-hidden focus-within:border-indigo-500/50">
                      <input type="text" value={subdomainInput} onChange={handleSubdomainChange} placeholder={isPt ? 'seusite' : 'yoursite'} className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 outline-none" maxLength={30} />
                      <span className="px-4 py-3 bg-slate-700/50 text-slate-400 text-sm font-medium border-l border-slate-600/50">.stellareal.com.br</span>
                    </div>
                    {subdomainError && <p className="absolute -bottom-6 left-0 text-red-400 text-xs flex items-center gap-1"><XIcon className="w-3 h-3" />{subdomainError}</p>}
                  </div>
                  <button onClick={handleSaveSubdomain} disabled={subdomainSaving || subdomainInput === subdomain} className={\`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 \${subdomainSuccess ? 'bg-green-600 text-white' : subdomainInput === subdomain ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}\`}>
                    {subdomainSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : subdomainSuccess ? <><Check className="w-4 h-4" />{isPt ? 'Salvo!' : 'Saved!'}</> : <><LinkIcon className="w-4 h-4" />{isPt ? 'Salvar' : 'Save'}</>}
                  </button>
                </div>
                {subdomain && (
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-slate-400">{isPt ? 'Seu site:' : 'Your site:'}</span>
                      </div>
                      <a href={\`https://\${subdomain}.stellareal.com.br\`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm font-medium">
                        {subdomain}.stellareal.com.br<ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-xs font-medium mb-3">
                <Crown className="w-3 h-3" />{isPt ? 'OFERTA EXCLUSIVA' : 'EXCLUSIVE OFFER'}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{isPt ? '12 meses grátis em qualquer plano!' : '12 months free on any plan!'}</h3>
              <p className="text-amber-200/80 text-sm">{isPt ? 'Como membro fundador, você tem acesso gratuito durante o primeiro ano.' : 'As a founding member, you have free access during the first year.'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id
              const colorClasses: Record<string, string> = { indigo: 'border-indigo-500/50 bg-indigo-500/5', purple: 'border-purple-500/50 bg-purple-500/5', amber: 'border-amber-500/50 bg-amber-500/5', rose: 'border-rose-500/50 bg-rose-500/5' }
              const buttonColorClasses: Record<string, string> = { indigo: 'bg-indigo-600 hover:bg-indigo-700', purple: 'bg-purple-600 hover:bg-purple-700', amber: 'bg-amber-600 hover:bg-amber-700', rose: 'bg-rose-600 hover:bg-rose-700' }
              const iconColorClasses: Record<string, string> = { indigo: 'text-indigo-400 bg-indigo-500/20', purple: 'text-purple-400 bg-purple-500/20', amber: 'text-amber-400 bg-amber-500/20', rose: 'text-rose-400 bg-rose-500/20' }
              return (
                <div key={plan.id} className={\`relative rounded-2xl p-6 transition-all \${isSelected ? colorClasses[plan.color] : 'bg-slate-900/60 border border-slate-700/50 hover:border-slate-600'}\`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">{isPt ? 'Mais Popular' : 'Most Popular'}</span></div>}
                  {isSelected && <div className="absolute top-4 right-4"><div className="p-1 bg-green-500 rounded-full"><Check className="w-4 h-4 text-white" /></div></div>}
                  <div className={\`inline-flex p-3 rounded-xl \${iconColorClasses[plan.color]} mb-4\`}>{plan.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.tagline}</p>
                  <div className="mb-4">
                    {plan.monthlyPrice !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">R$ {plan.founderPrice}</span>
                        <span className="text-slate-500 line-through">R$ {plan.monthlyPrice}</span>
                        <span className="text-slate-400 text-sm">/mês</span>
                      </div>
                    ) : <div className="text-2xl font-bold text-white">{isPt ? 'Sob consulta' : 'Contact us'}</div>}
                    {plan.monthlyPrice !== null && <p className="text-xs text-green-400 mt-1">{isPt ? '12 meses grátis para fundadores' : '12 months free for founders'}</p>}
                  </div>
                  <p className="text-sm text-slate-300 mb-6">{plan.description}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        {feature.included ? <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> : <XIcon className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />}
                        <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleSelectPlan(plan.id)} disabled={savingPlan} className={\`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 \${isSelected ? 'bg-green-600 text-white cursor-default' : buttonColorClasses[plan.color] + ' text-white'}\`}>
                    {isSelected ? <><Check className="w-4 h-4" />{isPt ? 'Selecionado' : 'Selected'}</> : plan.id === 'ENTERPRISE' ? <>{isPt ? 'Falar com vendas' : 'Contact sales'}<ArrowRight className="w-4 h-4" /></> : <>{isPt ? 'Selecionar plano' : 'Select plan'}<ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )
            })}
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              {isPt ? 'Dúvidas?' : 'Questions?'}{' '}
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">{isPt ? 'Fale conosco via WhatsApp' : 'Contact us via WhatsApp'}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
