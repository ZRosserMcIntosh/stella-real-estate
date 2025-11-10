export type UserRole = 'realtor' | 'brokerage' | 'developer' | 'employee'

export type OrgType = 'realtor' | 'brokerage' | 'developer'

export type MembershipRole = 'owner' | 'admin' | 'editor' | 'agent' | 'listing_manager' | 'employee' | 'viewer'

export type LicenseStatus = 'missing' | 'pending' | 'unverified' | 'verified' | 'rejected'

export type InviteCategory = 'employee' | 'developer'

export interface AccountProfile {
  id: string
  fullName: string
  email: string
  createdAt: string
  consent: boolean
  authProvider: 'email' | 'google' | 'apple' | 'facebook' | 'x'
}

export interface OrgProfile {
  id: string
  type: OrgType
  legalName: string
  cnpj?: string
  creciNumber?: string
  creciType?: 'individual' | 'juridico'
  creciUF?: string
  creciStatus?: LicenseStatus
  responsibleBrokerCreci?: string | null
  partnerOrgId?: string | null
  partnerOrgName?: string | null
  createdAt: string
}

export interface MembershipRecord {
  id: string
  userId: string
  orgId: string
  role: MembershipRole
  status: 'active' | 'invited'
  createdAt: string
}

export interface RealtorLicense {
  type: 'realtor'
  creciNumber: string
  uf: string
  creciName: string
  deferred?: boolean
  status: LicenseStatus
}

export interface BrokerageLicense {
  type: 'brokerage'
  legalName: string
  cnpj: string
  creciNumber: string
  uf: string
  responsibleCreci: string
  status: LicenseStatus
}

export interface DeveloperLink {
  type: 'developer'
  linkType: 'creci' | 'partner'
  responsibleCreci?: string
  partnerOrgId?: string
  partnerOrgName?: string
  status: LicenseStatus
}

export type LicenseRecord = RealtorLicense | BrokerageLicense | DeveloperLink

export interface InviteTemplate {
  code: string
  category: InviteCategory
  orgId: string
  orgName: string
  orgType: OrgType
  role: MembershipRole
  expiresAt: string
  maxUses: number
  uses: number
  boundEmail?: string | null
  developerRole?: UserRole
  note?: string | null
}

export interface InviteRedemption {
  code: string
  category: InviteCategory
  orgId: string
  orgName: string
  orgType: OrgType
  role: MembershipRole
  redeemedAt: string
  expiresAt: string
  boundEmail?: string | null
}

export interface TenantProfile {
  id: string
  orgId: string
  name: string
  slug: string
  defaultRoute: string
  pathFallback?: string | null
  primaryDomain?: string | null
  logoUrl?: string | null
  faviconUrl?: string | null
  createdAt: string
}

export interface OnboardingState {
  account?: AccountProfile
  role?: UserRole
  org?: OrgProfile
  membership?: MembershipRecord
  license?: LicenseRecord
  invite?: InviteRedemption
  tenant?: TenantProfile
  developerOverride?: boolean
  developerCode?: string
}

export type BuilderMode = 'locked' | 'limited' | 'full'

export interface BuilderGate {
  mode: BuilderMode
  reason?: string
}
