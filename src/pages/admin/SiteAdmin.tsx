import React, { useEffect, useMemo, useRef, useState } from 'react'
import { can, type UserRBACContext } from '../../lib/rbac'
import { getSiteSettings, setSiteSetting, getSiteSettingHistory, addSiteSettingToHistory } from '../../lib/siteSettings'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function SiteAdmin() {
  // TODO: wire the real user context; for now, assume admin access in dev
  const userCtx: UserRBACContext = {
    userId: 'local',
    roles: ['admin'],
    scopes: { listings: 'global', leads: 'global', cities: [] },
  }
  const allowed = can(userCtx, 'roles.manage') || can(userCtx, 'users.manage')
  const { isDemo } = useAuth()

  const [homeId, setHomeId] = useState('')
  const [loginId, setLoginId] = useState('')
  const [homeHistory, setHomeHistory] = useState<string[]>([])
  const [loginHistory, setLoginHistory] = useState<string[]>([])
  // Hero fallback image and optional uploaded hero video
  const [heroFallbackUrl, setHeroFallbackUrl] = useState('')
  const [heroVideoUploadedUrl, setHeroVideoUploadedUrl] = useState('')
  // Featured selection state
  const [featuredRaw, setFeaturedRaw] = useState<string>('')
  const [available, setAvailable] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const searchRef = useRef<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
  const s = await getSiteSettings(['video_home_id','video_login_id','featured_projects','video_home_fallback_image','video_home_uploaded_url'])
      setHomeId(s.video_home_id || '')
      setLoginId(s.video_login_id || '')
  setFeaturedRaw(s.featured_projects || '')
      setHeroFallbackUrl(s.video_home_fallback_image || '')
      setHeroVideoUploadedUrl(s.video_home_uploaded_url || '')
      const [hh, lh] = await Promise.all([
        getSiteSettingHistory('video_home_id', 10),
        getSiteSettingHistory('video_login_id', 10),
      ])
      setHomeHistory(hh)
      setLoginHistory(lh)

      // Preload available listings (initial, no search)
      await loadAvailable('')

      // Pre-select saved featured entries
      const raw = (s.featured_projects || '').trim()
      if (raw && (import.meta as any).env?.VITE_SUPABASE_URL) {
        let values: string[] = []
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) values = parsed.map(String)
          else if (typeof parsed === 'string') values = [parsed]
        } catch {
          values = [raw]
        }
        const ids = Array.from(new Set(
          values
            .map((v) => {
              const m = String(v).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
              return m?.[0] || String(v)
            })
            .filter(Boolean)
        ))
        if (ids.length) {
          const { data } = await supabase
            .from('listings')
            .select('id,title,city,state_code,listing_type,status,media')
            .in('id', ids)
          if (data && Array.isArray(data)) {
            const order: Record<string, number> = ids.reduce((acc, id, i) => { acc[id] = i; return acc }, {} as Record<string, number>)
            data.sort((a: any, b: any) => (order[a.id] ?? 0) - (order[b.id] ?? 0))
            setSelected(data.slice(0, 3))
          }
        }
      }
    }
    load()
  }, [])

  // Load available listings with server-side filtering and optional search
  async function loadAvailable(q: string) {
    try {
      if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
      setSearching(true)
      const or = q
        ? `title.ilike.%${q}%,city.ilike.%${q}%,state_code.ilike.%${q}%`
        : undefined
      let req = supabase
        .from('listings')
        .select('id,title,city,state_code,listing_type,status,media')
        .in('status', ['active','pending'])
        .order('created_at', { ascending: false })
        .limit(200)
      if (or) req = (req as any).or(or)
      const { data } = await req
      setAvailable(data || [])
    } finally {
      setSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (searchRef.current) window.clearTimeout(searchRef.current)
    searchRef.current = window.setTimeout(() => {
      loadAvailable(search.trim())
    }, 250)
    return () => {
      if (searchRef.current) window.clearTimeout(searchRef.current)
    }
  }, [search])

  if (!allowed) return <div className="text-slate-700">You do not have access.</div>

  const inputCls = "w-full rounded-md border border-slate-300 bg-white text-slate-900 placeholder-slate-400 px-3 py-2 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"

  const asYouTubeUrl = (id: string) => (id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : '#')

  const selectedIds = useMemo(() => selected.map(s => s.id), [selected])
  const toggleSelect = (item: any) => {
    const exists = selectedIds.includes(item.id)
    if (exists) {
      setSelected(prev => prev.filter(p => p.id !== item.id))
    } else {
      setSelected(prev => (prev.length >= 3 ? prev : [...prev, item]))
    }
  }
  const removeSelected = (id: string) => setSelected(prev => prev.filter(p => p.id !== id))
  const thumbOf = (p: any) => (p.media || []).find((m: any) => m.kind === 'thumbnail')?.url || (p.media || [])[0]?.url

  return (
    <div className="p-4 text-slate-900">
      <h1 className="text-xl font-semibold">Site Admin</h1>
      <p className="mt-1 text-slate-600">Manage public site configuration.</p>
      {isDemo && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Demo mode · changes disabled
        </p>
      )}
      <div className="mt-6 grid gap-6 max-w-2xl">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Home page background video (YouTube ID)</span>
          <input className={inputCls} value={homeId} onChange={e=>setHomeId(e.target.value)} placeholder="e.g., bv2x5gn_Tc0" />
        </label>
        <div className="grid gap-3 border border-slate-200 rounded-md p-3">
          <div className="text-sm font-medium">Hero fallback image</div>
          <div className="text-xs text-slate-600">Used when the hero video fails or is disabled. Paste a URL or upload an image.</div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
            <input className={inputCls} value={heroFallbackUrl} onChange={(e)=>setHeroFallbackUrl(e.target.value)} placeholder="https://.../fallback.jpg" />
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e)=>{
                  if (isDemo) {
                    setMsg('Demo mode: uploads are disabled.')
                    setTimeout(() => setMsg(null), 2500)
                    e.target.value = ''
                    return
                  }
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
                      // fallback: create a blob URL
                      const url = URL.createObjectURL(file)
                      setHeroFallbackUrl(url)
                      return
                    }
                    const path = `hero-fallback/${Date.now()}_${file.name}`
                    const { data, error } = await (supabase.storage.from('listings') as any).upload(path, file, { upsert: true, cacheControl: '3600' })
                    if (error) throw error
                    const { data: pub } = await (supabase.storage.from('listings') as any).getPublicUrl(path)
                    if (pub?.publicUrl) setHeroFallbackUrl(pub.publicUrl)
                  } catch {}
                }}
              />
              <span className="rounded-md bg-slate-100 px-3 py-2 border border-slate-300 hover:bg-slate-200">Upload</span>
            </label>
          </div>
          {heroFallbackUrl && (
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1">Preview</div>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={heroFallbackUrl} className="h-28 w-auto rounded-md border border-slate-200 object-cover" />
            </div>
          )}
        </div>
        {homeHistory.length > 0 && (
          <div className="-mt-2">
            <div className="text-xs text-slate-500 mb-2">Previously used</div>
            <div className="flex flex-wrap gap-2">
              {homeHistory.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setHomeId(id)}
                  className="px-2 py-1 rounded-md border border-slate-300 bg-white text-sm hover:bg-slate-50 flex items-center"
                  title="Click to use this ID"
                >
                  <span className="font-mono">{id}</span>
                  <a
                    href={asYouTubeUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-sky-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >link</a>
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Login pages background video (YouTube ID)</span>
          <input className={inputCls} value={loginId} onChange={e=>setLoginId(e.target.value)} placeholder="e.g., dQw4w9WgXcQ" />
        </label>
        <div className="grid gap-3 border border-slate-200 rounded-md p-3">
          <div className="text-sm font-medium">Optional uploaded hero video</div>
          <div className="text-xs text-slate-600">Upload a short, loopable video (MP4 recommended). This will be used instead of YouTube on the home hero if present.</div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
            <input className={inputCls} value={heroVideoUploadedUrl} onChange={(e)=>setHeroVideoUploadedUrl(e.target.value)} placeholder="https://.../hero.mp4" />
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                className="hidden"
                onChange={async (e)=>{
                  if (isDemo) {
                    setMsg('Demo mode: uploads are disabled.')
                    setTimeout(() => setMsg(null), 2500)
                    e.target.value = ''
                    return
                  }
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
                      const url = URL.createObjectURL(file)
                      setHeroVideoUploadedUrl(url)
                      return
                    }
                    const path = `hero-video/${Date.now()}_${file.name}`
                    const { error } = await (supabase.storage.from('listings') as any).upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type })
                    if (error) throw error
                    const { data: pub } = await (supabase.storage.from('listings') as any).getPublicUrl(path)
                    if (pub?.publicUrl) setHeroVideoUploadedUrl(pub.publicUrl)
                  } catch {}
                }}
              />
              <span className="rounded-md bg-slate-100 px-3 py-2 border border-slate-300 hover:bg-slate-200">Upload</span>
            </label>
          </div>
          {heroVideoUploadedUrl && (
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1">Preview</div>
              <video src={heroVideoUploadedUrl} className="h-28 w-auto rounded-md border border-slate-200" controls muted />
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-sm">Featured listings/projects (up to 3)</span>
            <span className="text-xs text-slate-500">{selected.length} / 3 selected</span>
          </div>
          <input
            className={inputCls}
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search by title, city, state code"
          />
          <div className="grid md:grid-cols-2 gap-3 mt-2">
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-200">Available {searching && '…'}</div>
              <div className="max-h-64 overflow-auto divide-y divide-slate-100">
                {available.length === 0 && (
                  <div className="px-3 py-3 text-sm text-slate-500">No results</div>
                )}
                {available.map((item) => {
                  const active = selectedIds.includes(item.id)
                  const thumb = thumbOf(item)
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleSelect(item)}
                      disabled={!active && selected.length >= 3}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 ${active ? 'bg-sky-50' : ''}`}
                    >
                      <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                        {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover"/> : null}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-slate-500 truncate">{[item.city, item.state_code].filter(Boolean).join(', ')} · {item.listing_type} · {item.status}</div>
                      </div>
                      <div className="ml-auto text-xs text-slate-600">{active ? 'Selected' : selected.length >= 3 ? 'Max' : 'Select'}</div>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-200">Selected</div>
              <div className="max-h-64 overflow-auto divide-y divide-slate-100">
                {selected.length === 0 && (
                  <div className="px-3 py-3 text-sm text-slate-500">Nothing selected</div>
                )}
                {selected.map((item) => {
                  const thumb = thumbOf(item)
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-3 py-2">
                      <div className="w-12 h-12 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                        {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover"/> : null}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-slate-500 truncate">{[item.city, item.state_code].filter(Boolean).join(', ')} · {item.listing_type} · {item.status}</div>
                      </div>
                      <button type="button" onClick={()=>removeSelected(item.id)} className="ml-auto text-xs text-sky-700 hover:underline">Remove</button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500">Saving will store the selected IDs in settings and update the homepage Featured section.</div>
        </div>
        {loginHistory.length > 0 && (
          <div className="-mt-2">
            <div className="text-xs text-slate-500 mb-2">Previously used</div>
            <div className="flex flex-wrap gap-2">
              {loginHistory.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLoginId(id)}
                  className="px-2 py-1 rounded-md border border-slate-300 bg-white text-sm hover:bg-slate-50 flex items-center"
                  title="Click to use this ID"
                >
                  <span className="font-mono">{id}</span>
                  <a
                    href={asYouTubeUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-sky-700 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >link</a>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            disabled={saving || isDemo}
            onClick={async ()=>{
              if (isDemo) {
                setMsg('Demo mode: settings are read-only.')
                setTimeout(() => setMsg(null), 2500)
                return
              }
              setSaving(true); setMsg(null)
              const hv = homeId.trim()
              const lv = loginId.trim()
              await Promise.all([
                setSiteSetting('video_home_id', hv),
                setSiteSetting('video_login_id', lv),
                setSiteSetting('featured_projects', JSON.stringify(selected.map(s => s.id))),
                setSiteSetting('video_home_fallback_image', heroFallbackUrl.trim()),
                setSiteSetting('video_home_uploaded_url', heroVideoUploadedUrl.trim()),
                addSiteSettingToHistory('video_home_id', hv),
                addSiteSettingToHistory('video_login_id', lv),
              ])
              const [hh, lh] = await Promise.all([
                getSiteSettingHistory('video_home_id', 10),
                getSiteSettingHistory('video_login_id', 10),
              ])
              setHomeHistory(hh)
              setLoginHistory(lh)
              setSaving(false)
              setMsg('Saved')
              setTimeout(()=> setMsg(null), 2000)
            }}
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            title={isDemo ? 'Disabled in demo mode' : undefined}
          >{saving ? 'Saving…' : 'Save'}</button>
          {msg && <span className="text-sm text-slate-600">{msg}</span>}
        </div>
      </div>
      <div className="mt-8 text-xs text-slate-500">
        Tip: Paste just the YouTube video ID (the part after v=). We use youtube-nocookie embed.
      </div>
    </div>
  )
}
