import React from 'react'

type DevicePreset = 'desktop' | 'tablet' | 'mobile'

interface SiteComponent {
  id: string
  label: string
  type: 'hero' | 'gallery' | 'cta' | 'testimonials' | 'faq' | 'map' | 'form' | 'stats' | 'blog'
  description: string
}

interface SitePage {
  name: string
  path: string
  components: SiteComponent[]
}

type PageKey = 'home' | 'listings' | 'team' | 'projects'

const createId = () => Math.random().toString(36).slice(2, 8)

const componentLibrary: SiteComponent[] = [
  { id: 'lib-hero-split', label: 'Hero · Skyline Split', type: 'hero', description: 'Full-bleed hero with dual imagery and CTA.' },
  { id: 'lib-gallery-waterfall', label: 'Gallery · Waterfall', type: 'gallery', description: 'Editorial waterfall layout for featured listings.' },
  { id: 'lib-cta-pillars', label: 'CTA · Pillars', type: 'cta', description: 'Bold CTA paired with performance pillars.' },
  { id: 'lib-testimonial-loop', label: 'Testimonials · Loop', type: 'testimonials', description: 'Auto-looping testimonials with client avatars.' },
  { id: 'lib-faq-accordion', label: 'FAQ · Accordion', type: 'faq', description: 'Compact accordion with search assist.' },
  { id: 'lib-map-hotspots', label: 'Map · Hotspots', type: 'map', description: 'Interactive map with market snapshot overlays.' },
  { id: 'lib-form-floating', label: 'Form · Floating', type: 'form', description: 'Floating lead form with multi-step support.' },
  { id: 'lib-stats-marquee', label: 'Stats · Marquee', type: 'stats', description: 'Animated marquee highlighting brokerage wins.' },
  { id: 'lib-blog-featured', label: 'Blog · Featured', type: 'blog', description: 'Featured stories with editorial card design.' },
]

const initialPages: Record<PageKey, SitePage> = {
  home: {
    name: 'Home',
    path: '/',
    components: [
      { id: 'home-hero', label: 'Hero · Sunrise Penthouse', type: 'hero', description: 'Immersive hero with cinematic flyover.' },
      { id: 'home-stats', label: 'Stats · Four Columns', type: 'stats', description: 'Track record highlights with counters.' },
      { id: 'home-gallery', label: 'Gallery · Featured Listings', type: 'gallery', description: 'Showcase the latest exclusives.' },
      { id: 'home-testimonials', label: 'Testimonials · Signature Clients', type: 'testimonials', description: 'Luxury buyer proof points.' },
      { id: 'home-cta', label: 'CTA · Consultation', type: 'cta', description: 'High-converting consultation invitation.' },
    ],
  },
  listings: {
    name: 'Listings',
    path: '/listings',
    components: [
      { id: 'listings-hero', label: 'Hero · Filter Bar', type: 'hero', description: 'Contextual hero with instant filters.' },
      { id: 'listings-grid', label: 'Gallery · Smart Grid', type: 'gallery', description: 'Adaptive inventory grid with badges.' },
      { id: 'listings-map', label: 'Map · Split View', type: 'map', description: 'Dual-pane map plus listing cards.' },
      { id: 'listings-faq', label: 'FAQ · Buyers', type: 'faq', description: 'Education moments for prospects.' },
    ],
  },
  team: {
    name: 'Team',
    path: '/team',
    components: [
      { id: 'team-hero', label: 'Hero · Portrait Studio', type: 'hero', description: 'Human-centered hero for the squad.' },
      { id: 'team-grid', label: 'Gallery · Team Grid', type: 'gallery', description: 'Agents with hover bios and social proof.' },
      { id: 'team-values', label: 'Stats · Values', type: 'stats', description: 'Principles paired with outcomes.' },
      { id: 'team-cta', label: 'CTA · Join Us', type: 'cta', description: 'Recruitment CTA with application flow.' },
    ],
  },
  projects: {
    name: 'Projects',
    path: '/projects',
    components: [
      { id: 'projects-hero', label: 'Hero · Development Spotlight', type: 'hero', description: 'Hero spotlighting active developments.' },
      { id: 'projects-gallery', label: 'Gallery · Case Studies', type: 'gallery', description: 'Recent projects with performance metrics.' },
      { id: 'projects-testimonials', label: 'Testimonials · Developers', type: 'testimonials', description: 'Developer testimonials with outcomes.' },
      { id: 'projects-form', label: 'Form · Proposal Request', type: 'form', description: 'Embedded proposal request form.' },
    ],
  },
}

const activeSites = [
  { name: 'Stella São Paulo', status: 'Live', domain: 'saopaulo.stella.com.br', updatedAt: '3 hours ago' },
  { name: 'Stella Rio', status: 'Design', domain: 'rio.stella.com.br', updatedAt: 'Yesterday' },
  { name: 'Stella Miami', status: 'Prototype', domain: 'miami.stella.com', updatedAt: 'In progress' },
]

const siteInsights = [
  { label: 'Last publish', value: '12 Apr · 18:42', tone: 'text-emerald-300', sub: 'Deployment #184' },
  { label: 'Unique visitors (7d)', value: '18,942', tone: 'text-indigo-300', sub: '+14% vs prior 7d' },
  { label: 'Lead conversion', value: '3.9%', tone: 'text-slate-200', sub: 'Goal 3.5%' },
]

const activityLog = [
  { id: 'act-01', label: 'Homepage hero swapped to Skyline Split', author: 'Maria (Marketing)', time: '12 Apr · 18:40' },
  { id: 'act-02', label: 'Listings map enabled for Jardins district site', author: 'Igor (Product)', time: '12 Apr · 10:12' },
  { id: 'act-03', label: 'Balé automation: social drop after publish', author: 'Workflow Bot', time: '11 Apr · 22:07' },
  { id: 'act-04', label: 'Miami microsite duplicated from São Paulo template', author: 'Andre (Expansion)', time: '11 Apr · 09:54' },
]

const DATA_KEY = 'application/x-stella-component'

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function StellaSiteBuilder() {
  const [pages, setPages] = React.useState(initialPages)
  const [activePage, setActivePage] = React.useState<PageKey>('home')
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)
  const [device, setDevice] = React.useState<DevicePreset>('desktop')
  const [activeLibraryType, setActiveLibraryType] = React.useState<SiteComponent['type'] | 'all'>('all')
  const [activeSiteIndex, setActiveSiteIndex] = React.useState(0)
  const [draggingSource, setDraggingSource] = React.useState<'existing' | 'library' | null>(null)
  const [dragHoverIndex, setDragHoverIndex] = React.useState<number | null>(null)

  const pageOrder: PageKey[] = ['home', 'listings', 'team', 'projects']
  const selectedPage = pages[activePage]
  const filteredLibrary = componentLibrary.filter((component) => activeLibraryType === 'all' || component.type === activeLibraryType)

  const handleReorder = (pageKey: PageKey, componentId: string, targetIndex: number) => {
    setPages((prev) => {
      const page = prev[pageKey]
      const currentIndex = page.components.findIndex((component) => component.id === componentId)
      if (currentIndex < 0 || targetIndex < 0 || targetIndex > page.components.length) return prev
      const updated = [...page.components]
      const [moved] = updated.splice(currentIndex, 1)
      const adjustedIndex = currentIndex < targetIndex ? targetIndex - 1 : targetIndex
      updated.splice(adjustedIndex, 0, moved)
      return { ...prev, [pageKey]: { ...page, components: updated } }
    })
  }

  const handleInsert = (pageKey: PageKey, libraryId: string, targetIndex: number) => {
    const libraryComponent = componentLibrary.find((item) => item.id === libraryId)
    if (!libraryComponent) return
    setPages((prev) => {
      const page = prev[pageKey]
      const updated = [...page.components]
      updated.splice(targetIndex, 0, {
        ...libraryComponent,
        id: `${libraryComponent.id}-${createId()}`,
      })
      return { ...prev, [pageKey]: { ...page, components: updated } }
    })
  }

  const handleDuplicate = (pageKey: PageKey, componentId: string) => {
    setPages((prev) => {
      const page = prev[pageKey]
      const index = page.components.findIndex((component) => component.id === componentId)
      if (index < 0) return prev
      const component = page.components[index]
      const clone: SiteComponent = {
        ...component,
        id: `${component.id}-copy-${createId()}`,
        label: `${component.label} (copy)`,
      }
      const updated = [...page.components]
      updated.splice(index + 1, 0, clone)
      return { ...prev, [pageKey]: { ...page, components: updated } }
    })
  }

  const handleRemove = (pageKey: PageKey, componentId: string) => {
    setPages((prev) => {
      const page = prev[pageKey]
      return {
        ...prev,
        [pageKey]: {
          ...page,
          components: page.components.filter((component) => component.id !== componentId),
        },
      }
    })
    if (selectedComponent === componentId) setSelectedComponent(null)
  }

  const handleReplace = (pageKey: PageKey, componentId: string, replacement: SiteComponent) => {
    setPages((prev) => {
      const page = prev[pageKey]
      return {
        ...prev,
        [pageKey]: {
          ...page,
          components: page.components.map((component) =>
            component.id === componentId
              ? { ...replacement, id: `${replacement.id}-${createId()}` }
              : component,
          ),
        },
      }
    })
  }

  const handleAddComponent = (pageKey: PageKey, libraryId: string) => {
    handleInsert(pageKey, libraryId, pages[pageKey].components.length)
  }

  const resetDragState = () => {
    setDraggingSource(null)
    setDragHoverIndex(null)
  }

  const handleDragStartExisting = (event: React.DragEvent<HTMLDivElement>, componentId: string) => {
    setDraggingSource('existing')
    event.dataTransfer.setData(DATA_KEY, JSON.stringify({ source: 'existing', componentId }))
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setDragImage(event.currentTarget, 20, 20)
  }

  const handleDragStartLibrary = (event: React.DragEvent<HTMLButtonElement>, libraryId: string) => {
    setDraggingSource('library')
    event.dataTransfer.setData(DATA_KEY, JSON.stringify({ source: 'library', libraryId }))
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOverIndex = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = draggingSource === 'library' ? 'copy' : 'move'
    if (dragHoverIndex !== index) setDragHoverIndex(index)
  }

  const handleDropOnIndex = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    const data = event.dataTransfer.getData(DATA_KEY)
    if (!data) {
      resetDragState()
      return
    }
    const payload = JSON.parse(data) as { source: 'existing' | 'library'; componentId?: string; libraryId?: string }
    if (payload.source === 'existing' && payload.componentId) {
      handleReorder(activePage, payload.componentId, index)
    }
    if (payload.source === 'library' && payload.libraryId) {
      handleInsert(activePage, payload.libraryId, index)
    }
    resetDragState()
  }

  const handleDragEnd = () => {
    resetDragState()
  }

  const filteredLibraryForDrop = React.useMemo(() => filteredLibrary, [filteredLibrary])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.9)]">
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">
              Constellation Studio
            </div>
            <div className="hidden items-center gap-3 text-sm text-slate-400 xl:flex">
              <span>{activeSites[activeSiteIndex].domain}</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                {activeSites[activeSiteIndex].status}
              </span>
              <span className="text-xs text-slate-500">Updated {activeSites[activeSiteIndex].updatedAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white xl:inline-flex"
              onClick={() => setActiveSiteIndex((index) => (index + 1) % activeSites.length)}
            >
              Switch site
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Share preview
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-white transition hover:bg-indigo-400"
            >
              Publish draft
            </button>
          </div>
        </header>

        <div className="flex min-h-[720px]">
          <aside className="hidden w-[320px] shrink-0 flex-col border-r border-slate-800 bg-slate-900/60 px-6 py-8 lg:flex">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-900/40">
              <h3 className="text-sm font-semibold text-white">Template Gallery</h3>
              <p className="mt-1 text-xs text-slate-400">100+ curated templates engineered for Stella-grade launches.</p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                Browse templates
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-900/40">
              <h3 className="text-sm font-semibold text-white">Active Sites</h3>
              <ul className="mt-3 space-y-3 text-xs">
                {activeSites.map((site, index) => (
                  <li
                    key={site.name}
                    className={classNames(
                      'rounded-xl border px-3 py-2 transition',
                      index === activeSiteIndex
                        ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-900/40'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white',
                    )}
                  >
                    <div className="font-semibold">{site.name}</div>
                    <div className="text-slate-400">{site.domain}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-900/40">
              <h3 className="text-sm font-semibold text-white">Component Library</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {(['all', 'hero', 'gallery', 'cta', 'testimonials', 'faq', 'map', 'form', 'stats', 'blog'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveLibraryType(type === 'all' ? 'all' : type)}
                    className={classNames(
                      'rounded-full border px-3 py-1 capitalize transition',
                      activeLibraryType === type
                        ? 'border-white bg-white text-slate-900'
                        : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white',
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-400">
                {filteredLibraryForDrop.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(event) => handleDragStartLibrary(event, item.id)}
                    onDragEnd={handleDragEnd}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-left text-slate-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                  >
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.type}</div>
                    <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-900/40">
              <h3 className="text-sm font-semibold text-white">Automation Recipes</h3>
              <p className="mt-2 text-xs text-slate-400">
                Sync Constelação data, trigger Balé workflows, schedule socials the moment you publish.
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/30"
              >
                Configure automations
              </button>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col bg-slate-950 px-8 py-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {siteInsights.map((insight) => (
                <div key={insight.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{insight.label}</div>
                  <div className={classNames('mt-2 text-xl font-semibold', insight.tone)}>{insight.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{insight.sub}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {pageOrder.map((pageKey) => (
                  <button
                    key={pageKey}
                    type="button"
                    onClick={() => {
                      setActivePage(pageKey)
                      setSelectedComponent(null)
                    }}
                    className={classNames(
                      'rounded-full px-4 py-2 text-sm font-semibold transition',
                      activePage === pageKey
                        ? 'bg-white text-slate-900 shadow-lg shadow-black/40'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    {pages[pageKey].name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 p-1 text-xs font-semibold text-slate-400">
                {(['desktop', 'tablet', 'mobile'] as DevicePreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDevice(preset)}
                    className={classNames(
                      'rounded-full px-3 py-1 capitalize transition',
                      device === preset ? 'bg-white text-slate-900 shadow' : 'hover:text-white',
                    )}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedPage.name} layout</h3>
                  <p className="text-xs text-slate-500">Reorder, duplicate, swap. Draft saves continuously.</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  Preview draft
                </button>
              </div>

              <div className="mt-5 space-y-2">
                <div
                  onDragOver={(event) => handleDragOverIndex(event, 0)}
                  onDragEnter={(event) => handleDragOverIndex(event, 0)}
                  onDragLeave={() => setDragHoverIndex(null)}
                  onDrop={(event) => handleDropOnIndex(event, 0)}
                  className={classNames(
                    'h-3 rounded-full transition-all duration-150',
                    dragHoverIndex === 0 && draggingSource
                      ? 'bg-indigo-500/60 shadow-[0_0_0_4px_rgba(99,102,241,0.25)]'
                      : 'bg-transparent',
                  )}
                />
                {selectedPage.components.map((component, index) => (
                  <React.Fragment key={component.id}>
                    <div
                      draggable
                      onDragStart={(event) => handleDragStartExisting(event, component.id)}
                      onDragEnd={handleDragEnd}
                      className={classNames(
                        'rounded-2xl border bg-slate-900/80 p-4 transition',
                        selectedComponent === component.id
                          ? 'border-indigo-400/50 shadow-lg shadow-indigo-900/30'
                          : 'border-slate-800 hover:border-slate-600',
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{component.label}</div>
                          <div className="text-xs text-slate-500">{component.description}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs">
                          <button
                            type="button"
                            onClick={() => handleReorder(activePage, component.id, Math.max(0, index - 1))}
                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:border-slate-500 hover:text-white"
                          >
                            Move up
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(activePage, component.id, Math.min(selectedPage.components.length, index + 2))}
                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:border-slate-500 hover:text-white"
                          >
                            Move down
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(activePage, component.id)}
                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:border-slate-500 hover:text-white"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(activePage, component.id)}
                            className="rounded-full border border-rose-500/40 px-3 py-1 text-rose-300 transition hover:border-rose-300 hover:text-rose-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                            {component.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedComponent(component.id)}
                            className="text-xs font-semibold text-indigo-300 transition hover:text-white"
                          >
                            Replace…
                          </button>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">#{index + 1}</span>
                      </div>

                      {selectedComponent === component.id && (
                        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Swap component</p>
                            <button
                              type="button"
                              onClick={() => setSelectedComponent(null)}
                              className="text-xs text-slate-500 transition hover:text-white"
                            >
                              Close
                            </button>
                          </div>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {filteredLibraryForDrop.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleReplace(activePage, component.id, item)}
                                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs text-slate-300 transition hover:border-indigo-400/40 hover:text-indigo-200"
                              >
                                <div className="text-sm font-semibold text-white">{item.label}</div>
                                <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-500">{item.type}</div>
                                <p className="mt-2 text-xs text-slate-400">{item.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      onDragOver={(event) => handleDragOverIndex(event, index + 1)}
                      onDragEnter={(event) => handleDragOverIndex(event, index + 1)}
                      onDragLeave={() => setDragHoverIndex(null)}
                      onDrop={(event) => handleDropOnIndex(event, index + 1)}
                      className={classNames(
                        'h-3 rounded-full transition-all duration-150',
                        dragHoverIndex === index + 1 && draggingSource
                          ? 'bg-indigo-500/60 shadow-[0_0_0_4px_rgba(99,102,241,0.25)]'
                          : 'bg-transparent',
                      )}
                    />
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-center">
                <p className="text-sm font-semibold text-white">Add a section</p>
                <p className="mt-1 text-xs text-slate-500">Quick-add components without leaving the canvas.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                  {filteredLibraryForDrop.map((item) => (
                    <button
                      key={`add-${item.id}`}
                      type="button"
                      onClick={() => handleAddComponent(activePage, item.id)}
                      className="rounded-full border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">Live preview ({device})</h3>
              <p className="mt-2 text-xs text-slate-500">Real-time preview shell renders the actual route with undo history.</p>
              <div
                className={classNames(
                  'mx-auto mt-6 rounded-[32px] border border-slate-800 bg-slate-950 shadow-inner shadow-black/30',
                  device === 'desktop' && 'h-[380px] w-full max-w-5xl',
                  device === 'tablet' && 'h-[340px] max-w-3xl',
                  device === 'mobile' && 'h-[320px] max-w-sm',
                )}
              >
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  Drag-and-drop preview goes live with the real-time renderer.
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Activity & approvals</h3>
                <button
                  type="button"
                  className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  View history
                </button>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {activityLog.map((item) => (
                  <li key={item.id} className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 shadow shadow-black/30">
                    <span className="font-semibold text-white">{item.label}</span>
                    <div className="text-xs text-slate-500">
                      {item.author} · {item.time}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
