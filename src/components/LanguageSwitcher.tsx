import React from 'react'
import i18n from '../i18n'

type LangCode = 'pt' | 'es' | 'en'

const LANGS: Record<LangCode, { flag: string; code: string; name: string }> = {
  pt: { flag: '🇧🇷', code: 'PT', name: 'Português' },
  es: { flag: '🇪🇸', code: 'ES', name: 'Español' },
  en: { flag: '🇺🇸', code: 'EN', name: 'English' },
}

export default function LanguageSwitcher() {
  const initial = (['pt', 'es', 'en'] as LangCode[]).includes(i18n.language as LangCode)
    ? (i18n.language as LangCode)
    : 'pt'
  const [lang, setLang] = React.useState<LangCode>(initial)
  const [open, setOpen] = React.useState(false)
  const [manual, setManual] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const closeTimer = React.useRef<number | null>(null)

  const change = (newLang: LangCode) => {
    if (newLang === lang) return setOpen(false)
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
    setLang(newLang)
    setOpen(false)
    setManual(false)
  }

  // Boxed trigger that spells out the language name
  const triggerCls = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm text-sm hover:bg-slate-50 transition-colors'
  const menuCls = 'absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden'
  const itemBase = 'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left'
  const itemActive = 'w-full flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-left'

  const current = LANGS[lang]

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!manual) return
      const el = wrapperRef.current
      if (el && !el.contains(e.target as Node)) {
        setOpen(false)
        setManual(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [manual])

  const handleMouseEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    if (manual) return // keep open when manually toggled
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 160)
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      aria-label="Language switcher"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={triggerCls}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          // Toggle manual open; if opening manually, ensure open
          setManual((m) => {
            const next = !m
            setOpen(next || open)
            if (!next) setOpen(false)
            return next
          })
        }}
      >
        <span className="font-medium tracking-wide">{current.name}</span>
        <svg className="h-3.5 w-3.5 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className={menuCls} role="listbox" aria-activedescendant={`lang-${lang}`}>
          <button
            id="lang-pt"
            onClick={() => change('pt')}
            className={lang === 'pt' ? itemActive : itemBase}
            role="option"
            aria-selected={lang === 'pt'}
          >
            <span aria-hidden>🇧🇷</span>
            <span className="font-medium">PT</span>
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">Português</span>
          </button>
          <button
            id="lang-es"
            onClick={() => change('es')}
            className={lang === 'es' ? itemActive : itemBase}
            role="option"
            aria-selected={lang === 'es'}
          >
            <span aria-hidden>🇪🇸</span>
            <span className="font-medium">ES</span>
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">Español</span>
          </button>
          <button
            id="lang-en"
            onClick={() => change('en')}
            className={lang === 'en' ? itemActive : itemBase}
            role="option"
            aria-selected={lang === 'en'}
          >
            <span aria-hidden>🇺🇸</span>
            <span className="font-medium">EN</span>
            <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">English</span>
          </button>
        </div>
      )}
    </div>
  )
}
