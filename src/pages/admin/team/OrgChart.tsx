import React, { useMemo, useState } from 'react'
import type { Person, OrgChartView } from './types'

export function OrgChart({
  people,
  onReassign,
  canEdit,
}: {
  people: Person[]
  onReassign: (id: string, newManagerId?: string) => void
  canEdit: boolean
}) {
  const [view, setView] = useState<OrgChartView>('tree')
  const [zoom, setZoom] = useState(100)

  const map = useMemo(() => {
    const byId = new Map<string, Person>()
    const children = new Map<string, Person[]>()
    people.forEach(p => {
      byId.set(p.id, p)
      if (p.managerId) {
        if (!children.has(p.managerId)) children.set(p.managerId, [])
        children.get(p.managerId)!.push(p)
      }
    })
    const roots = people.filter(p => !p.managerId)
    return { byId, children, roots }
  }, [people])

  const metrics = useMemo(() => {
    const headcount = people.length
    const contractors = people.filter(p => p.type === 'third_party').length
    const employees = headcount - contractors
    const managers = new Set(people.filter(p => (map.children.get(p.id)?.length || 0) > 0).map(p => p.id))
    const avgSpan = managers.size ? (Array.from(managers).reduce((acc, id) => acc + (map.children.get(id)?.length || 0), 0) / managers.size) : 0
    return { headcount, employees, contractors, openSeats: 0, avgSpan: Number(avgSpan.toFixed(1)), compliantPct: 0 }
  }, [people, map.children])

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <label className="text-slate-600">View</label>
          <select value={view} onChange={e=>setView(e.target.value as OrgChartView)} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm">
            <option value="tree">Tree</option>
            <option value="matrix">Matrix</option>
            <option value="geo">Geographic</option>
            <option value="vendor">Vendor</option>
          </select>
          <label className="ml-3 text-slate-600">Zoom</label>
          <input aria-label="Zoom" type="range" min={60} max={160} step={10} value={zoom} onChange={e=>setZoom(Number(e.target.value))} />
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>Headcount: {metrics.employees}/{metrics.contractors}</span>
          <span>Open Seats: {metrics.openSeats}</span>
          <span>Avg Span: {metrics.avgSpan}</span>
          <span>% Compliant: {metrics.compliantPct}%</span>
        </div>
      </div>
      <div className="overflow-auto p-4">
        {view !== 'tree' ? (
          <div className="text-slate-500 italic">Placeholder: {view} view coming soon.</div>
        ) : (
          <div className="min-w-[720px]" style={{ transform: `scale(${zoom/100})`, transformOrigin: '0 0' }}>
            <div className="mb-4 text-center text-2xl font-bold uppercase tracking-wide text-slate-800">Organizational Chart</div>
            <ul className="org-tree">
              {map.roots.map(root => (
                <li key={root.id}>
                  <NodeCard node={root} onReassign={onReassign} options={people} canEdit={canEdit} />
                  {renderChildren(root.id, map.children, onReassign, people, canEdit)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function renderChildren(
  id: string,
  children: Map<string, Person[]>,
  onReassign: (id: string, newManagerId?: string) => void,
  options: Person[],
  canEdit: boolean,
) {
  const kids = children.get(id) || []
  if (!kids.length) return null
  return (
    <ul>
      {kids.map(k => (
        <li key={k.id}>
          <NodeCard node={k} onReassign={onReassign} options={options} canEdit={canEdit} />
          {renderChildren(k.id, children, onReassign, options, canEdit)}
        </li>
      ))}
    </ul>
  )
}

function NodeCard({
  node,
  onReassign,
  options,
  canEdit,
}: {
  node: Person
  onReassign: (id: string, newManagerId?: string) => void
  options: Person[]
  canEdit: boolean
}) {
  const label = roleLabel(node.roleTitle)
  return (
    <div className="w-[240px] rounded-md border border-slate-300 bg-white text-center shadow-sm">
      <div className="rounded-t-md bg-indigo-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">{label}</div>
      <div className="px-3 py-3">
        <div className="text-[15px] font-medium text-slate-900">{node.fullName}</div>
        <div className="mt-0.5 text-[12px] text-slate-600">{node.roleTitle}</div>
      </div>
      <div className="border-t border-slate-200 p-2 text-[10px] text-slate-600">
        <div className="flex items-center justify-center gap-2">
          <span>{node.department}</span>
          <span>•</span>
          <span>{node.city}</span>
        </div>
        <div className="mt-2">
          <select
            aria-label="Assign Manager"
            className="w-full rounded border border-slate-300 bg-white px-2 py-1"
            value={node.managerId || ''}
            onChange={(e) => onReassign(node.id, e.target.value || undefined)}
            disabled={!canEdit}
          >
            <option value="">(no manager)</option>
            {options.filter(o => o.id !== node.id).map(o => (
              <option key={o.id} value={o.id}>{o.fullName} — {o.roleTitle}</option>
            ))}
          </select>
          {!canEdit && (
            <p className="mt-1 text-[10px] text-slate-400">Super admin access required to edit.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function roleLabel(roleTitle: string) {
  const t = roleTitle.toLowerCase()
  if (t.includes('ceo')) return 'CEO'
  if (t.includes('director')) return 'Director'
  if (t.includes('manager')) return 'Manager'
  if (t.includes('intern')) return 'Intern'
  if (t.includes('worker') || t.includes('agent') || t.includes('coordinator')) return 'Worker'
  return roleTitle.toUpperCase()
}
