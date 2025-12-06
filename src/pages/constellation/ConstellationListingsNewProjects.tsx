import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { 
  ArrowLeft, Plus, Building2, Search, 
  MoreVertical, Edit2, Trash2, Eye, EyeOff,
  MapPin, Bed, Bath, Square
} from 'lucide-react'

type Listing = {
  id: string
  listing_type: 'for_sale' | 'for_rent' | 'new_project'
  title: string
  description: string | null
  address_line1: string | null
  neighborhood: string | null
  city: string | null
  state_code: string | null
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  features: Record<string, any> | null
  media: Array<{ kind: string; url: string }>
  status: 'draft' | 'active' | 'pending' | 'sold' | 'rented' | 'archived'
  created_at: string
  parking_spaces?: number | null
}

export default function ConstellationListingsNewProjects() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')
  
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!session) {
      navigate(ConstellationUrls.login(), { replace: true })
      return
    }

    fetchListings()
  }, [session, authLoading])

  const fetchListings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('listing_type', 'new_project')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching listings:', fetchError)
        setError(isPt ? 'Erro ao carregar imóveis' : 'Error loading listings')
      } else {
        setListings(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredListings = listings.filter(l => {
    const matchesSearch = !search || 
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.neighborhood || '').toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      archived: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
    }
    const labels: Record<string, { pt: string; en: string }> = {
      draft: { pt: 'Rascunho', en: 'Draft' },
      active: { pt: 'Ativo', en: 'Active' },
      pending: { pt: 'Pendente', en: 'Pending' },
      archived: { pt: 'Arquivado', en: 'Archived' },
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status] || styles.draft}`}>
        {labels[status]?.[isPt ? 'pt' : 'en'] || status}
      </span>
    )
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', session?.user?.id)

      if (error) throw error
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus as any } : l))
    } catch (err) {
      console.error('Error updating status:', err)
    }
    setActiveMenu(null)
  }

  const deleteListing = async (id: string) => {
    if (!confirm(isPt ? 'Tem certeza que deseja excluir este imóvel?' : 'Are you sure you want to delete this listing?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id)

      if (error) throw error
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error deleting listing:', err)
    }
    setActiveMenu(null)
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{isPt ? 'Novos Projetos' : 'New Projects'} - Constellation</title>
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

  return (
    <>
      <Helmet>
        <title>{isPt ? 'Novos Projetos' : 'New Projects'} - Constellation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/listings"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {isPt ? 'Novos Projetos' : 'New Projects'}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {listings.length} {isPt ? 'lançamentos' : 'projects'}
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/dashboard/listings/create?type=new_project"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              {isPt ? 'Novo Lançamento' : 'New Project'}
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isPt ? 'Buscar projetos...' : 'Search projects...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="all">{isPt ? 'Todos os Status' : 'All Status'}</option>
              <option value="active">{isPt ? 'Ativos' : 'Active'}</option>
              <option value="draft">{isPt ? 'Rascunhos' : 'Drafts'}</option>
              <option value="pending">{isPt ? 'Pendentes' : 'Pending'}</option>
              <option value="archived">{isPt ? 'Arquivados' : 'Archived'}</option>
            </select>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {isPt ? 'Nenhum lançamento cadastrado' : 'No projects listed'}
              </h3>
              <p className="text-slate-400 mb-6">
                {isPt ? 'Adicione seu primeiro lançamento imobiliário' : 'Add your first real estate project'}
              </p>
              <Link
                to="/dashboard/listings/create?type=new_project"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                {isPt ? 'Criar Lançamento' : 'Create Project'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-slate-900">
                    {listing.media?.[0]?.url ? (
                      <img
                        src={listing.media[0].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-500/90 text-white">
                        {isPt ? 'Lançamento' : 'New Project'}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(listing.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 truncate">{listing.title}</h3>
                    {(listing.neighborhood || listing.city) && (
                      <p className="text-sm text-slate-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" />
                        {[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
                      </p>
                    )}

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      {listing.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {listing.bedrooms}
                        </span>
                      )}
                      {listing.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          {listing.bathrooms}
                        </span>
                      )}
                      {listing.area_m2 && (
                        <span className="flex items-center gap-1">
                          <Square className="w-3.5 h-3.5" />
                          {listing.area_m2}m²
                        </span>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-500">{isPt ? 'A partir de' : 'Starting at'}</p>
                        <div className="text-lg font-bold text-amber-400">
                          {formatPrice(listing.price)}
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenu === listing.id && (
                          <div className="absolute right-0 bottom-full mb-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-10">
                            <Link
                              to={`/dashboard/listings/${listing.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
                            >
                              <Edit2 className="w-4 h-4" />
                              {isPt ? 'Editar' : 'Edit'}
                            </Link>
                            {listing.status === 'active' ? (
                              <button
                                onClick={() => updateStatus(listing.id, 'draft')}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 w-full"
                              >
                                <EyeOff className="w-4 h-4" />
                                {isPt ? 'Desativar' : 'Deactivate'}
                              </button>
                            ) : (
                              <button
                                onClick={() => updateStatus(listing.id, 'active')}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 w-full"
                              >
                                <Eye className="w-4 h-4" />
                                {isPt ? 'Ativar' : 'Activate'}
                              </button>
                            )}
                            <button
                              onClick={() => deleteListing(listing.id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 w-full"
                            >
                              <Trash2 className="w-4 h-4" />
                              {isPt ? 'Excluir' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
