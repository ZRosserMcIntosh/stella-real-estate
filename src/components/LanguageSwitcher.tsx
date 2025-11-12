import React from 'react'
import i18n, { setCookie } from '../i18n'

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
  const [closing, setClosing] = React.useState(false)
  const [manual, setManual] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const [buttonCenter, setButtonCenter] = React.useState<number>(0)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const change = (newLang: LangCode) => {
    if (newLang === lang) return setOpen(false)
    i18n.changeLanguage(newLang)
    // Cookie and localStorage are now automatically synced by i18n listener
    setLang(newLang)
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 150)
    setManual(false)
  }

  // Boxed trigger that spells out the language name
  const triggerCls = 'lang-trigger'
  const menuCls = 'lang-menu'
  const itemBase = 'lang-item'
  const itemActive = 'lang-item-active'

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
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonCenter(rect.left + rect.width / 2)
    }
    setOpen(true)
  }
  const handleMouseLeave = () => {
    if (manual) return // keep open when manually toggled
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setClosing(true)
      setTimeout(() => {
        setOpen(false)
        setClosing(false)
      }, 350)
    }, 500) as any
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      aria-label="Language switcher"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes dropdownRollout {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes dropdownSlideUp {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
        }
        @keyframes dropdownSlideUpFast {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
        }
        .lang-trigger {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          cursor: pointer;
          padding: 0.4rem 0.8rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.4px;
          font-weight: 300;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: #ffffff;
        }
        .lang-trigger:hover {
          background: rgba(201, 179, 130, 0.18);
          box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.25);
          color: #C9B382;
        }
        .lang-trigger:active {
          background: rgba(201, 179, 130, 0.25);
          color: #C9B382;
        }
        @media (prefers-color-scheme: dark) {
          .lang-trigger {
            background: rgba(255, 255, 255, 0.05);
          }
          .lang-trigger:hover {
            background: rgba(201, 179, 130, 0.12);
            box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.18);
            color: #C9B382;
          }
          .lang-trigger:active {
            background: rgba(201, 179, 130, 0.18);
            color: #C9B382;
          }
        }
        .lang-menu {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.4px;
          font-weight: 300;
          text-transform: uppercase;
        }
        .lang-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.4px;
          font-weight: 300;
          text-transform: uppercase;
          color: #1e293b;
        }
        .lang-item:hover {
          background: rgba(201, 179, 130, 0.15);
          color: #C9B382;
        }
        @media (prefers-color-scheme: dark) {
          .lang-item {
            color: #e2e8f0;
          }
          .lang-item:hover {
            background: rgba(201, 179, 130, 0.12);
            color: #C9B382;
          }
        }
          animation: dropdownRollout 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lang-menu.closing {
          animation: dropdownSlideUp 0.35s ease-in forwards;
        }
        .lang-menu.closing-fast {
          animation: dropdownSlideUpFast 0.15s ease-in forwards;
        }
      `}</style>
      <button
        ref={buttonRef}
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
        <span>{current.name}</span>
        <svg className="h-3 w-3 opacity-60 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div
          className={`lang-menu dropdown-menu fixed z-[60] inline-block backdrop-blur bg-white/70 dark:bg-slate-900/50 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.48)] p-2 rounded-xl w-fit min-w-[160px] max-w-[90vw] sm:max-w-[280px] overflow-hidden ${closing ? 'closing' : ''}`}
          style={{ top: 'calc(var(--header-height, 60px) + 6px)', left: `${buttonCenter}px`, transform: 'translateX(-50%)' }}
          role="listbox"
          aria-activedescendant={`lang-${lang}`}
        >
          <button
            id="lang-pt"
            onClick={() => change('pt')}
            className="lang-item"
            role="option"
            aria-selected={lang === 'pt'}
          >
            <span aria-hidden>🇧🇷</span>
            <span>Português</span>
          </button>
          <button
            id="lang-es"
            onClick={() => change('es')}
            className="lang-item"
            role="option"
            aria-selected={lang === 'es'}
          >
            <span aria-hidden>🇪🇸</span>
            <span>Español</span>
          </button>
          <button
            id="lang-en"
            onClick={() => change('en')}
            className="lang-item"
            role="option"
            aria-selected={lang === 'en'}
          >
            <span aria-hidden>🇺🇸</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  )
}
