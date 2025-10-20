import { supabase } from '../lib/supabaseClient'
import type { Project, ProjectMediaItem, ProjectFeatures, ProjectUnitSummary } from '../types/projects'

const toNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

const ensureStringArray = (value: any): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

const randomUnitId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return 'unit-' + Math.random().toString(36).slice(2, 11)
}

const mapRow = (r: any): Project => {
  const slug = `${(r.title || 'project').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}-${r.id}`
  const rawMedia = Array.isArray(r.media) ? r.media.filter((m: any) => m && m.url) : []
  const mediaItems: ProjectMediaItem[] = rawMedia.map((item: any, index: number) => ({
    url: item.url,
    kind: item.kind ?? null,
    caption: item.caption ?? item.alt ?? null,
    order: toNumber(item.order) ?? index,
    alt: item.alt ?? null,
  }))
  mediaItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const heroImageCandidate =
    mediaItems.find((m) => m.kind === 'thumbnail') ??
    mediaItems.find((m) => !m.kind || m.kind === 'image') ??
    mediaItems[0]
  const videoBg = rawMedia.find((m: any) => m.kind === 'video_bg')?.url || null

  const rawFeatures: Record<string, any> =
    (r.features && typeof r.features === 'object' ? r.features : {}) as Record<string, any>

  const features: ProjectFeatures = {
    bedrooms: toNumber(
      rawFeatures.bedrooms ??
        rawFeatures.dormitorios ??
        rawFeatures.qtd_dormitorios ??
        rawFeatures.rooms,
    ),
    suites: toNumber(rawFeatures.suites ?? rawFeatures.qtd_suites),
    bathrooms: toNumber(
      rawFeatures.bathrooms ??
        rawFeatures.banheiros ??
        rawFeatures.qtd_banheiros ??
        rawFeatures.full_bathrooms,
    ),
    parkingSpaces: toNumber(
      rawFeatures.parking_spaces ??
        rawFeatures.vagas ??
        rawFeatures.garage_spots ??
        rawFeatures.garage_spaces,
    ),
    areaTotalM2: toNumber(
      rawFeatures.area_total ??
        rawFeatures.area_total_m2 ??
        rawFeatures.area_m2 ??
        rawFeatures.total_area ??
        r.area_m2,
    ),
    areaPrivateM2: toNumber(
      rawFeatures.area_private ??
        rawFeatures.area_privada ??
        rawFeatures.private_area_m2 ??
        rawFeatures.area_privativa,
    ),
    expectedDeliveryMonth: rawFeatures.expected_delivery_month ?? rawFeatures.delivery_month ?? null,
    expectedDeliveryYear: rawFeatures.expected_delivery_year ?? rawFeatures.delivery_year ?? null,
  }

  const deliveryDate = features.expectedDeliveryYear
    ? [features.expectedDeliveryMonth, features.expectedDeliveryYear].filter(Boolean).join(' / ')
    : null

  const highlightList = ensureStringArray(rawFeatures.highlights)
  const highlights =
    highlightList.length > 0
      ? highlightList
      : ensureStringArray(rawFeatures.amenities ?? rawFeatures.differentials ?? rawFeatures.tags)

  const rawUnits = Array.isArray(rawFeatures.units) ? rawFeatures.units : []
  const units: ProjectUnitSummary[] = rawUnits.map((unit: any) => ({
    id: unit?.id ?? randomUnitId(),
    label: unit?.label ?? unit?.name ?? unit?.unit ?? `Unit`,
    unitNumber: unit?.unitNumber ?? unit?.unit_number ?? unit?.number ?? null,
    floor: unit?.floor ?? unit?.level ?? unit?.andar ?? null,
    bedrooms: toNumber(unit?.bedrooms ?? unit?.beds ?? unit?.dormitorios),
    bathrooms: toNumber(unit?.bathrooms ?? unit?.baths ?? unit?.banheiros),
    areaM2: toNumber(unit?.areaM2 ?? unit?.area_m2 ?? unit?.area ?? unit?.metragem),
    price: toNumber(unit?.price ?? unit?.valor),
    features: ensureStringArray(unit?.features ?? unit?.tags ?? unit?.caracteristicas),
    available: unit?.available ?? unit?.isAvailable ?? unit?.disponivel ?? true,
    floorplanUrl: unit?.floorplanUrl ?? unit?.floorplan_url ?? unit?.floorplan ?? unit?.planta ?? null,
  }))
  const availableComputed = units.length ? units.filter((u) => u.available !== false).length : null
  const availableCount =
    typeof rawFeatures.unitsAvailable === 'number'
      ? rawFeatures.unitsAvailable
      : typeof rawFeatures.units_available === 'number'
        ? rawFeatures.units_available
        : availableComputed
  if (units.length) {
    features.units = units
    features.unitsAvailable = availableCount
  }

  // Determine a per-unit display price: prefer explicit unit_price, else min of unit prices, else r.price
  const unitPriceFromFeatures = typeof rawFeatures.unit_price === 'number' ? rawFeatures.unit_price : null
  let minUnitPrice: number | null = null
  for (const u of units) {
    if (typeof u.price === 'number') {
      minUnitPrice = minUnitPrice == null ? u.price : Math.min(minUnitPrice, u.price)
    }
  }
  const displayPrice = unitPriceFromFeatures ?? minUnitPrice ?? (typeof r.price === 'number' ? r.price : null)

  return {
    id: r.id,
    name: r.title,
    slug,
    status: r.status,
    city: r.city,
    state: r.state_code,
    deliveryDate,
    heroImageUrl: heroImageCandidate?.url ?? null,
    videoBgUrl: videoBg,
  price: toNumber(displayPrice),
    currency: r.currency ?? rawFeatures.currency ?? 'BRL',
    description: r.description ?? rawFeatures.description ?? rawFeatures.summary ?? null,
    media: mediaItems,
    features,
    highlights,
    rawFeatures,
  }
}

export async function fetchNewProjects(params?: { limit?: number }): Promise<Project[]> {
  const limit = params?.limit ?? 8
  const { data, error } = await supabase
    .from('listings')
    .select('id,title,status,city,state_code,features,media,created_at,price,currency,description,area_m2')
    .eq('listing_type', 'new_project')
  .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data || []).map(mapRow)
}

export async function fetchAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('id,title,status,city,state_code,features,media,created_at,price,currency,description,area_m2')
    .eq('listing_type', 'new_project')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapRow)
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  // We encode id in slug suffix: <slugified-title>-<uuid>
  // Extract a trailing UUID (36 chars, with hyphens).
  const m = slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  const id = m?.[0]
  if (!id) return null
  const { data, error } = await supabase
    .from('listings')
    .select('id,title,status,city,state_code,features,media,created_at,price,currency,description,area_m2')
    .eq('id', id)
    .eq('listing_type', 'new_project')
    .limit(1)
    .single()
  if (error) return null
  if (!data) return null
  if (['archived', 'deleted'].includes((data as any).status)) return null
  return mapRow(data)
}
