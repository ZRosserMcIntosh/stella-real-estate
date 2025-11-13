import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getSiteSettings } from './lib/siteSettings'
import { supabase } from './lib/supabaseClient'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { makeProjectSlug } from './utils/slug'
import { useCurrency } from './context/CurrencyContext'
import WatermarkedImage from './components/WatermarkedImage'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function App() {
  const { t } = useTranslation()
  const heroRef = useRef<HTMLDivElement | null>(null)

  // Make the background video ~20% blurrier overall and start slightly blurred (~10% of max).
  const maxBlur = 25.84 // previous 14.4 * 1.1 ≈ 10% more blur
  const minBlur = maxBlur * 0.1 // start with ~10% of max
  const [blur, setBlur] = useState<number>(minBlur)
  const [heroHeight, setHeroHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800)
  // keep main content visually above the fixed video so it covers the video when scrolling
  // (no need to toggle transparency — we want the white panels to always hide the video)
  const [showMainBg, setShowMainBg] = useState<boolean>(false)
  const [homeVideoId, setHomeVideoId] = useState<string>('bv2x5gn_Tc0')
  const [heroUploadedUrl, setHeroUploadedUrl] = useState<string>('')
  const [heroFallbackImage, setHeroFallbackImage] = useState<string>('')
  const [heroLogoUrl, setHeroLogoUrl] = useState<string>('')
  const [heroLogoLoading, setHeroLogoLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [projectsError, setProjectsError] = useState<string | null>(null)
  const { formatPrice } = useCurrency()
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // video aspect & computed min size so iframe behaves like background-size: cover
  const videoAspect = 16 / 9
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 0
  // ensure iframe is tall enough so (height * aspect) >= viewport width
  const requiredHeightForWidth = Math.ceil(viewportW / videoAspect)
  const computedMinHeight = Math.max(heroHeight, requiredHeightForWidth)
  const computedMinWidth = Math.ceil(computedMinHeight * videoAspect)

  useEffect(() => {
    function update() {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight
      setHeroHeight(h)
      const scrollY = window.scrollY || window.pageYOffset
      const progress = Math.max(0, Math.min(1, scrollY / h))
      // interpolate between minBlur and maxBlur based on scroll progress
      const next = Math.min(maxBlur, Math.max(minBlur, minBlur + progress * (maxBlur - minBlur)))
      setBlur(next)

      // show white background for main content only after user scrolls past the hero
      const headerOffset = 80 // tweak to match header height if needed
      setShowMainBg(scrollY > (h - headerOffset))
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
    let cancelled = false
    const loadVideo = async () => {
      try {
  const s = await getSiteSettings([
    'video_home_id',
    'featured_projects',
    'video_home_uploaded_url',
    'video_home_fallback_image',
    'hero_logo_url',
    'favicon_url',
    'disable_right_click',
    'disable_text_selection',
    'disable_image_dragging'
  ])
        if (cancelled) return
        if (s.video_home_id) setHomeVideoId(s.video_home_id)
  if (s.video_home_uploaded_url) setHeroUploadedUrl(s.video_home_uploaded_url)
  if (s.video_home_fallback_image) setHeroFallbackImage(s.video_home_fallback_image)
        if (s.hero_logo_url) {
          console.log('Hero logo URL loaded from Supabase:', s.hero_logo_url)
          setHeroLogoUrl(s.hero_logo_url)
        } else {
          console.log('No hero logo URL in Supabase, using local fallback')
          setHeroLogoUrl('/stella-logo.png')
        }
        
        // Update favicon
        if (s.favicon_url) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
          if (link) {
            link.href = s.favicon_url
          }
        }
        
        // Privacy settings
        if (s.disable_right_click === 'true') {
          document.addEventListener('contextmenu', (e) => e.preventDefault())
        }
        if (s.disable_text_selection === 'true') {
          document.body.style.userSelect = 'none'
          document.body.style.webkitUserSelect = 'none'
        }
        if (s.disable_image_dragging === 'true') {
          document.addEventListener('dragstart', (e) => {
            if ((e.target as HTMLElement).tagName === 'IMG') {
              e.preventDefault()
            }
          })
        }
        
        // Featured projects: accept JSON array of ids/slugs or a single string
        const raw = (s.featured_projects || '').trim()
        if (raw && (import.meta as any).env?.VITE_SUPABASE_URL) {
          let values: string[] = []
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) values = parsed.map(String)
            else if (typeof parsed === 'string') values = parsed.split(/[\,\s]+/).map(v=>v.trim()).filter(Boolean)
          } catch {
            values = raw.split(/[\,\s]+/).map(v=>v.trim()).filter(Boolean)
          }
          const ids = Array.from(new Set(
            values
              .map((v) => {
                const m = String(v).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
                return m?.[0] || String(v)
              })
              .filter(Boolean)
          ))
          if (ids.length === 1) {
            const { data } = await supabase.from('listings').select('*').eq('id', ids[0]).single()
            if (data) {
              console.log('Featured project loaded (single):', data)
              setFeaturedProjects([data])
            } else {
              console.log('No featured project found for ID:', ids[0])
            }
          } else if (ids.length > 1) {
            const { data } = await supabase.from('listings').select('*').in('id', ids)
            if (data && Array.isArray(data)) {
              console.log('Featured projects loaded (multiple):', data.length, 'projects')
              // preserve the admin's order
              const order: Record<string, number> = ids.reduce((acc, id, i) => { acc[id] = i; return acc }, {} as Record<string, number>)
              data.sort((a: any, b: any) => (order[a.id] ?? 0) - (order[b.id] ?? 0))
              setFeaturedProjects(data)
            } else {
              console.log('No featured projects found for IDs:', ids)
            }
          } else {
            console.log('No featured project IDs configured')
          }
        }
      } catch (err) {
        console.error('Failed to load video settings:', err)
      } finally {
        if (!cancelled) {
          setHeroLogoLoading(false)
        }
      }
    }
    loadVideo()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
        const attempt = async () => {
          const { data, error } = await supabase
            .from('listings')
            .select('id,title,city,state_code,features,media,price,created_at')
            .eq('listing_type', 'new_project')
            .neq('status', 'archived')
            .order('created_at', { ascending: false })
            .limit(6)
          if (error) throw error
          return data || []
        }
        let tries = 0
        let lastErr: any = null
        while (tries < 3) {
          try {
            const rows = await attempt()
            setProjects(rows)
            lastErr = null
            break
          } catch (e: any) {
            lastErr = e
            const msg: string = e?.message || ''
            if (msg.includes('schema cache')) {
              await new Promise(r => setTimeout(r, 600 * (tries + 1)))
              tries++
              continue
            }
            throw e
          }
        }
        if (lastErr) throw lastErr
      } catch (e: any) {
        const msg: string = e?.message || 'Failed to load projects'
        setProjectsError(msg)
      }
    }
    loadProjects()
  }, [])

  const heroFeatured = useMemo(() => {
    const featured = featuredProjects.slice(0, 3)
    console.log('Hero featured projects:', featured.length, 'projects')
    return featured
  }, [featuredProjects])
  const heroGridClasses = useMemo(() => {
    switch (heroFeatured.length) {
      case 1:
        return 'grid-cols-1 justify-items-center w-full max-w-[22rem]'
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 justify-items-center sm:justify-items-center w-full max-w-4xl'
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center sm:justify-items-center w-full max-w-6xl'
    }
  }, [heroFeatured.length])

  // Carousel controls for mobile
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % heroFeatured.length)
  }

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + heroFeatured.length) % heroFeatured.length)
  }

  // Swipe detection for mobile
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  // YouTube fallback overlay support
  const ytPlayerRef = useRef<any>(null)
  const ytReadyRef = useRef(false)
  const [ytPlaying, setYtPlaying] = useState(false)
  const [showFallbackOverlay, setShowFallbackOverlay] = useState(false)

  // Load YT Iframe API when needed
  useEffect(() => {
    if (!homeVideoId || heroUploadedUrl) return
    const ensureYT = () =>
      new Promise<void>((resolve) => {
        const w = window as any
        if (w.YT && w.YT.Player) return resolve()
        const prev = document.getElementById('yt-iframe-api') as HTMLScriptElement | null
        if (!prev) {
          const s = document.createElement('script')
          s.id = 'yt-iframe-api'
          s.src = 'https://www.youtube.com/iframe_api'
          document.head.appendChild(s)
        }
        const check = () => {
          const w = window as any
          if (w.YT && w.YT.Player) resolve()
          else window.setTimeout(check, 60)
        }
        check()
      })

    let cancelled = false
    ensureYT().then(() => {
      if (cancelled) return
      const w = window as any
      const onReady = () => {
        ytReadyRef.current = true
        // give it a moment to start
        window.setTimeout(() => {
          if (!ytPlaying) setShowFallbackOverlay(Boolean(heroFallbackImage))
        }, 1500)
      }
      const onStateChange = (e: any) => {
        // 1 = playing, 0 = ended, 2 = paused, 3 = buffering, -1 = unstarted, 5 = video cued
        const playing = e?.data === 1
        setYtPlaying(playing)
        if (playing) setShowFallbackOverlay(false)
      }
      try {
        ytPlayerRef.current = new w.YT.Player('hero-youtube-embed', {
          events: { onReady, onStateChange },
        })
      } catch {
        // If player init fails, show fallback
        setShowFallbackOverlay(Boolean(heroFallbackImage))
      }
    })

    return () => {
      cancelled = true
      try {
        const p = ytPlayerRef.current
        if (p && p.destroy) p.destroy()
      } catch { /* ignore */ }
      ytPlayerRef.current = null
      ytReadyRef.current = false
      setYtPlaying(false)
    }
  }, [homeVideoId, heroUploadedUrl, heroFallbackImage])

  // Helper function to render a featured card
  const renderFeaturedCard = (p: any) => {
    const mediaItems = Array.isArray(p.media) ? p.media : []
    const thumb = mediaItems.find((m: any) => m.kind === 'thumbnail')?.url || mediaItems[0]?.url
    const secondImage = mediaItems[1]?.url || null
    // Prefer per-unit price: features.unit_price, else min floorplan/units price, else row price
    const f = (p.features || {}) as any
    const toNum = (v: any): number | null => {
      const n = typeof v === 'number' ? v : Number(v)
      return Number.isFinite(n) ? n : null
    }
    let perUnit: number | null = toNum(f.unit_price ?? f.unitPrice)
    if (perUnit == null && Array.isArray(f.floorplans)) {
      for (const plan of f.floorplans) {
        const v = toNum(plan?.pricePerUnit ?? plan?.price_per_unit ?? plan?.price)
        if (v != null) perUnit = perUnit == null ? v : Math.min(perUnit, v)
      }
    }
    if (perUnit == null && Array.isArray(f.units)) {
      for (const u of f.units) {
        const v = toNum(u?.price ?? u?.valor)
        if (v != null) perUnit = perUnit == null ? v : Math.min(perUnit, v)
      }
    }
    const fallbackPrice = toNum(p.price)
    const displayPrice = perUnit != null ? perUnit : (fallbackPrice != null ? fallbackPrice : null)
    const price = displayPrice != null ? formatPrice(displayPrice) : null
    
    return (
      <article className="group relative flex flex-col w-full sm:w-[22rem] min-h-[360px] overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-4 text-left text-slate-900 shadow-2xl backdrop-blur-xl transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-white/60">
        {thumb ? (
          <div className="relative overflow-hidden rounded-2xl">
            {/* On hover, show second image if available */}
            {secondImage ? (
              <div className="relative h-52 w-full">
                <img
                  src={thumb}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-0"
                />
                <img
                  src={secondImage}
                  alt={`${p.title} - alternate`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            ) : (
              <img
                src={thumb}
                alt={p.title}
                className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            )}
          </div>
        ) : (
          <div className="grid h-52 w-full place-items-center rounded-2xl bg-slate-100/80 text-slate-400">
            {t('home.featured.noImage', { defaultValue: 'No image' })}
          </div>
        )}
        <div className="mt-3 space-y-2 min-h-[92px]">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{p.title}</h3>
          <p className="text-sm text-slate-600">{[p.city, p.state_code].filter(Boolean).join(', ')}</p>
          {price ? (
            <p className="text-xl font-bold text-brand-700 tracking-tight truncate">{price}</p>
          ) : (
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              {t('home.featured.priceUnavailable', { defaultValue: 'Price on request' })}
            </p>
          )}
        </div>
      </article>
    )
  }

  return (
  <div className="relative min-h-screen flex flex-col">
      {/* Fixed background video that fills edge-to-edge at the top (covers the hero area).
          Height is controlled by heroHeight so the video sits behind the header and hero content. */}
      <div
        aria-hidden
        className="fixed left-0 top-0 w-screen overflow-hidden pointer-events-none -z-20"
        style={{ height: `${heroHeight}px`, width: '100vw' }}
      >
  {heroUploadedUrl ? (
          <video
            src={heroUploadedUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(1.06)`,
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
              objectFit: 'cover'
            }}
          />
        ) : homeVideoId ? (
          <>
          <iframe
            // cover the viewport horizontally and the hero vertically to avoid letterboxing
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(1.06)`,
              transformOrigin: 'center center',
              // ensure the iframe covers horizontally by using the computed min height
              minWidth: `${computedMinWidth}px`,
              minHeight: `${computedMinHeight}px`,
              width: 'auto',
              height: 'auto',
              background: 'transparent',
              border: 0,
              filter: `blur(${blur}px)`,
              opacity: showFallbackOverlay ? 0 : 1,
              transition: 'filter 160ms linear, transform 400ms linear',
              willChange: 'filter, transform',
              pointerEvents: 'none'
            }}
            id="hero-youtube-embed"
            src={`https://www.youtube-nocookie.com/embed/${homeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${homeVideoId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(typeof window!== 'undefined' ? window.location.origin : '')}`}
            title="Background video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          {heroFallbackImage && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              src={heroFallbackImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(1.06)`,
                transformOrigin: 'center center',
                minWidth: `${computedMinWidth}px`,
                minHeight: `${computedMinHeight}px`,
                width: 'auto',
                height: 'auto',
                background: 'transparent',
                border: 0,
                filter: `blur(${blur}px)`,
                transition: 'filter 160ms linear, transform 400ms linear, opacity 200ms ease-in-out',
                willChange: 'filter, transform, opacity',
                pointerEvents: 'none',
                objectFit: 'cover',
                opacity: showFallbackOverlay ? 1 : 0,
              }}
            />
          )}
          </>
        ) : heroFallbackImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            src={heroFallbackImage}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(1.06)`,
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
              objectFit: 'cover'
            }}
          />
        ) : null}
        {/* slightly darker overlay for more contrast */}
        <div aria-hidden style={{ position: 'absolute', inset: 0 }} className="-z-10 bg-black/50 md:bg-black/45" />
      </div>

  {/* Header is provided by the shared Layout. */}

      {/* HERO — content area that sits visually over the video. Keep ref to measure height. */}
      <section
        ref={heroRef}
        className="relative overflow-hidden h-[75vh] md:h-[80vh] lg:h-[90vh] flex items-center"
        aria-label="Hero"
      >
        <div className="container-padded relative z-20 flex h-full w-full items-center justify-center py-12">
          <div className="w-full max-w-6xl flex flex-col items-center gap-6">
            {!heroLogoLoading && heroLogoUrl ? (
              <img
                src={heroLogoUrl}
                alt="Stella"
                className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/stella-logo.png') {
                    console.log('Hero logo failed to load, using fallback: /stella-logo.png');
                    target.src = '/stella-logo.png';
                  }
                }}
              />
            ) : heroLogoLoading ? (
              <div className="h-32 sm:h-40 md:h-48 lg:h-56 w-64 bg-white/10 animate-pulse rounded-lg" />
            ) : null}
            {heroFeatured.length > 0 && (
              <>
                {/* Mobile Carousel (< md breakpoint) */}
                <div 
                  className="md:hidden relative w-full max-w-[22rem] mx-auto"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="relative overflow-hidden">
                    <div 
                      className="flex transition-transform duration-300 ease-out"
                      style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                    >
                      {heroFeatured.map((p: any) => {
                        const card = renderFeaturedCard(p)
                        if (p.listing_type === 'new_project') {
                          const slug = makeProjectSlug(p.title || 'project', p.id)
                          return (
                            <div key={p.id} className="min-w-full px-2">
                              <Link
                                to={`/projetos/${slug}`}
                                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                                aria-label={p.title}
                              >
                                {card}
                              </Link>
                            </div>
                          )
                        }
                        return (
                          <div key={p.id} className="min-w-full px-2">
                            {card}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Carousel Controls */}
                  {heroFeatured.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-900" />
                      </button>
                      
                      {/* Dots Indicator */}
                      <div className="flex justify-center gap-2 mt-4">
                        {heroFeatured.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCarouselIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === carouselIndex 
                                ? 'bg-white w-6' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Desktop Grid (>= md breakpoint) */}
                <div className={`hidden md:grid gap-4 text-slate-900 ${heroGridClasses}`}>
                  {heroFeatured.map((p: any) => {
                    const card = renderFeaturedCard(p)
                    if (p.listing_type === 'new_project') {
                      const slug = makeProjectSlug(p.title || 'project', p.id)
                      return (
                        <Link
                          key={p.id}
                          to={`/projetos/${slug}`}
                          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                          aria-label={p.title}
                        >
                          {card}
                        </Link>
                      )
                    }
                    return (
                      <div key={p.id}>
                        {card}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

  {/* MAIN CONTENT */}
  <main className="flex-1 relative z-40 bg-gradient-to-b from-white/98 via-white/95 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
    {/* New Projects Section */}
    {projects.length > 0 && (
      <section id="new-projects" className="relative py-24 overflow-hidden">
        {/* Very subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/10 via-white/80 to-indigo-50/10 dark:from-brand-950/20 dark:via-transparent dark:to-indigo-950/10" />
        
        <div className="container-padded relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              {t('home.newProjects.title', { defaultValue: 'New Projects' })}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('home.newProjects.subtitle', { defaultValue: 'Discover our latest developments in prime locations' })}
            </p>
            {projectsError && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{projectsError}</p>}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => {
              const thumb = (p.media || []).find((m: any) => m.kind === 'thumbnail')?.url || (p.media || [])[0]?.url
              const secondPhoto = (p.media || []).filter((m: any) => m.kind !== 'video_bg' && m.kind !== 'thumbnail')[0]?.url || (p.media || [])[1]?.url
              const isHovered = hoveredProjectId === p.id
              const displayImage = isHovered && secondPhoto ? secondPhoto : thumb
              const expected = p.features?.expected_delivery_month || p.features?.expected_delivery_year
              const f = (p as any).features || {}
              const perUnit: number | null =
                typeof f.unit_price === 'number'
                  ? f.unit_price
                  : (typeof (p as any).price === 'number' && Number.isFinite((p as any).price) ? (p as any).price : null)
              return (
                <article 
                  key={p.id} 
                  className="group relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800/60 p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                  onMouseEnter={() => setHoveredProjectId(p.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt={p.title} 
                        className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-56 bg-slate-100 dark:bg-slate-700 rounded-2xl grid place-items-center text-slate-400 dark:text-slate-500 text-sm">No image</div>
                    )}
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[p.city, p.state_code].filter(Boolean).join(', ')}
                    </p>
                    {expected && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {t('home.newProjects.delivery', { defaultValue: 'Delivery' })}: {[p.features?.expected_delivery_month, p.features?.expected_delivery_year].filter(Boolean).join(' ')}
                      </p>
                    )}
                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{t('home.newProjects.startingFrom', { defaultValue: 'Starting from' })}</span>
                        <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{formatPrice(perUnit, { fallback: '—' })}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    )}

    {/* About Section */}
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Very light elegant background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900" />
      <div className="absolute inset-0 opacity-3 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(100, 116, 139) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="container-padded relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
            {t('home.about.title')}
          </h2>
          <p className="text-xl text-slate-700 dark:text-white/90 leading-relaxed font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t('home.about.body')}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/sobre" 
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-white px-8 py-3 text-sm font-semibold text-white dark:text-slate-900 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {t('home.about.learnMore', { defaultValue: 'Learn More' })}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link 
              to="/imoveis" 
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/30 px-8 py-3 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            >
              {t('home.about.viewProperties', { defaultValue: 'View Properties' })}
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Contact Section */}
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Very light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-brand-50/10 to-indigo-50/15 dark:from-slate-900 dark:via-brand-950/20 dark:to-indigo-950/30" />
      
      <div className="container-padded relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              {t('home.contact.title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-light" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('home.contact.subtitle', { defaultValue: 'Get in touch with our team of real estate experts' })}
            </p>
          </div>
          
          <form className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-200/50 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.contact.name', { defaultValue: 'Name' })}</span>
                  <input 
                    type="text" 
                    placeholder={t('home.contact.namePlaceholder', { defaultValue: 'Your name' })}
                    className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.contact.email')}</span>
                  <input 
                    type="email" 
                    placeholder={t('home.contact.emailPlaceholder', { defaultValue: 'you@example.com' })}
                    className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </label>
              </div>
              
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.contact.phone', { defaultValue: 'Phone' })}</span>
                <input 
                  type="tel" 
                  placeholder={t('home.contact.phonePlaceholder', { defaultValue: '+55 (11) 99999-9999' })}
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </label>
              
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.contact.message')}</span>
                <textarea 
                  placeholder={t('home.contact.messagePlaceholder', { defaultValue: 'Tell us how we can help...' })}
                  rows={5} 
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                />
              </label>
              
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                {t('home.contact.send')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>

  {/* Footer is provided by the shared Layout. */}

      {/* WhatsApp floating button — replace PHONE_NUMBER with e.g. 15551234567 (country + number, no plus) */}
      <a
        href="https://wa.me/5511986410429?text=Hello%2C%20I%27m%20interested%20in%20your%20listings"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.92 11.92 0 0012 0C5.37 0 .08 5.29.08 11.92c0 2.1.55 4.16 1.6 5.98L0 24l6.36-1.66A11.9 11.9 0 0012 23.84c6.63 0 11.92-5.29 11.92-11.92 0-3.18-1.24-6.17-3.4-8.44zM12 21.66c-1.3 0-2.57-.35-3.68-1.02l-.26-.15-3.78.99.99-3.69-.16-.27A8.45 8.45 0 013.56 11.9C3.56 7.04 7.14 3.46 12 3.46c4.86 0 8.44 3.58 8.44 8.44 0 4.86-3.58 8.44-8.44 8.44z"/>
          <path d="M17.2 14.06c-.27-.14-1.6-.79-1.85-.88-.25-.09-.44-.14-.63.14-.2.27-.77.88-.95 1.06-.17.18-.35.2-.65.07-.3-.13-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.12-.6.12-.12.27-.3.4-.45.14-.15.18-.27.28-.46.09-.18.05-.34-.03-.48-.08-.14-.63-1.52-.86-2.09-.23-.55-.47-.47-.64-.48l-.55-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.12 2.82.14.18 1.93 2.95 4.67 4.13 1.64.72 2.32.83 3.15.7.48-.07 1.6-.65 1.83-1.28.24-.62.24-1.16.17-1.28-.07-.12-.26-.18-.53-.32z"/>
        </svg>
      </a>
    </div>
  );
}
