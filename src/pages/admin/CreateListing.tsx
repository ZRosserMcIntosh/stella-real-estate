import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

type ListingType = 'new_project' | 'for_sale' | 'for_rent'

type Floorplan = {
	id: string
	name: string
	units?: number | null
	pricePerUnit?: number | null
	beds?: number | null
	baths?: number | null
	areaM2?: number | null
	floorplanUrl?: string | null
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

const featureLabel = (key: string) => {
	if (key === 'security_24h') return '24 Hour Security Guard'
	return key.replace(/_/g, ' ')
}

export default function CreateListing() {
	const { isDemo } = useAuth()
	
	// Listing type selection
	const [listingType, setListingType] = useState<ListingType>('new_project')
	
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

	// Form state - Common fields
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
		setLandAreaM2('')
		setCondoFee('')
		setIptuFee('')
		setFeatures({})
		setBbqType('')
		setStoveType('')
		setInternetType('')
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
			setError('Image upload failed. Ensure a Storage bucket named "listings" exists and is public.')
		}
		return uploads
	}

	const uploadFloorplanImages = async (listingId: string): Promise<Array<{ id: string; url: string }>> => {
		const results: Array<{ id: string; url: string }> = []
		const bucket = supabase.storage.from('listings')
		for (const fp of floorplans) {
			if (fp.floorplanFile) {
				const ext = fp.floorplanFile.name.split('.').pop() || 'jpg'
				const path = `${listingId}/floorplans/${fp.id}-${Date.now()}.${ext}`
				const { error: upErr } = await bucket.upload(path, fp.floorplanFile, { cacheControl: '3600', upsert: true })
				if (!upErr) {
					const { data: pub } = bucket.getPublicUrl(path)
					if (pub?.publicUrl) results.push({ id: fp.id, url: pub.publicUrl })
				}
			}
		}
		return results
	}

	const createListing = async (e: React.FormEvent) => {
		e.preventDefault()
		if (isDemo) {
			setError('Demo mode: creating listings is disabled.')
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

			// Build features object based on listing type
			const featuresObj: Record<string, any> = {
				...featureMap,
				...(bbqType ? { churrasqueira: bbqType } : {}),
				...(stoveType ? { stove: stoveType } : {}),
				...(internetType ? { internet: internetType } : {}),
				...(parseBRL(iptuFee) != null ? { iptu_fee: parseBRL(iptuFee) } : {}),
				show_exact_address: showExactAddress,
			}

			// Add new project specific features
			if (listingType === 'new_project') {
				const parsedUnits = unitsAvailable ? parseInt(unitsAvailable, 10) : null
				const parsedUnitPrice = parseBRL(unitPrice)
				if (parsedUnits != null) {
					featuresObj.units_available = parsedUnits
					featuresObj.unitsAvailable = parsedUnits
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
				// Add floorplans
				if (floorplans.length > 0) {
					featuresObj.floorplans = floorplans.map(fp => ({
						id: fp.id,
						name: fp.name,
						units: fp.units,
						pricePerUnit: fp.pricePerUnit,
						beds: fp.beds,
						baths: fp.baths,
						areaM2: fp.areaM2,
						floorplanUrl: fp.floorplanUrl,
					}))
				}
			}

			// Add rental specific features
			if (listingType === 'for_rent' && minLeaseTerm) {
				featuresObj.min_lease_term = minLeaseTerm
			}

			const insert: any = {
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
				land_area_m2: landAreaM2 === '' ? null : Number(landAreaM2),
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

			// Upload floorplan images for new projects
			if (listingType === 'new_project' && floorplans.length > 0) {
				const floorplanUrls = await uploadFloorplanImages(created.id)
				if (floorplanUrls.length > 0) {
					// Update floorplans with URLs
					const updatedFloorplans = (featuresObj.floorplans || []).map((fp: any) => {
						const match = floorplanUrls.find(u => u.id === fp.id)
						return match ? { ...fp, floorplanUrl: match.url } : fp
					})
					featuresObj.floorplans = updatedFloorplans
				}
			}

			// Update with media if any
			if (media.length || (listingType === 'new_project' && floorplans.length > 0)) {
				const updateData: any = {}
				if (media.length) updateData.media = media
				if (listingType === 'new_project') updateData.features = featuresObj
				
				await supabase.from('listings').update(updateData).eq('id', created.id)
			}

			setSuccess(`Listing "${title}" created successfully!`)
			resetForm()
		} catch (e: any) {
			setError(e?.message || 'Failed to create listing')
		} finally {
			setSaving(false)
		}
	}

	const inputCls = "w-full rounded-md border border-slate-700/60 bg-slate-800/50 text-slate-100 placeholder-slate-500 px-3 py-2 shadow-sm focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none"
	const selectCls = "rounded-md border border-slate-700/60 bg-slate-800/50 text-slate-100 px-2 py-2 text-sm focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none"

	const listingTypeOptions: Array<{ value: ListingType; label: string; description: string; icon: string }> = [
		{ 
			value: 'new_project', 
			label: 'New Project', 
			description: 'Development with multiple units',
			icon: '🏗️'
		},
		{ 
			value: 'for_sale', 
			label: 'For Sale', 
			description: 'Single property for sale',
			icon: '🏠'
		},
		{ 
			value: 'for_rent', 
			label: 'For Rent', 
			description: 'Property available for rent',
			icon: '🔑'
		},
	]

	return (
		<div className="p-4 text-slate-200">
			<div>
				<h1 className="text-xl font-semibold">Create New Listing</h1>
				<p className="mt-1 text-slate-400">Add a new property listing to your inventory.</p>
				{isDemo && (
					<p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-400/80 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
						Demo mode · changes disabled
					</p>
				)}
			</div>

			{/* Listing Type Selector */}
			<div className="mt-6 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6">
				<h2 className="text-lg font-semibold mb-4">Select Listing Type</h2>
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
							<div className="text-2xl mb-2">{option.icon}</div>
							<div className="font-semibold text-slate-100">{option.label}</div>
							<div className="text-sm text-slate-400 mt-1">{option.description}</div>
						</button>
					))}
				</div>
			</div>

			{/* Create Listing Form */}
			<div className="mt-6 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6">
				<h2 className="text-lg font-semibold mb-4">
					{listingType === 'new_project' && 'New Project Details'}
					{listingType === 'for_sale' && 'Property for Sale Details'}
					{listingType === 'for_rent' && 'Property for Rent Details'}
				</h2>

				{error && (
					<div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
						{error}
					</div>
				)}

				{success && (
					<div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
						{success}
					</div>
				)}

				<form onSubmit={createListing} className="grid gap-6">
					{/* Basic Information */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Basic Information</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Title *</span>
								<input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Luxury Apartment in Ipanema" />
							</label>
							
							{listingType !== 'new_project' && (
								<>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Usage Type</span>
										<select className={selectCls + " w-full"} value={usage} onChange={e => setUsage(e.target.value as any)}>
											<option value="residential">Residential</option>
											<option value="commercial">Commercial</option>
										</select>
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Property Type</span>
										<select className={selectCls + " w-full"} value={propType} onChange={e => setPropType(e.target.value)}>
											<option value="">Select type</option>
											{(usage === 'residential' ? RESIDENTIAL_TYPES : COMMERCIAL_TYPES).map(t => (
												<option key={t.value} value={t.value}>{t.label}</option>
											))}
										</select>
									</label>
								</>
							)}
						</div>
						
						<label className="grid gap-1 text-sm">
							<span className="font-medium">Description</span>
							<textarea className={inputCls + " min-h-[100px]"} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the property..." />
						</label>
					</div>

					{/* Location */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Location</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Street Address</span>
								<input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g., Rua Visconde de Pirajá" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Number</span>
								<input className={inputCls} value={addressNumber} onChange={e => setAddressNumber(e.target.value)} placeholder="e.g., 500" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Unit Number</span>
								<input className={inputCls} value={unitNumber} onChange={e => setUnitNumber(e.target.value)} placeholder="e.g., Apt 1201" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Neighborhood</span>
								<input className={inputCls} value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="e.g., Ipanema" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">City</span>
								<input className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g., Rio de Janeiro" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">State</span>
								<select className={selectCls + " w-full"} value={stateCode} onChange={e => setStateCode(e.target.value)}>
									<option value="">Select state</option>
									{BR_STATES_FULL.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
								</select>
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Postal Code</span>
								<input className={inputCls} value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="e.g., 22410-003" />
							</label>
						</div>

						{/* Map Address Display Toggle */}
						<div className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-4">
							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={showExactAddress}
									onChange={(e) => setShowExactAddress(e.target.checked)}
									className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
								/>
								<div>
									<span className="font-medium text-sm text-slate-200">Show exact address on map</span>
									<p className="text-xs text-slate-400 mt-0.5">
										When unchecked, the map will only show the neighborhood for privacy. When checked, it will show the full street address.
									</p>
								</div>
							</label>
						</div>
					</div>

					{/* Pricing & Size */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Pricing & Size</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{listingType === 'new_project' ? (
								<>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Units Available</span>
										<input
											type="number"
											min={0}
											className={inputCls}
											value={unitsAvailable}
											onChange={(e) => setUnitsAvailable(e.target.value)}
											placeholder="e.g., 23"
										/>
										{floorplans.length > 0 && (
											<span className="text-xs text-slate-500">Floorplans currently sum to {floorplanUnitsTotal} units.</span>
										)}
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Base Price per Unit</span>
										<input
											type="text"
											inputMode="numeric"
											className={inputCls}
											value={unitPrice}
											onChange={(e) => setUnitPrice(formatBRLInput(e.target.value))}
											placeholder="R$ 0,00"
										/>
									</label>
									<label className="grid gap-1 text-sm">
										<span className="font-medium">Total Inventory Value</span>
										<input
											type="text"
											className={inputCls + " bg-slate-900/50"}
											value={(() => {
												const units = parseInt(unitsAvailable || '0', 10)
												const priceVal = parseBRL(unitPrice)
												if (units && priceVal) return toBRL(units * priceVal)
												return ''
											})()}
											readOnly
											placeholder="Calculated automatically"
										/>
									</label>
								</>
							) : (
								<label className="grid gap-1 text-sm">
									<span className="font-medium">{listingType === 'for_rent' ? 'Monthly Rent' : 'Sale Price'}</span>
									<input
										type="text"
										inputMode="numeric"
										className={inputCls}
										value={price}
										onChange={(e) => setPrice(formatBRLInput(e.target.value))}
										placeholder="R$ 0,00"
									/>
								</label>
							)}
							
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Area (m²)</span>
								<input type="number" min={0} className={inputCls} value={area} onChange={e => setArea(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 120" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Land Area (m²)</span>
								<input type="number" min={0} className={inputCls} value={landAreaM2} onChange={e => setLandAreaM2(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 500" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Bedrooms</span>
								<input type="number" min={0} className={inputCls} value={bedrooms} onChange={e => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 3" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Bathrooms</span>
								<input type="number" min={0} step={0.5} className={inputCls} value={bathrooms} onChange={e => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 2" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Parking Spaces</span>
								<input type="number" min={0} className={inputCls} value={parkingSpaces} onChange={e => setParkingSpaces(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 2" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Unit Floor</span>
								<input type="number" min={0} className={inputCls} value={unitFloor} onChange={e => setUnitFloor(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 12" />
							</label>
						</div>
					</div>

					{/* Fees */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Monthly Fees</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Condo Fee (monthly)</span>
								<input
									type="text"
									inputMode="numeric"
									className={inputCls}
									value={condoFee}
									onChange={(e) => setCondoFee(formatBRLInput(e.target.value))}
									placeholder="R$ 0,00"
								/>
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">IPTU (annual)</span>
								<input
									type="text"
									inputMode="numeric"
									className={inputCls}
									value={iptuFee}
									onChange={(e) => setIptuFee(formatBRLInput(e.target.value))}
									placeholder="R$ 0,00"
								/>
							</label>
							{listingType === 'for_rent' && (
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Minimum Lease Term (months)</span>
									<input
										type="number"
										min={1}
										className={inputCls}
										value={minLeaseTerm}
										onChange={(e) => setMinLeaseTerm(e.target.value === '' ? '' : Number(e.target.value))}
										placeholder="e.g., 12"
									/>
								</label>
							)}
						</div>
					</div>

					{/* New Project Specific: Expected Delivery */}
					{listingType === 'new_project' && (
						<div className="grid gap-4">
							<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Expected Delivery</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Month</span>
									<select className={selectCls + " w-full"} value={expectedDeliveryMonth} onChange={e => setExpectedDeliveryMonth(e.target.value)}>
										<option value="">Select month</option>
										{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
											<option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
										))}
									</select>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Year</span>
									<input
										type="number"
										min={new Date().getFullYear()}
										max={2050}
										className={inputCls}
										value={expectedDeliveryYear}
										onChange={e => setExpectedDeliveryYear(e.target.value)}
										placeholder={String(new Date().getFullYear() + 2)}
									/>
								</label>
							</div>
						</div>
					)}

					{/* New Project Specific: Floorplans */}
					{listingType === 'new_project' && (
						<div className="grid gap-4">
							<div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
								<h3 className="font-medium text-slate-300">Floorplans</h3>
								<button
									type="button"
									onClick={addFloorplan}
									className="text-sm px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
								>
									+ Add Floorplan
								</button>
							</div>
							
							{floorplans.length === 0 ? (
								<p className="text-sm text-slate-500">No floorplans added yet. Click "Add Floorplan" to add one.</p>
							) : (
								<div className="grid gap-4">
									{floorplans.map((fp, idx) => (
										<div key={fp.id} className="p-4 rounded-lg border border-slate-700/60 bg-slate-800/30">
											<div className="flex items-center justify-between mb-3">
												<span className="font-medium text-sm text-slate-300">Floorplan {idx + 1}</span>
												<button
													type="button"
													onClick={() => removeFloorplan(fp.id)}
													className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
												>
													Remove
												</button>
											</div>
											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Name</span>
													<input
														className={inputCls}
														value={fp.name}
														onChange={e => updateFloorplan(fp.id, 'name', e.target.value)}
														placeholder="e.g., Type A"
													/>
												</label>
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Units</span>
													<input
														type="number"
														min={0}
														className={inputCls}
														value={fp.units ?? ''}
														onChange={e => updateFloorplan(fp.id, 'units', e.target.value === '' ? null : Number(e.target.value))}
														placeholder="e.g., 10"
													/>
												</label>
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Beds</span>
													<input
														type="number"
														min={0}
														className={inputCls}
														value={fp.beds ?? ''}
														onChange={e => updateFloorplan(fp.id, 'beds', e.target.value === '' ? null : Number(e.target.value))}
														placeholder="e.g., 2"
													/>
												</label>
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Baths</span>
													<input
														type="number"
														min={0}
														step={0.5}
														className={inputCls}
														value={fp.baths ?? ''}
														onChange={e => updateFloorplan(fp.id, 'baths', e.target.value === '' ? null : Number(e.target.value))}
														placeholder="e.g., 2"
													/>
												</label>
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Area (m²)</span>
													<input
														type="number"
														min={0}
														className={inputCls}
														value={fp.areaM2 ?? ''}
														onChange={e => updateFloorplan(fp.id, 'areaM2', e.target.value === '' ? null : Number(e.target.value))}
														placeholder="e.g., 85"
													/>
												</label>
												<label className="grid gap-1 text-sm">
													<span className="text-slate-400">Image</span>
													<input
														type="file"
														accept="image/*"
														className="text-xs text-slate-400"
														onChange={e => updateFloorplan(fp.id, 'floorplanFile', e.target.files?.[0] || null)}
													/>
												</label>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* Features */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Features & Amenities</h3>
						
						{Object.entries(FEATURES).map(([category, featureList]) => (
							<div key={category}>
								<h4 className="text-sm font-medium text-slate-400 capitalize mb-2">{category}</h4>
								<div className="flex flex-wrap gap-2">
									{featureList.map(f => (
										<label key={f} className="inline-flex items-center gap-2 text-sm cursor-pointer px-3 py-1.5 rounded-full border border-slate-700/60 bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
											<input
												type="checkbox"
												checked={!!features[f]}
												onChange={e => setFeatures(prev => ({ ...prev, [f]: e.target.checked }))}
												className="rounded border-slate-600 text-indigo-500 focus:ring-indigo-500/40"
											/>
											<span className="capitalize">{featureLabel(f)}</span>
										</label>
									))}
								</div>
							</div>
						))}

						{/* Special feature options */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">BBQ Type</span>
								<select className={selectCls + " w-full"} value={bbqType} onChange={e => setBbqType(e.target.value as any)}>
									<option value="">None</option>
									<option value="gas">Gas</option>
									<option value="charcoal">Charcoal</option>
								</select>
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Stove Type</span>
								<select className={selectCls + " w-full"} value={stoveType} onChange={e => setStoveType(e.target.value as any)}>
									<option value="">Not specified</option>
									<option value="gas">Gas</option>
									<option value="electric">Electric</option>
									<option value="induction">Induction</option>
								</select>
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Internet Type</span>
								<select className={selectCls + " w-full"} value={internetType} onChange={e => setInternetType(e.target.value as any)}>
									<option value="">Not specified</option>
									<option value="fiber">Fiber</option>
									<option value="dsl">DSL</option>
									<option value="broadband">Broadband</option>
									<option value="mobile">Mobile</option>
									<option value="starlink">Starlink</option>
								</select>
							</label>
						</div>
					</div>

					{/* Media */}
					<div className="grid gap-4">
						<h3 className="font-medium text-slate-300 border-b border-slate-700/60 pb-2">Images</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Thumbnail Image</span>
								<input
									type="file"
									accept="image/*"
									className="text-slate-400"
									onChange={e => setThumbFile(e.target.files?.[0] || null)}
								/>
								{thumbFile && <span className="text-xs text-slate-500">Selected: {thumbFile.name}</span>}
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Gallery Images</span>
								<input
									type="file"
									accept="image/*"
									multiple
									className="text-slate-400"
									onChange={e => setGalleryFiles(e.target.files)}
								/>
								{galleryFiles && galleryFiles.length > 0 && (
									<span className="text-xs text-slate-500">{galleryFiles.length} file(s) selected</span>
								)}
							</label>
						</div>
					</div>

					{/* Submit */}
					<div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/60">
						<button
							type="button"
							onClick={resetForm}
							className="px-4 py-2 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors"
						>
							Reset Form
						</button>
						<button
							type="submit"
							disabled={saving || !title}
							className="px-6 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium transition-colors"
						>
							{saving ? 'Creating...' : 'Create Listing'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
