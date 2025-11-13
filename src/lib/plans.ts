/**
 * Pricing & Plans Configuration
 * Based on Virgil's specifications for Stella Constellation Platform
 */

export type PlanId = 'FREE' | 'SOLO' | 'TEAM' | 'BROKERAGE' | 'ENTERPRISE'
export type SupportLevel = 'NONE' | 'STANDARD' | 'PRIORITY' | 'ENTERPRISE'
export type EarlyAccessLevel = 'NONE' | 'STANDARD' | 'FOUNDER' | 'ENTERPRISE'

export interface Plan {
  id: PlanId
  name: string
  monthlyPriceBRL?: number | null
  yearlyPriceBRL?: number | null
  maxSites?: number | null
  maxPagesPerSite?: number | null
  allowCustomDomain: boolean
  showStellaBranding: boolean
  maxActiveListings?: number | null
  included3DMapsPerMonth: number
  pricePerExtra3DMapBRL: number | null
  maxContacts?: number | null
  maxPipelines?: number | null
  automationsEnabled: boolean
  leadScoringEnabled: boolean
  maxUsers?: number | null
  hasRolePermissions: boolean
  supportLevel: SupportLevel
  canRemoveBranding: boolean
  earlyAccessLevel: EarlyAccessLevel
}

export interface Founding100Status {
  isFoundingMember: boolean
  foundingSlotNumber?: number
  prepaidUntil?: Date
  lifetimeDiscountPercent?: number
  extra3DMapsPerMonth?: number
  discountedPricePerExtra3DMapBRL?: number
  lostForInactivity?: boolean
}

export interface MapPackage {
  id: 'KILOMOVEIS' | 'MEGAMOVEIS'
  totalMaps: number
  totalPriceBRL: number
  validMonths: number
}

// Plan definitions
export const PLANS: Record<PlanId, Plan> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    monthlyPriceBRL: 0,
    yearlyPriceBRL: 0,
    maxSites: 1,
    maxPagesPerSite: 3,
    allowCustomDomain: false,
    showStellaBranding: true,
    maxActiveListings: 10,
    included3DMapsPerMonth: 0,
    pricePerExtra3DMapBRL: null,
    maxContacts: 200,
    maxPipelines: 1,
    automationsEnabled: false,
    leadScoringEnabled: false,
    maxUsers: 1,
    hasRolePermissions: false,
    canRemoveBranding: false,
    supportLevel: 'STANDARD',
    earlyAccessLevel: 'NONE',
  },
  SOLO: {
    id: 'SOLO',
    name: 'Solo',
    monthlyPriceBRL: 147,
    yearlyPriceBRL: 1470,
    maxSites: 1,
    maxPagesPerSite: null,
    allowCustomDomain: true,
    showStellaBranding: true,
    maxActiveListings: 50,
    included3DMapsPerMonth: 2,
    pricePerExtra3DMapBRL: 200,
    maxContacts: 3000,
    maxPipelines: 2,
    automationsEnabled: true,
    leadScoringEnabled: false,
    maxUsers: 2,
    hasRolePermissions: false,
    canRemoveBranding: false,
    supportLevel: 'STANDARD',
    earlyAccessLevel: 'STANDARD',
  },
  TEAM: {
    id: 'TEAM',
    name: 'Team',
    monthlyPriceBRL: 397,
    yearlyPriceBRL: 3970,
    maxSites: 2,
    maxPagesPerSite: null,
    allowCustomDomain: true,
    showStellaBranding: false,
    maxActiveListings: 150,
    included3DMapsPerMonth: 5,
    pricePerExtra3DMapBRL: 160,
    maxContacts: 10000,
    maxPipelines: null,
    automationsEnabled: true,
    leadScoringEnabled: true,
    maxUsers: 5,
    hasRolePermissions: true,
    canRemoveBranding: true,
    supportLevel: 'PRIORITY',
    earlyAccessLevel: 'STANDARD',
  },
  BROKERAGE: {
    id: 'BROKERAGE',
    name: 'Brokerage',
    monthlyPriceBRL: 997,
    yearlyPriceBRL: 9970,
    maxSites: 3,
    maxPagesPerSite: null,
    allowCustomDomain: true,
    showStellaBranding: false,
    maxActiveListings: 500,
    included3DMapsPerMonth: 20,
    pricePerExtra3DMapBRL: 120,
    maxContacts: 50000,
    maxPipelines: null,
    automationsEnabled: true,
    leadScoringEnabled: true,
    maxUsers: 30,
    hasRolePermissions: true,
    canRemoveBranding: true,
    supportLevel: 'PRIORITY',
    earlyAccessLevel: 'STANDARD',
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    monthlyPriceBRL: null,
    yearlyPriceBRL: null,
    maxSites: null,
    maxPagesPerSite: null,
    allowCustomDomain: true,
    showStellaBranding: false,
    maxActiveListings: null,
    included3DMapsPerMonth: 0, // Contract-defined
    pricePerExtra3DMapBRL: null, // Contract-defined
    maxContacts: null,
    maxPipelines: null,
    automationsEnabled: true,
    leadScoringEnabled: true,
    maxUsers: null,
    hasRolePermissions: true,
    canRemoveBranding: true,
    supportLevel: 'ENTERPRISE',
    earlyAccessLevel: 'ENTERPRISE',
  },
}

// Map packages
export const MAP_PACKAGES: Record<string, MapPackage> = {
  KILOMOVEIS: {
    id: 'KILOMOVEIS',
    totalMaps: 1000,
    totalPriceBRL: 120000,
    validMonths: 12,
  },
  MEGAMOVEIS: {
    id: 'MEGAMOVEIS',
    totalMaps: 1000000,
    totalPriceBRL: 45000000, // Configurable 40M-50M
    validMonths: 36, // Multi-year
  },
}

// Founding 100 constants
export const MAX_FOUNDING_SLOTS = 100
export const FOUNDING_PREPAID_MONTHS = 24
export const FOUNDING_ONE_TIME_PRICE_BRL = 2970
export const FOUNDING_LIFETIME_DISCOUNT_PERCENT = 40
export const FOUNDING_EXTRA_3D_MAPS_PER_MONTH = 5
export const FOUNDING_DISCOUNTED_PRICE_PER_EXTRA_3D_MAP_BRL = 140
export const FOUNDING_INACTIVITY_MONTHS = 6

/**
 * Check if an account can become a Founding member
 */
export function canBeFoundingMember(
  currentFoundingCount: number,
  maxUsers: number
): boolean {
  return currentFoundingCount < MAX_FOUNDING_SLOTS && maxUsers <= 3
}

/**
 * Get effective monthly price for an account with Founding status
 */
export function getEffectivePrice(
  plan: Plan,
  foundingStatus?: Founding100Status
): number | null {
  if (!plan.monthlyPriceBRL) return null

  const now = new Date()
  const isPrepaid =
    foundingStatus?.isFoundingMember &&
    foundingStatus.prepaidUntil &&
    foundingStatus.prepaidUntil > now

  if (isPrepaid) {
    return 0 // Prepaid period
  }

  if (
    foundingStatus?.isFoundingMember &&
    foundingStatus.lifetimeDiscountPercent &&
    !foundingStatus.lostForInactivity
  ) {
    return (
      plan.monthlyPriceBRL *
      (1 - foundingStatus.lifetimeDiscountPercent / 100)
    )
  }

  return plan.monthlyPriceBRL
}

/**
 * Get available 3D maps per month for an account
 */
export function getAvailable3DMaps(
  plan: Plan,
  foundingStatus?: Founding100Status
): number {
  let baseMaps = plan.included3DMapsPerMonth

  if (
    foundingStatus?.isFoundingMember &&
    !foundingStatus.lostForInactivity &&
    foundingStatus.extra3DMapsPerMonth
  ) {
    baseMaps += foundingStatus.extra3DMapsPerMonth
  }

  return baseMaps
}

/**
 * Get price per extra 3D map for an account
 */
export function getPricePerExtra3DMap(
  plan: Plan,
  foundingStatus?: Founding100Status
): number | null {
  if (
    foundingStatus?.isFoundingMember &&
    !foundingStatus.lostForInactivity &&
    foundingStatus.discountedPricePerExtra3DMapBRL
  ) {
    return foundingStatus.discountedPricePerExtra3DMapBRL
  }

  return plan.pricePerExtra3DMapBRL
}
