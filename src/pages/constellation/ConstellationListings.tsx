import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { 
  ArrowLeft, Plus, Home, Building2, Key, ArrowRight, TrendingUp
} from 'lucide-react'

export default function ConstellationListings() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    forSale: 0,
    forRent: 0,
    newProjects: 0,
    total: 0,
    active: 0,
  })

  useEffect(() => {
    if (authLoading) return
    
    if (!session) {
      navigate(ConstellationUrls.login(), { replace: true })
      return
    }

    fetchStats()
  }, [session, authLoading])

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('listing_type, status')
        .eq('user_id', session?.user?.id)

      if (error) {
        console.error('Error fetching stats:', error)
      } else {
        const listings = data || []
        setStats({
          forSale: listings.filter(l => l.listing_type === 'for_sale').length,
          forRent: listings.filter(l => l.listing_type === 'for_rent').length,
          newProjects: listings.filter(l => l.listing_type === 'new_project').length,
          total: listings.length,
          active: listings.filter(l => l.status === 'active').length,
        })
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{isPt ? 'Meus Imóveis' : 'My Listings'} - Constellation</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConstellationAuthHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">{isPt ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </>
    )
  }

  const categories = [
    {
      id: 'venda',
      title: isPt ? 'Imóveis à Venda' : 'For Sale',
      description: isPt ? 'Casas, apartamentos e terrenos para venda' : 'Houses, apartments and land for sale',
      count: stats.forSale,
      icon: Home,
      color: 'emerald',
      gradient: 'from-emerald-600 to-green-600',
      hoverGradient: 'hover:from-emerald-700 hover:to-green-700',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      link: '/dashboard/listings/venda',
      createLink: '/dashboard/listings/create?type=for_sale',
    },
    {
      id: 'alugar',
      title: isPt ? 'Imóveis para Alugar' : 'For Rent',
      description: isPt ? 'Imóveis disponíveis para locação' : 'Properties available for rent',
      count: stats.forRent,
      icon: Key,
      color: 'indigo',
      gradient: 'from-indigo-600 to-purple-600',
      hoverGradient: 'hover:from-indigo-700 hover:to-purple-700',
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      link: '/dashboard/listings/alugar',
      createLink: '/dashboard/listings/create?type=for_rent',
    },
    {
      id: 'novos-projetos',
      title: isPt ? 'Novos Projetos' : 'New Projects',
      description: isPt ? 'Lançamentos e empreendimentos' : 'New developments and projects',
      count: stats.newProjects,
      icon: Building2,
      color: 'amber',
      gradient: 'from-amber-600 to-orange-600',
      hoverGradient: 'hover:from-amber-700 hover:to-orange-700',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      link: '/dashboard/listings/novos-projetos',
      createLink: '/dashboard/listings/create?type=new_project',
    },
  ]

  return (
    <>
      <Helmet>
        <title>{isPt ? 'Meus Imóveis' : 'My Listings'} - Constellation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isPt ? 'Meus Imóveis' : 'My Listings'}
                </h1>
                <p className="text-sm text-slate-400">
                  {isPt ? 'Gerencie seus anúncios por categoria' : 'Manage your listings by category'}
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/listings/create"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              {isPt ? 'Novo Anúncio' : 'New Listing'}
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-slate-400">{isPt ? 'Total' : 'Total'}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              <p className="text-sm text-slate-400">{isPt ? 'Ativos' : 'Active'}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.forSale}</p>
              <p className="text-sm text-slate-400">{isPt ? 'Venda' : 'For Sale'}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">{stats.forRent}</p>
              <p className="text-sm text-slate-400">{isPt ? 'Aluguel' : 'For Rent'}</p>
            </div>
          </div>

          {/* Category Cards */}
          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.id}
                  className={`bg-slate-800/50 border ${category.borderColor} rounded-2xl p-6 hover:bg-slate-800/70 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${category.bgColor} rounded-xl`}>
                        <Icon className={`w-8 h-8 ${category.textColor}`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                          {category.title}
                          <span className={`px-2.5 py-0.5 text-sm font-medium rounded-full ${category.bgColor} ${category.textColor}`}>
                            {category.count}
                          </span>
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={category.createLink}
                        className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.gradient} ${category.hoverGradient} text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl`}
                      >
                        <Plus className="w-4 h-4" />
                        {isPt ? 'Adicionar' : 'Add'}
                      </Link>
                      <Link
                        to={category.link}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
                      >
                        {isPt ? 'Ver Todos' : 'View All'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Mobile Add Button */}
                  <div className="sm:hidden mt-4 pt-4 border-t border-slate-700/50">
                    <Link
                      to={category.createLink}
                      className={`flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r ${category.gradient} ${category.hoverGradient} text-white rounded-lg font-medium transition-all`}
                    >
                      <Plus className="w-4 h-4" />
                      {isPt ? 'Adicionar Novo' : 'Add New'}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Tips */}
          {stats.total === 0 && (
            <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isPt ? 'Comece a anunciar!' : 'Start advertising!'}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {isPt 
                      ? 'Adicione seus primeiros imóveis para que apareçam no seu site personalizado. Seus anúncios serão exibidos apenas no seu site, não na página principal da Stella.'
                      : 'Add your first listings so they appear on your personalized site. Your listings will only be displayed on your site, not on the main Stella page.'}
                  </p>
                  <Link
                    to="/dashboard/listings/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    {isPt ? 'Criar Primeiro Anúncio' : 'Create First Listing'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
