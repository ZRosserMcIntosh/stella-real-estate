import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { OrgChart } from './team/OrgChart'
import { Directory } from './team/Directory'
import { RolesPermissions } from './team/RolesPermissions'
import { SeatsHeadcount } from './team/SeatsHeadcount'
import { DocsCompliance } from './team/DocsCompliance'
import { EquipmentAccess } from './team/EquipmentAccess'
import { AddPersonModal } from './team/AddPersonModal'
import type { Person, PersonStatus, Department, EmploymentType } from './team/types'
import { supabase } from '../../lib/supabaseClient'

type TabKey = 'directory' | 'roles' | 'seats' | 'docs' | 'equipment'

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
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-slate-600">Org chart, directory, roles & permissions.</p>
          {loading && <p className="mt-1 text-sm text-slate-500">Loading team…</p>}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          {!supabaseConfigured && !error && (
            <p className="mt-1 text-xs text-slate-500">
              Configure Supabase credentials to see live team members.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search people / org"
              className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            + Add Person
          </button>
          <div className="relative inline-block">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50">
              Export
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as any)}
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="all">Department</option>
              {depts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="all">City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="max-w-[12rem] rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="all">Role</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="onboarding">Onboarding</option>
              <option value="offboarding">Offboarding</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
            >
              <option value="all">Type</option>
              <option value="employee">Employee</option>
              <option value="executive">Executive</option>
              <option value="third_party">Third-Party</option>
              <option value="intern">Intern</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <OrgChart people={filtered} onReassign={handleReassign} canEdit={canEditOrg} />
        {!canEditOrg && supabaseConfigured && (
          <p className="mt-2 text-xs text-slate-500">
            Sign in as a super admin to change reporting lines.
          </p>
        )}
      </div>

      <div className="mt-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6 text-sm" aria-label="Tabs">
          {(
            [
              ['directory', 'Directory'],
              ['roles', 'Roles & Permissions'],
              ['seats', 'Seats & Headcount'],
              ['docs', 'Docs & Compliance'],
              ['equipment', 'Equipment & Access'],
            ] as [TabKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                'border-b-2 px-1 pb-3 ' +
                (tab === key ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-600 hover:text-slate-800')
              }
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {tab === 'directory' && (
          <Directory
            people={filtered}
            onPeopleChange={setPeople}
            canEdit={canEditOrg}
            onBulkReassign={handleBulkReassign}
            onDisableAccess={handleDisableAccess}
          />
        )}
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
