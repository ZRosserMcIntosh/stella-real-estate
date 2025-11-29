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
    <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/40 px-6 py-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <label className="text-slate-300 font-medium">View</label>
            <select 
              value={view} 
              onChange={e=>setView(e.target.value as OrgChartView)} 
              className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
            >
              <option value="tree">Tree View</option>
              <option value="matrix">Matrix View</option>
              <option value="geo">Geographic View</option>
              <option value="vendor">Vendor View</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <label className="text-slate-300 font-medium">Zoom</label>
            <input 
              aria-label="Zoom" 
              type="range" 
              min={60} 
              max={160} 
              step={10} 
              value={zoom} 
              onChange={e=>setZoom(Number(e.target.value))} 
              className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-sm text-slate-400 w-12">{zoom}%</span>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300">
              <span className="font-semibold text-emerald-400">{metrics.employees}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="font-semibold text-amber-400">{metrics.contractors}</span>
              <span className="text-slate-500 ml-1">Headcount</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-slate-300">
              <span className="font-semibold text-indigo-400">{metrics.avgSpan}</span>
              <span className="text-slate-500 ml-1">Avg Span</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="overflow-auto p-6">
        {view !== 'tree' ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg font-medium mb-2">{view.charAt(0).toUpperCase() + view.slice(1)} View</p>
            <p className="text-slate-500 text-sm">Coming soon...</p>
          </div>
        ) : (
          <div className="min-w-[720px]" style={{ transform: `scale(${zoom/100})`, transformOrigin: '0 0' }}>
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Organization Structure
              </h2>
              <p className="mt-2 text-slate-400 text-sm">Hierarchical team overview</p>
            </div>
            <ul className="org-tree-dark">
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
      
      {/* Custom Styles for Tree */}
      <style>{`
        .org-tree-dark {
          position: relative;
          text-align: center;
          padding-top: 20px;
        }
        
        .org-tree-dark ul {
          position: relative;
          padding: 40px 0 0;
          display: flex;
          justify-content: center;
          gap: 40px;
        }
        
        .org-tree-dark li {
          position: relative;
          padding: 40px 5px 0;
          display: inline-block;
        }
        
        .org-tree-dark li::before,
        .org-tree-dark li::after {
          content: '';
          position: absolute;
          top: 0;
          right: 50%;
          width: 50%;
          height: 40px;
          border-top: 2px solid rgba(99, 102, 241, 0.3);
        }
        
        .org-tree-dark li::after {
          right: auto;
          left: 50%;
          border-left: 2px solid rgba(99, 102, 241, 0.3);
        }
        
        .org-tree-dark li:only-child::before,
        .org-tree-dark li:only-child::after {
          display: none;
        }
        
        .org-tree-dark li:only-child {
          padding-top: 0;
        }
        
        .org-tree-dark li:first-child::before,
        .org-tree-dark li:last-child::after {
          border: 0;
        }
        
        .org-tree-dark li:last-child::before {
          border-right: 2px solid rgba(99, 102, 241, 0.3);
          border-radius: 0 8px 0 0;
        }
        
        .org-tree-dark li:first-child::after {
          border-radius: 8px 0 0 0;
        }
        
        .org-tree-dark ul ul::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          width: 0;
          height: 40px;
          border-left: 2px solid rgba(99, 102, 241, 0.3);
        }
      `}</style>
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
  
  // Define colors based on role
  const getRoleColors = (lbl: string) => {
    switch(lbl) {
      case 'CEO':
        return 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/60 text-purple-300'
      case 'Director':
        return 'bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-indigo-500/60 text-indigo-300'
      case 'Manager':
        return 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-emerald-500/60 text-emerald-300'
      case 'Intern':
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/60 text-amber-300'
      default:
        return 'bg-gradient-to-r from-slate-600/20 to-slate-700/20 border-slate-500/60 text-slate-300'
    }
  }
  
  const roleColors = getRoleColors(label)
  
  return (
    <div className="w-[240px] rounded-xl border-2 border-slate-700/60 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
      <div className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${roleColors}`}>
        {label}
      </div>
      <div className="px-4 py-4">
        <div className="text-[15px] font-bold text-slate-100">{node.fullName}</div>
        <div className="mt-1 text-[12px] text-slate-400">{node.roleTitle}</div>
      </div>
      <div className="border-t border-slate-700/60 bg-slate-900/40 p-3 text-[10px] text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span>{node.department}</span>
          <span className="text-slate-600">•</span>
          <span>{node.city}</span>
        </div>
        <div>
          <select
            aria-label="Assign Manager"
            className="w-full rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="mt-2 text-[10px] text-slate-500 text-center">Super admin access required to edit.</p>
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
