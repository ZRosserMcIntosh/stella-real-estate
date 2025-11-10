import React, { useState } from 'react'
import { ViewType } from '../types'

const colorPresets = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#f59e0b']
const iconPresets = ['📋', '🚀', '🎨', '🏗️', '🧭', '📈']

export interface CreateProjectPayload {
  name: string
  description: string
  color: string
  icon: string
  defaultView: ViewType
}

interface CreateProjectModalProps {
  open: boolean
  workspaceName?: string
  onCreate: (payload: CreateProjectPayload) => Promise<void> | void
  onClose: () => void
}

export function CreateProjectModal({ open, workspaceName, onCreate, onClose }: CreateProjectModalProps) {
  const [form, setForm] = useState<CreateProjectPayload>({
    name: '',
    description: '',
    color: colorPresets[0],
    icon: iconPresets[0],
    defaultView: 'board',
  })
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      await onCreate(form)
      setForm({ ...form, name: '', description: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Create Project</h2>
            {workspaceName && <p className="text-xs text-slate-400">Workspace: {workspaceName}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Project name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="e.g. Product Launch"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              placeholder="Share context for your team"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(color => (
                  <button
                    type="button"
                    key={color}
                    className={`h-10 w-10 rounded-full border-2 transition-all ${
                      form.color === color ? 'border-white ring-2 ring-pink-500/50' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setForm({ ...form, color })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconPresets.map(icon => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => setForm({ ...form, icon })}
                    className={`h-10 w-10 rounded-xl border border-slate-700/60 bg-slate-800/60 text-xl ${
                      form.icon === icon ? 'ring-2 ring-pink-500/60 text-white' : 'text-slate-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-200">Default view</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {(['list', 'board', 'timeline', 'calendar'] as ViewType[]).map(view => (
                <button
                  type="button"
                  key={view}
                  onClick={() => setForm({ ...form, defaultView: view })}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize ${
                    form.defaultView === view
                      ? 'border-pink-500 bg-pink-500/20 text-pink-200'
                      : 'border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.name.trim() || submitting}
              className="rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 hover:from-pink-500 hover:to-pink-400 disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
