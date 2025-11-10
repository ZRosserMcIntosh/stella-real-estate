import type { BuilderMode } from '../types/onboarding'
import type { LicenseStatus, MembershipRole, UserRole } from '../types/onboarding'

export type TelemetryEventName =
  | 'signup_cta_click'
  | 'user_signup'
  | 'role_selected'
  | 'license_saved'
  | 'invite_created'
  | 'invite_redeemed'
  | 'tenant_created'
  | 'slug_chosen'
  | 'domain_assigned'
  | 'builder_unlocked'
  | 'listing_created'
  | 'listing_published'

type SignupPosition = 'header' | 'institucional' | 'footer'
type AuthMethod = 'email' | 'google' | 'apple' | 'facebook' | 'x'
type DomainType = 'dev_default' | 'custom'
type ListingTelemetryType = 'sale' | 'rent' | 'project'

type TelemetryPayloads = {
  signup_cta_click: { position: SignupPosition }
  user_signup: { auth_method: AuthMethod }
  role_selected: { role: UserRole }
  license_saved: { role: UserRole; status: LicenseStatus; deferred?: boolean }
  invite_created: { code: string; orgId: string; role: MembershipRole }
  invite_redeemed: { code: string; orgId: string; role: MembershipRole }
  tenant_created: { tenantId: string; orgId: string; slug: string }
  slug_chosen: { slug: string; orgId: string }
  domain_assigned: { tenantId: string; type: DomainType; value: string }
  builder_unlocked: { mode: BuilderMode; role: UserRole }
  listing_created: { tenantId: string; type: ListingTelemetryType }
  listing_published: { tenantId: string; listingId: string }
}

export type TelemetryRecord<K extends TelemetryEventName = TelemetryEventName> = {
  name: K
  payload: TelemetryPayloads[K]
  timestamp: string
}

declare global {
  interface Window {
    __STELLA_TELEMETRY__?: TelemetryRecord[]
  }
}

export function trackEvent<K extends TelemetryEventName>(name: K, payload: TelemetryPayloads[K]) {
  const record: TelemetryRecord<K> = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    window.__STELLA_TELEMETRY__ = [...(window.__STELLA_TELEMETRY__ ?? []), record]
    window.dispatchEvent(new CustomEvent('stella:telemetry', { detail: record }))
  }

  if (import.meta.env.MODE !== 'production') {
    console.info(`[telemetry] ${name}`, payload)
  }
}
