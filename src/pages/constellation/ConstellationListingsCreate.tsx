import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { ArrowLeft, Plus, Home, Building2, Key, Check, AlertCircle } from 'lucide-react'

type ListingType = 'new_project' | 'for_sale' | 'for_rent'

type Floorplan = {
	id: string
	name: string
	units?: number | null
	pricePerUnit?: number | null
	beds?: number | null
	baths?: number | null
	areaM2?: number | null
	floorplanFile?: File | null
}

const BR_STATES_FULL: Array<{ code: string; name: string }> = [
	{ code: 'AC', name: 'Acre' },
	{ code: 'AL', name: 'Alagoas' },
	{ code: 'AP', name: 'Amapá' },
	{ code: 'AM', name: 'Amazonas' },
	{ code: 'BA', name: 'Bahia' },
	{ code: 'CE', name: 'Ceará' },
	{ code: 'DF', name: 'Distrito Federal' },
	{ code: 'ES', name: 'Espírito Santo' },
	{ code: 'GO', name: 'Goiás' },
	{ code: 'MA', name: 'Maranhão' },
	{ code: 'MT', name: 'Mato Grosso' },
	{ code: 'MS', name: 'Mato Grosso do Sul' },
	{ code: 'MG', name: 'Minas Gerais' },
	{ code: 'PA', name: 'Pará' },
	{ code: 'PB', name: 'Paraíba' },
	{ code: 'PR', name: 'Paraná' },
	{ code: 'PE', name: 'Pernambuco' },
	{ code: 'PI', name: 'Piauí' },
	{ code: 'RJ', name: 'Rio de Janeiro' },
	{ code: 'RN', name: 'Rio Grande do Norte' },
	{ code: 'RS', name: 'Rio Grande do Sul' },
	{ code: 'RO', name: 'Rondônia' },
	{ code: 'RR', name: 'Roraima' },
	{ code: 'SC', name: 'Santa Catarina' },
	{ code: 'SP', name: 'São Paulo' },
	{ code: 'SE', name: 'Sergipe' },
	{ code: 'TO', name: 'Tocantins' },
]

const FEATURES = {
	property: [
		'garden', 'garage', 'balcony', 'sea_view', 'wheelchair_accessible', 'solar_power',
		'fully_furnished', 'pets_allowed', 'heating', 'air_conditioning', 'service_area',
		'storage_room', 'office', 'large_windows', 'fireplace', 'furnished_backyard',
		'cable_tv', 'beautiful_view', 'gourmet_balcony',
		'bulletproof_windows', 'washing_machine', 'dryer'
	],
	leisure: [
		'pool', 'tennis_court', 'basketball_court', 'playground', 'party_room', 'game_room', 'sauna', 'spa', 'bbq_area'
	],
	convenience: [
		'elevator', 'gym', 'coworking', 'laundry_room', 'bike_storage', 'intercom'
	],
	security: [
		'doorman', 'cctv', 'gated', 'security_24h', 'facial_recognition', 'electric_fence'
	]
} as const

const RESIDENTIAL_TYPES = [
	{ value: 'apartment', label: 'Apartamento' },
	{ value: 'penthouse', label: 'Cobertura' },
	{ value: 'studio', label: 'Studio' },
	{ value: 'kitnet', label: 'Kitnet' },
	{ value: 'house', label: 'Casa' },
	{ value: 'loft', label: 'Loft' },
	{ value: 'land_lot', label: 'Terreno' },
	{ value: 'farm_ranch', label: 'Sítio / Fazenda' },
] as const

const COMMERCIAL_TYPES = [
	{ value: 'office', label: 'Escritório' },
	{ value: 'retail', label: 'Loja' },
	{ value: 'casa_comercial', label: 'Casa Comercial' },
	{ value: 'hotel', label: 'Hotel' },
	{ value: 'motel', label: 'Motel' },
	{ value: 'entire_floor', label: 'Andar Corporativo' },
	{ value: 'entire_building', label: 'Prédio Comercial' },
	{ value: 'garage', label: 'Garagem' },
	{ value: 'land_commercial', label: 'Terreno Comercial' },
	{ value: 'storage_facility', label: 'Galpão' },
	{ value: 'factory', label: 'Fábrica' },
	{ value: 'warehouse', label: 'Armazém' },
] as const

const featureLabel = (key: string, isPt: boolean) => {
	const labels: Record<string, { pt: string; en: string }> = {
		garden: { pt: 'Jardim', en: 'Garden' },
		garage: { pt: 'Garagem', en: 'Garage' },
		balcony: { pt: 'Varanda', en: 'Balcony' },
		sea_view: { pt: 'Vista Mar', en: 'Sea View' },
		wheelchair_accessible: { pt: 'Acessível', en: 'Accessible' },
		solar_power: { pt: 'Energia Solar', en: 'Solar Power' },
		fully_furnished: { pt: 'Mobiliado', en: 'Furnished' },
		pets_allowed: { pt: 'Aceita Pets', en: 'Pets Allowed' },
		heating: { pt: 'Aquecimento', en: 'Heating' },
		air_conditioning: { pt: 'Ar Condicionado', en: 'A/C' },
		service_area: { pt: 'Área de Serviço', en: 'Service Area' },
		storage_room: { pt: 'Depósito', en: 'Storage' },
		office: { pt: 'Escritório', en: 'Office' },
		pool: { pt: 'Piscina', en: 'Pool' },
		gym: { pt: 'Academia', en: 'Gym' },
		elevator: { pt: 'Elevador', en: 'Elevator' },
		doorman: { pt: 'Portaria', en: 'Doorman' },
		cctv: { pt: 'Câmeras', en: 'CCTV' },
		gated: { pt: 'Condomínio Fechado', en: 'Gated' },
		security_24h: { pt: 'Segurança 24h', en: '24h Security' },
		bbq_area: { pt: 'Churrasqueira', en: 'BBQ Area' },
		party_room: { pt: 'Salão de Festas', en: 'Party Room' },
		playground: { pt: 'Playground', en: 'Playground' },
		coworking: { pt: 'Coworking', en: 'Coworking' },
	}
	return labels[key]?.[isPt ? 'pt' : 'en'] || key.replace(/_/g, ' ')
}

export default function ConstellationListingsCreate() {
	const navigate = useNavigate()
	const { session, loading: authLoading } = useAuth()
	const { i18n } = useTranslation()
	const isPt = i18n.language?.startsWith('pt')
	
	const [loading, setLoading] = useState(true)
	const [memberData, setMemberData] = useState<any>(null)
	
	// Listing type selection
	const [listingType, setListingType] = useState<ListingType>('for_sale')
	
	// Helpers for BRL currency input
	const toBRL = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
	const formatBRLInput = (raw: string) => {
		const digits = (raw || '').replace(/\D/g, '')
		if (!digits) return ''
		const value = Number(digits) / 100
		return toBRL(value)
	}
	const parseBRL = (s: string): number | null => {
		if (!s) return null
		const digits = s.replace(/\D/g, '')
		if (!digits) return null
		return Number(digits) / 100
	}

	// Form state
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [address, setAddress] = useState('')
	const [addressNumber, setAddressNumber] = useState('')
	const [city, setCity] = useState('')
	const [neighborhood, setNeighborhood] = useState('')
	const [stateCode, setStateCode] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [price, setPrice] = useState<string>('')
	const [area, setArea] = useState<number | ''>('')
	const [bedrooms, setBedrooms] = useState<number | ''>('')
	const [bathrooms, setBathrooms] = useState<number | ''>('')
	const [features, setFeatures] = useState<Record<string, boolean>>({})
	const [parkingSpaces, setParkingSpaces] = useState<number | ''>('')
	const [unitFloor, setUnitFloor] = useState<number | ''>('')
	const [condoFee, setCondoFee] = useState<string>('')
	const [iptuFee, setIptuFee] = useState<string>('')
	const [unitNumber, setUnitNumber] = useState('')
	const [usage, setUsage] = useState<'residential' | 'commercial'>('residential')
	const [propType, setPropType] = useState<string>('')
	const [showExactAddress, setShowExactAddress] = useState(true)
	
	// For Rent specific
	const [minLeaseTerm, setMinLeaseTerm] = useState<number | ''>('')
	
	// New Project specific
	const [unitsAvailable, setUnitsAvailable] = useState<string>('')
	const [unitPrice, setUnitPrice] = useState<string>('')
	const [expectedDeliveryMonth, setExpectedDeliveryMonth] = useState('')
	const [expectedDeliveryYear, setExpectedDeliveryYear] = useState('')
	const [floorplans, setFloorplans] = useState<Floorplan[]>([])
	
	// Media
	const [thumbFile, setThumbFile] = useState<File | null>(null)
	const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null)
	
	// UI state
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

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
			setLoading(false)
		} catch (err) {
			console.error('Error:', err)
			setLoading(false)
		}
	}

	const floorplanUnitsTotal = useMemo(() => floorplans.reduce((acc, fp) => acc + (fp.units || 0), 0), [floorplans])

	const addFloorplan = () => {
		setFloorplans(prev => [...prev, { id: crypto.randomUUID(), name: '', units: null, pricePerUnit: null, beds: null, baths: null, areaM2: null }])
	}

	const removeFloorplan = (id: string) => {
		setFloorplans(prev => prev.filter(fp => fp.id !== id))
	}

	const updateFloorplan = (id: string, field: keyof Floorplan, value: any) => {
		setFloorplans(prev => prev.map(fp => fp.id === id ? { ...fp, [field]: value } : fp))
	}

	const resetForm = () => {
		setTitle('')
		setDescription('')
		setAddress('')
		setAddressNumber('')
		setNeighborhood('')
		setCity('')
		setStateCode('')
		setPostalCode('')
		setUnitNumber('')
		setUsage('residential')
		setPropType('')
		setPrice('')
		setArea('')
		setBedrooms('')
		setBathrooms('')
		setParkingSpaces('')
		setUnitFloor('')
		setCondoFee('')
		setIptuFee('')
		setFeatures({})
		setThumbFile(null)
		setGalleryFiles(null)
		setMinLeaseTerm('')
		setUnitsAvailable('')
		setUnitPrice('')
		setExpectedDeliveryMonth('')
		setExpectedDeliveryYear('')
		setFloorplans([])
		setShowExactAddress(true)
	}

	const uploadImages = async (listingId: string): Promise<Array<{ kind: string; url: string }>> => {
		const uploads: Array<{ kind: string; url: string }> = []
		if (!thumbFile && (!galleryFiles || galleryFiles.length === 0)) return uploads
		try {
			const bucket = supabase.storage.from('listings')
			if (thumbFile) {
				const ext = thumbFile.name.split('.').pop() || 'jpg'
				const path = `${listingId}/thumbnail-${Date.now()}.${ext}`
				const { error: upErr } = await bucket.upload(path, thumbFile, { cacheControl: '3600', upsert: true })
				if (upErr) throw upErr
				const { data: pub } = bucket.getPublicUrl(path)
				if (pub?.publicUrl) uploads.push({ kind: 'thumbnail', url: pub.publicUrl })
			}
			if (galleryFiles && galleryFiles.length > 0) {
				for (let i = 0; i < galleryFiles.length; i++) {
					const f = galleryFiles.item(i)!
					const ext = f.name.split('.').pop() || 'jpg'
					const path = `${listingId}/gallery/${Date.now()}-${i}.${ext}`
					const { error: upErr } = await bucket.upload(path, f, { cacheControl: '3600', upsert: true })
					if (upErr) throw upErr
					const { data: pub } = bucket.getPublicUrl(path)
					if (pub?.publicUrl) uploads.push({ kind: 'image', url: pub.publicUrl })
				}
			}
		} catch (e: any) {
			console.error('Upload failed:', e?.message || e)
			setError(isPt ? 'Falha no upload de imagens.' : 'Image upload failed.')
		}
		return uploads
	}

	const createListing = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!session?.user?.id) {
			setError(isPt ? 'Você precisa estar logado.' : 'You must be logged in.')
			return
		}
		
		setSaving(true)
		setError(null)
		setSuccess(null)
		
		try {
			const featureMap = Object.keys(features).reduce((acc: any, key) => {
				if (features[key]) acc[key] = true
				return acc
			}, {})

			const featuresObj: Record<string, any> = {
				...featureMap,
				...(parseBRL(iptuFee) != null ? { iptu_fee: parseBRL(iptuFee) } : {}),
				show_exact_address: showExactAddress,
			}

			// Add new project specific features
			if (listingType === 'new_project') {
				const parsedUnits = unitsAvailable ? parseInt(unitsAvailable, 10) : null
				const parsedUnitPrice = parseBRL(unitPrice)
				if (parsedUnits != null) {
					featuresObj.units_available = parsedUnits
				}
				if (parsedUnitPrice != null) {
					featuresObj.unit_price = parsedUnitPrice
				}
				if (parsedUnits != null && parsedUnitPrice != null) {
					featuresObj.total_inventory_value = parsedUnits * parsedUnitPrice
				}
				if (expectedDeliveryMonth || expectedDeliveryYear) {
					featuresObj.expected_delivery = { month: expectedDeliveryMonth, year: expectedDeliveryYear }
				}
				if (floorplans.length > 0) {
					featuresObj.floorplans = floorplans.map(fp => ({
						id: fp.id,
						name: fp.name,
						units: fp.units,
						pricePerUnit: fp.pricePerUnit,
						beds: fp.beds,
						baths: fp.baths,
						areaM2: fp.areaM2,
					}))
				}
			}

			if (listingType === 'for_rent' && minLeaseTerm) {
				featuresObj.min_lease_term = minLeaseTerm
			}

			// CRITICAL: Include user_id to scope listing to this Constellation user
			const insert: any = {
				user_id: session.user.id, // This scopes the listing to the user's site
				listing_type: listingType,
				title,
				description: description || null,
				address_line1: address || null,
				address_number: addressNumber || null,
				unit_number: unitNumber || null,
				neighborhood: neighborhood || null,
				city: city || null,
				state_code: stateCode || null,
				postal_code: postalCode || null,
				property_usage: usage,
				property_type: propType || null,
				price: parseBRL(price),
				area_m2: area === '' ? null : Number(area),
				bedrooms: bedrooms === '' ? null : Number(bedrooms),
				bathrooms: bathrooms === '' ? null : Number(bathrooms),
				parking_spaces: parkingSpaces === '' ? null : Number(parkingSpaces),
				unit_floor: unitFloor === '' ? null : Number(unitFloor),
				condo_fee: parseBRL(condoFee),
				features: featuresObj,
				status: 'draft' as const,
				media: [] as any,
			}

			const { data, error: insertError } = await supabase.from('listings').insert(insert).select('*').single()
			if (insertError) throw insertError
			
			const created = data as any

			// Upload images
			const media = await uploadImages(created.id)

			if (media.length) {
				await supabase.from('listings').update({ media }).eq('id', created.id)
			}

			setSuccess(isPt ? `Imóvel "${title}" criado com sucesso!` : `Listing "${title}" created successfully!`)
			resetForm()
			
			// Redirect to listings page after short delay
			setTimeout(() => {
				navigate('/dashboard/listings')
			}, 1500)
		} catch (e: any) {
			setError(e?.message || (isPt ? 'Falha ao criar imóvel' : 'Failed to create listing'))
		} finally {
			setSaving(false)
		}
	}

	const inputCls = "w-full rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-100 placeholder-slate-500 px-4 py-2.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
	const selectCls = "w-full rounded-lg border border-slate-600/50 bg-slate-800/50 text-slate-100 px-4 py-2.5 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"

	const listingTypeOptions: Array<{ value: ListingType; label: string; labelPt: string; description: string; descriptionPt: string; icon: React.ReactNode }> = [
		{ 
			value: 'for_sale', 
			label: 'For Sale', 
			labelPt: 'Venda',
			description: 'Single property for sale',
			descriptionPt: 'Imóvel à venda',
			icon: <Home className="w-6 h-6" />
		},
		{ 
			value: 'for_rent', 
			label: 'For Rent', 
			labelPt: 'Aluguel',
			description: 'Property for rent',
			descriptionPt: 'Imóvel para alugar',
			icon: <Key className="w-6 h-6" />
		},
		{ 
			value: 'new_project', 
			label: 'New Project', 
			labelPt: 'Lançamento',
			description: 'Development project',
			descriptionPt: 'Empreendimento',
			icon: <Building2 className="w-6 h-6" />
		},
	]

	if (loading) {
		return (
			<>
				<Helmet>
					<title>{isPt ? 'Criar Imóvel' : 'Create Listing'} - Constellation</title>
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
				<title>{isPt ? 'Criar Imóvel' : 'Create Listing'} - Constellation</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<ConstellationAuthHeader />
			
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<Link
							to="/dashboard/listings"
							className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
						>
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="text-2xl font-bold text-white">
								{isPt ? 'Criar Novo Imóvel' : 'Create New Listing'}
							</h1>
							<p className="text-slate-400 mt-1">
								{isPt ? 'Adicione um imóvel ao seu portfólio' : 'Add a property to your portfolio'}
							</p>
						</div>
					</div>

					{/* Listing Type Selector */}
					<div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-6">
						<h2 className="text-lg font-semibold text-white mb-4">
							{isPt ? 'Tipo de Imóvel' : 'Listing Type'}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{listingTypeOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => setListingType(option.value)}
									className={`p-4 rounded-xl border-2 transition-all text-left ${
										listingType === option.value
											? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
											: 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-700/30'
									}`}
								>
									<div className={`mb-2 ${listingType === option.value ? 'text-indigo-400' : 'text-slate-400'}`}>
										{option.icon}
									</div>
									<div className="font-semibold text-white">
										{isPt ? option.labelPt : option.label}
									</div>
									<div className="text-sm text-slate-400 mt-1">
										{isPt ? option.descriptionPt : option.description}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Form */}
					<form onSubmit={createListing}>
						<div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-6">
							{error && (
								<div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
									<AlertCircle className="w-5 h-5 flex-shrink-0" />
									<span>{error}</span>
								</div>
							)}

							{success && (
								<div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
									<Check className="w-5 h-5 flex-shrink-0" />
									<span>{success}</span>
								</div>
							)}

							{/* Basic Info */}
							<div>
								<h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-slate-700/50">
									{isPt ? 'Informações Básicas' : 'Basic Information'}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="sm:col-span-2">
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Título *' : 'Title *'}
										</label>
										<input
											className={inputCls}
											value={title}
											onChange={e => setTitle(e.target.value)}
											required
											placeholder={isPt ? 'Ex: Apartamento 3 quartos em Ipanema' : 'e.g., 3BR Apartment in Ipanema'}
										/>
									</div>
									
									{listingType !== 'new_project' && (
										<>
											<div>
												<label className="block text-sm font-medium text-slate-300 mb-1.5">
													{isPt ? 'Uso' : 'Usage'}
												</label>
												<select className={selectCls} value={usage} onChange={e => setUsage(e.target.value as any)}>
													<option value="residential">{isPt ? 'Residencial' : 'Residential'}</option>
													<option value="commercial">{isPt ? 'Comercial' : 'Commercial'}</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-300 mb-1.5">
													{isPt ? 'Tipo de Imóvel' : 'Property Type'}
												</label>
												<select className={selectCls} value={propType} onChange={e => setPropType(e.target.value)}>
													<option value="">{isPt ? 'Selecione' : 'Select type'}</option>
													{(usage === 'residential' ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES).map(t => (
														<option key={t.value} value={t.value}>{t.label}</option>
													))}
												</select>
											</div>
										</>
									)}
									
									<div className="sm:col-span-2">
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Descrição' : 'Description'}
										</label>
										<textarea
											className={inputCls + " min-h-[100px] resize-y"}
											value={description}
											onChange={e => setDescription(e.target.value)}
											placeholder={isPt ? 'Descreva o imóvel...' : 'Describe the property...'}
										/>
									</div>
								</div>
							</div>

							{/* Location */}
							<div>
								<h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-slate-700/50">
									{isPt ? 'Localização' : 'Location'}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="lg:col-span-2">
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Endereço' : 'Street Address'}
										</label>
										<input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} placeholder={isPt ? 'Ex: Rua Visconde de Pirajá' : 'e.g., Rua Visconde de Pirajá'} />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Número' : 'Number'}
										</label>
										<input className={inputCls} value={addressNumber} onChange={e => setAddressNumber(e.target.value)} placeholder="500" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Bairro' : 'Neighborhood'}
										</label>
										<input className={inputCls} value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder={isPt ? 'Ex: Ipanema' : 'e.g., Ipanema'} />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Cidade' : 'City'}
										</label>
										<input className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder={isPt ? 'Ex: Rio de Janeiro' : 'e.g., Rio de Janeiro'} />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Estado' : 'State'}
										</label>
										<select className={selectCls} value={stateCode} onChange={e => setStateCode(e.target.value)}>
											<option value="">{isPt ? 'Selecione' : 'Select'}</option>
											{BR_STATES_FULL.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
										</select>
									</div>
								</div>
							</div>

							{/* Pricing */}
							<div>
								<h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-slate-700/50">
									{isPt ? 'Preço e Área' : 'Pricing & Size'}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{listingType === 'new_project' ? (
										<>
											<div>
												<label className="block text-sm font-medium text-slate-300 mb-1.5">
													{isPt ? 'Unidades Disponíveis' : 'Units Available'}
												</label>
												<input type="number" min={0} className={inputCls} value={unitsAvailable} onChange={e => setUnitsAvailable(e.target.value)} placeholder="23" />
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-300 mb-1.5">
													{isPt ? 'Preço Base por Unidade' : 'Base Price per Unit'}
												</label>
												<input type="text" inputMode="numeric" className={inputCls} value={unitPrice} onChange={e => setUnitPrice(formatBRLInput(e.target.value))} placeholder="R$ 0,00" />
											</div>
										</>
									) : (
										<div>
											<label className="block text-sm font-medium text-slate-300 mb-1.5">
												{listingType === 'for_rent' ? (isPt ? 'Aluguel Mensal' : 'Monthly Rent') : (isPt ? 'Preço de Venda' : 'Sale Price')}
											</label>
											<input type="text" inputMode="numeric" className={inputCls} value={price} onChange={e => setPrice(formatBRLInput(e.target.value))} placeholder="R$ 0,00" />
										</div>
									)}
									
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Área (m²)' : 'Area (m²)'}
										</label>
										<input type="number" min={0} className={inputCls} value={area} onChange={e => setArea(e.target.value === '' ? '' : Number(e.target.value))} placeholder="120" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Quartos' : 'Bedrooms'}
										</label>
										<input type="number" min={0} className={inputCls} value={bedrooms} onChange={e => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="3" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Banheiros' : 'Bathrooms'}
										</label>
										<input type="number" min={0} step={0.5} className={inputCls} value={bathrooms} onChange={e => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Vagas' : 'Parking'}
										</label>
										<input type="number" min={0} className={inputCls} value={parkingSpaces} onChange={e => setParkingSpaces(e.target.value === '' ? '' : Number(e.target.value))} placeholder="2" />
									</div>
								</div>
							</div>

							{/* Monthly Fees */}
							<div>
								<h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-slate-700/50">
									{isPt ? 'Taxas Mensais' : 'Monthly Fees'}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Condomínio' : 'Condo Fee'}
										</label>
										<input type="text" inputMode="numeric" className={inputCls} value={condoFee} onChange={e => setCondoFee(formatBRLInput(e.target.value))} placeholder="R$ 0,00" />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'IPTU (anual)' : 'IPTU (annual)'}
										</label>
										<input type="text" inputMode="numeric" className={inputCls} value={iptuFee} onChange={e => setIptuFee(formatBRLInput(e.target.value))} placeholder="R$ 0,00" />
									</div>
									{listingType === 'for_rent' && (
										<div>
											<label className="block text-sm font-medium text-slate-300 mb-1.5">
												{isPt ? 'Contrato Mínimo (meses)' : 'Min. Lease (months)'}
											</label>
											<input type="number" min={1} className={inputCls} value={minLeaseTerm} onChange={e => setMinLeaseTerm(e.target.value === '' ? '' : Number(e.target.value))} placeholder="12" />
										</div>
									)}
								</div>
							</div>

							{/* Images */}
							<div>
								<h3 className="text-lg font-medium text-white mb-4 pb-2 border-b border-slate-700/50">
									{isPt ? 'Imagens' : 'Images'}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Foto Principal' : 'Thumbnail'}
										</label>
										<input type="file" accept="image/*" className="text-slate-400 text-sm" onChange={e => setThumbFile(e.target.files?.[0] || null)} />
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-300 mb-1.5">
											{isPt ? 'Galeria' : 'Gallery'}
										</label>
										<input type="file" accept="image/*" multiple className="text-slate-400 text-sm" onChange={e => setGalleryFiles(e.target.files)} />
									</div>
								</div>
							</div>

							{/* Submit */}
							<div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
								<button
									type="button"
									onClick={() => navigate('/dashboard/listings')}
									className="px-5 py-2.5 text-sm rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800/50 transition-all"
								>
									{isPt ? 'Cancelar' : 'Cancel'}
								</button>
								<button
									type="submit"
									disabled={saving || !title}
									className="px-6 py-2.5 text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-medium transition-all flex items-center gap-2"
								>
									{saving ? (
										<>
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											{isPt ? 'Criando...' : 'Creating...'}
										</>
									) : (
										<>
											<Plus className="w-4 h-4" />
											{isPt ? 'Criar Imóvel' : 'Create Listing'}
										</>
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}
