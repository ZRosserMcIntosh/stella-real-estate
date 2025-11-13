import React from 'react'
import {
  useCurrency,
  CURRENCY_META,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from '../context/CurrencyContext'

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const [manual, setManual] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const [buttonCenter, setButtonCenter] = React.useState<number>(0)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerCls = 'currency-trigger'
  const menuCls = 'absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden'
  const itemBase = 'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-left'
  const itemActive = 'w-full flex items-center gap-2 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white text-left'

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
    if (manual) return
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setClosing(true)
      setTimeout(() => {
        setOpen(false)
        setClosing(false)
      }, 350)
    }, 500) as any
  }

  const change = (next: CurrencyCode) => {
    if (next === currency) {
      setOpen(false)
      setManual(false)
      return
    }
    setCurrency(next)
    setClosing(true)
    setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 150)
    setManual(false)
  }

  const current = CURRENCY_META[currency]

  return (
    <div
      ref={wrapperRef}
      className="relative"
      aria-label="Currency switcher"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
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
        .cur-menu {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .cur-menu.closing {
          animation: dropdownSlideUp 0.35s ease-in forwards;
        }
        .cur-menu.closing-fast {
          animation: dropdownSlideUp 0.15s ease-in forwards;
        }
        .currency-trigger {
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
          justify-content: center;
          gap: 0.375rem;
          color: #ffffff;
          height: 32px;
          min-width: fit-content;
        }
        .currency-trigger:hover {
          background: rgba(201, 179, 130, 0.18);
          box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.25);
          color: #C9B382;
        }
        .currency-trigger:active {
          background: rgba(201, 179, 130, 0.25);
          color: #C9B382;
        }
        @media (prefers-color-scheme: dark) {
          .currency-trigger {
            background: rgba(255, 255, 255, 0.05);
          }
          .currency-trigger:hover {
            background: rgba(201, 179, 130, 0.12);
            box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.18);
            color: #C9B382;
          }
          .currency-trigger:active {
            background: rgba(201, 179, 130, 0.18);
            color: #C9B382;
          }
        }
        .cur-menu {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.4px;
          font-weight: 300;
          text-transform: uppercase;
        }
        .cur-item {
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
        .cur-item:hover {
          background: rgba(201, 179, 130, 0.15);
          color: #C9B382;
        }
        @media (prefers-color-scheme: dark) {
          .cur-item {
            color: #e2e8f0;
          }
          .cur-item:hover {
            background: rgba(201, 179, 130, 0.12);
            color: #C9B382;
          }
        }
      `}</style>
      <button
        ref={buttonRef}
        type="button"
        className={triggerCls}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setManual((m) => {
            const next = !m
            setOpen(next || open)
            if (!next) setOpen(false)
            return next
          })
        }}
      >
        <span>{currency}</span>
        <span aria-hidden className="opacity-80">{current.symbol}</span>
        <svg className="h-3.5 w-3.5 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
          <div
            className={`dropdown-menu cur-menu fixed z-[60] backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.48)] p-2 rounded-b-xl w-fit min-w-[180px] max-w-[90vw] sm:max-w-[320px] border border-slate-200/20 dark:border-slate-700/20 ${closing ? 'closing' : ''}`}
            style={{ 
              top: 'calc(var(--header-height, 60px) + 6px)', 
              left: `${buttonCenter}px`, 
              transform: 'translateX(-50%)',
            }}
            role="listbox"
            aria-activedescendant={`cur-${currency}`}
          >
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c}
              id={`cur-${c}`}
              onClick={() => change(c)}
              className="cur-item"
              role="option"
              aria-selected={currency === c}
            >
              {CURRENCY_META[c].flag ? (
                <span aria-hidden className="text-base leading-none">{CURRENCY_META[c].flag}</span>
              ) : (
                <span aria-hidden className="w-4" />
              )}
              <span>{c}</span>
              <span className="ml-auto opacity-70">{CURRENCY_META[c].symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
