import React from 'react'
import { trackEvent } from '../lib/telemetry'
import type {
  AccountProfile,
  BuilderGate,
  BuilderMode,
  InviteCategory,
  InviteRedemption,
  InviteTemplate,
  LicenseRecord,
  MembershipRecord,
  MembershipRole,
  OnboardingState,
  OrgProfile,
  OrgType,
  TenantProfile,
  UserRole,
} from '../types/onboarding'

const STORAGE_KEY = 'stella:onboarding:state'
const EMAIL_KEY = 'stella:onboarding:emails'
const SLUG_KEY = 'stella:onboarding:slugs'
const INVITE_KEY = 'stella:onboarding:invites'
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const CODE_BLOCK_SIZE = 4
const CODE_BLOCKS = 4
const DEFAULT_EMPLOYEE_EXPIRY_DAYS = 7
const DEFAULT_DEVELOPER_EXPIRY_DAYS = 30

type AuthMethod = 'email' | 'google' | 'apple' | 'facebook' | 'x'

const createId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

const nowIso = () => new Date().toISOString()

const addDays = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const normalizeCode = (code: string) => code.trim().toUpperCase()

const generateInviteCode = () => {
  const blocks: string[] = []
  for (let i = 0; i < CODE_BLOCKS; i += 1) {
    let segment = ''
    for (let j = 0; j < CODE_BLOCK_SIZE; j += 1) {
      const index = Math.floor(Math.random() * CODE_CHARS.length)
      segment += CODE_CHARS[index]
    }
    blocks.push(segment)
  }
  return blocks.join('-')
}

const defaultInvites: InviteTemplate[] = [
  {
    code: 'CONSTELLA24',
    category: 'employee',
    orgId: 'org_constellation',
    orgName: 'Constellation Brokers',
    orgType: 'brokerage',
    role: 'editor',
    expiresAt: '2025-01-31T23:59:59.000Z',
    maxUses: 5,
    uses: 0,
    boundEmail: null,
    developerRole: undefined,
    note: null,
  },
  {
    code: 'SKYLINEOPS',
    category: 'employee',
    orgId: 'org_skyline_ops',
    orgName: 'Skyline Operations',
    orgType: 'brokerage',
    role: 'listing_manager',
    expiresAt: '2024-12-31T23:59:59.000Z',
    maxUses: 1,
    uses: 0,
    boundEmail: null,
    developerRole: undefined,
    note: null,
  },
]

const defaultState: OnboardingState = {}

export class OnboardingError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}

const readFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as T
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

const persistToStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore persistence errors */
  }
}

type CreateAccountInput = {
  fullName: string
  email: string
  password: string
  consent: boolean
  authMethod?: AuthMethod
}

type SaveRealtorLicenseInput = {
  creciNumber?: string
  uf?: string
  creciName?: string
  deferred?: boolean
}

type SaveBrokerageLicenseInput = {
  legalName: string
  cnpj: string
  creciNumber: string
  uf: string
  responsibleCreci: string
}

type SaveDeveloperLinkInput =
  | {
    linkType: 'creci'
    responsibleCreci: string
  }
  | {
    linkType: 'partner'
    partnerOrgId: string
    partnerOrgName: string
  }
  | {
    linkType: 'defer'
  }

type CreateTenantInput = {
  name: string
  slug: string
  logoUrl?: string | null
  faviconUrl?: string | null
}

type CreateEmployeeInviteInput = {
  email: string
  orgName: string
  orgType?: OrgType
  role: MembershipRole
  maxUses?: number
  expiresAt?: string
  note?: string | null
}

type CreateDeveloperCodeInput = {
  email: string
  role?: UserRole
  label?: string
  maxUses?: number
  expiresAt?: string
  note?: string | null
}

type RedeemDeveloperCodeResult = {
  code: string
  role: UserRole
}

type OnboardingContextValue = {
  state: OnboardingState
  builderGate: BuilderGate
  existingEmails: string[]
  existingSlugs: string[]
  inviteDirectory: InviteTemplate[]
  createAccount: (input: CreateAccountInput) => Promise<AccountProfile>
  selectRole: (role: UserRole) => void
  saveRealtorLicense: (input: SaveRealtorLicenseInput) => LicenseRecord
  saveBrokerageLicense: (input: SaveBrokerageLicenseInput) => LicenseRecord
  saveDeveloperLink: (input: SaveDeveloperLinkInput) => LicenseRecord
  redeemInvite: (code: string) => Promise<InviteRedemption>
  createTenant: (input: CreateTenantInput) => TenantProfile
  createEmployeeInvite: (input: CreateEmployeeInviteInput) => InviteTemplate
  createDeveloperCode: (input: CreateDeveloperCodeInput) => InviteTemplate
  redeemDeveloperCode: (code: string) => Promise<RedeemDeveloperCodeResult>
  resetOnboarding: () => void
}

const OnboardingContext = React.createContext<OnboardingContextValue | undefined>(undefined)

const computeBuilderGate = (state: OnboardingState): BuilderGate => {
  if (!state.role) {
    return { mode: 'locked', reason: 'Como você quer começar?' }
  }

  if (state.developerOverride) {
    return { mode: 'full' }
  }

  if (state.role === 'realtor') {
    const license = state.license && state.license.type === 'realtor' ? state.license : undefined
    if (!license || license.deferred || !license.creciNumber || !license.uf) {
      return { mode: 'locked', reason: 'Adicione seu CRECI para continuar.' }
    }
    return { mode: 'full' }
  }

  if (state.role === 'brokerage') {
    const license = state.license && state.license.type === 'brokerage' ? state.license : undefined
    if (!license || !license.creciNumber || !license.responsibleCreci) {
      return { mode: 'locked', reason: 'Precisamos do CRECI Jurídico e do corretor responsável.' }
    }
    return { mode: 'full' }
  }

  if (state.role === 'developer') {
    const license = state.license && state.license.type === 'developer' ? state.license : undefined
    if (!license) {
      return { mode: 'locked', reason: 'Vincule um corretor responsável para publicar.' }
    }
    const hasPendingCreci = license.linkType === 'creci' && !!license.responsibleCreci
    const hasPartner = license.linkType === 'partner' && !!license.partnerOrgId
    if (!hasPendingCreci && !hasPartner) {
      return { mode: 'limited', reason: 'O construtor está em modo rascunho até você vincular um corretor.' }
    }
    if (license.status === 'verified') {
      return { mode: 'full' }
    }
    return { mode: 'limited', reason: 'Aguardando verificação para publicar listagens.' }
  }

  // employee flow
  const invite = state.invite
  if (!invite) {
    return { mode: 'locked', reason: 'Insira o código de convite do seu empregador.' }
  }
  const role = state.membership?.role ?? invite.role
  const builderRoles: MembershipRole[] = ['owner', 'admin', 'editor', 'agent', 'listing_manager']
  if (!builderRoles.includes(role)) {
    return { mode: 'locked', reason: 'Sua função ainda não tem acesso ao construtor.' }
  }
  return { mode: 'full' }
}

const validatePassword = (password: string) => {
  if (password.length < 8) {
    throw new OnboardingError('weak_password', 'A senha deve ter pelo menos 8 caracteres.')
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new OnboardingError('weak_password', 'Use letras e números para criar sua senha.')
  }
}

const validateEmail = (email: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email)) {
    throw new OnboardingError('invalid_email', 'Informe um e-mail válido.')
  }
}

const normalizeSlug = (slug: string) => slug.trim().toLowerCase()

const slugIsValid = (slug: string) => /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(slug) && !/-{2,}/.test(slug)

const sanitizeCreci = (value: string) => value.trim().toUpperCase()

const sanitizeUF = (value: string) => value.trim().toUpperCase()

const sanitizeCNPJ = (value: string) => value.replace(/[^\d]/g, '')

const validateCNPJ = (cnpj: string) => {
  if (cnpj.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cnpj)) return false

  const calc = (base: number[]) => {
    const size = base.length
    let sum = 0
    let pos = size - 7
    for (let i = size; i >= 1; i -= 1) {
      sum += base[size - i] * pos
      pos -= 1
      if (pos < 2) pos = 9
    }
    const result = sum % 11
    return result < 2 ? 0 : 11 - result
  }

  const numbers = cnpj.split('').map((digit) => parseInt(digit, 10))
  const firstCalc = calc(numbers.slice(0, 12))
  if (firstCalc !== numbers[12]) return false
  const secondCalc = calc(numbers.slice(0, 13))
  return secondCalc === numbers[13]
}

export const OnboardingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState<OnboardingState>(() => readFromStorage<OnboardingState>(STORAGE_KEY, defaultState))
  const [emails, setEmails] = React.useState<string[]>(() => readFromStorage<string[]>(EMAIL_KEY, []))
  const [slugs, setSlugs] = React.useState<string[]>(() => readFromStorage<string[]>(SLUG_KEY, []))
  const [inviteDirectory, setInviteDirectory] = React.useState<InviteTemplate[]>(() => readFromStorage<InviteTemplate[]>(INVITE_KEY, defaultInvites))
  const [lastTrackedGate, setLastTrackedGate] = React.useState<BuilderMode>('locked')

  const builderGate = React.useMemo(() => computeBuilderGate(state), [state])

  React.useEffect(() => {
    persistToStorage(STORAGE_KEY, state)
  }, [state])

  React.useEffect(() => {
    persistToStorage(EMAIL_KEY, emails)
  }, [emails])

  React.useEffect(() => {
    persistToStorage(SLUG_KEY, slugs)
  }, [slugs])

  React.useEffect(() => {
    persistToStorage(INVITE_KEY, inviteDirectory)
  }, [inviteDirectory])

  React.useEffect(() => {
    if (state.role && builderGate.mode !== 'locked' && lastTrackedGate === 'locked') {
      trackEvent('builder_unlocked', { mode: builderGate.mode, role: state.role })
    }
    if (builderGate.mode !== lastTrackedGate) {
      setLastTrackedGate(builderGate.mode)
    }
  }, [builderGate.mode, lastTrackedGate, state.role])

  const createAccount = React.useCallback<OnboardingContextValue['createAccount']>(async (input) => {
    const { fullName, email, password, consent, authMethod = 'email' } = input
    if (!consent) {
      throw new OnboardingError('missing_consent', 'Você precisa aceitar os termos de uso.')
    }
    const trimmedName = fullName.trim()
    if (!trimmedName) {
      throw new OnboardingError('invalid_name', 'Informe seu nome completo.')
    }
    validateEmail(email.trim().toLowerCase())
    validatePassword(password)
    const normalizedEmail = email.trim().toLowerCase()
    if (emails.includes(normalizedEmail)) {
      throw new OnboardingError('email_in_use', 'Este e-mail já está em uso. Entre para continuar.')
    }

    const account: AccountProfile = {
      id: state.account?.id ?? createId('usr'),
      fullName: trimmedName,
      email: normalizedEmail,
      createdAt: nowIso(),
      consent,
      authProvider: authMethod,
    }
    setEmails((prev) => [...prev, normalizedEmail])
    setState((prev) => ({
      ...prev,
      account,
    }))

    trackEvent('user_signup', { auth_method: authMethod })
    return account
  }, [emails, state.account])

  const selectRole = React.useCallback<OnboardingContextValue['selectRole']>((role) => {
    if (!state.account) {
      throw new OnboardingError('missing_account', 'Crie sua conta antes de escolher um caminho.')
    }
    setState((prev) => {
      const next: OnboardingState = {
        ...prev,
        role,
      }
      if (role === 'employee') {
        next.license = undefined
        next.tenant = undefined
        next.org = undefined
        next.membership = undefined
      } else {
        next.invite = undefined
        if (next.membership && next.membership.role === 'employee') {
          next.membership = undefined
        }
      }
      return next
    })
    trackEvent('role_selected', { role })
  }, [state.account])

  const saveRealtorLicense = React.useCallback<OnboardingContextValue['saveRealtorLicense']>((input) => {
    if (state.role !== 'realtor') {
      throw new OnboardingError('wrong_role', 'Selecione o fluxo de corretor(a) para continuar.')
    }
    const deferred = input.deferred ?? false
    const creciNumber = input.creciNumber?.trim() ?? ''
    const uf = input.uf ? sanitizeUF(input.uf) : ''
    const creciName = input.creciName?.trim() ?? state.account?.fullName ?? ''

    if (!deferred) {
      if (!creciNumber) throw new OnboardingError('missing_creci', 'Informe o número do seu CRECI.')
      if (!uf) throw new OnboardingError('missing_uf', 'Selecione a UF do seu CRECI.')
    }

    const license: LicenseRecord = {
      type: 'realtor',
      creciNumber: deferred ? '' : sanitizeCreci(creciNumber),
      uf: deferred ? '' : uf,
      creciName,
      deferred,
      status: deferred ? 'missing' : 'unverified',
    }

    const org: OrgProfile = state.org && state.org.type === 'realtor'
      ? {
        ...state.org,
        creciNumber: license.creciNumber || undefined,
        creciType: 'individual',
        creciUF: license.uf || undefined,
        creciStatus: license.status,
      }
      : {
        id: state.org?.id ?? createId('org'),
        type: 'realtor',
        legalName: state.account?.fullName ?? 'Novo(a) corretor(a)',
        creciNumber: license.creciNumber || undefined,
        creciType: 'individual',
        creciUF: license.uf || undefined,
        creciStatus: license.status,
        responsibleBrokerCreci: null,
        partnerOrgId: null,
        partnerOrgName: null,
        createdAt: nowIso(),
      }

    const membership: MembershipRecord = {
      id: state.membership?.id ?? createId('mem'),
      userId: state.account?.id ?? createId('usr'),
      orgId: org.id,
      role: 'owner',
      status: 'active',
      createdAt: nowIso(),
    }

    setState((prev) => ({
      ...prev,
      license,
      org,
      membership,
    }))

    trackEvent('license_saved', { role: 'realtor', status: license.status, deferred })
    return license
  }, [state.role, state.org, state.account, state.membership])

  const saveBrokerageLicense = React.useCallback<OnboardingContextValue['saveBrokerageLicense']>((input) => {
    if (state.role !== 'brokerage') {
      throw new OnboardingError('wrong_role', 'Selecione o fluxo de imobiliária para continuar.')
    }

    const legalName = input.legalName.trim()
    const cnpj = sanitizeCNPJ(input.cnpj)
    const creciNumber = sanitizeCreci(input.creciNumber)
    const uf = sanitizeUF(input.uf)
    const responsible = sanitizeCreci(input.responsibleCreci)

    if (!legalName) throw new OnboardingError('missing_name', 'Informe a razão social da imobiliária.')
    if (!validateCNPJ(cnpj)) throw new OnboardingError('invalid_cnpj', 'Informe um CNPJ válido.')
    if (!creciNumber) throw new OnboardingError('missing_creci', 'Informe o CRECI Jurídico.')
    if (!uf) throw new OnboardingError('missing_uf', 'Selecione a UF do CRECI.')
    if (!responsible) throw new OnboardingError('missing_responsible', 'Informe o CRECI do corretor responsável.')

    const license: LicenseRecord = {
      type: 'brokerage',
      legalName,
      cnpj,
      creciNumber,
      uf,
      responsibleCreci: responsible,
      status: 'unverified',
    }

    const org: OrgProfile = {
      id: state.org?.id ?? createId('org'),
      type: 'brokerage',
      legalName,
      cnpj,
      creciNumber,
      creciType: 'juridico',
      creciUF: uf,
      creciStatus: 'unverified',
      responsibleBrokerCreci: responsible,
      partnerOrgId: null,
      partnerOrgName: null,
      createdAt: state.org?.createdAt ?? nowIso(),
    }

    const membership: MembershipRecord = {
      id: state.membership?.id ?? createId('mem'),
      userId: state.account?.id ?? createId('usr'),
      orgId: org.id,
      role: 'owner',
      status: 'active',
      createdAt: nowIso(),
    }

    setState((prev) => ({
      ...prev,
      license,
      org,
      membership,
    }))

    trackEvent('license_saved', { role: 'brokerage', status: license.status })
    return license
  }, [state.role, state.org, state.account, state.membership])

  const saveDeveloperLink = React.useCallback<OnboardingContextValue['saveDeveloperLink']>((input) => {
    if (state.role !== 'developer') {
      throw new OnboardingError('wrong_role', 'Selecione o fluxo de incorporadora para continuar.')
    }

    let license: LicenseRecord
    if (input.linkType === 'creci') {
      const responsible = sanitizeCreci(input.responsibleCreci)
      if (!responsible) {
        throw new OnboardingError('missing_responsible', 'Informe o CRECI do corretor responsável.')
      }
      license = {
        type: 'developer',
        linkType: 'creci',
        responsibleCreci: responsible,
        status: 'pending',
      }
    } else if (input.linkType === 'partner') {
      const partnerName = input.partnerOrgName.trim()
      if (!partnerName) {
        throw new OnboardingError('missing_partner_name', 'Informe o nome da imobiliária parceira.')
      }
      const partnerOrgId = input.partnerOrgId.trim() || createId('org_partner')
      license = {
        type: 'developer',
        linkType: 'partner',
        partnerOrgId,
        partnerOrgName: partnerName,
        status: 'pending',
      }
    } else {
      license = {
        type: 'developer',
        linkType: 'partner',
        partnerOrgId: undefined,
        partnerOrgName: undefined,
        status: 'missing',
      }
    }

    const org: OrgProfile = {
      id: state.org?.id ?? createId('org'),
      type: 'developer',
      legalName: state.org?.legalName ?? (state.account?.fullName ? `Incorporação de ${state.account.fullName}` : 'Nova incorporadora'),
      creciStatus: license.status,
      createdAt: state.org?.createdAt ?? nowIso(),
      creciNumber: state.org?.creciNumber,
      creciType: state.org?.creciType,
      creciUF: state.org?.creciUF,
      responsibleBrokerCreci: license.type === 'developer' ? license.responsibleCreci ?? null : null,
      partnerOrgId: license.type === 'developer' ? license.partnerOrgId ?? null : null,
      partnerOrgName: license.type === 'developer' ? license.partnerOrgName ?? null : null,
    }

    const membership: MembershipRecord = {
      id: state.membership?.id ?? createId('mem'),
      userId: state.account?.id ?? createId('usr'),
      orgId: org.id,
      role: 'owner',
      status: 'active',
      createdAt: nowIso(),
    }

    setState((prev) => ({
      ...prev,
      license,
      org,
      membership,
    }))

    trackEvent('license_saved', { role: 'developer', status: license.status })
    return license
  }, [state.role, state.org, state.account, state.membership])

  const redeemInvite = React.useCallback<OnboardingContextValue['redeemInvite']>(async (code) => {
    if (!state.account) {
      throw new OnboardingError('missing_account', 'Crie sua conta antes de usar um código.')
    }
    if (state.role !== 'employee') {
      throw new OnboardingError('wrong_role', 'Selecione o fluxo de funcionário(a) para continuar.')
    }
    const normalized = normalizeCode(code)
    if (!normalized) {
      throw new OnboardingError('missing_code', 'Informe o código de convite.')
    }
    const directoryIndex = inviteDirectory.findIndex((item) => item.code === normalized)
    if (directoryIndex === -1) {
      throw new OnboardingError('invalid_code', 'Código de convite inválido.')
    }

    const inviteTemplate = inviteDirectory[directoryIndex]
    if (inviteTemplate.category !== 'employee') {
      throw new OnboardingError('invalid_code', 'Este código é reservado para outro fluxo.')
    }
    const now = new Date()
    if (new Date(inviteTemplate.expiresAt) < now) {
      throw new OnboardingError('invite_expired', 'Este convite expirou. Peça um novo ao administrador da imobiliária.')
    }
    if (inviteTemplate.uses >= inviteTemplate.maxUses) {
      throw new OnboardingError('invite_used', 'Este convite já foi utilizado.')
    }
    const accountEmail = state.account.email.toLowerCase()
    if (inviteTemplate.boundEmail && inviteTemplate.boundEmail.toLowerCase() !== accountEmail) {
      throw new OnboardingError('email_mismatch', 'Este código está associado a outro e-mail.')
    }

    const redemption: InviteRedemption = {
      code: inviteTemplate.code,
      category: inviteTemplate.category,
      orgId: inviteTemplate.orgId,
      orgType: inviteTemplate.orgType,
      orgName: inviteTemplate.orgName,
      role: inviteTemplate.role,
      redeemedAt: nowIso(),
      expiresAt: inviteTemplate.expiresAt,
      boundEmail: inviteTemplate.boundEmail ?? null,
    }

    const org: OrgProfile = {
      id: inviteTemplate.orgId,
      type: inviteTemplate.orgType,
      legalName: inviteTemplate.orgName,
      createdAt: nowIso(),
      creciStatus: 'pending',
      responsibleBrokerCreci: null,
      partnerOrgId: null,
      partnerOrgName: null,
    }

    const membership: MembershipRecord = {
      id: state.membership?.id ?? createId('mem'),
      userId: state.account?.id ?? createId('usr'),
      orgId: redemption.orgId,
      role: redemption.role,
      status: 'active',
      createdAt: nowIso(),
    }

    setInviteDirectory((prev) => {
      const copy = [...prev]
      copy[directoryIndex] = {
        ...copy[directoryIndex],
        uses: copy[directoryIndex].uses + 1,
      }
      return copy
    })

    setState((prev) => ({
      ...prev,
      invite: redemption,
      org,
      membership,
    }))

    trackEvent('invite_redeemed', { code: redemption.code, orgId: redemption.orgId, role: redemption.role })
    return redemption
  }, [inviteDirectory, state.account, state.membership, state.role])

  const createTenant = React.useCallback<OnboardingContextValue['createTenant']>((input) => {
    if (!state.role) {
      throw new OnboardingError('missing_role', 'Selecione um caminho de onboarding antes de configurar o site.')
    }
    if (state.role === 'employee' && !state.developerOverride) {
      throw new OnboardingError('not_allowed', 'Funcionários precisam de acesso concedido pela imobiliária.')
    }
    let resolvedOrg = state.org
    let resolvedMembership = state.membership
    let createdOrg: OrgProfile | undefined
    let createdMembership: MembershipRecord | undefined
    if ((!resolvedOrg || !resolvedMembership) && state.developerOverride) {
      const orgType: OrgType =
        state.role === 'brokerage' ? 'brokerage' : state.role === 'developer' ? 'developer' : 'realtor'
      createdOrg = {
        id: createId('org'),
        type: orgType,
        legalName: state.account?.fullName ? `${state.account.fullName} Sandbox` : 'Sandbox Stella',
        createdAt: nowIso(),
        creciStatus: 'pending',
        creciNumber: undefined,
        creciType: undefined,
        creciUF: undefined,
        responsibleBrokerCreci: null,
        partnerOrgId: null,
        partnerOrgName: null,
      }
      createdMembership = {
        id: createId('mem'),
        userId: state.account?.id ?? createId('usr'),
        orgId: createdOrg.id,
        role: state.role === 'employee' ? 'employee' : 'owner',
        status: 'active',
        createdAt: nowIso(),
      }
      resolvedOrg = createdOrg
      resolvedMembership = createdMembership
    }
    if (!resolvedOrg || !resolvedMembership) {
      throw new OnboardingError('missing_org', 'Conclua a etapa de licenciamento antes de criar seu site.')
    }
    const name = input.name.trim()
    const slug = normalizeSlug(input.slug)
    if (!name) throw new OnboardingError('missing_name', 'Informe o nome do site.')
    if (!slugIsValid(slug)) throw new OnboardingError('invalid_slug', 'Slug inválido. Use apenas letras minúsculas, números e hífens.')
    if (slugs.includes(slug)) throw new OnboardingError('slug_in_use', 'Este slug já está em uso. Escolha outro.')

    const tenant: TenantProfile = {
      id: state.tenant?.id ?? createId('tenant'),
      orgId: resolvedOrg.id,
      name,
      slug,
      defaultRoute: `https://${slug}.stella-real-estate.vercel.app/`,
      pathFallback: `/t/${slug}`,
      primaryDomain: state.tenant?.primaryDomain ?? null,
      logoUrl: input.logoUrl ?? null,
      faviconUrl: input.faviconUrl ?? null,
      createdAt: state.tenant?.createdAt ?? nowIso(),
    }

    setSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
    setState((prev) => ({
      ...prev,
      tenant,
      org: createdOrg ?? prev.org,
      membership: createdMembership ?? prev.membership,
    }))

    trackEvent('tenant_created', { tenantId: tenant.id, orgId: tenant.orgId, slug: tenant.slug })
    trackEvent('slug_chosen', { slug: tenant.slug, orgId: tenant.orgId })
    trackEvent('domain_assigned', { tenantId: tenant.id, type: 'dev_default', value: tenant.defaultRoute })
    return tenant
  }, [slugs, state.account, state.developerOverride, state.membership, state.org, state.role, state.tenant])

  const createEmployeeInvite = React.useCallback<OnboardingContextValue['createEmployeeInvite']>((input) => {
    const email = input.email.trim().toLowerCase()
    if (!email) throw new OnboardingError('missing_email', 'Informe o e-mail do colaborador.')
    validateEmail(email)
    const orgName = input.orgName.trim() || 'Equipe Stella'
    const orgType = input.orgType ?? 'brokerage'
    const code = generateInviteCode()
    const invite: InviteTemplate = {
      code,
      category: 'employee',
      orgId: createId('org'),
      orgName,
      orgType,
      role: input.role,
      expiresAt: input.expiresAt ?? addDays(DEFAULT_EMPLOYEE_EXPIRY_DAYS),
      maxUses: input.maxUses ?? 1,
      uses: 0,
      boundEmail: email,
      developerRole: undefined,
      note: input.note ?? null,
    }
    setInviteDirectory((prev) => [invite, ...prev.filter((item) => item.code !== invite.code)])
    trackEvent('invite_created', { code: invite.code, orgId: invite.orgId, role: invite.role })
    return invite
  }, [])

  const createDeveloperCode = React.useCallback<OnboardingContextValue['createDeveloperCode']>((input) => {
    const email = input.email.trim().toLowerCase()
    if (!email) throw new OnboardingError('missing_email', 'Informe o e-mail autorizado para este código.')
    validateEmail(email)
    const targetRole: UserRole = input.role ?? (state.role ?? 'realtor')
    const orgType: OrgType =
      targetRole === 'brokerage' ? 'brokerage' : targetRole === 'developer' ? 'developer' : 'realtor'
    const code = generateInviteCode()
    const label = input.label?.trim() || 'Sandbox Stella'
    const membershipRole: MembershipRole = targetRole === 'employee' ? 'employee' : 'owner'
    const invite: InviteTemplate = {
      code,
      category: 'developer',
      orgId: createId('dev_org'),
      orgName: label,
      orgType,
      role: membershipRole,
      expiresAt: input.expiresAt ?? addDays(DEFAULT_DEVELOPER_EXPIRY_DAYS),
      maxUses: input.maxUses ?? 1,
      uses: 0,
      boundEmail: email,
      developerRole: targetRole,
      note: input.note ?? null,
    }
    setInviteDirectory((prev) => [invite, ...prev.filter((item) => item.code !== invite.code)])
    trackEvent('invite_created', { code: invite.code, orgId: invite.orgId, role: invite.role })
    return invite
  }, [state.role])

  const redeemDeveloperCode = React.useCallback<OnboardingContextValue['redeemDeveloperCode']>(async (code) => {
    if (!state.account) {
      throw new OnboardingError('missing_account', 'Crie sua conta antes de usar um código de desenvolvedor.')
    }
    const normalized = normalizeCode(code)
    if (!normalized) throw new OnboardingError('missing_code', 'Informe o código de desenvolvedor.')
    const directoryIndex = inviteDirectory.findIndex((item) => item.code === normalized)
    if (directoryIndex === -1) {
      throw new OnboardingError('invalid_code', 'Código de desenvolvedor não encontrado.')
    }
    const inviteTemplate = inviteDirectory[directoryIndex]
    if (inviteTemplate.category !== 'developer') {
      throw new OnboardingError('invalid_code', 'Use esta opção apenas para códigos de desenvolvedor.')
    }
    const now = new Date()
    if (new Date(inviteTemplate.expiresAt) < now) {
      throw new OnboardingError('invite_expired', 'Este código expirou. Gere um novo no painel Developer.')
    }
    if (inviteTemplate.uses >= inviteTemplate.maxUses) {
      throw new OnboardingError('invite_used', 'Este código já atingiu o limite de uso.')
    }
    const accountEmail = state.account.email.toLowerCase()
    if (inviteTemplate.boundEmail && inviteTemplate.boundEmail.toLowerCase() !== accountEmail) {
      throw new OnboardingError('email_mismatch', 'Este código está vinculado a outro e-mail.')
    }

    const assignedRole: UserRole = inviteTemplate.developerRole ?? state.role ?? 'realtor'
    const orgType: OrgType =
      assignedRole === 'brokerage' ? 'brokerage' : assignedRole === 'developer' ? 'developer' : 'realtor'
    const org: OrgProfile = state.org ?? {
      id: createId('org'),
      type: orgType,
      legalName: inviteTemplate.orgName || (state.account.fullName ? `${state.account.fullName} Sandbox` : 'Sandbox Stella'),
      createdAt: nowIso(),
      creciStatus: 'pending',
      creciNumber: undefined,
      creciType: undefined,
      creciUF: undefined,
      responsibleBrokerCreci: null,
      partnerOrgId: null,
      partnerOrgName: null,
    }
    const membership: MembershipRecord = state.membership ?? {
      id: createId('mem'),
      userId: state.account.id,
      orgId: org.id,
      role: inviteTemplate.role ?? (assignedRole === 'employee' ? 'employee' : 'owner'),
      status: 'active',
      createdAt: nowIso(),
    }

    let license = state.license
    if (!license && assignedRole !== 'employee') {
      if (assignedRole === 'realtor') {
        license = {
          type: 'realtor',
          creciNumber: '',
          uf: '',
          creciName: state.account.fullName,
          deferred: true,
          status: 'pending',
        }
      } else if (assignedRole === 'brokerage') {
        license = {
          type: 'brokerage',
          legalName: org.legalName,
          cnpj: '',
          creciNumber: '',
          uf: '',
          responsibleCreci: '',
          status: 'pending',
        }
      } else if (assignedRole === 'developer') {
        license = {
          type: 'developer',
          linkType: 'partner',
          partnerOrgId: inviteTemplate.orgId,
          partnerOrgName: inviteTemplate.orgName || 'Parceiro sandbox',
          status: 'pending',
        }
      }
    }

    setInviteDirectory((prev) => {
      const copy = [...prev]
      copy[directoryIndex] = {
        ...copy[directoryIndex],
        uses: copy[directoryIndex].uses + 1,
      }
      return copy
    })

    setState((prev) => ({
      ...prev,
      role: assignedRole,
      developerOverride: true,
      developerCode: inviteTemplate.code,
      org,
      membership,
      license: license ?? prev.license,
    }))

    trackEvent('invite_redeemed', { code: inviteTemplate.code, orgId: org.id, role: membership.role })
    return { code: inviteTemplate.code, role: assignedRole }
  }, [inviteDirectory, state.account, state.license, state.membership, state.org, state.role])

  const resetOnboarding = React.useCallback(() => {
    setState(defaultState)
  }, [])

  const value = React.useMemo<OnboardingContextValue>(() => ({
    state,
    builderGate,
    existingEmails: emails,
    existingSlugs: slugs,
    inviteDirectory,
    createAccount,
    selectRole,
    saveRealtorLicense,
    saveBrokerageLicense,
    saveDeveloperLink,
    redeemInvite,
    createTenant,
    createEmployeeInvite,
    createDeveloperCode,
    redeemDeveloperCode,
    resetOnboarding,
  }), [
    state,
    builderGate,
    emails,
    slugs,
    inviteDirectory,
    createAccount,
    selectRole,
    saveRealtorLicense,
    saveBrokerageLicense,
    saveDeveloperLink,
    redeemInvite,
    createTenant,
    createEmployeeInvite,
    createDeveloperCode,
    redeemDeveloperCode,
    resetOnboarding,
  ])

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboarding = () => {
  const ctx = React.useContext(OnboardingContext)
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return ctx
}
