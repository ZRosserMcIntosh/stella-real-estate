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
  
  // Upload progress tracking
  const [uploadingFallback, setUploadingFallback] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingHeroLogo, setUploadingHeroLogo] = useState(false)
  const [uploadingHeaderLogo, setUploadingHeaderLogo] = useState(false)
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false)
  const [uploadingWatermark, setUploadingWatermark] = useState(false)

  // Watermark settings
  const [watermarkEnabled, setWatermarkEnabled] = useState(false)
  const [watermarkText, setWatermarkText] = useState('STELLA')
  const [watermarkOpacity, setWatermarkOpacity] = useState('0.15')
  const [watermarkPosition, setWatermarkPosition] = useState('center')
  const [watermarkType, setWatermarkType] = useState('text')
  const [watermarkImageUrl, setWatermarkImageUrl] = useState('')
  const [watermarkSize, setWatermarkSize] = useState('medium')
  
  // Logo URLs
  const [heroLogoUrl, setHeroLogoUrl] = useState('')
  const [headerLogoUrl, setHeaderLogoUrl] = useState('')
  const [headerLogoSize, setHeaderLogoSize] = useState('medium')
  const [footerLogoUrl, setFooterLogoUrl] = useState('')
  
  // Favicon URL
  const [faviconUrl, setFaviconUrl] = useState('')
  
  // Privacy settings
  const [disableRightClick, setDisableRightClick] = useState(false)
  const [disableTextSelection, setDisableTextSelection] = useState(false)
  const [disableImageDragging, setDisableImageDragging] = useState(false)

  useEffect(() => {
    const load = async () => {
  const s = await getSiteSettings([
    'video_home_id',
    'video_login_id',
    'featured_projects',
    'video_home_fallback_image',
    'video_home_uploaded_url',
    'watermark_enabled',
    'watermark_text',
    'watermark_opacity',
    'watermark_position',
    'watermark_type',
    'watermark_image_url',
    'watermark_size',
    'hero_logo_url',
    'header_logo_url',
    'header_logo_size',
    'footer_logo_url',
    'favicon_url',
    'disable_right_click',
    'disable_text_selection',
    'disable_image_dragging'
  ])
      setHomeId(s.video_home_id || '')
      setLoginId(s.video_login_id || '')
  setFeaturedRaw(s.featured_projects || '')
      setHeroFallbackUrl(s.video_home_fallback_image || '')
      setHeroVideoUploadedUrl(s.video_home_uploaded_url || '')
      
      // Load watermark settings
      setWatermarkEnabled(s.watermark_enabled === 'true')
      setWatermarkText(s.watermark_text || 'STELLA')
      setWatermarkOpacity(s.watermark_opacity || '0.15')
      setWatermarkPosition(s.watermark_position || 'center')
      setWatermarkType(s.watermark_type || 'text')
      setWatermarkImageUrl(s.watermark_image_url || '')
      setWatermarkSize(s.watermark_size || 'medium')
      
      // Load logo URLs
      setHeroLogoUrl(s.hero_logo_url || '')
      setHeaderLogoUrl(s.header_logo_url || '')
      setHeaderLogoSize(s.header_logo_size || 'medium')
      setFooterLogoUrl(s.footer_logo_url || '')
      
      // Load favicon URL
      setFaviconUrl(s.favicon_url || '')
      
      // Load privacy settings
      setDisableRightClick(s.disable_right_click === 'true')
      setDisableTextSelection(s.disable_text_selection === 'true')
      setDisableImageDragging(s.disable_image_dragging === 'true')
      
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

  if (!allowed) return <div className="text-slate-300">You do not have access.</div>

  const inputCls = "w-full rounded-md border border-slate-700/60 bg-slate-800/50 text-slate-100 placeholder-slate-500 px-3 py-2 shadow-sm focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none"

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
    <div className="p-4 text-slate-300">
      <h1 className="text-xl font-semibold text-slate-100">Site Admin</h1>
      <p className="mt-1 text-slate-400">Manage public site configuration.</p>
      {isDemo && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-400/80 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
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
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingFallback}
                onChange={async (e)=>{
                  if (isDemo) {
                    setMsg('Demo mode: uploads are disabled.')
                    setTimeout(() => setMsg(null), 2500)
                    e.target.value = ''
                    return
                  }
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  setUploadingFallback(true)
                  setMsg('Uploading image...')
                  
                  try {
                    if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
                      // fallback: create a blob URL
                      const url = URL.createObjectURL(file)
                      setHeroFallbackUrl(url)
                      setMsg('✓ Image loaded locally (Supabase not configured)')
                      setTimeout(() => setMsg(null), 3000)
                      e.target.value = ''
                      return
                    }
                    
                    // Sanitize filename
                    const sanitized = file.name
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-zA-Z0-9._-]/g, '_')
                    
                    const bucket = supabase.storage.from('listings')
                    const path = `hero-fallback/${Date.now()}_${sanitized}`
                    
                    const { error } = await bucket.upload(path, file, { 
                      upsert: true, 
                      cacheControl: '3600',
                      contentType: file.type 
                    })
                    
                    if (error) throw new Error(error.message || 'Upload failed')
                    
                    const { data: pub } = bucket.getPublicUrl(path)
                    
                    if (pub?.publicUrl) {
                      setHeroFallbackUrl(pub.publicUrl)
                      setMsg('✓ Fallback image uploaded successfully!')
                      setTimeout(() => setMsg(null), 2000)
                    } else {
                      throw new Error('Failed to get public URL')
                    }
                  } catch (err: any) {
                    console.error('Hero fallback upload error:', err)
                    const errorMsg = err?.message || 'Upload failed'
                    
                    if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                      setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                      const url = URL.createObjectURL(file)
                      setHeroFallbackUrl(url)
                    } else {
                      setMsg(`Upload failed: ${errorMsg}`)
                    }
                    
                    setTimeout(() => setMsg(null), 5000)
                  } finally {
                    setUploadingFallback(false)
                  }
                  e.target.value = ''
                }}
              />
              <span className={`
                inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                border transition-all duration-200
                ${uploadingFallback 
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                  : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}>
                {uploadingFallback ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload Image</span>
                  </>
                )}
              </span>
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
                  className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 hover:bg-slate-700/60 hover:text-slate-100 flex items-center transition-colors"
                  title="Click to use this ID"
                >
                  <span className="font-mono">{id}</span>
                  <a
                    href={asYouTubeUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-indigo-400 hover:text-indigo-300 underline"
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
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer group">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                className="hidden"
                disabled={uploadingVideo}
                onChange={async (e)=>{
                  if (isDemo) {
                    setMsg('Demo mode: uploads are disabled.')
                    setTimeout(() => setMsg(null), 2500)
                    e.target.value = ''
                    return
                  }
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  setUploadingVideo(true)
                  setMsg('Uploading video...')
                  
                  try {
                    if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
                      const url = URL.createObjectURL(file)
                      setHeroVideoUploadedUrl(url)
                      setMsg('✓ Video loaded locally (Supabase not configured)')
                      setTimeout(() => setMsg(null), 3000)
                      e.target.value = ''
                      return
                    }
                    
                    // Sanitize filename
                    const sanitized = file.name
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-zA-Z0-9._-]/g, '_')
                    
                    const bucket = supabase.storage.from('listings')
                    const path = `hero-video/${Date.now()}_${sanitized}`
                    
                    const { error } = await bucket.upload(path, file, { 
                      upsert: true, 
                      cacheControl: '3600', 
                      contentType: file.type 
                    })
                    
                    if (error) throw new Error(error.message || 'Upload failed')
                    
                    const { data: pub } = bucket.getPublicUrl(path)
                    
                    if (pub?.publicUrl) {
                      setHeroVideoUploadedUrl(pub.publicUrl)
                      setMsg('✓ Video uploaded successfully!')
                      setTimeout(() => setMsg(null), 2000)
                    } else {
                      throw new Error('Failed to get public URL')
                    }
                  } catch (err: any) {
                    console.error('Hero video upload error:', err)
                    const errorMsg = err?.message || 'Upload failed'
                    
                    if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                      setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                      const url = URL.createObjectURL(file)
                      setHeroVideoUploadedUrl(url)
                    } else {
                      setMsg(`Upload failed: ${errorMsg}`)
                    }
                    
                    setTimeout(() => setMsg(null), 5000)
                  } finally {
                    setUploadingVideo(false)
                  }
                  e.target.value = ''
                }}
              />
              <span className={`
                inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                border transition-all duration-200
                ${uploadingVideo 
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                  : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                }
                disabled:opacity-60 disabled:cursor-not-allowed
              `}>
                {uploadingVideo ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <span>Upload Video</span>
                  </>
                )}
              </span>
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

        {/* Hero Logo Configuration Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Homepage Hero Logo</h3>
            <p className="text-sm text-slate-400 mt-1">Customize the logo displayed on the homepage hero overlay</p>
          </div>
          
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-200">Logo Image URL</span>
              <input 
                className={inputCls}
                value={heroLogoUrl}
                onChange={(e) => setHeroLogoUrl(e.target.value)}
                placeholder="https://... or leave empty to use default Stella.png"
              />
              <div className="text-xs text-slate-500">Paste a URL or upload an image. Leave empty to use the default logo.</div>
            </label>

            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  disabled={uploadingHeroLogo}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    setUploadingHeroLogo(true)
                    setMsg('Uploading logo...')
                    
                    try {
                      // Sanitize filename
                      const sanitized = file.name
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-zA-Z0-9._-]/g, '_')
                      
                      const bucket = supabase.storage.from('listings')
                      const path = `hero-logo/${Date.now()}_${sanitized}`
                      
                      const { error } = await bucket.upload(path, file, { 
                        upsert: true, 
                        cacheControl: '3600',
                        contentType: file.type 
                      })
                      
                      if (error) throw new Error(error.message || 'Upload failed')
                      
                      const { data: pub } = bucket.getPublicUrl(path)
                      
                      if (pub?.publicUrl) {
                        setHeroLogoUrl(pub.publicUrl)
                        setMsg('✓ Logo uploaded successfully!')
                        setTimeout(() => setMsg(null), 2000)
                      } else {
                        throw new Error('Failed to get public URL')
                      }
                    } catch (err: any) {
                      console.error('Hero logo upload error:', err)
                      const errorMsg = err?.message || 'Upload failed'
                      
                      if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                        setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                        const url = URL.createObjectURL(file)
                        setHeroLogoUrl(url)
                      } else {
                        setMsg(`Upload failed: ${errorMsg}`)
                      }
                      
                      setTimeout(() => setMsg(null), 5000)
                    } finally {
                      setUploadingHeroLogo(false)
                    }
                    e.target.value = ''
                  }}
                />
                <span className={`
                  inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                  border transition-all duration-200
                  ${uploadingHeroLogo 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                    : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}>
                  {uploadingHeroLogo ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Upload Logo</span>
                    </>
                  )}
                </span>
              </label>
            </div>

            {heroLogoUrl && (
              <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
                <div className="text-xs font-semibold text-slate-300 mb-2">Current Hero Logo</div>
                <img 
                  src={heroLogoUrl} 
                  alt="Hero Logo" 
                  className="h-24 w-auto rounded-md bg-slate-800/50 p-2"
                />
              </div>
            )}

            <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
              <div className="text-xs font-semibold text-slate-300 mb-2">Preview on Dark Background</div>
              <div className="relative h-32 bg-gradient-to-br from-slate-900 to-slate-800 rounded-md flex items-center justify-center">
                <img 
                  src={heroLogoUrl || '/Stella.png'} 
                  alt="Preview" 
                  className="h-20 w-auto drop-shadow-lg"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {heroLogoUrl ? 'This is your custom hero logo' : 'Using default Stella.png logo'}
              </p>
            </div>
          </div>
        </div>

        {/* Header Logo Configuration Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Header Logo</h3>
            <p className="text-sm text-slate-400 mt-1">Customize the logo displayed in the top navigation header</p>
          </div>
          
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-200">Logo Image URL</span>
              <input 
                className={inputCls}
                value={headerLogoUrl}
                onChange={(e) => setHeaderLogoUrl(e.target.value)}
                placeholder="https://... or leave empty to use default constellation logo"
              />
              <div className="text-xs text-slate-500">Paste a URL or upload an image. Leave empty to use the default header logo.</div>
            </label>
            
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-200">
                Header Logo Size 
                <span className="ml-2 text-xs text-sky-400">(Current: {headerLogoSize})</span>
              </span>
              <select
                className={inputCls}
                value={headerLogoSize}
                onChange={(e) => {
                  console.log('Header logo size changed to:', e.target.value)
                  setHeaderLogoSize(e.target.value)
                }}
              >
                <option value="small">Small (Compact - 48px)</option>
                <option value="medium">Medium (Standard - 80px)</option>
                <option value="large">Large (Prominent - 112px)</option>
              </select>
              <div className="text-xs text-slate-500">
                Adjusts logo height with minimal padding. Small: 48px, Medium: 80px, Large: 112px
                <br />
                <strong className="text-sky-400">Remember to click "Save Settings" below to persist changes!</strong>
              </div>
            </label>

            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  disabled={uploadingHeaderLogo}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    setUploadingHeaderLogo(true)
                    setMsg('Uploading header logo...')
                    
                    try {
                      const sanitized = file.name
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-zA-Z0-9._-]/g, '_')
                      
                      const bucket = supabase.storage.from('listings')
                      const path = `header-logo/${Date.now()}_${sanitized}`
                      
                      const { error } = await bucket.upload(path, file, { 
                        upsert: true, 
                        cacheControl: '3600',
                        contentType: file.type 
                      })
                      
                      if (error) throw new Error(error.message || 'Upload failed')
                      
                      const { data: pub } = bucket.getPublicUrl(path)
                      
                      if (pub?.publicUrl) {
                        setHeaderLogoUrl(pub.publicUrl)
                        setMsg('✓ Header logo uploaded successfully!')
                        setTimeout(() => setMsg(null), 2000)
                      } else {
                        throw new Error('Failed to get public URL')
                      }
                    } catch (err: any) {
                      console.error('Header logo upload error:', err)
                      const errorMsg = err?.message || 'Upload failed'
                      
                      if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                        setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                        const url = URL.createObjectURL(file)
                        setHeaderLogoUrl(url)
                      } else {
                        setMsg(`Upload failed: ${errorMsg}`)
                      }
                      
                      setTimeout(() => setMsg(null), 5000)
                    } finally {
                      setUploadingHeaderLogo(false)
                    }
                    e.target.value = ''
                  }}
                />
                <span className={`
                  inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                  border transition-all duration-200
                  ${uploadingHeaderLogo 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                    : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}>
                  {uploadingHeaderLogo ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Upload Logo</span>
                    </>
                  )}
                </span>
              </label>
            </div>

            {headerLogoUrl && (
              <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
                <div className="text-xs font-semibold text-slate-300 mb-2">Current Header Logo</div>
                <img 
                  src={headerLogoUrl} 
                  alt="Header Logo" 
                  className="h-16 w-auto rounded-md bg-slate-800/50 p-2"
                />
              </div>
            )}

            <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Preview (Header Size) - {headerLogoSize.toUpperCase()}
              </div>
              <div className={`relative bg-gradient-to-br from-slate-800 to-slate-700 rounded-md flex items-center justify-center ${
                headerLogoSize === 'small' ? 'h-16 py-1.5' :
                headerLogoSize === 'large' ? 'h-32 py-2.5' :
                'h-24 py-2'
              }`}>
                <img 
                  src={headerLogoUrl || '/contellation-logo.png'} 
                  alt="Preview" 
                  className={`w-auto transition-all duration-300 ${
                    headerLogoSize === 'small' ? 'h-12' :
                    headerLogoSize === 'large' ? 'h-28' :
                    'h-20'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {headerLogoUrl ? 'Custom header logo' : 'Default constellation logo'}
                {' · '}
                Size: {headerLogoSize === 'small' ? '48px (compact)' : headerLogoSize === 'large' ? '112px (prominent)' : '80px (standard)'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Logo Configuration Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Footer Logo</h3>
            <p className="text-sm text-slate-400 mt-1">Customize the logo displayed centered at the bottom of the footer</p>
          </div>
          
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-slate-200">Logo Image URL</span>
              <input 
                className={inputCls}
                value={footerLogoUrl}
                onChange={(e) => setFooterLogoUrl(e.target.value)}
                placeholder="https://... or leave empty for no footer logo"
              />
              <div className="text-xs text-slate-500">Paste a URL or upload an image. Leave empty for no footer logo.</div>
            </label>

            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm group">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  disabled={uploadingFooterLogo}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    setUploadingFooterLogo(true)
                    setMsg('Uploading footer logo...')
                    
                    try {
                      const sanitized = file.name
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-zA-Z0-9._-]/g, '_')
                      
                      const bucket = supabase.storage.from('listings')
                      const path = `footer-logo/${Date.now()}_${sanitized}`
                      
                      const { error } = await bucket.upload(path, file, { 
                        upsert: true, 
                        cacheControl: '3600',
                        contentType: file.type 
                      })
                      
                      if (error) throw new Error(error.message || 'Upload failed')
                      
                      const { data: pub } = bucket.getPublicUrl(path)
                      
                      if (pub?.publicUrl) {
                        setFooterLogoUrl(pub.publicUrl)
                        setMsg('✓ Footer logo uploaded successfully!')
                        setTimeout(() => setMsg(null), 2000)
                      } else {
                        throw new Error('Failed to get public URL')
                      }
                    } catch (err: any) {
                      console.error('Footer logo upload error:', err)
                      const errorMsg = err?.message || 'Upload failed'
                      
                      if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                        setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                        const url = URL.createObjectURL(file)
                        setFooterLogoUrl(url)
                      } else {
                        setMsg(`Upload failed: ${errorMsg}`)
                      }
                      
                      setTimeout(() => setMsg(null), 5000)
                    } finally {
                      setUploadingFooterLogo(false)
                    }
                    e.target.value = ''
                  }}
                />
                <span className={`
                  inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                  border transition-all duration-200
                  ${uploadingFooterLogo 
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                    : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}>
                  {uploadingFooterLogo ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Upload Logo</span>
                    </>
                  )}
                </span>
              </label>
            </div>

            {footerLogoUrl && (
              <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
                <div className="text-xs font-semibold text-slate-300 mb-2">Current Footer Logo</div>
                <img 
                  src={footerLogoUrl} 
                  alt="Footer Logo" 
                  className="h-16 w-auto rounded-md bg-slate-800/50 p-2"
                />
              </div>
            )}

            <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
              <div className="text-xs font-semibold text-slate-300 mb-2">Preview (Footer Size)</div>
              <div className="relative h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-md flex items-center justify-center border-t border-slate-700">
                {footerLogoUrl ? (
                  <img 
                    src={footerLogoUrl} 
                    alt="Preview" 
                    className="h-16 w-auto"
                  />
                ) : (
                  <div className="text-slate-500 text-sm">No footer logo set</div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {footerLogoUrl ? 'This logo will appear centered at the bottom of the footer' : 'No footer logo will be displayed'}
              </p>
            </div>
          </div>
        </div>

        {/* Favicon Configuration Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Favicon</h3>
            <p className="text-xs text-slate-400 mt-1">The small icon that appears in browser tabs and bookmarks.</p>
          </div>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Favicon URL</label>
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                placeholder="https://... or upload an image"
              />
              <div className="text-xs text-slate-500">Paste a URL or upload an image. Recommended size: 32x32 or 64x64 pixels.</div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Upload Favicon Image</label>
              <input 
                type="file" 
                accept="image/*"
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  try {
                    const sanitized = f.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                    const path = `favicon/${Date.now()}-${sanitized}`
                    const { data, error } = await supabase.storage.from('listings').upload(path, f, { upsert: false })
                    if (error) throw error
                    const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(path)
                    setFaviconUrl(publicUrl)
                    setMsg('✓ Favicon uploaded successfully!')
                    setTimeout(() => setMsg(null), 2500)
                  } catch (err: any) {
                    if (err?.message?.includes('duplicate')) {
                      console.error('Favicon upload error:', err)
                      setMsg('File already exists. Using local file URL.')
                      const localUrl = URL.createObjectURL(f)
                      setFaviconUrl(localUrl)
                    } else {
                      console.error('Favicon upload error:', err)
                      setMsg(`Upload error: ${err?.message || 'Unknown'}`)
                    }
                    setTimeout(() => setMsg(null), 3000)
                  } finally {
                    e.target.value = ''
                  }
                }}
              />
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-300 mb-2">Current Favicon</div>
                {faviconUrl ? (
                  <img 
                    src={faviconUrl} 
                    alt="Favicon" 
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        const err = document.createElement('div')
                        err.className = 'text-red-400 text-xs'
                        err.textContent = 'Failed to load favicon'
                        parent.appendChild(err)
                      }
                    }}
                  />
                ) : (
                  <div className="text-slate-500 text-sm">No favicon set</div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-300 mb-2">Preview</div>
                {faviconUrl ? (
                  <img 
                    src={faviconUrl} 
                    alt="Preview" 
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="text-slate-500 text-sm">No favicon set</div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {faviconUrl ? 'This icon will appear in browser tabs and bookmarks' : 'Default favicon will be used'}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Site Privacy & Protection</h3>
            <p className="text-xs text-slate-400 mt-1">Protect your content from being easily copied or stolen.</p>
          </div>
          
          <div className="grid gap-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-900/30 transition-colors">
              <input 
                type="checkbox" 
                checked={disableRightClick}
                onChange={(e) => setDisableRightClick(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">Disable Right-Click</div>
                <div className="text-xs text-slate-500">Prevents users from right-clicking to access context menus</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-900/30 transition-colors">
              <input 
                type="checkbox" 
                checked={disableTextSelection}
                onChange={(e) => setDisableTextSelection(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">Disable Text Selection</div>
                <div className="text-xs text-slate-500">Prevents users from selecting and copying text content</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-900/30 transition-colors">
              <input 
                type="checkbox" 
                checked={disableImageDragging}
                onChange={(e) => setDisableImageDragging(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">Disable Image Dragging</div>
                <div className="text-xs text-slate-500">Prevents users from dragging images to save them</div>
              </div>
            </label>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs text-amber-300">
              <strong>Note:</strong> These measures provide basic protection but are not foolproof. 
              Determined users can still access content through browser developer tools or screenshots.
            </p>
          </div>
        </div>

        {/* Watermark Configuration Section */}
        <div className="grid gap-4 border border-slate-700/60 rounded-xl p-4 bg-slate-800/30">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Image Watermark</h3>
            <p className="text-xs text-slate-400 mt-1">Apply a subtle watermark to all listing photos on the public site.</p>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={watermarkEnabled}
              onChange={(e) => setWatermarkEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
            />
            <span className="text-sm font-medium text-slate-200">Enable watermark on listing images</span>
          </label>

          {watermarkEnabled && (
            <div className="grid gap-4 pl-7 border-l-2 border-slate-700/60">
              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-200">Watermark Type</span>
                <select 
                  className={inputCls}
                  value={watermarkType}
                  onChange={e => setWatermarkType(e.target.value)}
                >
                  <option value="text">Text Watermark</option>
                  <option value="image">Image/Logo Watermark</option>
                </select>
              </label>

              {watermarkType === 'text' ? (
                <label className="grid gap-1 text-sm">
                  <span className="font-medium text-slate-200">Watermark Text</span>
                  <input 
                    className={inputCls} 
                    value={watermarkText} 
                    onChange={e => setWatermarkText(e.target.value)} 
                    placeholder="e.g., STELLA, © STELLA REAL ESTATE"
                    maxLength={50}
                  />
                  <span className="text-xs text-slate-500">Keep it short for best visibility</span>
                </label>
              ) : (
                <div className="grid gap-3 border border-slate-700/60 rounded-md p-3">
                  <div className="text-sm font-medium text-slate-200">Watermark Image/Logo</div>
                  <div className="text-xs text-slate-400">Upload a PNG logo with transparent background for best results</div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
                    <input 
                      className={inputCls} 
                      value={watermarkImageUrl} 
                      onChange={e => setWatermarkImageUrl(e.target.value)} 
                      placeholder="https://.../watermark-logo.png" 
                    />
                    <label className="inline-flex items-center gap-2 text-sm cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingWatermark}
                        onChange={async (e) => {
                          if (isDemo) {
                            setMsg('Demo mode: uploads are disabled.')
                            setTimeout(() => setMsg(null), 2500)
                            e.target.value = ''
                            return
                          }
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          setUploadingWatermark(true)
                          setMsg('Uploading watermark...')
                          
                          try {
                            // Check if Supabase is configured
                            if (!(import.meta as any).env?.VITE_SUPABASE_URL) {
                              // Fallback: create local blob URL
                              const url = URL.createObjectURL(file)
                              setWatermarkImageUrl(url)
                              setMsg('✓ Image loaded (local preview)')
                              setTimeout(() => setMsg(null), 2000)
                              e.target.value = ''
                              return
                            }
                            
                            // Sanitize filename: remove special characters and spaces
                            const sanitizedName = file.name
                              .normalize('NFD') // Normalize accented characters
                              .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                              .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
                              .replace(/_+/g, '_') // Replace multiple underscores with single
                              .toLowerCase()
                            
                            // Upload to Supabase with sanitized filename
                            const path = `watermark/${Date.now()}_${sanitizedName}`
                            const bucket = supabase.storage.from('listings')
                            
                            const { data, error } = await bucket.upload(path, file, { 
                              upsert: true, 
                              cacheControl: '3600',
                              contentType: file.type 
                            })
                            
                            if (error) {
                              console.error('Upload error:', error)
                              throw new Error(error.message || 'Upload failed')
                            }
                            
                            // Get public URL
                            const { data: pub } = bucket.getPublicUrl(path)
                            
                            if (pub?.publicUrl) {
                              setWatermarkImageUrl(pub.publicUrl)
                              setMsg('✓ Watermark uploaded successfully!')
                              setTimeout(() => setMsg(null), 2000)
                            } else {
                              throw new Error('Failed to get public URL')
                            }
                          } catch (err: any) {
                            console.error('Watermark upload error:', err)
                            const errorMsg = err?.message || 'Upload failed'
                            
                            // Provide helpful error messages
                            if (errorMsg.includes('row-level security') || errorMsg.includes('policy')) {
                              setMsg('Upload failed: Storage bucket permissions not configured. Using local preview.')
                              // Fallback to local preview
                              const url = URL.createObjectURL(file)
                              setWatermarkImageUrl(url)
                            } else if (errorMsg.includes('not found')) {
                              setMsg('Upload failed: Storage bucket "listings" not found. Please create it in Supabase.')
                            } else {
                              setMsg(`Upload failed: ${errorMsg}`)
                            }
                            
                            setTimeout(() => setMsg(null), 5000)
                          } finally {
                            setUploadingWatermark(false)
                          }
                          e.target.value = ''
                        }}
                      />
                      <span className={`
                        inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                        border transition-all duration-200
                        ${uploadingWatermark 
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 cursor-wait' 
                          : 'bg-gradient-to-r from-indigo-600/80 to-indigo-700/80 border-indigo-500/60 text-white hover:from-indigo-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]'
                        }
                        disabled:opacity-60 disabled:cursor-not-allowed
                      `}>
                        {uploadingWatermark ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Upload Image</span>
                          </>
                        )}
                      </span>
                    </label>
                  </div>
                  {watermarkImageUrl && (
                    <div className="mt-2">
                      <div className="text-xs text-slate-500 mb-1">Current watermark image</div>
                      <img src={watermarkImageUrl} alt="Watermark" className="h-16 w-auto rounded-md border border-slate-700 bg-slate-800/50 p-2" />
                    </div>
                  )}
                  <div className="mt-1 text-xs text-slate-500">
                    💡 Tip: Paste a URL or upload a file. If upload fails, the image will still work as a local preview.
                  </div>
                </div>
              )}

              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-200">Opacity: {(parseFloat(watermarkOpacity) * 100).toFixed(0)}%</span>
                <input 
                  type="range" 
                  min="0.05" 
                  max="0.5" 
                  step="0.05"
                  value={watermarkOpacity}
                  onChange={e => setWatermarkOpacity(e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtle (5%)</span>
                  <span>Visible (50%)</span>
                </div>
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-200">Position</span>
                <select 
                  className={inputCls}
                  value={watermarkPosition}
                  onChange={e => setWatermarkPosition(e.target.value)}
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="center-left">Center Left</option>
                  <option value="center">Center</option>
                  <option value="center-right">Center Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </label>

              <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-200">Size</span>
                <select 
                  className={inputCls}
                  value={watermarkSize}
                  onChange={e => setWatermarkSize(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <div className="text-xs text-slate-500">
                  {watermarkSize === 'small' && '📏 Small: Subtle, minimal presence'}
                  {watermarkSize === 'medium' && '📏 Medium: Balanced visibility'}
                  {watermarkSize === 'large' && '📏 Large: Maximum prominence'}
                </div>
              </label>

              <div className="rounded-lg bg-slate-900/50 p-3 border border-slate-700/40">
                <div className="text-xs font-semibold text-slate-300 mb-2">Preview</div>
                <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-md overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className={`absolute pointer-events-none select-none ${
                      watermarkPosition === 'top-left' ? 'top-2 left-2' :
                      watermarkPosition === 'top-center' ? 'top-2 left-1/2 -translate-x-1/2' :
                      watermarkPosition === 'top-right' ? 'top-2 right-2' :
                      watermarkPosition === 'center-left' ? 'top-1/2 left-2 -translate-y-1/2' :
                      watermarkPosition === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' :
                      watermarkPosition === 'center-right' ? 'top-1/2 right-2 -translate-y-1/2' :
                      watermarkPosition === 'bottom-left' ? 'bottom-2 left-2' :
                      watermarkPosition === 'bottom-center' ? 'bottom-2 left-1/2 -translate-x-1/2' :
                      'bottom-2 right-2'
                    }`}
                    style={{ opacity: parseFloat(watermarkOpacity) }}
                  >
                    {watermarkType === 'image' && watermarkImageUrl ? (
                      <img 
                        src={watermarkImageUrl} 
                        alt="Watermark preview"
                        className={`object-contain drop-shadow-lg ${
                          watermarkSize === 'small' ? 'max-w-[15%] max-h-[15%]' :
                          watermarkSize === 'large' ? 'max-w-[35%] max-h-[35%]' :
                          'max-w-[25%] max-h-[25%]'
                        }`}
                      />
                    ) : (
                      <div 
                        className="text-white font-bold tracking-widest drop-shadow-lg"
                        style={{
                          fontSize: watermarkSize === 'small' ? 'clamp(0.75rem, 2vw, 1rem)' :
                                   watermarkSize === 'large' ? 'clamp(1.25rem, 4vw, 2rem)' :
                                   'clamp(1rem, 3vw, 1.5rem)'
                        }}
                      >
                        {watermarkText || 'STELLA'}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">This is how your watermark will appear on listing images</p>
              </div>
            </div>
          )}
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
                  className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-800/50 text-sm text-slate-200 hover:bg-slate-700/60 hover:text-slate-100 flex items-center transition-colors"
                  title="Click to use this ID"
                >
                  <span className="font-mono">{id}</span>
                  <a
                    href={asYouTubeUrl(id)}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-indigo-400 hover:text-indigo-300 underline"
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
              console.log('💾 Saving header_logo_size:', headerLogoSize)
              await Promise.all([
                setSiteSetting('video_home_id', hv),
                setSiteSetting('video_login_id', lv),
                setSiteSetting('featured_projects', JSON.stringify(selected.map(s => s.id))),
                setSiteSetting('video_home_fallback_image', heroFallbackUrl.trim()),
                setSiteSetting('video_home_uploaded_url', heroVideoUploadedUrl.trim()),
                setSiteSetting('watermark_enabled', watermarkEnabled ? 'true' : 'false'),
                setSiteSetting('watermark_text', watermarkText.trim() || 'STELLA'),
                setSiteSetting('watermark_opacity', watermarkOpacity),
                setSiteSetting('watermark_position', watermarkPosition),
                setSiteSetting('watermark_type', watermarkType),
                setSiteSetting('watermark_image_url', watermarkImageUrl.trim()),
                setSiteSetting('watermark_size', watermarkSize),
                setSiteSetting('hero_logo_url', heroLogoUrl.trim()),
                setSiteSetting('header_logo_url', headerLogoUrl.trim()),
                setSiteSetting('header_logo_size', headerLogoSize),
                setSiteSetting('footer_logo_url', footerLogoUrl.trim()),
                setSiteSetting('favicon_url', faviconUrl.trim()),
                setSiteSetting('disable_right_click', disableRightClick ? 'true' : 'false'),
                setSiteSetting('disable_text_selection', disableTextSelection ? 'true' : 'false'),
                setSiteSetting('disable_image_dragging', disableImageDragging ? 'true' : 'false'),
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
