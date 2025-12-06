import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { 
	ArrowLeft, Plus, Home, Building2, Key, Search, Filter, 
	MoreVertical, Edit2, Trash2, Eye, EyeOff, CheckCircle,
	MapPin, Bed, Bath, Square, DollarSign
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

export default function ConstellationListings() {
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const { session, loading: authLoading } = useAuth()
	const { i18n } = useTranslation()
	const isPt = i18n.language?.startsWith('pt')
	
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState<Listing[]>([])
	const [memberData, setMemberData] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)
	
	// Filters
	const [search, setSearch] = useState('')
	const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || 'all')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	
	// Action menu
	const [activeMenu, setActiveMenu] = useState<string | null>(null)

	useEffect(() => {
		if (authLoading) return
		
		if (!session) {
			navigate(ConstellationUrls.login(), { replace: true })
			return
		}

		fetchData()
	}, [session, authLoading])

	useEffect(() => {
		const type = searchParams.get('type')
		if (type) setTypeFilter(type)
	}, [searchParams])

	const fetchData = async () => {
		try {
			// Fetch member data
			const { data: memberResult } = await supabase
				.from('founding_members')
				.select('*')
				.eq('user_id', session?.user?.id)
				.single()

			if (memberResult) {
				setMemberData(memberResult)
			}

			// Fetch listings for this user only
			const { data: listingsData, error: listingsError } = await supabase
				.from('listings')
				.select('*')
				.eq('user_id', session?.user?.id)
				.order('created_at', { ascending: false })

			if (listingsError) {
				console.error('Error fetching listings:', listingsError)
				setError(isPt ? 'Erro ao carregar imóveis' : 'Error loading listings')
			} else {
				setListings(listingsData || [])
			}

			setLoading(false)
		} catch (err) {
			console.error('Error:', err)
			setLoading(false)
		}
	}

	const filteredListings = useMemo(() => {
		return listings.filter(l => {
			const matchesSearch = !search || 
				l.title.toLowerCase().includes(search.toLowerCase()) ||
				(l.city || '').toLowerCase().includes(search.toLowerCase()) ||
				(l.neighborhood || '').toLowerCase().includes(search.toLowerCase())
			
			const matchesType = typeFilter === 'all' || l.listing_type === typeFilter
			const matchesStatus = statusFilter === 'all' || l.status === statusFilter
			
			return matchesSearch && matchesType && matchesStatus
		})
	}, [listings, search, typeFilter, statusFilter])

	const stats = useMemo(() => ({
		total: listings.length,
		forSale: listings.filter(l => l.listing_type === 'for_sale').length,
		forRent: listings.filter(l => l.listing_type === 'for_rent').length,
		newProjects: listings.filter(l => l.listing_type === 'new_project').length,
		active: listings.filter(l => l.status === 'active').length,
		draft: listings.filter(l => l.status === 'draft').length,
	}), [listings])

	const formatPrice = (price: number | null) => {
		if (!price) return '-'
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
	}

	const getStatusBadge = (status: string) => {
		const styles: Record<string, string> = {
			draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
			active: 'bg-green-500/20 text-green-300 border-green-500/30',
			pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
			sold: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
			rented: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
			archived: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
		}
		const labels: Record<string, { pt: string; en: string }> = {
			draft: { pt: 'Rascunho', en: 'Draft' },
			active: { pt: 'Ativo', en: 'Active' },
			pending: { pt: 'Pendente', en: 'Pending' },
			sold: { pt: 'Vendido', en: 'Sold' },
			rented: { pt: 'Alugado', en: 'Rented' },
			archived: { pt: 'Arquivado', en: 'Archived' },
		}
		return (
			<span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status] || styles.draft}`}>
				{labels[status]?.[isPt ? 'pt' : 'en'] || status}
			</span>
		)
	}

	const getTypeBadge = (type: string) => {
		const styles: Record<string, string> = {
			for_sale: 'bg-emerald-500/20 text-emerald-300',
			for_rent: 'bg-indigo-500/20 text-indigo-300',
			new_project: 'bg-amber-500/20 text-amber-300',
		}
		const labels: Record<string, { pt: string; en: string }> = {
			for_sale: { pt: 'Venda', en: 'For Sale' },
			for_rent: { pt: 'Aluguel', en: 'For Rent' },
			new_project: { pt: 'Lançamento', en: 'New Project' },
		}
		return (
			<span className={`px-2 py-0.5 text-xs font-medium rounded ${styles[type]}`}>
				{labels[type]?.[isPt ? 'pt' : 'en'] || type}
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

	return (
		<>
			<Helmet>
				<title>{isPt ? 'Meus Imóveis' : 'My Listings'} - Constellation</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<ConstellationAuthHeader />
			
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
				<div className="max-w-6xl mx-auto">
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
								<p className="text-slate-400 mt-1">
									{isPt ? 'Gerencie seu portfólio de imóveis' : 'Manage your property portfolio'}
								</p>
							</div>
						</div>
						<Link
							to="/dashboard/listings/create"
							className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
						>
							<Plus className="w-4 h-4" />
							{isPt ? 'Novo Imóvel' : 'New Listing'}
						</Link>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
							<div className="text-2xl font-bold text-white">{stats.total}</div>
							<div className="text-sm text-slate-400">{isPt ? 'Total' : 'Total'}</div>
						</div>
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
							<div className="text-2xl font-bold text-emerald-400">{stats.forSale}</div>
							<div className="text-sm text-slate-400">{isPt ? 'Venda' : 'For Sale'}</div>
						</div>
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
							<div className="text-2xl font-bold text-indigo-400">{stats.forRent}</div>
							<div className="text-sm text-slate-400">{isPt ? 'Aluguel' : 'For Rent'}</div>
						</div>
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4">
							<div className="text-2xl font-bold text-amber-400">{stats.newProjects}</div>
							<div className="text-sm text-slate-400">{isPt ? 'Lançamentos' : 'Projects'}</div>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
								<input
									type="text"
									value={search}
									onChange={e => setSearch(e.target.value)}
									placeholder={isPt ? 'Buscar por título, cidade...' : 'Search by title, city...'}
									className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
								/>
							</div>
							<div className="flex gap-2">
								<select
									value={typeFilter}
									onChange={e => {
										setTypeFilter(e.target.value)
										if (e.target.value !== 'all') {
											setSearchParams({ type: e.target.value })
										} else {
											setSearchParams({})
										}
									}}
									className="px-4 py-2.5 rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 outline-none transition-all"
								>
									<option value="all">{isPt ? 'Todos os tipos' : 'All types'}</option>
									<option value="for_sale">{isPt ? 'Venda' : 'For Sale'}</option>
									<option value="for_rent">{isPt ? 'Aluguel' : 'For Rent'}</option>
									<option value="new_project">{isPt ? 'Lançamentos' : 'Projects'}</option>
								</select>
								<select
									value={statusFilter}
									onChange={e => setStatusFilter(e.target.value)}
									className="px-4 py-2.5 rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 outline-none transition-all"
								>
									<option value="all">{isPt ? 'Todos os status' : 'All status'}</option>
									<option value="draft">{isPt ? 'Rascunho' : 'Draft'}</option>
									<option value="active">{isPt ? 'Ativo' : 'Active'}</option>
									<option value="pending">{isPt ? 'Pendente' : 'Pending'}</option>
									<option value="sold">{isPt ? 'Vendido' : 'Sold'}</option>
									<option value="rented">{isPt ? 'Alugado' : 'Rented'}</option>
								</select>
							</div>
						</div>
					</div>

					{/* Listings Grid */}
					{filteredListings.length === 0 ? (
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-12 text-center">
							<Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-white mb-2">
								{listings.length === 0 
									? (isPt ? 'Nenhum imóvel cadastrado' : 'No listings yet')
									: (isPt ? 'Nenhum resultado encontrado' : 'No results found')
								}
							</h3>
							<p className="text-slate-400 mb-6">
								{listings.length === 0
									? (isPt ? 'Comece adicionando seu primeiro imóvel' : 'Start by adding your first property')
									: (isPt ? 'Tente ajustar os filtros' : 'Try adjusting your filters')
								}
							</p>
							{listings.length === 0 && (
								<Link
									to="/dashboard/listings/create"
									className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all"
								>
									<Plus className="w-4 h-4" />
									{isPt ? 'Adicionar Imóvel' : 'Add Listing'}
								</Link>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredListings.map(listing => {
								const thumb = listing.media?.find(m => m.kind === 'thumbnail')?.url || listing.media?.[0]?.url
								
								return (
									<div key={listing.id} className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all group">
										{/* Image */}
										<div className="relative aspect-[4/3] bg-slate-800">
											{thumb ? (
												<img src={thumb} alt={listing.title} className="w-full h-full object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center text-slate-600">
													<Building2 className="w-12 h-12" />
												</div>
											)}
											<div className="absolute top-3 left-3 flex gap-2">
												{getTypeBadge(listing.listing_type)}
											</div>
											<div className="absolute top-3 right-3">
												{getStatusBadge(listing.status)}
											</div>
										</div>
										
										{/* Content */}
										<div className="p-4">
											<h3 className="font-semibold text-white line-clamp-1 mb-1">{listing.title}</h3>
											{(listing.neighborhood || listing.city) && (
												<div className="flex items-center gap-1 text-sm text-slate-400 mb-3">
													<MapPin className="w-3.5 h-3.5" />
													<span className="line-clamp-1">
														{[listing.neighborhood, listing.city].filter(Boolean).join(', ')}
													</span>
												</div>
											)}
											
											<div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
												{listing.bedrooms != null && (
													<span className="flex items-center gap-1">
														<Bed className="w-3.5 h-3.5" />
														{listing.bedrooms}
													</span>
												)}
												{listing.bathrooms != null && (
													<span className="flex items-center gap-1">
														<Bath className="w-3.5 h-3.5" />
														{listing.bathrooms}
													</span>
												)}
												{listing.area_m2 != null && (
													<span className="flex items-center gap-1">
														<Square className="w-3.5 h-3.5" />
														{listing.area_m2}m²
													</span>
												)}
											</div>
											
											<div className="flex items-center justify-between">
												<div className="text-lg font-bold text-white">
													{formatPrice(listing.price)}
													{listing.listing_type === 'for_rent' && <span className="text-sm font-normal text-slate-400">/mês</span>}
												</div>
												
												{/* Actions */}
												<div className="relative">
													<button
														onClick={() => setActiveMenu(activeMenu === listing.id ? null : listing.id)}
														className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
													>
														<MoreVertical className="w-4 h-4" />
													</button>
													
													{activeMenu === listing.id && (
														<div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl z-10 overflow-hidden">
															<button
																onClick={() => navigate(`/dashboard/listings/edit/${listing.id}`)}
																className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-700/50 flex items-center gap-2"
															>
																<Edit2 className="w-4 h-4" />
																{isPt ? 'Editar' : 'Edit'}
															</button>
															{listing.status === 'draft' ? (
																<button
																	onClick={() => updateStatus(listing.id, 'active')}
																	className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-700/50 flex items-center gap-2"
																>
																	<Eye className="w-4 h-4" />
																	{isPt ? 'Publicar' : 'Publish'}
																</button>
															) : listing.status === 'active' ? (
																<button
																	onClick={() => updateStatus(listing.id, 'draft')}
																	className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-700/50 flex items-center gap-2"
																>
																	<EyeOff className="w-4 h-4" />
																	{isPt ? 'Despublicar' : 'Unpublish'}
																</button>
															) : null}
															<button
																onClick={() => deleteListing(listing.id)}
																className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
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
								)
							})}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
