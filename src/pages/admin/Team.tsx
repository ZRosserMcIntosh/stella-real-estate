import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { OrgChart } from './team/OrgChart'
import { Directory } from './team/Directory'
import { RolesPermissions } from './team/RolesPermissions'
import { SeatsHeadcount } from './team/SeatsHeadcount'
import { DocsCompliance } from './team/DocsCompliance'
import { EquipmentAccess } from './team/EquipmentAccess'
import { InviteCodes } from './team/InviteCodes'
import { AddPersonModal } from './team/AddPersonModal'
import type { Person, PersonStatus, Department, EmploymentType } from './team/types'
import { supabase } from '../../lib/supabaseClient'

type TabKey = 'directory' | 'invitations' | 'roles' | 'seats' | 'docs' | 'equipment'

const roleTitleMap: Record<string, string> = {
  owner: 'Owner',
  admin: 'Administrator',
  exec: 'Executive',
  manager: 'Manager',
  agent: 'Broker / Agent',
  ops: 'Operations',
  marketing: 'Marketing',
  legal: 'Legal Counsel',
  accounting: 'Accounting',
  contractor: 'Contractor',
  viewer: 'Contributor',
}

const capitalizeWords = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

function roleTitleFromKey(raw?: string | null): string {
  if (!raw) return 'Team Member'
  const key = raw.toLowerCase()
  return roleTitleMap[key] ?? capitalizeWords(raw)
}

function normalizeStatus(status?: string | null): PersonStatus {
  const normalized = (status || '').toLowerCase()
  switch (normalized) {
    case 'active':
    case 'inactive':
    case 'onboarding':
    case 'offboarding':
      return normalized as PersonStatus
    default:
      return 'active'
  }
}

function employmentTypeFrom(role?: string | null, employment?: string | null): EmploymentType {
  const employmentKey = (employment || '').toLowerCase()
  if (employmentKey === 'intern') return 'intern'
  if (employmentKey === 'contractor' || employmentKey === 'pj') return 'third_party'
  const roleKey = (role || '').toLowerCase()
  if (['owner', 'admin', 'exec'].includes(roleKey)) return 'executive'
  if (roleKey === 'contractor') return 'third_party'
  return 'employee'
}

function mapRowToPerson(row: any): Person {
  return {
    id: row.id,
    fullName: row.full_name ?? '(sem nome)',
    socialName: row.social_name ?? undefined,
    preferredName: row.social_name ?? undefined,
    email: row.email,
    phones: Array.isArray(row.phones) ? row.phones.filter(Boolean) : undefined,
    roleTitle: roleTitleFromKey(row.role),
    department: row.department || '—',
    city: row.city || '—',
    status: normalizeStatus(row.status),
    managerId: row.manager_id || undefined,
    type: employmentTypeFrom(row.role, row.employment_type),
    vendorName: row.vendor_name || undefined,
    tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : undefined,
  }
}

export default function Team() {
  const supabaseConfigured = Boolean(
    (import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
  )
  const [tab, setTab] = useState<TabKey>('directory')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<PersonStatus | 'all'>('all')
  const [dept, setDept] = useState<Department | 'all'>('all')
  const [city, setCity] = useState<string | 'all'>('all')
  const [role, setRole] = useState<string | 'all'>('all')
  const [type, setType] = useState<EmploymentType | 'all'>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState<boolean>(supabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const [canEditOrg, setCanEditOrg] = useState<boolean>(false)

  const loadTeam = useCallback(async () => {
    if (!supabaseConfigured) {
      setLoading(false)
      setError(
        'Supabase environment variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load the live team directory.',
      )
      return
    }

    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('team_members')
      .select(
        'id, full_name, social_name, email, phones, role, department, city, status, manager_id, employment_type, vendor_name, tags',
      )
      .order('full_name', { ascending: true })

    if (fetchError) {
      setPeople([])
      setError(fetchError.message ?? 'Unable to load team members.')
    } else {
      setPeople((data ?? []).map(mapRowToPerson))
    }
    setLoading(false)
  }, [supabaseConfigured])

  useEffect(() => {
    void loadTeam()
  }, [loadTeam])

  useEffect(() => {
    // Determine org-edit capability
    // 1) If metadata carries 'super_admin', allow
    // 2) Otherwise, query team_members role for this user and allow if owner/admin/exec
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const session = data.session
      if (!session) {
        setCanEditOrg(false)
        return
      }
      const roles = new Set<string>()
      const collect = (input: unknown) => {
        if (typeof input === 'string') roles.add(input.toLowerCase())
        else if (Array.isArray(input)) input.forEach(collect)
      }
      const appMeta: any = session.user.app_metadata ?? {}
      const userMeta: any = session.user.user_metadata ?? {}
      collect(appMeta.role)
      collect(appMeta.roles)
      collect(userMeta.role)
      collect(userMeta.roles)

      if (roles.has('super_admin')) {
        setCanEditOrg(true)
        return
      }

      if (supabaseConfigured) {
        const { data: me } = await supabase
          .from('team_members')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle()
        const roleKey = (me?.role || '').toLowerCase()
        setCanEditOrg(['owner', 'admin', 'exec'].includes(roleKey))
      } else {
        setCanEditOrg(false)
      }
    })
    return () => {
      active = false
    }
  }, [supabaseConfigured])

  const handleReassign = useCallback(
    async (id: string, newManagerId?: string) => {
      if (!canEditOrg || !supabaseConfigured) return

      const snapshot = people
      setPeople((prev) =>
        prev.map((p) => (p.id === id ? { ...p, managerId: newManagerId || undefined } : p)),
      )

      const { error: updateError } = await supabase
        .from('team_members')
        .update({ manager_id: newManagerId ?? null })
        .eq('id', id)

      if (updateError) {
        setError(
          updateError.message
            ? `Failed to update manager: ${updateError.message}`
            : 'Failed to update manager.',
        )
        setPeople(snapshot)
      } else {
        void loadTeam()
      }
    },
    [canEditOrg, supabaseConfigured, people, loadTeam],
  )

  const handleBulkReassign = useCallback(
    async (ids: string[], newManagerId?: string) => {
      if (!ids.length) return
      if (!canEditOrg) return
      const prev = people
      setPeople((ps) => ps.map((p) => (ids.includes(p.id) ? { ...p, managerId: newManagerId || undefined } : p)))
      if (!supabaseConfigured) return
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ manager_id: newManagerId ?? null })
        .in('id', ids)
      if (updateError) {
        setPeople(prev)
        setError(updateError.message || 'Failed to change manager.')
      } else {
        void loadTeam()
      }
    },
    [canEditOrg, supabaseConfigured, people, loadTeam],
  )

  const handleDisableAccess = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return
      if (!canEditOrg) return
      const prev = people
      setPeople((ps) => ps.map((p) => (ids.includes(p.id) ? { ...p, status: 'inactive' as PersonStatus } : p)))
      if (!supabaseConfigured) return
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ status: 'inactive' })
        .in('id', ids)
      if (updateError) {
        setPeople(prev)
        setError(updateError.message || 'Failed to disable access.')
      } else {
        void loadTeam()
      }
    },
    [canEditOrg, supabaseConfigured, people, loadTeam],
  )

  const filtered: Person[] = useMemo(() => {
    const qlc = q.trim().toLowerCase()
    return people.filter((p) => {
      const matchesQ =
        !qlc ||
        p.fullName.toLowerCase().includes(qlc) ||
        (p.preferredName?.toLowerCase().includes(qlc) ?? false) ||
        p.email.toLowerCase().includes(qlc) ||
        (p.vendorName?.toLowerCase().includes(qlc) ?? false) ||
        p.roleTitle.toLowerCase().includes(qlc) ||
        p.department.toLowerCase().includes(qlc) ||
        p.city.toLowerCase().includes(qlc) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(qlc))

      const matchesStatus = status === 'all' || p.status === status
      const matchesDept = dept === 'all' || p.department === dept
      const matchesCity = city === 'all' || p.city === city
      const matchesRole = role === 'all' || p.roleTitle === role
      const matchesType = type === 'all' || p.type === type
      return matchesQ && matchesStatus && matchesDept && matchesCity && matchesRole && matchesType
    })
  }, [q, status, dept, city, role, type, people])

  const cities = useMemo(
    () => Array.from(new Set(people.map((p) => p.city).filter(Boolean))).sort(),
    [people],
  )
  const depts = useMemo(
    () => Array.from(new Set(people.map((p) => p.department).filter(Boolean))).sort(),
    [people],
  )
  const roles = useMemo(
    () => Array.from(new Set(people.map((p) => p.roleTitle).filter(Boolean))).sort(),
    [people],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Team Management
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Manage your organization, invite members, and configure permissions
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAdd(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add Person
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
            
            <button className="px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mt-4 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-sm text-indigo-300 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading team members...
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        
        {!supabaseConfigured && !error && (
          <div className="mt-4 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-amber-300">
              Configure Supabase credentials to see live team members.
            </p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 p-6 bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people, roles, departments..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Departments</option>
            {depts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="onboarding">Onboarding</option>
            <option value="offboarding">Offboarding</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="employee">Employee</option>
            <option value="executive">Executive</option>
            <option value="third_party">Third-Party</option>
            <option value="intern">Intern</option>
          </select>
        </div>
      </div>

      {/* Org Chart */}
      <div className="mb-6">
        <OrgChart people={filtered} onReassign={handleReassign} canEdit={canEditOrg} />
        {!canEditOrg && supabaseConfigured && (
          <p className="mt-3 text-xs text-slate-500 text-center">
            Sign in as a super admin to change reporting lines.
          </p>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
        <nav className="flex" aria-label="Tabs">
          {(
            [
              ['directory', 'Directory', 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'],
              ['invitations', 'Invitations', 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'],
              ['roles', 'Roles & Permissions', 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'],
              ['seats', 'Seats & Headcount', 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'],
              ['docs', 'Docs & Compliance', 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'],
              ['equipment', 'Equipment & Access', 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25'],
            ] as [TabKey, string, string][]
          ).map(([key, label, iconPath]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                tab === key
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30 border-b-2 border-transparent'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
              </svg>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/40 rounded-2xl shadow-xl p-6">
        {tab === 'directory' && (
          <Directory
            people={filtered}
            onPeopleChange={setPeople}
            canEdit={canEditOrg}
            onBulkReassign={handleBulkReassign}
            onDisableAccess={handleDisableAccess}
          />
        )}
        {tab === 'invitations' && <InviteCodes />}
        {tab === 'roles' && <RolesPermissions />}
        {tab === 'seats' && <SeatsHeadcount />}
        {tab === 'docs' && <DocsCompliance />}
        {tab === 'equipment' && <EquipmentAccess />}
      </div>

      <AddPersonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(person) => {
          if (person) {
            setPeople((prev) => [...prev, person])
          } else {
            void loadTeam()
          }
          setShowAdd(false)
        }}
        existingPeople={people}
      />
    </div>
  )
}
