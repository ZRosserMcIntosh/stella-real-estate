import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Listing = {
	id: string
	listing_type: 'for_sale' | 'for_rent'
	title: string
	description: string | null
	address_line1: string | null
	city: string | null
	state_code: string | null
	postal_code: string | null
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

const featureLabel = (key: string) => {
	if (key === 'security_24h') return '24 Hour Security Guard'
	return key.replace(/_/g, ' ')
}

export default function ListingsForSale() {
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
		const [bbqType, setBbqType] = useState<'gas' | 'charcoal' | ''>('')
		const [parkingSpaces, setParkingSpaces] = useState<number | ''>('')
		const [stoveType, setStoveType] = useState<'gas' | 'electric' | 'induction' | ''>('')
		const [internetType, setInternetType] = useState<'fiber' | 'dsl' | 'broadband' | 'mobile' | 'starlink' | ''>('')
			const [unitFloor, setUnitFloor] = useState<number | ''>('')
			const [landAreaM2, setLandAreaM2] = useState<number | ''>('')
			const [condoFee, setCondoFee] = useState<string>('')
			const [iptuFee, setIptuFee] = useState<string>('')
			const [unitNumber, setUnitNumber] = useState('')
			const [usage, setUsage] = useState<'residential' | 'commercial'>('residential')
			const [propType, setPropType] = useState<string>('')

			const RESIDENTIAL_TYPES = [
				{ value: 'apartment', label: 'Apartment' },
				{ value: 'penthouse', label: 'Penthouse' },
				{ value: 'studio', label: 'Studio' },
				{ value: 'kitnet', label: 'Kitnet' },
				{ value: 'house', label: 'House' },
				{ value: 'loft', label: 'Loft' },
				{ value: 'land_lot', label: 'Land / Lot' },
				{ value: 'farm_ranch', label: 'Farm / Ranch' },
			] as const

			const COMMERCIAL_TYPES = [
				{ value: 'office', label: 'Office' },
				{ value: 'retail', label: 'Retail' },
				{ value: 'casa_comercial', label: 'Casa Comercial' },
				{ value: 'hotel', label: 'Hotel' },
				{ value: 'motel', label: 'Motel' },
				{ value: 'entire_floor', label: 'Entire Floor / Corporate' },
				{ value: 'entire_building', label: 'Entire Building' },
				{ value: 'garage', label: 'Garage' },
				{ value: 'land_commercial', label: 'Land / Commercial Lots' },
				{ value: 'storage_facility', label: 'Storage Facility' },
				{ value: 'factory', label: 'Factory' },
				{ value: 'warehouse', label: 'Warehouse' },
				{ value: 'shopping_mall', label: 'Shopping Mall' },
			] as const
	const [thumbFile, setThumbFile] = useState<File | null>(null)
	const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null)
		const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
		const [showForm, setShowForm] = useState(false)

	// Data state
	const [items, setItems] = useState<Listing[]>([])
	const [loading, setLoading] = useState(false)

	// Edit state
	const [editingId, setEditingId] = useState<string | null>(null)
	const [eTitle, setETitle] = useState('')
	const [eDescription, setEDescription] = useState('')
	const [eCity, setECity] = useState('')
	const [eState, setEState] = useState('')
	const [ePostal, setEPostal] = useState('')
	const [ePrice, setEPrice] = useState<string>('')
	const [eArea, setEArea] = useState<number | ''>('')
	const [eBeds, setEBeds] = useState<number | ''>('')
	const [eBaths, setEBaths] = useState<number | ''>('')
	const [eStatus, setEStatus] = useState<Listing['status']>('draft')

	// Filters
	const [q, setQ] = useState('')
	const [fCity, setFCity] = useState('all')
	const [fState, setFState] = useState('all')
	const [minPrice, setMinPrice] = useState<number | ''>('')
	const [maxPrice, setMaxPrice] = useState<number | ''>('')
	const [fBeds, setFBeds] = useState<number | 'all'>('all')
	const [fBaths, setFBaths] = useState<number | 'all'>('all')
	const [fStatus, setFStatus] = useState<'all' | Listing['status']>('all')

	useEffect(() => {
		const load = async () => {
			if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
			setLoading(true)
			const { data, error } = await supabase
				.from('listings')
				.select('*')
				.eq('listing_type', 'for_sale')
				.order('created_at', { ascending: false })
			if (!error && data) setItems(data as any)
			setLoading(false)
		}
		load()
	}, [])

	const distinctCities = useMemo(() => Array.from(new Set(items.map(i => i.city).filter(Boolean))).sort() as string[], [items])
	const distinctStates = useMemo(() => Array.from(new Set(items.map(i => i.state_code).filter(Boolean))).sort() as string[], [items])

	const filtered = useMemo(() => {
		const term = q.trim().toLowerCase()
		return items.filter(i => {
			const matchesQ = !term
				|| i.title.toLowerCase().includes(term)
				|| (i.description ?? '').toLowerCase().includes(term)
				|| (i.city ?? '').toLowerCase().includes(term)
				|| (i.state_code ?? '').toLowerCase().includes(term)
				|| (i.postal_code ?? '').toLowerCase().includes(term)
			const matchesCity = fCity === 'all' || i.city === fCity
			const matchesState = fState === 'all' || i.state_code === fState
			const matchesMin = minPrice === '' || (i.price ?? 0) >= Number(minPrice)
			const matchesMax = maxPrice === '' || (i.price ?? 0) <= Number(maxPrice)
			const matchesBeds = fBeds === 'all' || (i.bedrooms ?? 0) >= Number(fBeds)
			const matchesBaths = fBaths === 'all' || (i.bathrooms ?? 0) >= Number(fBaths)
			const matchesStatus = fStatus === 'all' || i.status === fStatus
			return matchesQ && matchesCity && matchesState && matchesMin && matchesMax && matchesBeds && matchesBaths && matchesStatus
		})
	}, [items, q, fCity, fState, minPrice, maxPrice, fBeds, fBaths, fStatus])

	const resetForm = () => {
		setTitle('');
		setDescription('');
		setAddress('');
		setAddressNumber('');
		setNeighborhood('');
		setCity('');
		setStateCode('');
		setPostalCode('');
		setUnitNumber('');
		setUsage('residential');
		setPropType('');
		setPrice('');
		setArea('');
		setBedrooms('');
		setBathrooms('');
		setParkingSpaces('');
		setUnitFloor('');
		setLandAreaM2('');
	setCondoFee('');
	setIptuFee('');
		setFeatures({});
		setBbqType('');
		setStoveType('');
		setInternetType('');
		setThumbFile(null);
		setGalleryFiles(null);
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
			// eslint-disable-next-line no-console
			console.error('Upload failed:', e?.message || e)
			setError('Image upload failed. Ensure a Storage bucket named "listings" exists and is public.')
		}
		return uploads
	}

	const createListing = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		setError(null)
		try {
			const featureMap = Object.keys(features).reduce((acc: any, key) => {
				if (features[key]) acc[key] = true
				return acc
			}, {})
					const insert = {
				listing_type: 'for_sale' as const,
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
			land_area_m2: landAreaM2 === '' ? null : Number(landAreaM2),
			condo_fee: parseBRL(condoFee),
			// persist IPTU in features JSON to avoid schema coupling
							features: { 
								...featureMap,
								...(bbqType ? { churrasqueira: bbqType } : {}),
								...(stoveType ? { stove: stoveType } : {}),
								...(internetType ? { internet: internetType } : {}),
								...(parseBRL(iptuFee) != null ? { iptu_fee: parseBRL(iptuFee) } : {}),
							},
				status: 'draft' as const,
				media: [] as any,
			}
			const { data, error } = await supabase.from('listings').insert(insert).select('*').single()
			if (error) throw error
			const created = data as Listing
			const media = await uploadImages(created.id)
			if (media.length) {
				const { error: uErr, data: updated } = await supabase.from('listings').update({ media }).eq('id', created.id).select('*').single()
				if (!uErr && updated) setItems(prev => [updated as any, ...prev])
				else setItems(prev => [created, ...prev])
			} else {
				setItems(prev => [created, ...prev])
			}
			resetForm()
		} catch (e: any) {
			setError(e?.message || 'Failed to create listing')
		} finally {
			setSaving(false)
		}
	}

	const remove = async (id: string) => {
		await supabase.from('listings').delete().eq('id', id)
		setItems(prev => prev.filter(i => i.id !== id))
	}

	function startEdit(l: Listing) {
		setEditingId(l.id)
		setETitle(l.title || '')
		setEDescription(l.description || '')
		setECity(l.city || '')
		setEState(l.state_code || '')
		setEPostal(l.postal_code || '')
		setEPrice(l.price != null ? toBRL(l.price) : '')
		setEArea(l.area_m2 ?? '')
		setEBeds(l.bedrooms ?? '')
		setEBaths(l.bathrooms ?? '')
		setEStatus(l.status)
	}

	async function saveEdit() {
		if (!editingId) return
		 setSaving(true)
		setError(null)
		try {
			const update: any = {
				title: eTitle,
				description: eDescription || null,
				city: eCity || null,
				state_code: eState || null,
				postal_code: ePostal || null,
				price: parseBRL(ePrice),
				area_m2: eArea === '' ? null : Number(eArea),
				bedrooms: eBeds === '' ? null : Number(eBeds),
				bathrooms: eBaths === '' ? null : Number(eBaths),
				status: eStatus,
			}
			const { data, error } = await supabase.from('listings').update(update).eq('id', editingId).select('*').single()
			if (error) throw error
			const updated = data as Listing
			setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
			setEditingId(null)
		} catch (e: any) {
			setError(e?.message || 'Failed to update listing')
		} finally {
			setSaving(false)
		}
	}

			const inputCls = "w-full rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
		const selectCls = "rounded-md border border-slate-300 bg-white text-slate-900 px-2 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"

		return (
			<div className="p-4 text-slate-800">
				<div>
					<h1 className="text-xl font-semibold">Listings · For Sale</h1>
					<p className="mt-1 text-slate-600">Create and manage properties listed for sale.</p>
					{loading && <p className="text-sm text-slate-500 mt-1">Loading…</p>}
					{error && <p className="text-sm text-red-600 mt-1">{error}</p>}
				</div>

				{/* Add New Listing (collapsible) */}
				<div className="mt-6 rounded-xl border border-slate-200 bg-white">
					<button type="button" onClick={()=>setShowForm(s=>!s)} className="w-full flex items-center justify-between px-4 py-3">
						<span className="font-medium">Add a new listing</span>
						<svg className={"h-5 w-5 text-slate-500 transition-transform " + (showForm ? "rotate-180" : "rotate-0")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
						</svg>
					</button>
					{showForm && (
						<div className="border-t border-slate-200 p-4">
							<form onSubmit={createListing} className="grid gap-3">
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Title</span>
									<input className={inputCls} value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g., 3BR Apartment in Copacabana" />
								</label>
												<label className="grid gap-1 text-sm">
													<span className="font-medium">Brief description</span>
													<textarea className={inputCls} rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short summary of the property" />
												</label>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													<label className="grid gap-1 text-sm">
														<span className="font-medium">Usage</span>
														<select className={selectCls} value={usage} onChange={e=>{ setUsage(e.target.value as any); setPropType('') }}>
															<option value="residential">Residential</option>
															<option value="commercial">Commercial</option>
														</select>
													</label>
													<label className="grid gap-1 text-sm">
														<span className="font-medium">Property type</span>
														<select className={selectCls} value={propType} onChange={e=>setPropType(e.target.value)}>
															<option value="">Select type</option>
															{(usage === 'residential' ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES).map(t => (
																<option key={t.value} value={t.value}>{t.label}</option>
															))}
														</select>
													</label>
												</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">CEP</span>
										<input
											className={inputCls}
											value={postalCode}
											maxLength={9}
											onChange={async e=>{
												const raw = e.target.value || ''
												const digits = raw.replace(/\D/g,'').slice(0,8)
												const formatted = digits.length > 5 ? `${digits.slice(0,5)}-${digits.slice(5)}` : digits
												setPostalCode(formatted)
												if (digits.length === 8) {
													try {
														const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
														if (res.ok) {
															const data = await res.json()
															if (!data.erro) {
																if (data.logradouro) setAddress(data.logradouro)
																if (data.bairro) setNeighborhood(data.bairro)
																if (data.localidade) setCity(data.localidade)
																if (data.uf) setStateCode(data.uf)
															}
														}
													} catch { /* ignore */ }
												}
											}}
											placeholder="00000-000"
										/>
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Street name</span>
										<input className={inputCls} value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Street number</span>
										<input className={inputCls} value={addressNumber} onChange={e=>setAddressNumber(e.target.value)} placeholder="Number" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Apt / Unit / Suite (optional)</span>
										<input className={inputCls} value={unitNumber} onChange={e=>setUnitNumber(e.target.value)} placeholder="e.g., Apt 501" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Neighborhood (Bairro)</span>
										<input className={inputCls} value={neighborhood} onChange={e=>setNeighborhood(e.target.value)} placeholder="Bairro" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">City</span>
										<input className={inputCls} value={city} onChange={e=>setCity(e.target.value)} placeholder="City" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">State</span>
										<select className={selectCls} value={stateCode} onChange={e=>setStateCode(e.target.value)}>
											<option value="">Select state</option>
											{BR_STATES_FULL.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
										</select>
									</label>

								</div>
								{/* Currency row: Price, Condominium fee, IPTU */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Price</span>
										<input
											type="text"
											inputMode="numeric"
											className={inputCls}
											value={price}
											onChange={e=>setPrice(formatBRLInput(e.target.value))}
											placeholder={toBRL(0)}
										/>
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Condominium fee</span>
										<input
											type="text"
											inputMode="numeric"
											className={inputCls}
											value={condoFee}
											onChange={e=>setCondoFee(formatBRLInput(e.target.value))}
											placeholder={toBRL(0)}
										/>
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">IPTU</span>
										<input
											type="text"
											inputMode="numeric"
											className={inputCls}
											value={iptuFee}
											onChange={e=>setIptuFee(formatBRLInput(e.target.value))}
											placeholder={toBRL(0)}
										/>
									</label>
								</div>

								{/* Area, Beds, Baths, Parking */}
								<div className="grid grid-cols-2 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Area (m²)</span>
										<input type="number" min={0} step="0.1" className={inputCls} value={area} onChange={e=>setArea(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Bedrooms</span>
										<input type="number" min={0} step="1" className={inputCls} value={bedrooms} onChange={e=>setBedrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Bathrooms</span>
										<input type="number" min={0} step="0.5" className={inputCls} value={bathrooms} onChange={e=>setBathrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Parking spaces</span>
										<input type="number" min={0} step="1" className={inputCls} value={parkingSpaces} onChange={e=>setParkingSpaces(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
									</label>
								</div>

												{/* Optional fields */}
														<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
																	<label className="grid gap-1 text-sm">
																		<span className="font-medium">Unit floor (optional)</span>
																		<input type="number" min={0} step="1" className={inputCls} value={unitFloor} onChange={e=>setUnitFloor(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 5" />
																	</label>
																	<label className="grid gap-1 text-sm">
																		<span className="font-medium">Land area (m²) (optional)</span>
																		<input type="number" min={0} step="0.1" className={inputCls} value={landAreaM2} onChange={e=>setLandAreaM2(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 300" />
																	</label>
															{/* Condo fee moved to currency row above */}
																</div>

												{/* Feature categories */}
												<fieldset className="mt-1 grid gap-4">
													<div>
														<legend className="text-sm font-medium mb-1">Property characteristics</legend>
														<div className="grid grid-cols-2 gap-2">
							    {FEATURES.property.map(key => (
																<label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
																	<input type="checkbox" checked={!!features[key]} onChange={e=>setFeatures(prev=>({ ...prev, [key]: e.target.checked }))} />
								    <span className="capitalize">{featureLabel(key)}</span>
																</label>
															))}
														</div>
														{/* Churrasqueira + Stove + Internet */}
														<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
															<span className="text-slate-700">Churrasqueira</span>
															<select className={selectCls} value={bbqType} onChange={e=>setBbqType(e.target.value as any)}>
																<option value="">—</option>
																<option value="gas">Gas</option>
																<option value="charcoal">Charcoal</option>
															</select>
															<span className="ml-4 text-slate-700">Stove</span>
															<select className={selectCls} value={stoveType} onChange={e=>setStoveType(e.target.value as any)}>
																<option value="">—</option>
																<option value="gas">Gas</option>
																<option value="electric">Electric</option>
																<option value="induction">Induction</option>
															</select>
															<span className="ml-4 text-slate-700">Internet</span>
															<select className={selectCls} value={internetType} onChange={e=>setInternetType(e.target.value as any)}>
																<option value="">—</option>
																<option value="fiber">Fiber</option>
																<option value="dsl">DSL</option>
																<option value="broadband">Broadband</option>
																<option value="mobile">Mobile</option>
																<option value="starlink">Starlink</option>
															</select>
														</div>
													</div>
													<div>
														<legend className="text-sm font-medium mb-1">Leisure</legend>
														<div className="grid grid-cols-2 gap-2">
							    {FEATURES.leisure.map(key => (
																<label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
																	<input type="checkbox" checked={!!features[key]} onChange={e=>setFeatures(prev=>({ ...prev, [key]: e.target.checked }))} />
								    <span className="capitalize">{featureLabel(key)}</span>
																</label>
															))}
														</div>
													</div>
													<div>
														<legend className="text-sm font-medium mb-1">Convenience</legend>
														<div className="grid grid-cols-2 gap-2">
							    {FEATURES.convenience.map(key => (
																<label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
																	<input type="checkbox" checked={!!features[key]} onChange={e=>setFeatures(prev=>({ ...prev, [key]: e.target.checked }))} />
								    <span className="capitalize">{featureLabel(key)}</span>
																</label>
															))}
														</div>
													</div>
													<div>
														<legend className="text-sm font-medium mb-1">Security</legend>
														<div className="grid grid-cols-2 gap-2">
							    {FEATURES.security.map(key => (
																<label key={key} className="inline-flex items-center gap-2 text-sm text-slate-700">
																	<input type="checkbox" checked={!!features[key]} onChange={e=>setFeatures(prev=>({ ...prev, [key]: e.target.checked }))} />
								    <span className="capitalize">{featureLabel(key)}</span>
																</label>
															))}
														</div>
													</div>
												</fieldset>

								<div className="grid gap-2">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Thumbnail</span>
										<input type="file" accept="image/*" onChange={e=>setThumbFile(e.target.files?.[0] ?? null)} className="text-slate-700" />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Gallery</span>
										<input type="file" accept="image/*" multiple onChange={e=>setGalleryFiles(e.target.files)} className="text-slate-700" />
									</label>
								</div>

								<button disabled={saving || !title} className="mt-4 mx-auto w-fit text-sm inline-flex items-center rounded-md px-3 py-1.5 text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-60">
									{saving ? 'Saving…' : 'Add Listing'}
								</button>
							</form>
						</div>
					)}
				</div>

				{/* Inventory and Filters layout */}
				<div className="mt-6 grid grid-cols-1 md:grid-cols-[260px,1fr] gap-4 items-start">
					{/* Left sidebar filters */}
					<aside className="rounded-xl border border-slate-200 p-4 bg-white sticky top-4 h-fit">
						<h2 className="text-sm font-semibold mb-2">Filters</h2>
						<div className="grid gap-2 text-sm">
							<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title, city, CEP…" className={inputCls+" text-sm"} />
							<label className="grid gap-1">
								<span className="text-slate-600">City</span>
								<select value={fCity} onChange={e=>setFCity(e.target.value)} className={selectCls}>
									<option value="all">All</option>
									{distinctCities.map(c => <option key={c} value={c}>{c}</option>)}
								</select>
							</label>
							<label className="grid gap-1">
								<span className="text-slate-600">State</span>
								<select value={fState} onChange={e=>setFState(e.target.value)} className={selectCls}>
									<option value="all">All</option>
									{distinctStates.map(s => <option key={s} value={s}>{s}</option>)}
								</select>
							</label>
							<div className="grid grid-cols-2 gap-2">
								<input value={minPrice} onChange={e=>setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" min={0} placeholder="Min" className={inputCls+" text-sm"} />
								<input value={maxPrice} onChange={e=>setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" min={0} placeholder="Max" className={inputCls+" text-sm"} />
							</div>
							<label className="grid gap-1">
								<span className="text-slate-600">Beds</span>
								<select value={fBeds} onChange={e=>setFBeds(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
									<option value="all">Any</option>
									{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
								</select>
							</label>
							<label className="grid gap-1">
								<span className="text-slate-600">Baths</span>
								<select value={fBaths} onChange={e=>setFBaths(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
									<option value="all">Any</option>
									{[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
								</select>
							</label>
							<label className="grid gap-1">
								<span className="text-slate-600">Status</span>
								<select value={fStatus} onChange={e=>setFStatus(e.target.value as any)} className={selectCls}>
									<option value="all">Any</option>
									{['draft','active','pending','sold','archived'].map(s => <option key={s} value={s}>{s}</option>)}
								</select>
							</label>
						</div>
					</aside>

					{/* Right inventory grid */}
					<section>
						<h2 className="text-base font-semibold">Current inventory</h2>
						<div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map(l => {
						const thumb = l.media?.find(m => m.kind === 'thumbnail')?.url || l.media?.[0]?.url
						return (
							<div key={l.id} className="rounded-xl border border-slate-200 p-3 bg-white text-slate-800">
								{thumb ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
								) : (
									<div className="w-full h-40 bg-slate-100 rounded-md grid place-items-center text-slate-400 text-sm">No image</div>
								)}
								<div className="mt-2 flex items-start justify-between gap-3">
									<div>
										<h3 className="font-semibold line-clamp-1">{l.title}</h3>
										<p className="text-sm text-slate-600">{[l.city, l.state_code].filter(Boolean).join(', ')}</p>
										<p className="text-sm text-slate-700 mt-1">{l.price ? `R$ ${Number(l.price).toLocaleString()}` : '—'}</p>
									</div>
									<div className="flex items-center gap-3">
										<button onClick={()=>startEdit(l)} className="text-sm text-slate-700 hover:underline">Edit</button>
										<button onClick={()=>remove(l.id)} className="text-sm text-red-600 hover:underline">Delete</button>
									</div>
								</div>
							</div>
						)
					})}
						{!loading && filtered.length === 0 && (
							<div className="text-slate-500">No listings match your filters.</div>
						)}
						</div>
					</section>
				</div>

				{editingId && (
					<div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
						<div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-xl">
							<h3 className="text-lg font-semibold">Edit listing</h3>
							<div className="mt-3 grid gap-3">
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Title</span>
									<input className={inputCls} value={eTitle} onChange={e=>setETitle(e.target.value)} />
								</label>
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Description</span>
									<textarea className={inputCls} rows={3} value={eDescription} onChange={e=>setEDescription(e.target.value)} />
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">City</span>
										<input className={inputCls} value={eCity} onChange={e=>setECity(e.target.value)} />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">State</span>
										<input className={inputCls} value={eState} onChange={e=>setEState(e.target.value)} />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">CEP</span>
										<input className={inputCls} value={ePostal} onChange={e=>setEPostal(e.target.value)} />
									</label>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Price</span>
										<input className={inputCls} value={ePrice} onChange={e=>setEPrice(formatBRLInput(e.target.value))} />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Area (m²)</span>
										<input type="number" className={inputCls} value={eArea} onChange={e=>setEArea(e.target.value === '' ? '' : Number(e.target.value))} />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Status</span>
										<select className={selectCls} value={eStatus} onChange={e=>setEStatus(e.target.value as any)}>
											{['draft','active','pending','sold','rented','archived'].map(s => <option key={s} value={s}>{s}</option>)}
										</select>
									</label>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Beds</span>
										<input type="number" className={inputCls} value={eBeds} onChange={e=>setEBeds(e.target.value === '' ? '' : Number(e.target.value))} />
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Baths</span>
										<input type="number" className={inputCls} value={eBaths} onChange={e=>setEBaths(e.target.value === '' ? '' : Number(e.target.value))} />
									</label>
								</div>
								<div className="mt-2 flex items-center gap-3">
									<button onClick={saveEdit} className="inline-flex items-center rounded-md px-3 py-1.5 text-white bg-sky-600 hover:bg-sky-700 text-sm" type="button">Save</button>
									<button onClick={()=>setEditingId(null)} className="inline-flex items-center rounded-md px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm" type="button">Cancel</button>
								</div>
								{error && <p className="text-sm text-red-600 mt-1">{error}</p>}
							</div>
						</div>
					</div>
				)}
			</div>
		)
}
