import React, { useEffect, useMemo, useState } from 'react'
import type { Portfolio, Project } from '../types'

const colorPalette = ['#0ea5e9', '#a855f7', '#ec4899', '#f97316', '#14b8a6', '#22c55e', '#f59e0b']

type FolderInput = {
  name: string
  description: string
  color: string
  projectIds: string[]
}

interface ProjectFoldersDrawerProps {
  open: boolean
  folders: Portfolio[]
  projects: Project[]
  onClose: () => void
  onCreateFolder: (input: FolderInput) => Promise<void>
  onUpdateFolder: (id: string, input: FolderInput) => Promise<void>
  onDeleteFolder: (id: string) => Promise<void>
}

export function ProjectFoldersDrawer({
  open,
  folders,
  projects,
  onClose,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}: ProjectFoldersDrawerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<FolderInput>({
    name: '',
    description: '',
    color: colorPalette[1],
    projectIds: [],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setEditingId(null)
      setDraft({ name: '', description: '', color: colorPalette[1], projectIds: [] })
    }
  }, [open])

  useEffect(() => {
    if (!editingId) return
    const folder = folders.find(f => f.id === editingId)
    if (folder) {
      setDraft({
        name: folder.name,
        description: folder.description,
        color: folder.color,
        projectIds: folder.projectIds,
      })
    }
  }, [editingId, folders])

  const availableProjects = useMemo(() => [...projects].sort((a, b) => a.name.localeCompare(b.name)), [projects])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await onUpdateFolder(editingId, draft)
      } else {
        await onCreateFolder(draft)
      }
      setEditingId(null)
      setDraft({ name: '', description: '', color: colorPalette[1], projectIds: [] })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (folderId: string) => {
    if (!confirm('Delete this folder? Projects remain intact.')) return
    setSaving(true)
    try {
      await onDeleteFolder(folderId)
      if (editingId === folderId) {
        setEditingId(null)
        setDraft({ name: '', description: '', color: colorPalette[1], projectIds: [] })
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleProject = (projectId: string) => {
    setDraft(current => ({
      ...current,
      projectIds: current.projectIds.includes(projectId)
        ? current.projectIds.filter(id => id !== projectId)
        : [...current.projectIds, projectId],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-pink-500/20">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Project folders</h2>
            <p className="text-xs text-slate-400">Group related projects for portfolio views</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/70 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-full overflow-y-auto px-6 py-5 space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Existing folders</h3>
              <button
                onClick={() => {
                  setEditingId(null)
                  setDraft({ name: '', description: '', color: colorPalette[1], projectIds: [] })
                }}
                className="text-xs font-semibold text-pink-300 hover:text-white"
              >
                + New folder
              </button>
            </div>
            {folders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700/70 bg-slate-800/30 px-4 py-6 text-center text-sm text-slate-400">
                No folders yet. Create one to organize projects like Asana portfolios.
              </div>
            ) : (
              <div className="space-y-2">
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                      editingId === folder.id
                        ? 'border-pink-500/50 bg-pink-500/5 shadow-lg shadow-pink-500/10'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        className="flex items-center gap-2 text-left"
                        onClick={() => setEditingId(folder.id)}
                      >
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: folder.color }}></span>
                        <span className="font-semibold text-slate-100">{folder.name}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(folder.id)}
                        className="text-xs text-slate-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{folder.projectIds.length} projects</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {editingId ? 'Update folder' : 'New folder'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setDraft({ name: '', description: '', color: colorPalette[1], projectIds: [] })
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">Name *</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-pink-500 focus:outline-none"
                placeholder="e.g. Roadmap"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-400">Description</label>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:border-pink-500 focus:outline-none"
                placeholder="Add context for the folder"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setDraft({ ...draft, color })}
                    className={`h-8 w-8 rounded-full border-2 ${draft.color === color ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Projects</label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                {availableProjects.length === 0 && (
                  <p className="text-xs text-slate-500">No projects available yet.</p>
                )}
                {availableProjects.map(project => {
                  const checked = draft.projectIds.includes(project.id)
                  return (
                    <label key={project.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-200 hover:bg-slate-800/60">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProject(project.id)}
                        className="rounded border-slate-600 bg-slate-900"
                      />
                      <span className="flex-1">{project.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!draft.name.trim() || saving}
              className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update folder' : 'Create folder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export type { FolderInput }
