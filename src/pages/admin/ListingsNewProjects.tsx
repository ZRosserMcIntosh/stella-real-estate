import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

type Listing = {
	id: string
	listing_type: 'for_sale' | 'for_rent' | 'new_project'
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

type Floorplan = {
	id: string
	name: string
	units?: number | null
	pricePerUnit?: number | null
	areaM2?: number | null
	description?: string | null
	floorplanUrl?: string | null
	floorplanFile?: File | null
}

type FloorplanManagerProps = {
	title: string
	floorplans: Floorplan[]
	onChange: (next: Floorplan[]) => void
	formatBRLInput: (raw: string) => string
	parseBRL: (value: string) => number | null
	toBRL: (value: number) => string
}

type FloorplanDraft = {
	id: string
	name: string
	units: string
	pricePerUnit: string
	areaM2: string
	description: string
	floorplanFile: File | null
	floorplanUrl: string | null
}

function FloorplansManager({ title, floorplans, onChange, formatBRLInput, parseBRL, toBRL }: FloorplanManagerProps) {
	const [modalOpen, setModalOpen] = useState(false)
	const [draft, setDraft] = useState<FloorplanDraft>({
		id: randomId(),
		name: '',
		units: '',
		pricePerUnit: '',
		areaM2: '',
		description: '',
		floorplanFile: null,
		floorplanUrl: null,
	})
	const [editIndex, setEditIndex] = useState<number | null>(null)

	const resetDraft = () => {
		setDraft({
			id: randomId(),
			name: '',
			units: '',
			pricePerUnit: '',
			areaM2: '',
			description: '',
			floorplanFile: null,
			floorplanUrl: null,
		})
		setEditIndex(null)
	}

	const openForCreate = () => {
		resetDraft()
		setModalOpen(true)
	}

	const openForEdit = (index: number) => {
		const plan = floorplans[index]
		if (!plan) return
		setDraft({
			id: plan.id,
			name: plan.name ?? '',
			units: plan.units != null ? String(plan.units) : '',
			pricePerUnit: plan.pricePerUnit != null ? toBRL(plan.pricePerUnit) : '',
			areaM2: plan.areaM2 != null ? String(plan.areaM2) : '',
			description: plan.description ?? '',
			floorplanFile: null,
			floorplanUrl: plan.floorplanUrl ?? null,
		})
		setEditIndex(index)
		setModalOpen(true)
	}

	const duplicatePlan = (index: number) => {
		const plan = floorplans[index]
		if (!plan) return
		const copy: Floorplan = {
			...plan,
			id: randomId(),
			name: `${plan.name} (copy)`
		}
		onChange([...floorplans, copy])
	}

	const removePlan = (index: number) => {
		onChange(floorplans.filter((_, i) => i !== index))
	}

	const handleSave = () => {
		const name = draft.name.trim() || `Floorplan ${floorplans.length + 1}`
		const parseNumber = (value: string): number | null => {
			if (!value) return null
			const normalized = Number(value.replace(',', '.'))
			return Number.isFinite(normalized) ? normalized : null
		}
		const normalized: Floorplan = {
			id: draft.id || randomId(),
			name,
			units: parseNumber(draft.units),
			pricePerUnit: parseBRL(draft.pricePerUnit),
			areaM2: parseNumber(draft.areaM2),
			description: draft.description.trim() || null,
			floorplanUrl: draft.floorplanUrl,
			floorplanFile: draft.floorplanFile,
		}
		if (editIndex != null) {
			onChange(floorplans.map((fp, idx) => (idx === editIndex ? normalized : fp)))
		} else {
			onChange([...floorplans, normalized])
		}
		resetDraft()
		setModalOpen(false)
	}

	const totalUnits = useMemo(() => floorplans.reduce((acc, fp) => acc + (fp.units ?? 0), 0), [floorplans])
	const totalValue = useMemo(
		() =>
			floorplans.reduce((acc, fp) => {
				if (fp.units != null && fp.pricePerUnit != null) return acc + fp.units * fp.pricePerUnit
				return acc
			}, 0),
		[floorplans],
	)

	return (
		<div className="rounded-xl border border-slate-700/60 bg-slate-50/80 p-4">
			<div className="flex items-center justify-between gap-2">
				<div>
					<h3 className="text-sm font-semibold text-slate-100">{title}</h3>
					<p className="text-xs text-slate-500">Plans: {floorplans.length} · Units counted: {totalUnits}</p>
					{totalValue > 0 && <p className="text-xs text-slate-500">Inventory value from plans: {toBRL(totalValue)}</p>}
				</div>
				<button
					type="button"
					onClick={openForCreate}
					className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
				>
					Add floorplan
				</button>
			</div>
			{floorplans.length === 0 ? (
				<p className="mt-3 text-sm text-slate-400">No floorplans added yet. Use “Add floorplan” to outline variations.</p>
			) : (
				<div className="mt-3 overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead>
							<tr className="text-xs uppercase text-slate-500">
								<th className="px-2 py-1.5">Name</th>
								<th className="px-2 py-1.5">Units</th>
								<th className="px-2 py-1.5">Price / unit</th>
								<th className="px-2 py-1.5">Area (m²)</th>
								<th className="px-2 py-1.5">Total value</th>
								<th className="px-2 py-1.5">Floorplan</th>
								<th className="px-2 py-1.5" />
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{floorplans.map((plan, index) => {
								const planTotal = plan.units != null && plan.pricePerUnit != null ? plan.units * plan.pricePerUnit : null
								return (
									<tr key={plan.id}>
										<td className="px-2 py-2 font-medium text-slate-200">{plan.name}</td>
										<td className="px-2 py-2 text-slate-400">{plan.units ?? '—'}</td>
										<td className="px-2 py-2 text-slate-400">{plan.pricePerUnit != null ? toBRL(plan.pricePerUnit) : '—'}</td>
										<td className="px-2 py-2 text-slate-400">{plan.areaM2 != null ? plan.areaM2 : '—'}</td>
										<td className="px-2 py-2 text-slate-400">{planTotal != null ? toBRL(planTotal) : '—'}</td>
										<td className="px-2 py-2 text-slate-400">
											{plan.floorplanUrl ? (
												<a href={plan.floorplanUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
													View
												</a>
											) : (
												'—'
											)}
										</td>
										<td className="px-2 py-2">
											<div className="flex items-center gap-2 text-xs">
												<button type="button" onClick={() => openForEdit(index)} className="text-slate-700 hover:underline">
													Edit
												</button>
												<button type="button" onClick={() => duplicatePlan(index)} className="text-slate-700 hover:underline">
													Duplicate
												</button>
												<button type="button" onClick={() => removePlan(index)} className="text-rose-600 hover:underline">
													Delete
												</button>
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			)}

			{modalOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
					<div className="absolute inset-0 overflow-y-auto">
						<div className="mx-auto mt-16 w-full max-w-lg rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-2xl shadow-slate-950/30">
							<h4 className="text-lg font-semibold">{editIndex != null ? 'Edit floorplan' : 'Add floorplan'}</h4>
							<div className="mt-3 grid gap-3 text-sm">
								<label className="grid gap-1">
									<span className="font-medium">Name</span>
									<input
										className="rounded-md border border-slate-700/60 px-3 py-2 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
										value={draft.name}
										onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
										placeholder="Tower A, 3BR Classic, Penthouse"
									/>
								</label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<label className="grid gap-1">
										<span className="font-medium">Units in this plan</span>
										<input
											type="number"
											min={0}
											className="rounded-md border border-slate-700/60 px-3 py-2 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
											value={draft.units}
											onChange={(e) => setDraft((prev) => ({ ...prev, units: e.target.value }))}
										/>
									</label>
									<label className="grid gap-1">
										<span className="font-medium">Area (m²)</span>
										<input
											type="number"
											min={0}
											step="0.1"
											className="rounded-md border border-slate-700/60 px-3 py-2 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
											value={draft.areaM2}
											onChange={(e) => setDraft((prev) => ({ ...prev, areaM2: e.target.value }))}
										/>
									</label>
								</div>
								<label className="grid gap-1">
									<span className="font-medium">Price per unit</span>
									<input
										className="rounded-md border border-slate-700/60 px-3 py-2 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
										value={draft.pricePerUnit}
										onChange={(e) => {
											const formatted = formatBRLInput(e.target.value)
											setDraft((prev) => ({ ...prev, pricePerUnit: formatted }))
										}}
										placeholder={toBRL(0)}
									/>
								</label>
								<label className="grid gap-1">
									<span className="font-medium">Notes</span>
									<textarea
										className="rounded-md border border-slate-700/60 px-3 py-2 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
										value={draft.description}
										onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
										rows={2}
										placeholder="Optional details about this floorplan"
									/>
								</label>
								<div className="grid gap-2">
									<label className="grid gap-1">
										<span className="font-medium">Floorplan (PDF or image)</span>
										<input
											type="file"
											accept=".pdf,image/*"
											onChange={(e) => setDraft((prev) => ({ ...prev, floorplanFile: e.target.files?.[0] ?? null }))}
											className="text-slate-700 text-sm"
										/>
									</label>
									{draft.floorplanUrl && (
										<div className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700">
											<a href={draft.floorplanUrl} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
												View current file
											</a>
											<button
												type="button"
												onClick={() => setDraft((prev) => ({ ...prev, floorplanUrl: null }))}
												className="text-rose-600 hover:underline"
											>
												Remove link
											</button>
										</div>
									)}
								</div>
							</div>
							<div className="mt-4 flex items-center justify-end gap-2">
								<button
									type="button"
									onClick={() => {
										resetDraft()
										setModalOpen(false)
									}}
									className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleSave}
									className="rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-sky-700"
								>
									Save floorplan
								</button>
							</div>
						</div>
					</div>
				</div>
		)}
		</div>
	)
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

const MONTHS = [
	'January','February','March','April','May','June','July','August','September','October','November','December'
] as const

const randomId = () => {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
	return 'unit-' + Math.random().toString(36).slice(2, 11)
}

const ensureArrayOfStrings = (value: any): string[] => {
	if (Array.isArray(value)) return value.map(v => String(v)).filter(Boolean)
	if (typeof value === 'string') {
		return value.split(',').map(v => v.trim()).filter(Boolean)
	}
	return []
}

const parseFloorplansFromFeatures = (features: any): Floorplan[] => {
	if (!features) return []
	const candidates = Array.isArray(features.floorplans)
		? features.floorplans
		: Array.isArray(features)
		? features
		: []
	const toNumber = (value: any): number | null => {
		if (value === null || value === undefined || value === '') return null
		const num = Number(value)
		return Number.isFinite(num) ? num : null
	}
	if (Array.isArray(candidates) && candidates.length) {
		return candidates.map((raw: any) => ({
			id: raw?.id ?? randomId(),
			name: raw?.name ?? raw?.label ?? raw?.title ?? `Floorplan ${Math.random().toString(36).slice(-4)}`,
			units: toNumber(raw?.units ?? raw?.quantity ?? raw?.count),
			pricePerUnit: toNumber(raw?.pricePerUnit ?? raw?.price_per_unit ?? raw?.price),
			areaM2: toNumber(raw?.areaM2 ?? raw?.area_m2 ?? raw?.area),
			description: raw?.description ?? raw?.notes ?? null,
			floorplanUrl: raw?.floorplanUrl ?? raw?.floorplan_url ?? raw?.url ?? null,
			floorplanFile: null,
		}))
	}
	if (Array.isArray(features.units) && features.units.length) {
		return (features.units as any[]).map((raw: any) => ({
			id: raw?.id ?? randomId(),
			name: raw?.label ?? raw?.name ?? `Unit ${Math.random().toString(36).slice(-4)}`,
			units: 1,
			pricePerUnit: toNumber(raw?.price ?? raw?.valor),
			areaM2: toNumber(raw?.areaM2 ?? raw?.area_m2 ?? raw?.area),
			description: Array.isArray(raw?.features) ? raw.features.filter(Boolean).join(', ') : null,
			floorplanUrl: raw?.floorplanUrl ?? raw?.floorplan_url ?? null,
			floorplanFile: null,
		}))
	}
	return []
}

const serializeFloorplansForFeatures = (floorplans: Floorplan[]) =>
	floorplans.map((plan) => ({
		id: plan.id,
		name: plan.name,
		units: plan.units ?? null,
		pricePerUnit: plan.pricePerUnit ?? null,
		price_per_unit: plan.pricePerUnit ?? null,
		areaM2: plan.areaM2 ?? null,
		area_m2: plan.areaM2 ?? null,
		description: plan.description ?? null,
		floorplanUrl: plan.floorplanUrl ?? null,
		floorplan_url: plan.floorplanUrl ?? null,
	}))

const sumFloorplanUnits = (plans: Floorplan[]) => plans.reduce((acc, plan) => acc + (plan.units ?? 0), 0)

const sumFloorplanValue = (plans: Floorplan[]) =>
	plans.reduce((acc, plan) => {
		if (plan.units != null && plan.pricePerUnit != null) {
			return acc + plan.units * plan.pricePerUnit
		}
		return acc
	}, 0)

export default function ListingsNewProjects(){
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

	// Form state (copy of Sale with Expected Delivery fields)
	const [title, setTitle] = useState('')
	const [expectedMonth, setExpectedMonth] = useState<string>('')
	const [expectedYear, setExpectedYear] = useState<string>('')
	const [description, setDescription] = useState('')
	const [address, setAddress] = useState('')
	const [addressNumber, setAddressNumber] = useState('')
	const [city, setCity] = useState('')
	const [neighborhood, setNeighborhood] = useState('')
	const [stateCode, setStateCode] = useState('')
	const [postalCode, setPostalCode] = useState('')
	const [price, setPrice] = useState<string>('')
	const [unitPrice, setUnitPrice] = useState<string>('')
	const [unitsAvailable, setUnitsAvailable] = useState<string>('')
	const [floorplans, setFloorplans] = useState<Floorplan[]>([])
	const [area, setArea] = useState<number | ''>('')
	const [bedrooms, setBedrooms] = useState<number | ''>('')
	const [bathrooms, setBathrooms] = useState<number | ''>('')
	const [parkingSpaces, setParkingSpaces] = useState<number | ''>('')
	const [unitFloor, setUnitFloor] = useState<number | ''>('')
	const [landAreaM2, setLandAreaM2] = useState<number | ''>('')
	const [condoFee, setCondoFee] = useState<string>('')
	const [iptuFee, setIptuFee] = useState<string>('')
	const [unitNumber, setUnitNumber] = useState('')
	const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null)
	const [showExactAddress, setShowExactAddress] = useState(false)
	// Optional YouTube background video for new projects
	const [youtubeBg, setYoutubeBg] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [lastDbError, setLastDbError] = useState<string | null>(null)
	const [showForm, setShowForm] = useState(false)
	// Diagnostics state
	type DiagEntry = { step: string; ok: boolean; details?: any }
	const [diagRunning, setDiagRunning] = useState(false)
	const [diagLog, setDiagLog] = useState<DiagEntry[]>([])
	const [diagReport, setDiagReport] = useState<string>('')

	// Data state
	const [items, setItems] = useState<Listing[]>([])
	const [loading, setLoading] = useState(false)
	const { isDemo } = useAuth()

	const parsedUnitsAvailableValue = useMemo<number | null>(() => {
		const digits = (unitsAvailable || '').replace(/[^0-9]/g, '')
		if (!digits) return null
		const value = Number(digits)
		return Number.isFinite(value) ? value : null
	}, [unitsAvailable])

	const floorplanUnitsTotal = useMemo(() => sumFloorplanUnits(floorplans), [floorplans])
	const floorplanValueTotal = useMemo(() => sumFloorplanValue(floorplans), [floorplans])
	const floorplanMinUnitPrice = useMemo(() => {
		let min: number | null = null
		for (const fp of floorplans) {
			if (fp.pricePerUnit != null) {
				min = min == null ? fp.pricePerUnit : Math.min(min, fp.pricePerUnit)
			}
		}
		return min
	}, [floorplans])
	const baseUnitPriceValue = useMemo<number | null>(() => (unitPrice ? parseBRL(unitPrice) : null), [unitPrice])
	const derivedTotalValue = useMemo<number | null>(() => {
		if (floorplanValueTotal > 0) return floorplanValueTotal
		if (parsedUnitsAvailableValue != null && baseUnitPriceValue != null) {
			return parsedUnitsAvailableValue * baseUnitPriceValue
		}
		return null
	}, [floorplanValueTotal, parsedUnitsAvailableValue, baseUnitPriceValue])
	// The public listing price should reflect per-unit pricing. Prefer explicit base unit price, else min plan price.
	const displayPerUnitPrice = useMemo<number | null>(() => {
		return baseUnitPriceValue != null ? baseUnitPriceValue : (floorplanMinUnitPrice != null ? floorplanMinUnitPrice : null)
	}, [baseUnitPriceValue, floorplanMinUnitPrice])

	useEffect(() => {
		if (derivedTotalValue != null) {
			setPrice(toBRL(derivedTotalValue))
		} else {
			setPrice('')
		}
	}, [derivedTotalValue])

	// Editing state
	const [editingId, setEditingId] = useState<string | null>(null)
	const [eTitle, setETitle] = useState('')
	const [eDescription, setEDescription] = useState('')
	const [eCity, setECity] = useState('')
	const [eState, setEState] = useState('')
	const [ePostal, setEPostal] = useState('')
	const [eAddress, setEAddress] = useState('')
	const [eAddressNumber, setEAddressNumber] = useState('')
	const [eUnitNumber, setEUnitNumber] = useState('')
	const [eNeighborhood, setENeighborhood] = useState('')
	const [eExpectedMonth, setEExpectedMonth] = useState('')
	const [eExpectedYear, setEExpectedYear] = useState('')
	const [eCondoFee, setECondoFee] = useState<string>('')
	const [eIptuFee, setEIptuFee] = useState<string>('')
	const [eParkingSpaces, setEParkingSpaces] = useState<number | ''>('')
	const [eUnitFloor, setEUnitFloor] = useState<number | ''>('')
	const [eLandAreaM2, setELandAreaM2] = useState<number | ''>('')
	const [ePrice, setEPrice] = useState<string>('')
	const [eUnitPrice, setEUnitPrice] = useState<string>('')
	const [eUnitsAvailable, setEUnitsAvailable] = useState<string>('')
	const [eFloorplans, setEFloorplans] = useState<Floorplan[]>([])
	const [eArea, setEArea] = useState<number | ''>('')
	const [eBeds, setEBeds] = useState<number | ''>('')
	const [eBaths, setEBaths] = useState<number | ''>('')
	const [eStatus, setEStatus] = useState<Listing['status']>('draft')
	const [eYoutubeBg, setEYoutubeBg] = useState('')
	const [eShowExactAddress, setEShowExactAddress] = useState(false)
	const [eGalleryFiles, setEGalleryFiles] = useState<FileList | null>(null)
	const [eExistingMedia, setEExistingMedia] = useState<Array<{ kind: string; url: string }>>([])

	const parsedEUnitsAvailableValue = useMemo<number | null>(() => {
		const digits = (eUnitsAvailable || '').replace(/[^0-9]/g, '')
		if (!digits) return null
		const value = Number(digits)
		return Number.isFinite(value) ? value : null
	}, [eUnitsAvailable])

	const eFloorplanUnitsTotal = useMemo(() => sumFloorplanUnits(eFloorplans), [eFloorplans])
	const eFloorplanValueTotal = useMemo(() => sumFloorplanValue(eFloorplans), [eFloorplans])
	const eFloorplanMinUnitPrice = useMemo(() => {
		let min: number | null = null
		for (const fp of eFloorplans) {
			if (fp.pricePerUnit != null) {
				min = min == null ? fp.pricePerUnit : Math.min(min, fp.pricePerUnit)
			}
		}
		return min
	}, [eFloorplans])
	const baseEUnitPriceValue = useMemo<number | null>(() => (eUnitPrice ? parseBRL(eUnitPrice) : null), [eUnitPrice])
	const eDerivedTotalValue = useMemo<number | null>(() => {
		if (eFloorplanValueTotal > 0) return eFloorplanValueTotal
		if (parsedEUnitsAvailableValue != null && baseEUnitPriceValue != null) {
			return parsedEUnitsAvailableValue * baseEUnitPriceValue
		}
		return null
	}, [eFloorplanValueTotal, parsedEUnitsAvailableValue, baseEUnitPriceValue])
	const eDisplayPerUnitPrice = useMemo<number | null>(() => {
		return baseEUnitPriceValue != null ? baseEUnitPriceValue : (eFloorplanMinUnitPrice != null ? eFloorplanMinUnitPrice : null)
	}, [baseEUnitPriceValue, eFloorplanMinUnitPrice])

	useEffect(() => {
		if (eDerivedTotalValue != null) {
			setEPrice(toBRL(eDerivedTotalValue))
		} else if (!eUnitPrice && !parsedEUnitsAvailableValue) {
			setEPrice('')
		}
	}, [eDerivedTotalValue, eUnitPrice, parsedEUnitsAvailableValue])

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
			const attempt = async () => {
				const { data, error } = await supabase
					.from('listings')
					.select('*')
					.eq('listing_type', 'new_project')
					.order('created_at', { ascending: false })
				if (error) throw error
				return data as any[]
			}
			let tries = 0
			let lastErr: any = null
			while (tries < 3) {
				try {
					const rows = await attempt()
					setItems(rows as any)
					lastErr = null
					break
				} catch (e: any) {
					lastErr = e
					const msg: string = e?.message || ''
					if (msg.includes('schema cache')) {
						await new Promise(r => setTimeout(r, 600 * (tries + 1)))
						tries++
						continue
					}
					break
				}
			}
			if (lastErr) setError('Database API is warming up. Please retry.')
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
		setTitle('')
		setExpectedMonth('')
		setExpectedYear('')
		setDescription('')
		setAddress('')
		setAddressNumber('')
		setNeighborhood('')
		setCity('')
		setStateCode('')
		setPostalCode('')
		setUnitNumber('')
		setPrice('')
		setUnitPrice('')
		setUnitsAvailable('')
		setArea('')
		setBedrooms('')
		setBathrooms('')
		setParkingSpaces('')
		setUnitFloor('')
		setLandAreaM2('')
		setCondoFee('')
		setIptuFee('')
		setGalleryFiles(null)
		setShowExactAddress(false)
		setFloorplans([])
		setYoutubeBg('')
	}

	function parseTimeToSeconds(value: string | null): number {
		if (!value) return 0
		const v = value.trim()
		if (!v) return 0
		if (/^\d+$/.test(v)) return parseInt(v, 10)
		// support 1h2m3s / 2m10s / 45s
		const re = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i
		const m = v.match(re)
		if (!m) return 0
		const h = m[1] ? parseInt(m[1], 10) : 0
		const mnt = m[2] ? parseInt(m[2], 10) : 0
		const s = m[3] ? parseInt(m[3], 10) : 0
		return h * 3600 + mnt * 60 + s
	}

	function extractYouTubeParts(input: string): { id: string | null; start: number } {
		const idPattern = /^[a-zA-Z0-9_-]{11}$/
		if (!input) return { id: null, start: 0 }
		const trimmed = input.trim()
		if (idPattern.test(trimmed)) return { id: trimmed, start: 0 }
		try {
			const u = new URL(trimmed)
			let id: string | null = null
			if (u.hostname.includes('youtube.com')) {
				const v = u.searchParams.get('v')
				if (v && idPattern.test(v)) id = v
			}
			if (!id && u.hostname === 'youtu.be') {
				const seg = u.pathname.replace('/', '')
				if (idPattern.test(seg)) id = seg
			}
			const start = parseTimeToSeconds(u.searchParams.get('start') || u.searchParams.get('t'))
			return { id, start }
		} catch {
			// fallback: try extracting 11-char id
			const m = trimmed.match(/([A-Za-z0-9_-]{11})/)
			const id = m ? m[1] : null
			return { id, start: 0 }
		}
	}

	const createListing = async (e: React.FormEvent) => {
		e.preventDefault()
		if (isDemo) {
			setError('Demo mode: creating projects is disabled.')
			return
		}
		setSaving(true)
		setError(null)
		setLastDbError(null)
		try {
			if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
				throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
			}
			const features: Record<string, any> = {}
			if (expectedMonth) features.expected_delivery_month = expectedMonth
			if (expectedYear) features.expected_delivery_year = Number(expectedYear)
			const floorplanPayload = serializeFloorplansForFeatures(floorplans)
			if (floorplanPayload.length) {
				features.floorplans = floorplanPayload
			}
			const unitsAvailableValue = parsedUnitsAvailableValue ?? (floorplanUnitsTotal || null)
			if (unitsAvailableValue != null) {
				features.units_available = unitsAvailableValue
				features.unitsAvailable = unitsAvailableValue
			}
			if (baseUnitPriceValue != null) {
				features.unit_price = baseUnitPriceValue
			}
			if (derivedTotalValue != null) {
				features.total_inventory_value = derivedTotalValue
			}
			// Store address display preference
			features.show_exact_address = showExactAddress
			const floorplansNeedingUpload = floorplans.filter(fp => fp.floorplanFile)

			const insert = {
				listing_type: 'new_project' as const,
				title,
				description: description || null,
				address_line1: address || null,
				address_number: addressNumber || null,
				unit_number: unitNumber || null,
				neighborhood: neighborhood || null,
				city: city || null,
				state_code: stateCode || null,
				postal_code: postalCode || null,
				price: displayPerUnitPrice ?? parseBRL(unitPrice) ?? null,
				area_m2: area === '' ? null : Number(area),
				bedrooms: bedrooms === '' ? null : Number(bedrooms),
				bathrooms: bathrooms === '' ? null : Number(bathrooms),
				parking_spaces: parkingSpaces === '' ? null : Number(parkingSpaces),
				unit_floor: unitFloor === '' ? null : Number(unitFloor),
				land_area_m2: landAreaM2 === '' ? null : Number(landAreaM2),
				condo_fee: parseBRL(condoFee),
				features,
				status: 'draft' as const,
				media: [] as any,
			}
			// Attach YouTube background video if provided
			const parts = extractYouTubeParts(youtubeBg)
			if (parts.id) {
				const watchUrl = 'https://www.youtube.com/watch?v=' + parts.id + (parts.start ? '&t=' + parts.start : '')
				const ins: any = insert as any
				const baseMedia: any[] = Array.isArray(ins.media) ? ins.media : []
				ins.media = baseMedia.concat([{ kind: 'video_bg', url: watchUrl }])
			}
			const attempt = async () => {
				const { data, error } = await supabase.from('listings').insert(insert).select('*').single()
				if (error) throw error
				return data as Listing
			}
			let tries = 0
			const maxTries = 5
			let created: Listing | null = null
			let lastErr: any = null
			while (tries < maxTries) {
				try {
					created = await attempt()
					break
				} catch (e: any) {
					lastErr = e
					const msg: string = e?.message || ''
					setLastDbError(msg)
					if (msg.includes('schema cache')) {
						await new Promise(r => setTimeout(r, 500 * Math.pow(1.8, tries)))
						tries++
						continue
					}
					break
				}
			}
			if (!created) throw (lastErr ?? new Error('Failed to create listing'))
			// Upload images to storage - first photo becomes thumbnail
			const uploads: Array<{ kind: string; url: string }> = []
			try {
				const bucket = supabase.storage.from('listings')
				if (galleryFiles && galleryFiles.length > 0) {
					for (let i = 0; i < galleryFiles.length; i++) {
						const f = galleryFiles.item(i)!
						const ext = f.name.split('.').pop() || 'jpg'
						const path = `${created.id}/gallery/${Date.now()}-${i}.${ext}`
						const { error: upErr } = await bucket.upload(path, f, { cacheControl: '3600', upsert: true })
						if (upErr) throw upErr
						const { data: pub } = bucket.getPublicUrl(path)
						// First photo is thumbnail, rest are regular images
						if (pub?.publicUrl) uploads.push({ kind: i === 0 ? 'thumbnail' : 'image', url: pub.publicUrl })
					}
				}
			} catch (e: any) {
				console.error('Upload failed:', e?.message || e)
				setError('Image upload failed. Ensure a Storage bucket named "listings" exists and is public.')
			}
			let finalRow = created
			if (uploads.length) {
				const { data: updated, error: uErr } = await supabase.from('listings').update({ media: [...(created.media||[]), ...uploads] }).eq('id', created.id).select('*').single()
				if (!uErr && updated) finalRow = updated as any
			}
			if (floorplansNeedingUpload.length) {
				try {
					const bucket = supabase.storage.from('listings')
					const updatedPlans = [...(features.floorplans ?? [])]
					for (const plan of floorplansNeedingUpload) {
						const file = plan.floorplanFile
						if (!file) continue
						const ext = file.name.split('.').pop() || 'pdf'
						const path = `${created.id}/floorplans/${plan.id}-floorplan.${ext}`
						const { error: uploadErr } = await bucket.upload(path, file, { cacheControl: '3600', upsert: true })
						if (uploadErr) throw uploadErr
						const { data: pub } = bucket.getPublicUrl(path)
						const url = pub?.publicUrl || null
						if (url) {
							const idx = updatedPlans.findIndex((fp: any) => fp.id === plan.id)
							if (idx >= 0) updatedPlans[idx] = { ...updatedPlans[idx], floorplanUrl: url }
						}
					}
					const updatedFeatures = {
						...(features || {}),
						floorplans: updatedPlans,
					}
					const { data: featureUpdated, error: fErr } = await supabase
						.from('listings')
						.update({ features: updatedFeatures })
						.eq('id', created.id)
						.select('*')
						.single()
					if (!fErr && featureUpdated) {
						finalRow = featureUpdated as Listing
					}
				} catch (uploadUnitsErr: any) {
					console.error('Floorplan upload failed:', uploadUnitsErr?.message || uploadUnitsErr)
					setError('Some unit floorplans could not be uploaded. You can retry editing the project to add them.')
				}
			}
			setItems(prev => [finalRow, ...prev])
			resetForm()
		} catch (e: any) {
			const msg: string = e?.message || 'Failed to create listing'
			if (msg.includes('schema cache')) {
				setError('Database API is warming up or misconfigured. Please retry in a moment and verify Supabase URL/key are correct.')
			} else {
				setError(msg)
			}
			setLastDbError(msg)
		} finally {
			setSaving(false)
		}
	}

	function startEdit(l: Listing) {
		setEditingId(l.id)
		setETitle(l.title || '')
		setEDescription(l.description || '')
		setECity(l.city || '')
		setEState(l.state_code || '')
		setEPostal(l.postal_code || '')
		setEAddress(l.address_line1 || '')
		const features = l.features ?? {}
		setEAddressNumber(features?.address_number ?? '')
		setEUnitNumber(features?.unit_number ?? '')
		setENeighborhood(features?.neighborhood ?? '')
		setEExpectedMonth(features?.expected_delivery_month ?? '')
		setEExpectedYear(features?.expected_delivery_year ?? '')
		setECondoFee(features?.condo_fee != null ? toBRL(features.condo_fee) : '')
		setEIptuFee(features?.iptu_fee != null ? toBRL(features.iptu_fee) : '')
		setEParkingSpaces(l.parking_spaces ?? '')
		setEUnitFloor(features?.unit_floor ?? '')
		setELandAreaM2(features?.land_area_m2 ?? '')
		setEPrice(l.price != null ? toBRL(l.price) : '')
		setEArea(l.area_m2 ?? '')
		setEBeds(l.bedrooms ?? '')
		setEBaths(l.bathrooms ?? '')
		setEStatus(l.status)
		const bgUrl = l.media?.find(m => m.kind === 'video_bg')?.url || ''
		setEYoutubeBg(bgUrl)
		const plans = parseFloorplansFromFeatures(features)
		setEFloorplans(plans)
		const storedUnits =
			features?.units_available ??
			features?.unitsAvailable ??
			(null as number | null)
		const derivedUnits = storedUnits != null ? storedUnits : (plans.length ? sumFloorplanUnits(plans) : null)
		setEUnitsAvailable(derivedUnits != null ? String(derivedUnits) : '')
		const storedUnitPrice = features?.unit_price ?? features?.unitPrice ?? null
		setEUnitPrice(storedUnitPrice != null ? toBRL(storedUnitPrice) : '')
		
		// Load address display preference
		setEShowExactAddress(features?.show_exact_address ?? false)
		
		// Populate existing media (excluding video_bg which is handled separately)
		const existingMedia = (Array.isArray(l.media) ? l.media : []).filter(m => m.kind !== 'video_bg')
		setEExistingMedia(existingMedia)
	}

	async function saveEdit() {
		if (isDemo) {
			setError('Demo mode: editing projects is disabled.')
			return
		}
		if (!editingId) return
		setSaving(true)
		setError(null)
	try {
		const current = items.find(i => i.id === editingId)
		const floorplanPayload = serializeFloorplansForFeatures(eFloorplans)
		const baseFeatures: Record<string, any> = { ...(current?.features ?? {}) }
		
		// Store floorplans
		if (floorplanPayload.length) {
			baseFeatures.floorplans = floorplanPayload
		} else {
			delete baseFeatures.floorplans
		}
		
		// Store units and pricing
		const unitsAvailableValue = parsedEUnitsAvailableValue ?? (eFloorplanUnitsTotal || null)
		if (unitsAvailableValue != null) {
			baseFeatures.units_available = unitsAvailableValue
			baseFeatures.unitsAvailable = unitsAvailableValue
		} else {
			delete baseFeatures.units_available
			delete baseFeatures.unitsAvailable
		}
		if (baseEUnitPriceValue != null) {
			baseFeatures.unit_price = baseEUnitPriceValue
		} else {
			delete baseFeatures.unit_price
		}
		if (eDerivedTotalValue != null) {
			baseFeatures.total_inventory_value = eDerivedTotalValue
		} else {
			delete baseFeatures.total_inventory_value
		}
		
		// Store address details
		if (eAddressNumber) baseFeatures.address_number = eAddressNumber
		else delete baseFeatures.address_number
		
		if (eUnitNumber) baseFeatures.unit_number = eUnitNumber
		else delete baseFeatures.unit_number
		
		if (eNeighborhood) baseFeatures.neighborhood = eNeighborhood
		else delete baseFeatures.neighborhood
		
		// Store expected delivery
		if (eExpectedMonth) baseFeatures.expected_delivery_month = eExpectedMonth
		else delete baseFeatures.expected_delivery_month
		
		if (eExpectedYear) baseFeatures.expected_delivery_year = eExpectedYear
		else delete baseFeatures.expected_delivery_year
		
		// Store fees
		const condoFeeValue = parseBRL(eCondoFee)
		if (condoFeeValue != null) baseFeatures.condo_fee = condoFeeValue
		else delete baseFeatures.condo_fee
		
		const iptuFeeValue = parseBRL(eIptuFee)
		if (iptuFeeValue != null) baseFeatures.iptu_fee = iptuFeeValue
		else delete baseFeatures.iptu_fee
		
		// Store additional property details
		if (eUnitFloor !== '') baseFeatures.unit_floor = Number(eUnitFloor)
		else delete baseFeatures.unit_floor
		
		if (eLandAreaM2 !== '') baseFeatures.land_area_m2 = Number(eLandAreaM2)
		else delete baseFeatures.land_area_m2
		
		// Store address display preference
		baseFeatures.show_exact_address = eShowExactAddress
		
		const floorplansNeedingUpload = eFloorplans.filter(fp => fp.floorplanFile)
		const update: any = {
			title: eTitle,
			description: eDescription || null,
			address_line1: eAddress || null,
			city: eCity || null,
			state_code: eState || null,
			postal_code: ePostal || null,
			price: eDisplayPerUnitPrice ?? parseBRL(eUnitPrice) ?? null,
			area_m2: eArea === '' ? null : Number(eArea),
			bedrooms: eBeds === '' ? null : Number(eBeds),
			bathrooms: eBaths === '' ? null : Number(eBaths),
			parking_spaces: eParkingSpaces === '' ? null : Number(eParkingSpaces),
			status: eStatus,
			features: baseFeatures,
		}
			if (current) {
				// Start with existing media from our managed state (already reordered/deleted by user)
				let media = [...eExistingMedia]
				
				// Handle YouTube video background
				const parts = extractYouTubeParts(eYoutubeBg)
				if (parts.id) {
					const url = 'https://www.youtube.com/watch?v=' + parts.id + (parts.start ? '&t=' + parts.start : '')
					media.push({ kind: 'video_bg', url })
				}
				
				// If new files selected, upload and append
				const uploads: Array<{ kind: string; url: string }> = []
				try {
					if (eGalleryFiles && eGalleryFiles.length) {
						const bucket = supabase.storage.from('listings')
						// Check if we already have a thumbnail in existing media
						const hasThumbnail = media.some(m => m.kind === 'thumbnail')
						
						for (let i = 0; i < eGalleryFiles.length; i++) {
							const f = eGalleryFiles.item(i)!
							const ext = f.name.split('.').pop() || 'jpg'
							const path = `${editingId}/gallery/${Date.now()}-${i}.${ext}`
							const { error: upErr } = await bucket.upload(path, f, { cacheControl: '3600', upsert: true })
							if (upErr) throw upErr
							const { data: pub } = bucket.getPublicUrl(path)
							// First new photo becomes thumbnail if no thumbnail exists
							if (pub?.publicUrl) uploads.push({ kind: !hasThumbnail && i === 0 ? 'thumbnail' : 'image', url: pub.publicUrl })
						}
					}
				} catch (e: any) {
					console.error('Upload failed:', e?.message || e)
					setError('Image upload failed. Ensure Storage bucket "listings" is public.')
				}
				update.media = [...media, ...uploads]
			}
			const { data, error } = await supabase.from('listings').update(update).eq('id', editingId).select('*').single()
			if (error) throw error
			let updated = data as Listing
	if (floorplansNeedingUpload.length) {
		try {
			const bucket = supabase.storage.from('listings')
			const serializedPlans = serializeFloorplansForFeatures(eFloorplans)
			for (const plan of floorplansNeedingUpload) {
				const file = plan.floorplanFile
				if (!file) continue
				const ext = file.name.split('.').pop() || 'pdf'
				const path = `${editingId}/floorplans/${plan.id}-floorplan.${ext}`
				const { error: uploadErr } = await bucket.upload(path, file, { cacheControl: '3600', upsert: true })
				if (uploadErr) throw uploadErr
				const { data: pub } = bucket.getPublicUrl(path)
				const url = pub?.publicUrl || null
				if (url) {
					const idx = serializedPlans.findIndex(fp => fp.id === plan.id)
					if (idx >= 0) serializedPlans[idx] = { ...serializedPlans[idx], floorplanUrl: url }
				}
			}
			const updatedFeatures = {
				...(update.features || {}),
				floorplans: serializedPlans,
			}
			const { data: featureRow, error: featureErr } = await supabase
				.from('listings')
				.update({ features: updatedFeatures })
				.eq('id', editingId)
				.select('*')
				.single()
			if (featureErr) throw featureErr
			if (featureRow) {
				updated = featureRow as Listing
			}
		} catch (floorplanErr: any) {
			console.error('Floorplan upload failed:', floorplanErr?.message || floorplanErr)
			setError('Some floorplans failed to upload. Please re-edit the project to retry.')
		}
	}
	setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
	const updatedFeatures = updated.features ?? {}
	const updatedPlans = parseFloorplansFromFeatures(updatedFeatures)
	setEFloorplans(updatedPlans)
	const updatedUnitsAvailableValue = updatedFeatures?.units_available ?? updatedFeatures?.unitsAvailable ?? (updatedPlans.length ? sumFloorplanUnits(updatedPlans) : null)
	setEUnitsAvailable(updatedUnitsAvailableValue != null ? String(updatedUnitsAvailableValue) : '')
	const updatedUnitPriceValue = updatedFeatures?.unit_price ?? updatedFeatures?.unitPrice ?? null
	setEUnitPrice(updatedUnitPriceValue != null ? toBRL(updatedUnitPriceValue) : '')
	
	// Update existing media state with saved media
	const savedMedia = (Array.isArray(updated.media) ? updated.media : []).filter(m => m.kind !== 'video_bg')
	setEExistingMedia(savedMedia)
	
	setEditingId(null)
	setEGalleryFiles(null)
		} catch (e: any) {
			setError(e?.message || 'Failed to update listing')
		} finally {
			setSaving(false)
		}
	}

	async function warmApi() {
		if (isDemo) {
			setError('Demo mode: diagnostics are disabled.')
			return
		}
		setError(null)
		setLastDbError(null)
		try {
			const { error } = await supabase.from('listings').select('id').limit(1)
			if (error) throw error
		} catch (e: any) {
			const msg: string = e?.message || String(e)
			setLastDbError(msg)
			setError('Database ping failed. See details below.')
		}
	}

	function mask(val?: string) {
		if (!val) return '(empty)'
		const s = String(val)
		if (s.length <= 10) return s
		return s.slice(0, 8) + '…' + s.slice(-4)
	}

	async function runDiagnostics() {
		if (isDemo) {
			setError('Demo mode: diagnostics are disabled.')
			return
		}
		setDiagRunning(true)
		setDiagLog([])
		setError(null)
		setLastDbError(null)
		const logs: DiagEntry[] = []
		const push = (e: DiagEntry) => { logs.push(e); setDiagLog([...logs]) }
		const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined
		const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined
		push({ step: 'Env: VITE_SUPABASE_URL present', ok: !!envUrl, details: mask(envUrl) })
		push({ step: 'Env: VITE_SUPABASE_ANON_KEY present', ok: !!envAnon, details: mask(envAnon) })
		try {
			const { data, error } = await supabase.auth.getSession()
			if (error) throw error
			push({ step: 'Auth session', ok: true, details: {
				user: data.session?.user?.email || data.session?.user?.id || '(anonymous)'
			}})
		} catch (e: any) {
			push({ step: 'Auth session', ok: false, details: e?.message || String(e) })
		}
		try {
			const { data, error } = await supabase.from('listings').select('id', { count: 'exact', head: false }).limit(1)
			if (error) throw error
			push({ step: 'Connectivity: select listings', ok: true, details: { sample: data?.length ?? 0 } })
		} catch (e: any) {
			push({ step: 'Connectivity: select listings', ok: false, details: e?.message || String(e) })
			setLastDbError(e?.message || String(e))
		}
		try {
			const { error } = await supabase.from('listings').select('listing_type,title,status').limit(1)
			if (error) throw error
			push({ step: 'Schema: listing_type/title/status columns', ok: true })
		} catch (e: any) {
			push({ step: 'Schema: listing_type/title/status columns', ok: false, details: e?.message || String(e) })
		}
		let testId: string | null = null
		try {
			// Insert then delete to validate RLS and constraints
			const title = `diag-test ${new Date().toISOString()}`
			const { data, error } = await supabase
				.from('listings')
				.insert({ listing_type: 'new_project', title, status: 'draft' })
				.select('id')
				.single()
			if (error) throw error
			testId = (data as any)?.id || null
			push({ step: 'RLS/Constraint: insert new_project', ok: true, details: { id: testId } })
		} catch (e: any) {
			push({ step: 'RLS/Constraint: insert new_project', ok: false, details: e?.message || String(e) })
			setLastDbError(e?.message || String(e))
		}
		if (testId) {
			try {
				const { error } = await supabase.from('listings').delete().eq('id', testId)
				if (error) throw error
				push({ step: 'Cleanup: delete test row', ok: true })
			} catch (e: any) {
				push({ step: 'Cleanup: delete test row', ok: false, details: e?.message || String(e) })
			}
		}
		// Build copyable report
		const report = {
			when: new Date().toISOString(),
			url: envUrl,
			anonKeyMasked: mask(envAnon),
			results: logs,
		}
		setDiagReport(JSON.stringify(report, null, 2))
		setDiagRunning(false)
	}

		const currentYear = new Date().getFullYear()
		const minAllowedYear = currentYear - 1
		const isYearValid = (y: string) => {
			if (!y) return true
			if (!/^\d{4}$/.test(y)) return false
			const n = Number(y)
			return n >= minAllowedYear
		}

	const inputCls = "w-full rounded-md border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-100 placeholder-slate-400 px-3 py-2 shadow-lg shadow-slate-950/20 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none"
	const selectCls = "rounded-md border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-100 px-2 py-2 text-sm focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none"

	return <div className="p-4 text-slate-200">
	<div>
		<h1 className="text-xl font-semibold">Listings · New Projects</h1>
		<p className="mt-1 text-slate-400">Manage new developments.</p>
		{isDemo && (
			<p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
				Demo mode · changes disabled
			</p>
		)}
		{loading && <p className="text-sm text-slate-500 mt-1">Loading…</p>}
		{error && <p className="text-sm text-red-600 mt-1">{error}</p>}
	</div>

		<div className="mt-6 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg">
			<button type="button" onClick={()=>setShowForm(s=>!s)} className="w-full flex items-center justify-between px-4 py-3">
				<span className="font-medium">Add a new project</span>
				<svg className={"h-5 w-5 text-slate-500 transition-transform " + (showForm ? "rotate-180" : "rotate-0")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
				</svg>
			</button>
			{showForm && (
				<div className="border-t border-slate-700/60 p-4">
					<form onSubmit={createListing} className="grid gap-3">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Title</span>
								<input className={inputCls} value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g., Park View Residences" />
							</label>
							<div className="grid grid-cols-2 gap-2">
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Expected delivery (month)</span>
									<select className={selectCls} value={expectedMonth} onChange={e=>setExpectedMonth(e.target.value)}>
										<option value="">—</option>
										{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
									</select>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Expected delivery (year)</span>
									<input className={inputCls} value={expectedYear} onChange={e=>{
										const raw = (e.target.value || '').replace(/\D/g,'').slice(0,4)
										setExpectedYear(raw)
									}} placeholder="YYYY" inputMode="numeric" maxLength={4} />
														{!isYearValid(expectedYear) && (
															<span className="text-xs text-red-600">Enter a valid year (≥ {minAllowedYear}).</span>
														)}
								</label>
							</div>
						</div>

						<label className="grid gap-1 text-sm">
							<span className="font-medium">Brief description</span>
							<textarea className={inputCls} rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short summary of the project" />
						</label>

						<label className="grid gap-1 text-sm">
							<span className="font-medium">YouTube background video (optional)</span>
							<input className={inputCls} value={youtubeBg} onChange={e=>setYoutubeBg(e.target.value)} placeholder="Paste a YouTube link or ID" />
							<span className="text-xs text-slate-500">Example: https://youtu.be/dQw4w9WgXcQ or dQw4w9WgXcQ</span>
						</label>

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
								<input className={inputCls} value={unitNumber} onChange={e=>setUnitNumber(e.target.value)} placeholder="e.g., Tower B" />
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

						{/* Map Address Display Toggle */}
						<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={showExactAddress}
									onChange={(e) => setShowExactAddress(e.target.checked)}
									className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
								/>
								<div>
									<span className="font-medium text-sm text-slate-900">Show exact address on map</span>
									<p className="text-xs text-slate-500 mt-0.5">
										When unchecked, the map will only show the neighborhood for privacy. When checked, it will show the full street address.
									</p>
								</div>
							</label>
						</div>

		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
			<label className="grid gap-1 text-sm">
				<span className="font-medium">Units available</span>
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
				<span className="font-medium">Base price per unit (optional)</span>
				<input
					type="text"
					inputMode="numeric"
					className={inputCls}
					value={unitPrice}
					onChange={(e) => setUnitPrice(formatBRLInput(e.target.value))}
					placeholder={toBRL(0)}
				/>
			</label>
			<label className="grid gap-1 text-sm">
				<span className="font-medium">Total inventory value (auto)</span>
				<input
					className={`${inputCls} bg-slate-100`}
					value={price}
					onChange={() => {}}
					placeholder="Calculated automatically"
					readOnly
				/>
			</label>
		</div>

		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<label className="grid gap-1 text-sm">
				<span className="font-medium">Condominium fee</span>
				<input type="text" inputMode="numeric" className={inputCls} value={condoFee} onChange={e=>setCondoFee(formatBRLInput(e.target.value))} placeholder={toBRL(0)} />
			</label>
			<label className="grid gap-1 text-sm">
				<span className="font-medium">IPTU</span>
				<input type="text" inputMode="numeric" className={inputCls} value={iptuFee} onChange={e=>setIptuFee(formatBRLInput(e.target.value))} placeholder={toBRL(0)} />
			</label>
		</div>

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

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Unit floor (optional)</span>
								<input type="number" min={0} step="1" className={inputCls} value={unitFloor} onChange={e=>setUnitFloor(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 5" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Land area (m²) (optional)</span>
								<input type="number" min={0} step="0.1" className={inputCls} value={landAreaM2} onChange={e=>setLandAreaM2(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 300" />
							</label>
						</div>

		<FloorplansManager
			title="Floorplans (optional)"
			floorplans={floorplans}
			onChange={setFloorplans}
			formatBRLInput={formatBRLInput}
			parseBRL={parseBRL}
			toBRL={toBRL}
		/>

						<div className="grid gap-2">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Photos (first photo will be the thumbnail)</span>
								<input type="file" accept="image/*" multiple onChange={e=>setGalleryFiles(e.target.files)} className="text-slate-700" />
							</label>
						</div>

						<button
							disabled={saving || !title || !isYearValid(expectedYear) || isDemo}
							className="mt-4 mx-auto w-fit text-sm inline-flex items-center rounded-md px-3 py-1.5 text-white bg-sky-600 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
							title={isDemo ? 'Disabled in demo mode' : undefined}
						>
							{saving ? 'Saving…' : 'Add Project'}
						</button>
						<div className="mt-3 mx-auto w-full max-w-2xl grid gap-2">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={isDemo ? undefined : warmApi}
								disabled={isDemo}
								className="text-xs inline-flex items-center rounded-md px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
								title={isDemo ? 'Disabled in demo mode' : undefined}
							>Quick ping</button>
							<button
								type="button"
								disabled={diagRunning || isDemo}
								onClick={isDemo ? undefined : runDiagnostics}
								className="text-xs inline-flex items-center rounded-md px-2 py-1 text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
								title={isDemo ? 'Disabled in demo mode' : undefined}
							>
								{diagRunning ? 'Running diagnostics…' : 'Run full diagnostics'}
							</button>
							</div>
							{diagLog.length > 0 && (
								<div className="mt-2 rounded border border-slate-700/60 p-2 bg-slate-50">
									<ul className="text-xs text-slate-200 space-y-1">
										{diagLog.map((d,i)=> (
											<li key={i} className="flex items-start gap-2">
												<span className={"mt-0.5 inline-block h-2 w-2 rounded-full " + (d.ok ? 'bg-green-500' : 'bg-red-500')}></span>
												<div>
													<div className="font-medium">{d.step}</div>
													{d.details !== undefined && (
														<pre className="whitespace-pre-wrap break-words text-[11px] text-slate-700">{typeof d.details === 'string' ? d.details : JSON.stringify(d.details)}</pre>
													)}
												</div>
											</li>
										))}
									</ul>
									{diagReport && (
										<div className="mt-2 flex items-center gap-2">
											<button type="button" className="text-xs inline-flex items-center rounded-md px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200"
												onClick={async ()=>{ try { await navigator.clipboard.writeText(diagReport) } catch {} }}>
												Copy report
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					</form>
				</div>
			)}
		</div>

		<div className="mt-6 grid grid-cols-1 sm:grid-cols-[260px,1fr] gap-4 items-start">
			<aside className="rounded-xl border border-slate-700/60 p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg sticky top-4 h-fit">
				<h2 className="text-sm font-semibold mb-2">Filters</h2>
				<div className="grid gap-2 text-sm">
					<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title, city, CEP…" className={"w-full rounded-md border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-100 placeholder-slate-400 px-3 py-2 shadow-lg shadow-slate-950/20 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none text-sm"} />
					<label className="grid gap-1">
						<span className="text-slate-400">City</span>
						<select value={fCity} onChange={e=>setFCity(e.target.value)} className={selectCls}>
							<option value="all">All</option>
							{distinctCities.map(c => <option key={c} value={c}>{c}</option>)}
						</select>
					</label>
					<label className="grid gap-1">
						<span className="text-slate-400">State</span>
						<select value={fState} onChange={e=>setFState(e.target.value)} className={selectCls}>
							<option value="all">All</option>
							{distinctStates.map(s => <option key={s} value={s}>{s}</option>)}
						</select>
					</label>
					<div className="grid grid-cols-2 gap-2">
						<input value={minPrice} onChange={e=>setMinPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" min={0} placeholder="Min" className={"w-full rounded-md border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-100 placeholder-slate-400 px-3 py-2 shadow-lg shadow-slate-950/20 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none text-sm"} />
						<input value={maxPrice} onChange={e=>setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" min={0} placeholder="Max" className={"w-full rounded-md border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-100 placeholder-slate-400 px-3 py-2 shadow-lg shadow-slate-950/20 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none text-sm"} />
					</div>
					<label className="grid gap-1">
						<span className="text-slate-400">Beds</span>
						<select value={fBeds} onChange={e=>setFBeds(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
							<option value="all">Any</option>
							{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
						</select>
					</label>
					<label className="grid gap-1">
						<span className="text-slate-400">Baths</span>
						<select value={fBaths} onChange={e=>setFBaths(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
							<option value="all">Any</option>
							{[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
						</select>
					</label>
					<label className="grid gap-1">
						<span className="text-slate-400">Status</span>
						<select value={fStatus} onChange={e=>setFStatus(e.target.value as any)} className={selectCls}>
							<option value="all">Any</option>
							{['draft','active','pending','sold','archived'].map(s => <option key={s} value={s}>{s}</option>)}
						</select>
					</label>
				</div>
			</aside>

			<section>
				<h2 className="text-base font-semibold">Current inventory</h2>
				<div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filtered.map(l => {
						const thumb = l.media?.find(m => m.kind === 'thumbnail')?.url || l.media?.[0]?.url
						const features = l.features ?? {}
						const floorplans = parseFloorplansFromFeatures(features)
						const unitsAvailable = features?.units_available ?? features?.unitsAvailable ?? (floorplans.length ? sumFloorplanUnits(floorplans) : null)
						const pricePerUnit = features?.unit_price ?? features?.unitPrice ?? l.price ?? null
						const totalInventoryValue = features?.total_inventory_value ?? (unitsAvailable && pricePerUnit ? unitsAvailable * pricePerUnit : null)
						
						return (
							<div key={l.id} className="rounded-xl border border-slate-700/60 p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-200">
								{thumb ? (
									<img src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
								) : (
									<div className="w-full h-40 bg-slate-100 rounded-md grid place-items-center text-slate-400 text-sm">No image</div>
								)}
								<div className="mt-2">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1">
											<h3 className="font-semibold line-clamp-1">{l.title}</h3>
											<p className="text-sm text-slate-400">{[l.city, l.state_code].filter(Boolean).join(', ')}</p>
										</div>
										<div className="flex items-center gap-3">
											<button className="text-sm text-slate-700 hover:underline" onClick={() => startEdit(l)}>Edit</button>
											<button
												className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
												onClick={async ()=>{
													if (isDemo) return
													await supabase.from('listings').delete().eq('id', l.id)
													setItems(prev => prev.filter(i => i.id !== l.id))
												}}
												disabled={isDemo}
												title={isDemo ? 'Disabled in demo mode' : undefined}
											>Delete</button>
										</div>
									</div>
									
									{/* New Project Metrics */}
									<div className="mt-3 grid grid-cols-2 gap-2 text-xs">
										<div className="bg-slate-700/30 rounded px-2 py-1.5">
											<div className="text-slate-400">Price per Unit</div>
											<div className="font-semibold text-slate-100 mt-0.5">
												{pricePerUnit ? `R$ ${Number(pricePerUnit).toLocaleString('pt-BR')}` : '—'}
											</div>
										</div>
										<div className="bg-slate-700/30 rounded px-2 py-1.5">
											<div className="text-slate-400">Floor Plans</div>
											<div className="font-semibold text-slate-100 mt-0.5">
												{floorplans.length || '—'}
											</div>
										</div>
										<div className="bg-slate-700/30 rounded px-2 py-1.5">
											<div className="text-slate-400">Units Available</div>
											<div className="font-semibold text-slate-100 mt-0.5">
												{unitsAvailable ?? '—'}
											</div>
										</div>
										<div className="bg-slate-700/30 rounded px-2 py-1.5">
											<div className="text-slate-400">Total Inventory</div>
											<div className="font-semibold text-slate-100 mt-0.5">
												{totalInventoryValue ? `R$ ${Number(totalInventoryValue).toLocaleString('pt-BR')}` : '—'}
											</div>
										</div>
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
			<div className="fixed inset-0 bg-black/30 grid place-items-center z-50 overflow-y-auto py-8">
				<div className="w-full max-w-4xl rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 text-slate-200 shadow-lg shadow-slate-950/25 my-8">
					<h3 className="text-xl font-semibold">Edit project</h3>
					<div className="mt-4 grid gap-4 max-h-[80vh] overflow-y-auto pr-2">
						{/* Basic Info */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Title</span>
								<input className={inputCls} value={eTitle} onChange={e=>setETitle(e.target.value)} required />
							</label>
							<div className="grid grid-cols-2 gap-2">
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Expected delivery (month)</span>
									<select className={selectCls} value={eExpectedMonth} onChange={e=>setEExpectedMonth(e.target.value)}>
										<option value="">—</option>
										{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
									</select>
								</label>
								<label className="grid gap-1 text-sm">
									<span className="font-medium">Expected delivery (year)</span>
									<input className={inputCls} value={eExpectedYear} onChange={e=>{
										const raw = (e.target.value || '').replace(/\D/g,'').slice(0,4)
										setEExpectedYear(raw)
									}} placeholder="YYYY" inputMode="numeric" maxLength={4} />
								</label>
							</div>
						</div>

						<label className="grid gap-1 text-sm">
							<span className="font-medium">Brief description</span>
							<textarea className={inputCls} rows={3} value={eDescription} onChange={e=>setEDescription(e.target.value)} />
						</label>

						<label className="grid gap-1 text-sm">
							<span className="font-medium">YouTube background video (optional)</span>
							<input className={inputCls} value={eYoutubeBg} onChange={e=>setEYoutubeBg(e.target.value)} placeholder="Paste a YouTube link or ID" />
						</label>

						{/* Location */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">CEP</span>
								<input
									className={inputCls}
									value={ePostal}
									maxLength={9}
									onChange={async e=>{
										const raw = e.target.value || ''
										const digits = raw.replace(/\D/g,'').slice(0,8)
										const formatted = digits.length > 5 ? `${digits.slice(0,5)}-${digits.slice(5)}` : digits
										setEPostal(formatted)
										if (digits.length === 8) {
											try {
												const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
												if (res.ok) {
													const data = await res.json()
													if (!data.erro) {
														if (data.logradouro) setEAddress(data.logradouro)
														if (data.bairro) setENeighborhood(data.bairro)
														if (data.localidade) setECity(data.localidade)
														if (data.uf) setEState(data.uf)
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
								<input className={inputCls} value={eAddress} onChange={e=>setEAddress(e.target.value)} placeholder="Street" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Street number</span>
								<input className={inputCls} value={eAddressNumber} onChange={e=>setEAddressNumber(e.target.value)} placeholder="Number" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Apt / Unit / Suite (optional)</span>
								<input className={inputCls} value={eUnitNumber} onChange={e=>setEUnitNumber(e.target.value)} placeholder="e.g., Tower B" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Neighborhood (Bairro)</span>
								<input className={inputCls} value={eNeighborhood} onChange={e=>setENeighborhood(e.target.value)} placeholder="Bairro" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">City</span>
								<input className={inputCls} value={eCity} onChange={e=>setECity(e.target.value)} placeholder="City" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">State</span>
								<select className={selectCls} value={eState} onChange={e=>setEState(e.target.value)}>
									<option value="">Select state</option>
									{BR_STATES_FULL.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
								</select>
							</label>
						</div>

						{/* Map Address Display Toggle */}
						<div className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-4">
							<label className="flex items-center gap-3 cursor-pointer">
								<input
									type="checkbox"
									checked={eShowExactAddress}
									onChange={(e) => setEShowExactAddress(e.target.checked)}
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

						{/* Pricing & Inventory */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Units available</span>
								<input
									type="number"
									min={0}
									className={inputCls}
									value={eUnitsAvailable}
									onChange={(e) => setEUnitsAvailable(e.target.value)}
									placeholder="e.g., 23"
								/>
								{eFloorplans.length > 0 && (
									<span className="text-xs text-slate-500">Floorplans currently sum to {eFloorplanUnitsTotal} units.</span>
								)}
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Base price per unit (optional)</span>
								<input
									type="text"
									inputMode="numeric"
									className={inputCls}
									value={eUnitPrice}
									onChange={(e) => setEUnitPrice(formatBRLInput(e.target.value))}
									placeholder={toBRL(0)}
								/>
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Total inventory value (auto)</span>
								<input
									className={`${inputCls} bg-slate-700/50`}
									value={ePrice}
									onChange={() => {}}
									placeholder="Calculated automatically"
									readOnly
								/>
							</label>
						</div>

						{/* Fees */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Condominium fee</span>
								<input type="text" inputMode="numeric" className={inputCls} value={eCondoFee} onChange={e=>setECondoFee(formatBRLInput(e.target.value))} placeholder={toBRL(0)} />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">IPTU</span>
								<input type="text" inputMode="numeric" className={inputCls} value={eIptuFee} onChange={e=>setEIptuFee(formatBRLInput(e.target.value))} placeholder={toBRL(0)} />
							</label>
						</div>

						{/* Property Details */}
						<div className="grid grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Area (m²)</span>
								<input type="number" min={0} step="0.1" className={inputCls} value={eArea} onChange={e=>setEArea(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Bedrooms</span>
								<input type="number" min={0} step="1" className={inputCls} value={eBeds} onChange={e=>setEBeds(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Bathrooms</span>
								<input type="number" min={0} step="0.5" className={inputCls} value={eBaths} onChange={e=>setEBaths(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Parking spaces</span>
								<input type="number" min={0} step="1" className={inputCls} value={eParkingSpaces} onChange={e=>setEParkingSpaces(e.target.value === '' ? '' : Number(e.target.value))} placeholder="0" />
							</label>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Unit floor (optional)</span>
								<input type="number" min={0} step="1" className={inputCls} value={eUnitFloor} onChange={e=>setEUnitFloor(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 5" />
							</label>
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Land area (m²) (optional)</span>
								<input type="number" min={0} step="0.1" className={inputCls} value={eLandAreaM2} onChange={e=>setELandAreaM2(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 300" />
							</label>
						</div>

						<label className="grid gap-1 text-sm">
							<span className="font-medium">Status</span>
							<select className={selectCls} value={eStatus} onChange={e=>setEStatus(e.target.value as any)}>
								{['draft','active','pending','sold','rented','archived'].map(s => <option key={s} value={s}>{s}</option>)}
							</select>
						</label>

						<FloorplansManager
							title="Floorplans"
							floorplans={eFloorplans}
							onChange={setEFloorplans}
							formatBRLInput={formatBRLInput}
							parseBRL={parseBRL}
							toBRL={toBRL}
						/>

						{/* Existing Media Manager */}
						{eExistingMedia.length > 0 && (
							<div className="border border-slate-700/60 rounded-lg p-4">
								<h4 className="text-sm font-semibold mb-3">Existing Photos</h4>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{eExistingMedia.map((media, index) => (
										<div key={index} className="relative group">
											<img 
												src={media.url} 
												alt={media.kind} 
												className="w-full h-32 object-cover rounded-lg border border-slate-700/60"
											/>
											<div className="absolute top-1 right-1 flex gap-1">
												{/* Move Up */}
												{index > 0 && (
													<button
														type="button"
														onClick={() => {
															const newMedia = [...eExistingMedia]
															const temp = newMedia[index]
															newMedia[index] = newMedia[index - 1]
															newMedia[index - 1] = temp
															setEExistingMedia(newMedia)
														}}
														className="p-1 bg-slate-800/90 hover:bg-slate-700 rounded text-slate-200 text-xs"
														title="Move up"
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
														</svg>
													</button>
												)}
												{/* Move Down */}
												{index < eExistingMedia.length - 1 && (
													<button
														type="button"
														onClick={() => {
															const newMedia = [...eExistingMedia]
															const temp = newMedia[index]
															newMedia[index] = newMedia[index + 1]
															newMedia[index + 1] = temp
															setEExistingMedia(newMedia)
														}}
														className="p-1 bg-slate-800/90 hover:bg-slate-700 rounded text-slate-200 text-xs"
														title="Move down"
													>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
														</svg>
													</button>
												)}
												{/* Delete */}
												<button
													type="button"
													onClick={() => {
														setEExistingMedia(eExistingMedia.filter((_, i) => i !== index))
													}}
													className="p-1 bg-red-600/90 hover:bg-red-700 rounded text-white text-xs"
													title="Delete"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
											<button
												type="button"
												onClick={() => {
													const updated = [...eExistingMedia]
													// Remove thumbnail from all photos
													updated.forEach(m => {
														if (m.kind === 'thumbnail') m.kind = 'image'
													})
													// Set this one as thumbnail
													updated[index].kind = 'thumbnail'
													setEExistingMedia(updated)
												}}
												className="absolute bottom-1 left-1 px-2 py-0.5 bg-slate-800/90 hover:bg-slate-700 rounded text-xs text-slate-200 cursor-pointer"
												title="Click to set as thumbnail"
											>
												{media.kind === 'thumbnail' ? '⭐ Thumbnail' : `#${index + 1} (click to make thumbnail)`}
											</button>
										</div>
									))}
								</div>
								<p className="text-xs text-slate-400 mt-2">Use arrows to reorder, × to delete, or click photo label to set as thumbnail</p>
							</div>
						)}

						<div className="grid gap-3">
							<label className="grid gap-1 text-sm">
								<span className="font-medium">Add more photos (first new photo will become thumbnail if none selected above)</span>
								<input type="file" accept="image/*" multiple onChange={e=>setEGalleryFiles(e.target.files)} className="text-slate-300 text-sm" />
							</label>
						</div>
					</div>
					
					<div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-3">
						<button
							onClick={isDemo ? undefined : saveEdit}
							disabled={isDemo || saving}
							className="inline-flex items-center rounded-md px-4 py-2 text-white bg-sky-600 hover:bg-sky-700 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
							type="button"
							title={isDemo ? 'Disabled in demo mode' : undefined}
						>{saving ? 'Saving...' : 'Save Changes'}</button>
						<button onClick={()=>setEditingId(null)} className="inline-flex items-center rounded-md px-4 py-2 text-slate-200 bg-slate-700 hover:bg-slate-600 text-sm font-medium" type="button">Cancel</button>
						{error && <p className="text-sm text-red-600 ml-2">{error}</p>}
					</div>
				</div>
			</div>
		)}
	</div>
}
