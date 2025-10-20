export type ProjectStatus = 'new' | 'active' | 'archived' | 'deleted' | 'pending' | 'draft' | string

export interface ProjectMediaItem {
  url: string
  kind?: string | null
  caption?: string | null
  order?: number | null
  alt?: string | null
}

export interface ProjectFeatures {
  bedrooms?: number | null
  suites?: number | null
  bathrooms?: number | null
  parkingSpaces?: number | null
  areaTotalM2?: number | null
  areaPrivateM2?: number | null
  expectedDeliveryMonth?: string | null
  expectedDeliveryYear?: string | null
  units?: ProjectUnitSummary[]
  unitsAvailable?: number | null
  [key: string]: number | string | boolean | null | undefined | ProjectUnitSummary[] | string[]
}

export interface ProjectUnitSummary {
  id: string
  label: string
  bedrooms?: number | null
  bathrooms?: number | null
  areaM2?: number | null
  price?: number | null
  floor?: string | null
  unitNumber?: string | null
  features?: string[]
  available?: boolean
  floorplanUrl?: string | null
}

export interface Project {
  id: string
  name: string
  slug: string
  status: ProjectStatus
  city?: string | null
  state?: string | null
  deliveryDate?: string | null
  heroImageUrl?: string | null
  videoBgUrl?: string | null
  price?: number | null
  currency?: string | null
  description?: string | null
  media?: ProjectMediaItem[]
  features?: ProjectFeatures
  highlights?: string[]
  rawFeatures?: Record<string, unknown>
}
