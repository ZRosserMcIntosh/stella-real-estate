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
  const [searchQuery, setSearchQuery] = useState('')
  const selectedIds = useMemo(()=> Object.keys(sel).filter(id=>sel[id]), [sel])
  const [showManagerPicker, setShowManagerPicker] = useState(false)
  const [newManagerId, setNewManagerId] = useState<string>('')

  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return people
    const q = searchQuery.toLowerCase()
    return people.filter(p => 
      p.fullName?.toLowerCase().includes(q) ||
      p.roleTitle?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    )
  }, [people, searchQuery])

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

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      case 'inactive': return 'bg-red-500/20 text-red-300 border-red-500/40'
      case 'pending': return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === 'third_party') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      )
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/40 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: View Toggle & Search */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl bg-slate-800/60 p-1">
              <button 
                onClick={()=>setView('cards')} 
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${view==='cards' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Cards
              </button>
              <button 
                onClick={()=>setView('table')} 
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${view==='table' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                </svg>
                Table
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-xl border border-slate-700/60 bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>
          
          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <span className="text-sm text-indigo-400 font-medium">
                {selectedIds.length} selected
              </span>
            )}
            
            <button 
              onClick={handleMessage} 
              disabled={!selectedIds.length} 
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Message
            </button>
            
            <button 
              onClick={handleExport} 
              disabled={!selectedIds.length} 
              className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
            
            <div className="relative">
              <button
                onClick={() => canEdit && setShowManagerPicker((v) => !v)}
                disabled={!selectedIds.length || !canEdit}
                className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Change Manager
              </button>
              {showManagerPicker && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-700/60 bg-slate-800/95 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-700/60">
                    <div className="text-sm font-semibold text-slate-200">Assign manager to {selectedIds.length} selected</div>
                  </div>
                  <div className="p-4">
                    <select 
                      value={newManagerId} 
                      onChange={(e)=>setNewManagerId(e.target.value)} 
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      <option value="">(no manager)</option>
                      {people.map(m => (<option key={m.id} value={m.id}>{m.fullName} — {m.roleTitle}</option>))}
                    </select>
                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button 
                        onClick={()=> setShowManagerPicker(false)} 
                        className="rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/60 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async ()=>{
                          if (!onBulkReassign) return setShowManagerPicker(false)
                          await onBulkReassign(selectedIds, newManagerId || undefined)
                          setShowManagerPicker(false)
                          setSel({})
                        }}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
                      >
                        Apply
                      </button>
                    </div>
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
              className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Disable
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {view==='cards' ? (
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPeople.map(p => (
            <label 
              key={p.id} 
              className={`group relative flex cursor-pointer flex-col rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                sel[p.id] 
                  ? 'border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' 
                  : 'border-slate-700/60 bg-slate-800/60 hover:border-slate-600/60 hover:bg-slate-800/80'
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4">
                <input 
                  type="checkbox" 
                  className="h-5 w-5 rounded-lg border-2 border-slate-600 bg-slate-800/60 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 transition-all cursor-pointer" 
                  checked={!!sel[p.id]} 
                  onChange={(e)=> setSel(prev=> ({...prev, [p.id]: e.target.checked}))} 
                />
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Avatar & Name */}
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                    p.type === 'third_party' 
                      ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 text-purple-300' 
                      : 'bg-gradient-to-br from-indigo-600/30 to-blue-600/30 text-indigo-300'
                  }`}>
                    <span className="text-xl font-bold">
                      {p.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="truncate text-lg font-bold text-slate-100">{p.fullName}</div>
                    <div className="truncate text-sm text-slate-400">{p.roleTitle}</div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                    <span className="truncate">{p.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="truncate">{p.city}</span>
                  </div>
                </div>
                
                {/* Footer: Status & Type */}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs ${p.type === 'third_party' ? 'text-purple-400' : 'text-indigo-400'}`}>
                    {getTypeIcon(p.type)}
                    {p.type === 'third_party' ? 'Contractor' : 'Employee'}
                  </span>
                </div>
                
                {/* Vendor */}
                {p.vendorName && (
                  <div className="mt-3 rounded-lg bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                    <span className="text-slate-500">Vendor:</span> {p.vendorName}
                  </div>
                )}
                
                {/* Tags */}
                {p.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-slate-700/60 px-2 py-1 text-[10px] font-medium text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </label>
          ))}
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/40">
                <th className="px-6 py-4 text-left">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded-lg border-2 border-slate-600 bg-slate-800/60 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 transition-all cursor-pointer"
                    onChange={(e)=>{
                      const v = e.target.checked; const next: Record<string,boolean> = {}; filteredPeople.forEach(p=> next[p.id]=v); setSel(next)
                    }} 
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Dept</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">City</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredPeople.map(p => (
                <tr 
                  key={p.id} 
                  className={`transition-colors ${sel[p.id] ? 'bg-indigo-500/10' : 'hover:bg-slate-800/40'}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded-lg border-2 border-slate-600 bg-slate-800/60 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 transition-all cursor-pointer"
                      checked={!!sel[p.id]} 
                      onChange={(e)=> setSel(prev=> ({...prev, [p.id]: e.target.checked}))} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        p.type === 'third_party' 
                          ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 text-purple-300' 
                          : 'bg-gradient-to-br from-indigo-600/30 to-blue-600/30 text-indigo-300'
                      }`}>
                        <span className="text-sm font-bold">
                          {p.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-slate-100">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{p.roleTitle}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{p.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{p.city}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-sm ${p.type === 'third_party' ? 'text-purple-400' : 'text-indigo-400'}`}>
                      {getTypeIcon(p.type)}
                      {p.type === 'third_party' ? 'Contractor' : 'Employee'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Empty State */}
      {filteredPeople.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg font-medium mb-2">No team members found</p>
          <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
