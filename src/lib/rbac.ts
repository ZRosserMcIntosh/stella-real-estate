export type ScopeLevel = 'own' | 'team' | 'city' | 'global'

export type PermissionKey =
  | 'listings.create'
  | 'listings.edit'
  | 'listings.publish'
  | 'listings.unpublish'
  | 'listings.delete'
  | 'listings.change_price'
  | 'listings.manage_media'
  | 'listings.assign_agent'
  | 'listings.export'
  | 'leads.view'
  | 'leads.view_unmasked_contacts'
  | 'leads.edit'
  | 'leads.assign'
  | 'leads.export'
  | 'clients.view_contact_details_unmasked'
  | 'finance.view_commissions'
  | 'users.manage'
  | 'roles.manage'
  | 'privacy.lgpd_console'
  | 'audit.view_logs'

export type RoleKey =
  | 'super_admin'
  | 'owner'
  | 'admin'
  | 'broker_manager'
  | 'agent_senior'
  | 'agent_junior'
  | 'marketing'
  | 'legal'
  | 'accounting'
  | 'operations'
  | 'read_only'
  | 'external'

export type UserScopes = {
  listings: ScopeLevel
  leads: ScopeLevel
  cities: string[]
}

export type UserRBACContext = {
  userId: string
  roles: RoleKey[]
  explicitAllow?: PermissionKey[]
  explicitDeny?: PermissionKey[]
  scopes: UserScopes
}

export function hasRole(ctx: UserRBACContext, role: RoleKey) {
  return ctx.roles.includes(role)
}

export function can(ctx: UserRBACContext, perm: PermissionKey) {
  if (ctx.explicitDeny?.includes(perm)) return false
  if (ctx.explicitAllow?.includes(perm)) return true
  // Owner/Admin shortcut
  if (hasRole(ctx, 'super_admin') || hasRole(ctx, 'owner') || hasRole(ctx, 'admin')) return true
  // Extend with more nuanced role → permission map in app layer as needed
  return false
}
