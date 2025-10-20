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
  const [manual, setManual] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const closeTimer = React.useRef<number | null>(null)

  const triggerCls = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-md text-sm hover:bg-white/20 transition-colors'
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
    setOpen(true)
  }
  const handleMouseLeave = () => {
    if (manual) return
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 160)
  }

  const change = (next: CurrencyCode) => {
    if (next === currency) {
      setOpen(false)
      setManual(false)
      return
    }
    setCurrency(next)
    setOpen(false)
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
      <button
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
        <span className="font-medium tracking-wide">{currency}</span>
        <span aria-hidden className="opacity-80">{current.symbol}</span>
        <svg className="h-3.5 w-3.5 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className={menuCls} role="listbox" aria-activedescendant={`cur-${currency}`}>
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c}
              id={`cur-${c}`}
              onClick={() => change(c)}
              className={currency === c ? itemActive : itemBase}
              role="option"
              aria-selected={currency === c}
            >
              {/* Flag only in dropdown */}
              {CURRENCY_META[c].flag ? (
                <span aria-hidden className="text-base leading-none">{CURRENCY_META[c].flag}</span>
              ) : (
                <span aria-hidden className="w-4" />
              )}
              <span className="font-medium">{c}</span>
              <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{CURRENCY_META[c].label}</span>
              <span aria-hidden className="ml-2 text-sm text-slate-500 dark:text-slate-400">{CURRENCY_META[c].symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
