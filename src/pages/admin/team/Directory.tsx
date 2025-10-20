import React, { useMemo, useState } from 'react'
import type { Person } from './types'

type Props = {
  people: Person[]
  onPeopleChange: (p: Person[]) => void
  canEdit?: boolean
  onBulkReassign?: (ids: string[], newManagerId?: string) => void | Promise<void>
  onDisableAccess?: (ids: string[]) => void | Promise<void>
}

export function Directory({ people, onPeopleChange, canEdit = false, onBulkReassign, onDisableAccess }: Props) {
  const [view, setView] = useState<'cards'|'table'>('cards')
  const [sel, setSel] = useState<Record<string, boolean>>({})
  const selectedIds = useMemo(()=> Object.keys(sel).filter(id=>sel[id]), [sel])
  const [showManagerPicker, setShowManagerPicker] = useState(false)
  const [newManagerId, setNewManagerId] = useState<string>('')

  const selectedPeople = useMemo(() => {
    const setIds = new Set(selectedIds)
    return people.filter(p => setIds.has(p.id))
  }, [selectedIds, people])

  const handleMessage = () => {
    if (!selectedPeople.length) return
    const emails = selectedPeople.map(p => p.email).filter(Boolean)
    if (!emails.length) return
    const link = `mailto:${encodeURIComponent(emails.join(','))}`
    window.location.href = link
  }

  const handleExport = () => {
    if (!selectedPeople.length) return
    const headers = ['id','fullName','email','roleTitle','department','city','type','status']
    const rows = selectedPeople.map(p => [p.id, p.fullName, p.email, p.roleTitle, p.department, p.city, p.type, p.status])
    const csv = [headers, ...rows]
      .map(r =>
        r
          .map(String)
          .map(v => '"' + v.replace(/"/g, '""') + '"')
          .join(','),
      )
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team_export_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=>setView('cards')} className={'rounded px-2 py-1 ' + (view==='cards'?'bg-slate-900 text-white':'border border-slate-300 bg-white')}>Cards</button>
          <button onClick={()=>setView('table')} className={'rounded px-2 py-1 ' + (view==='table'?'bg-slate-900 text-white':'border border-slate-300 bg-white')}>Table</button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={handleMessage} disabled={!selectedIds.length} className="rounded border border-slate-300 bg-white px-2 py-1 disabled:opacity-50">Message</button>
          <button onClick={handleExport} disabled={!selectedIds.length} className="rounded border border-slate-300 bg-white px-2 py-1 disabled:opacity-50">Export</button>
          <div className="relative inline-block">
            <button
              onClick={() => canEdit && setShowManagerPicker((v) => !v)}
              disabled={!selectedIds.length || !canEdit}
              className="rounded border border-slate-300 bg-white px-2 py-1 disabled:opacity-50"
            >
              Change Manager
            </button>
            {showManagerPicker && (
              <div className="absolute right-0 z-10 mt-1 w-64 rounded-md border border-slate-200 bg-white p-2 shadow-lg">
                <div className="mb-2 text-xs font-medium text-slate-600">Assign manager to {selectedIds.length} selected</div>
                <select value={newManagerId} onChange={(e)=>setNewManagerId(e.target.value)} className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm">
                  <option value="">(no manager)</option>
                  {people.map(m => (<option key={m.id} value={m.id}>{m.fullName} — {m.roleTitle}</option>))}
                </select>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button onClick={()=> setShowManagerPicker(false)} className="rounded border border-slate-300 bg-white px-2 py-1 text-sm">Cancel</button>
                  <button
                    onClick={async ()=>{
                      if (!onBulkReassign) return setShowManagerPicker(false)
                      await onBulkReassign(selectedIds, newManagerId || undefined)
                      setShowManagerPicker(false)
                      setSel({})
                    }}
                    className="rounded bg-sky-600 px-2 py-1 text-sm text-white"
                  >Apply</button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={async ()=>{
              if (!selectedIds.length) return
              if (!canEdit) return
              if (!onDisableAccess) return
              if (!confirm('Disable access for selected people?')) return
              await onDisableAccess(selectedIds)
              setSel({})
            }}
            disabled={!selectedIds.length || !canEdit}
            className="rounded border border-slate-300 bg-white px-2 py-1 disabled:opacity-50"
          >
            Disable Access
          </button>
        </div>
      </div>
      {view==='cards' ? (
        <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {people.map(p => (
            <label key={p.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50">
              <input type="checkbox" className="mt-1" checked={!!sel[p.id]} onChange={(e)=> setSel(prev=> ({...prev, [p.id]: e.target.checked}))} />
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-900">{p.fullName} <span className="text-slate-500">— {p.roleTitle}</span></div>
                <div className="text-xs text-slate-600">{p.department} • {p.city} • {p.status}</div>
                {p.vendorName && <div className="mt-1 text-xs text-slate-500">Vendor: {p.vendorName}</div>}
                {p.tags?.length ? <div className="mt-1 flex flex-wrap gap-1">{p.tags.map((tag) => (
                  <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">{tag}</span>
                ))}</div> : null}
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2"><input type="checkbox" onChange={(e)=>{
                  const v = e.target.checked; const next: Record<string,boolean> = {}; people.forEach(p=> next[p.id]=v); setSel(next)
                }} /></th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Dept</th>
                <th className="px-3 py-2">City</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {people.map(p => (
                <tr key={p.id} className="border-t border-slate-200">
                  <td className="px-3 py-2"><input type="checkbox" checked={!!sel[p.id]} onChange={(e)=> setSel(prev=> ({...prev, [p.id]: e.target.checked}))} /></td>
                  <td className="px-3 py-2">{p.fullName}</td>
                  <td className="px-3 py-2">{p.roleTitle}</td>
                  <td className="px-3 py-2">{p.department}</td>
                  <td className="px-3 py-2">{p.city}</td>
                  <td className="px-3 py-2">{p.type}</td>
                  <td className="px-3 py-2">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
