import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProjects } from '../../services/projects'
import type { Project } from '../../types/projects'

export default function ProjectsIndex() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const rows = await fetchAllProjects()
        setItems(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">New Projects</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-2 text-sm text-slate-500">Loading…</p>}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <Link key={p.id} to={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/60 shadow-soft block">
            {p.heroImageUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={p.heroImageUrl} className="w-full h-44 object-cover rounded-xl" />
            ) : (
              <div className="w-full h-44 bg-slate-100 rounded-xl grid place-items-center text-slate-400 text-sm">No image</div>
            )}
            <h3 className="mt-3 text-lg font-semibold line-clamp-1">{p.name}</h3>
            <p className="text-sm text-slate-600">{[p.city, p.state].filter(Boolean).join(', ')}</p>
          </Link>
        ))}
        {!loading && items.length === 0 && <div className="text-slate-600">No projects available yet.</div>}
      </div>
    </section>
  )
}
