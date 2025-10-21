import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { supabase } from '../lib/supabaseClient'

type ProjectLite = {
  id: string
  title: string
  city: string | null
  state_code: string | null
  media: Array<{ kind: string; url: string }>
}

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [hoverOpen, setHoverOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectLite[]>([])
  const [loading, setLoading] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!isHome) return
      if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id,title,city,state_code,media')
          .eq('listing_type', 'new_project')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })
          .limit(4)
        if (error) throw error
        if (!cancelled) setProjects((data || []) as any)
      } catch {
        if (!cancelled) setProjects([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [isHome])
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header className="z-50 backdrop-blur bg-white/70 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="container-padded flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          {!logoFailed ? (
            // Place image at public/stella-mary-logo.png
            // Will be served at /stella-mary-logo.png
            // Size scales with height, preserves aspect via object-contain
            // eslint-disable-next-line jsx-a11y/alt-text
            <img
              src="/stella-mary-logo.png"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
              alt={t('header.brand') as string}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 shadow-soft grid place-items-center text-white">
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide leading-3 text-center">
                <div>STELLA</div>
                <div>LOGO</div>
              </div>
            </div>
          )}
        </Link>
  {/* Desktop nav */}
  <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => isHome && setHoverOpen(true)}
            onMouseLeave={() => setHoverOpen(false)}
          >
            <Link className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" to="/projects">
              {t('header.nav.projects')}
            </Link>
            {isHome && hoverOpen && (projects.length > 0 || loading) && (
              <div className="absolute left-0 mt-2 w-[320px] sm:w-[420px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-3">
                <div className="text-xs text-slate-500 px-1">New Projects</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {projects.map((p) => {
                    const thumb = (p.media || []).find(m => m.kind === 'thumbnail')?.url || (p.media || [])[0]?.url
                    const slugBase = (p.title || 'project').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
                    const slug = `${slugBase}-${p.id}`
                    return (
                      <Link key={p.id} to={`/projects/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 p-2 transition-colors">
                        {thumb ? (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img src={thumb} className="h-12 w-12 rounded-md object-cover flex-none" />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400 text-xs flex-none">No image</div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{p.title}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{[p.city, p.state_code].filter(Boolean).join(', ')}</div>
                        </div>
                      </Link>
                    )
                  })}
                  {!loading && projects.length === 0 && (
                    <div className="text-sm text-slate-600 px-2 py-3">No projects yet.</div>
                  )}
                </div>
                <div className="mt-2 border-t border-slate-200 dark:border-slate-800 pt-2 text-right">
                  <Link to="/projects" className="text-xs text-brand-700 dark:text-brand-400 hover:underline">View all</Link>
                </div>
              </div>
            )}
          </div>
          <Link className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" to="/listings">{t('header.nav.listings')}</Link>
          <Link className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" to="/about">{t('header.nav.about')}</Link>
          <Link className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" to="/contact">{t('header.nav.contact')}</Link>
          <Link className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors" to="/login">{t('header.nav.employeeLogin')}</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <CurrencySwitcher />
          <Link to="/contact" className="hidden sm:inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 transition-colors shadow-soft">
            {t('header.cta')}
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              {mobileOpen ? (
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="sm:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-50 mt-[60px] max-h-[calc(100vh-60px)] overflow-y-auto rounded-b-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-2 text-base font-medium">
              <Link to="/projects" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.projects')}
              </Link>
              <Link to="/listings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.listings')}
              </Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.about')}
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.contact')}
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.employeeLogin')}
              </Link>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">
                {t('header.cta')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
