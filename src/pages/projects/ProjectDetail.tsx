import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Navigate } from 'react-router-dom'
import { fetchProjectBySlug } from '../../services/projects'
import type { Project, ProjectMediaItem, ProjectUnitSummary } from '../../types/projects'
import { useCurrency } from '../../context/CurrencyContext'

const youtubeIdFromUrl = (input?: string | null): string => {
  if (!input) return ''
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://placeholder.local'
    const parsed = new URL(input, base)
    const paramId = parsed.searchParams.get('v')
    if (paramId) return paramId
    const pathFragment = parsed.pathname.split('/').filter(Boolean).pop()
    if (pathFragment && pathFragment.length >= 8) return pathFragment
  } catch {
    const fallback = input.match(/([A-Za-z0-9_-]{11})(?:\?|$)/)
    if (fallback) return fallback[1]
  }
  return ''
}

const youtubeStartFromUrl = (input?: string | null): number => {
  if (!input) return 0
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://placeholder.local'
    const parsed = new URL(input, base)
    const raw = parsed.searchParams.get('start') || parsed.searchParams.get('t')
    if (!raw) return 0
    if (/^\d+$/.test(raw)) return parseInt(raw, 10)
    const m = raw.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i)
    if (!m) return 0
    const h = m[1] ? parseInt(m[1], 10) : 0
    const mm = m[2] ? parseInt(m[2], 10) : 0
    const ss = m[3] ? parseInt(m[3], 10) : 0
    return h * 3600 + mm * 60 + ss
  } catch {
    return 0
  }
}

const asStringArray = (value: any): string[] => {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
  return []
}

const normalizeUnitsFromProject = (project: Project | null | undefined): ProjectUnitSummary[] => {
  if (!project) return []
  const provided = Array.isArray(project.features?.units) ? project.features?.units ?? [] : []
  if (provided.length) return provided
  const rawUnits = project.rawFeatures && Array.isArray((project.rawFeatures as any).units)
    ? (project.rawFeatures as any).units
    : []
  return rawUnits.map((unit: any) => ({
    id: unit?.id ?? unit?.unit_id ?? `unit-${Math.random().toString(36).slice(2, 8)}`,
    label: unit?.label ?? unit?.name ?? unit?.unit ?? `Unit`,
    unitNumber: unit?.unitNumber ?? unit?.unit_number ?? unit?.number ?? null,
    floor: unit?.floor ?? unit?.level ?? unit?.andar ?? null,
    bedrooms: unit?.bedrooms ?? unit?.beds ?? unit?.dormitorios ?? null,
    bathrooms: unit?.bathrooms ?? unit?.baths ?? unit?.banheiros ?? null,
    areaM2: unit?.areaM2 ?? unit?.area_m2 ?? unit?.area ?? null,
    price: unit?.price ?? unit?.valor ?? null,
    features: asStringArray(unit?.features ?? unit?.tags ?? unit?.caracteristicas),
    available: unit?.available ?? unit?.isAvailable ?? unit?.disponivel ?? true,
    floorplanUrl: unit?.floorplanUrl ?? unit?.floorplan_url ?? unit?.floorplan ?? unit?.planta ?? null,
  }))
}

export default function ProjectDetail() {
  const { i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const { formatPrice } = useCurrency()
  const heroRef = useRef<HTMLDivElement | null>(null)
  const [viewportH, setViewportH] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 600)
  const maxBlur = 20
  const minBlur = maxBlur * 0.08
  const [blur, setBlur] = useState<number>(minBlur)
  const videoAspect = 16 / 9
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 0
  const requiredHeightForWidth = Math.ceil(viewportW / videoAspect)
  const computedMinHeight = Math.max(viewportH, requiredHeightForWidth)
  const computedMinWidth = Math.ceil(computedMinHeight * videoAspect)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        if (!slug) { setProject(null); return }
        const p = await fetchProjectBySlug(slug)
        if (!cancelled) setProject(p)
      } catch {
        if (!cancelled) setProject(null)
      }
    }
    run()
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    function update() {
      const h = window.innerHeight || 600
      const scrollY = window.scrollY || window.pageYOffset
      const progress = Math.max(0, Math.min(1, scrollY / h))
      const next = Math.min(maxBlur, Math.max(minBlur, minBlur + progress * (maxBlur - minBlur)))
      setBlur(next)
      setViewportH(h)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [project?.id])

  const galleryImages = useMemo(() => {
    if (!project) return []
    const images = (project.media ?? []).filter((item) => {
      if (!item || !item.url) return false
      const kind = (item.kind || '').toLowerCase()
      return !kind || kind.includes('image') || kind === 'thumbnail'
    })
    const fallback: ProjectMediaItem[] = project.heroImageUrl
      ? [{
        url: project.heroImageUrl,
        kind: 'image',
        caption: project.name,
        alt: project.name,
        order: 0,
      } as ProjectMediaItem]
      : []
    const merged: ProjectMediaItem[] = images.length ? images : fallback
    const deduped: ProjectMediaItem[] = []
    const seen = new Set<string>()
    merged.forEach((item) => {
      const key = item.url
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(item)
      }
    })
    return deduped
  }, [project?.media, project?.heroImageUrl, project?.name])

  const activeImage = useMemo(() => {
    if (!galleryImages.length) return null
    const safeIndex = Math.max(0, Math.min(activeImageIndex, galleryImages.length - 1))
    return galleryImages[safeIndex]
  }, [galleryImages, activeImageIndex])

  const formattedPrice = useMemo(() => {
    if (!project || project.price == null) return null
    const numeric = typeof project.price === 'number' ? project.price : Number(project.price)
    if (!Number.isFinite(numeric)) return null
    return formatPrice(numeric)
  }, [formatPrice, project])

  // Area unit switcher (m² / ft²) — default to ft² for English
  const [areaUnit, setAreaUnit] = useState<'m2' | 'ft2'>(() =>
    (i18n?.language || '').toLowerCase().startsWith('en') ? 'ft2' : 'm2'
  )
  const numberLocale = useMemo(() => (
    (i18n?.language || '').toLowerCase().startsWith('en') ? 'en-US' : 'pt-BR'
  ), [i18n?.language])

  const formatArea = (m2?: number | null): string | null => {
    if (m2 == null) return null
    if (areaUnit === 'ft2') {
      const ft2 = Math.round((m2 * 10.7639) * 10) / 10 // nearest tenth
      return `${ft2.toLocaleString(numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ft²`
    }
    // m²: show without decimals
    const val = Math.round(m2)
    return `${val.toLocaleString(numberLocale)} m²`
  }

  const stats = useMemo(() => {
    if (!project) return []
    const entries: { label: string; value: string }[] = []
    const f = project?.features ?? {}

    const formatNumber = (value: number | null | undefined) =>
      value == null ? null : Number(value).toLocaleString(numberLocale)

    const bedrooms = formatNumber(f.bedrooms as number | null | undefined)
    if (bedrooms) entries.push({ label: 'Dormitórios', value: bedrooms })
    const suites = formatNumber(f.suites as number | null | undefined)
    if (suites) entries.push({ label: 'Suítes', value: suites })
    const bathrooms = formatNumber(f.bathrooms as number | null | undefined)
    if (bathrooms) entries.push({ label: 'Banheiros', value: bathrooms })
    const parking = formatNumber(f.parkingSpaces as number | null | undefined)
    if (parking) entries.push({ label: 'Vagas', value: parking })
    const areaPriv = formatArea(f.areaPrivateM2 as number | null | undefined)
    if (areaPriv) entries.push({ label: 'Área privativa', value: areaPriv })
    const areaTotal = formatArea(f.areaTotalM2 as number | null | undefined)
    if (areaTotal) entries.push({ label: 'Área total', value: areaTotal })

    const deliveryLabel = project.deliveryDate
      || (f.expectedDeliveryYear ? [f.expectedDeliveryMonth, f.expectedDeliveryYear].filter(Boolean).join(' / ') : null)
    if (deliveryLabel) entries.push({ label: 'Entrega prevista', value: deliveryLabel })

    return entries
  }, [project, areaUnit, numberLocale])

  const unitSummaries = useMemo(() => normalizeUnitsFromProject(project), [project])
  const unitsAvailable = useMemo(() => {
    if (!project) return null
    const direct =
      (project.features as any)?.unitsAvailable ??
      (project.rawFeatures as any)?.unitsAvailable ??
      (project.rawFeatures as any)?.units_available
    if (typeof direct === 'number') return direct
    return unitSummaries.filter((unit) => unit.available !== false).length
  }, [project, unitSummaries])

  const highlights = useMemo(() => {
    const fromProject = Array.isArray(project?.highlights) ? project?.highlights : []
    const rawHighlights = project?.rawFeatures ? project.rawFeatures['highlights'] : undefined
    const fromFeatures = Array.isArray(rawHighlights)
      ? (rawHighlights as unknown[]).map((item) => (typeof item === 'string' ? item : String(item))).filter(Boolean)
      : []
    const selected = fromProject.length ? fromProject : fromFeatures
    return selected.map((item) => item.trim()).filter(Boolean)
  }, [project])

  const locationLabel = useMemo(
    () => [project?.city, project?.state].filter(Boolean).join(', '),
    [project?.city, project?.state],
  )

  const videoId = useMemo(() => youtubeIdFromUrl(project?.videoBgUrl), [project?.videoBgUrl])
  const videoStart = useMemo(() => youtubeStartFromUrl(project?.videoBgUrl), [project?.videoBgUrl])

  if (project === undefined) return <div className="container-padded py-12">Loading…</div>
  if (!project) return <Navigate to="/projects" replace />

  return (
    <div className="relative min-h-screen flex flex-col">
      {videoId && (
        <div aria-hidden className="fixed left-0 top-0 w-screen overflow-hidden -z-20" style={{ height: '100vh', width: '100vw' }}>
          <iframe
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.04)',
              transformOrigin: 'center center',
              minWidth: `${computedMinWidth}px`,
              minHeight: `${computedMinHeight}px`,
              width: 'auto',
              height: 'auto',
              background: 'transparent',
              border: 0,
              filter: `blur(${blur}px)`,
              transition: 'filter 160ms linear, transform 400ms linear',
              willChange: 'filter, transform',
              pointerEvents: 'none',
            }}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1${videoStart ? `&start=${videoStart}` : ''}`}
            title="Background video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          <div aria-hidden style={{ position: 'absolute', inset: 0 }} className="-z-10 bg-black/45" />
        </div>
      )}
      <header ref={heroRef} className="relative overflow-visible pt-24">
        <div className="container-padded relative z-20">
          <div className="inline-block rounded-2xl bg-black/35 backdrop-blur px-4 py-4 text-white shadow-soft">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">{project.name}</h1>
            {locationLabel && <p className="mt-1 text-sm text-white/90">{locationLabel}</p>}
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-40">
        <section className="container-padded py-10">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              {activeImage ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
                  <img
                    src={activeImage.url}
                    alt={activeImage.alt || activeImage.caption || project.name}
                    className="h-[420px] w-full object-cover"
                  />
                  {activeImage.caption && (
                    <div className="border-t border-slate-200 px-4 py-3 text-sm text-slate-600">{activeImage.caption}</div>
                  )}
                </div>
              ) : (
                <div className="grid h-[320px] place-items-center rounded-3xl border border-dashed border-slate-300 bg-white text-slate-400">
                  Galeria indisponível no momento.
                </div>
              )}
              {galleryImages.length > 1 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {galleryImages.map((image, idx) => (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`group overflow-hidden rounded-2xl border ${idx === activeImageIndex ? 'border-brand-600 ring-2 ring-brand-400' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.caption || `${project.name} ${idx + 1}`}
                        className="h-24 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
                <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Valor solicitado</div>
                <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {formattedPrice ?? 'Consultar'}
                </div>
                {formattedPrice && (
                  <p className="mt-2 text-sm text-slate-600">
                    Patrimônio para quem lidera o mercado paulistano — negociações desse porte exigem presença e visão.
                  </p>
                )}
              </div>
              {stats.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-900">Ficha técnica</h2>
                    <div className="inline-flex items-center rounded-full border border-slate-300 bg-white p-0.5 text-xs shadow-sm">
                      <button
                        type="button"
                        onClick={() => setAreaUnit('m2')}
                        className={`px-2 py-1 rounded-full ${areaUnit === 'm2' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                        aria-pressed={areaUnit === 'm2'}
                        title="Square meters"
                      >m²</button>
                      <button
                        type="button"
                        onClick={() => setAreaUnit('ft2')}
                        className={`px-2 py-1 rounded-full ${areaUnit === 'ft2' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                        aria-pressed={areaUnit === 'ft2'}
                        title="Square feet"
                      >ft²</button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {stats.map(({ label, value }) => (
                      <div key={label} className="rounded-2xl border border-slate-200/80 bg-slate-50/60 px-3 py-3">
                        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {highlights.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft">
                  <h2 className="text-base font-semibold text-slate-900">Diferenciais</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
          {unitSummaries.length > 0 && (
            <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Residências disponíveis</h2>
                  <p className="text-sm text-slate-500">Seleção de unidades com métricas prontas para apresentar clientes.</p>
                </div>
                {typeof unitsAvailable === 'number' && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {unitsAvailable} unidade{unitsAvailable === 1 ? '' : 's'} disponível{unitsAvailable === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {unitSummaries.map((unit) => {
                  const rawUnitPrice = typeof unit.price === 'number' ? unit.price : Number(unit.price)
                  const displayUnitPrice = Number.isFinite(rawUnitPrice) ? formatPrice(rawUnitPrice) : 'Sob consulta'
                  return (
                    <article key={unit.id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{unit.label}</h3>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {[unit.unitNumber, unit.floor ? `Andar ${unit.floor}` : null].filter(Boolean).join(' • ') || '—'}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            unit.available === false ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {unit.available === false ? 'Reservado' : 'Disponível'}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                        {unit.bedrooms != null && (
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-slate-500">Dormitórios</dt>
                            <dd className="mt-1 text-base font-semibold text-slate-900">{unit.bedrooms}</dd>
                          </div>
                        )}
                        {unit.bathrooms != null && (
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-slate-500">Banheiros</dt>
                            <dd className="mt-1 text-base font-semibold text-slate-900">{unit.bathrooms}</dd>
                          </div>
                        )}
                        {unit.areaM2 != null && (
                          <div>
                            <dt className="text-xs uppercase tracking-wide text-slate-500">Área privativa</dt>
                            <dd className="mt-1 text-base font-semibold text-slate-900">
                              {formatArea(Number(unit.areaM2))}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-xs uppercase tracking-wide text-slate-500">Valor</dt>
                          <dd className="mt-1 text-base font-semibold text-slate-900">{displayUnitPrice}</dd>
                        </div>
                      </dl>
                      {unit.features?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {unit.features.map((feature) => (
                            <span key={feature} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {unit.floorplanUrl && (
                        <a
                          href={unit.floorplanUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center text-sm font-medium text-sky-600 hover:underline"
                        >
                          Ver planta
                        </a>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )}
          {(project.description || locationLabel) && (
            <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-soft">
              <h2 className="text-lg font-semibold text-slate-900">Sobre o empreendimento</h2>
              {locationLabel && (
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                  {locationLabel}
                </p>
              )}
              {project.description ? (
                <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {project.description}
                </p>
              ) : (
                <p className="mt-4 text-base text-slate-600">
                  Detalhes adicionais serão publicados em breve. Solicite uma apresentação exclusiva para conhecer plantas, memoriais e condições comerciais.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
