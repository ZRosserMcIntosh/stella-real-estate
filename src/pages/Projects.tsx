import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabaseClient'

type Project = {
  id: string
  title: string
  city: string | null
  state_code: string | null
  features: Record<string, any> | null
  media: Array<{ kind: string; url: string }>
}

export default function Projects() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id,title,city,state_code,features,media,created_at')
          .eq('listing_type', 'new_project')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })
          .limit(24)
        if (error) throw error
        setItems((data || []) as any)
      } catch (e: any) {
        setError(e?.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.projects.title', { defaultValue: 'New Projects' })}</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-2 text-sm text-slate-500">Loading…</p>}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => {
          const thumb = (p.media || []).find((m) => m.kind === 'thumbnail')?.url || (p.media || [])[0]?.url
          const expected = p.features?.expected_delivery_month || p.features?.expected_delivery_year
          return (
            <div key={p.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-slate-900/60 shadow-soft">
              {thumb ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={thumb} className="w-full h-44 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-44 bg-slate-100 rounded-xl grid place-items-center text-slate-400 text-sm">No image</div>
              )}
              <h3 className="mt-3 text-lg font-semibold line-clamp-1">{p.title}</h3>
              <p className="text-sm text-slate-600">{[p.city, p.state_code].filter(Boolean).join(', ')}</p>
              {expected && (
                <p className="text-sm text-slate-700 mt-1">Delivery: {[
                  p.features?.expected_delivery_month,
                  p.features?.expected_delivery_year,
                ].filter(Boolean).join(' ')}</p>
              )}
            </div>
          )
        })}
        {!loading && items.length === 0 && (
          <div className="text-slate-600">No projects available yet.</div>
        )}
      </div>
    </section>
  )
}
