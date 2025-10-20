import React from 'react'

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'JPY' | 'MXN' | 'AED'

type CurrencyMeta = { symbol: string; label: string; flag?: string }

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  BRL: { symbol: 'R$', label: 'Brazilian Real', flag: '🇧🇷' },
  USD: { symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  EUR: { symbol: '€', label: 'Euro', flag: '🇪🇺' },
  GBP: { symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  CAD: { symbol: '$', label: 'Canadian Dollar', flag: '🇨🇦' },
  CHF: { symbol: 'Fr', label: 'Swiss Franc', flag: '🇨🇭' },
  JPY: { symbol: '¥', label: 'Japanese Yen', flag: '🇯🇵' },
  MXN: { symbol: '$', label: 'Mexican Peso', flag: '🇲🇽' },
  AED: { symbol: 'د.إ', label: 'UAE Dirham', flag: '🇦🇪' },
}

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ['BRL', 'USD', 'EUR', 'GBP', 'CAD', 'CHF', 'JPY', 'MXN', 'AED']

const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  CAD: 'en-CA',
  CHF: 'de-CH',
  JPY: 'ja-JP',
  MXN: 'es-MX',
  AED: 'ar-AE',
}

const FRACTION_DIGITS: Record<CurrencyCode, number> = {
  BRL: 0,
  USD: 0,
  EUR: 0,
  GBP: 0,
  CAD: 0,
  CHF: 0,
  JPY: 0,
  MXN: 0,
  AED: 0,
}

const FALLBACK_RATES: Readonly<Partial<Record<CurrencyCode, number>>> = Object.freeze({
  BRL: 1,
  USD: 0.2,
  EUR: 0.18,
  GBP: 0.16,
  CAD: 0.26,
  CHF: 0.18,
  JPY: 27.5,
  MXN: 3.4,
  AED: 0.73,
})

type StoredRates = { updatedAt: number; rates: Partial<Record<CurrencyCode, number>> }

type CurrencyContextValue = {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  rates: Partial<Record<CurrencyCode, number>>
  lastUpdated: number | null
  loading: boolean
  error: string | null
  convertFromBRL: (amount: number) => number
  formatPrice: (amount: number | null | undefined, opts?: { fallback?: string }) => string
}

const CurrencyContext = React.createContext<CurrencyContextValue | undefined>(undefined)

const STORAGE_KEY_CURRENCY = 'currency'
const STORAGE_KEY_RATES = 'currency:rates'
const MAX_AGE_MS = 1000 * 60 * 60 * 6 // 6 hours

const readStoredCurrency = (): CurrencyCode => {
  if (typeof window === 'undefined') return 'BRL'
  const saved = window.localStorage.getItem(STORAGE_KEY_CURRENCY) as CurrencyCode | null
  return saved && SUPPORTED_CURRENCIES.includes(saved) ? saved : 'BRL'
}

const readStoredRates = (): { rates: Partial<Record<CurrencyCode, number>>; updatedAt: number | null } => {
  if (typeof window === 'undefined') return { rates: { ...FALLBACK_RATES }, updatedAt: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_RATES)
    if (!raw) return { rates: { ...FALLBACK_RATES }, updatedAt: null }
    const parsed = JSON.parse(raw) as StoredRates
    if (!parsed || typeof parsed !== 'object') return { rates: { ...FALLBACK_RATES }, updatedAt: null }
    const safe: Partial<Record<CurrencyCode, number>> = { ...FALLBACK_RATES }
    SUPPORTED_CURRENCIES.forEach((code) => {
      const value = parsed.rates?.[code]
      if (typeof value === 'number' && Number.isFinite(value)) {
        safe[code] = value
      }
    })
    return { rates: safe, updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null }
  } catch {
    return { rates: { ...FALLBACK_RATES }, updatedAt: null }
  }
}

type ProviderProps = { children: React.ReactNode }

export function CurrencyProvider({ children }: ProviderProps) {
  const [currency, setCurrencyState] = React.useState<CurrencyCode>(() => readStoredCurrency())
  const [{ rates, lastUpdated }, setRatesState] = React.useState<{
    rates: Partial<Record<CurrencyCode, number>>
    lastUpdated: number | null
  }>(() => {
    const stored = readStoredRates()
    return { rates: stored.rates, lastUpdated: stored.updatedAt }
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY_CURRENCY, currency)
  }, [currency])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const now = Date.now()
    const needsUpdate = !lastUpdated || now - lastUpdated > MAX_AGE_MS
    if (!needsUpdate) return

    let cancelled = false
    const fetchRates = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/BRL')
        if (!res.ok) throw new Error(`Failed to load exchange rates (${res.status})`)
        const json = await res.json()
        if (!json || json.result !== 'success' || typeof json.rates !== 'object') {
          throw new Error('Unexpected exchange rate response')
        }

        const nextRates: Partial<Record<CurrencyCode, number>> = { BRL: 1 }
        SUPPORTED_CURRENCIES.forEach((code) => {
          if (code === 'BRL') return
          const value = json.rates?.[code]
          if (typeof value === 'number' && Number.isFinite(value)) {
            nextRates[code] = value
          }
        })

        if (!cancelled) {
          const updatedAt = Date.now()
          let mergedForStorage: Partial<Record<CurrencyCode, number>> = {}
          setRatesState((prev) => {
            const merged: Partial<Record<CurrencyCode, number>> = { ...FALLBACK_RATES, ...prev.rates }
            Object.entries(nextRates).forEach(([code, value]) => {
              if (typeof value === 'number' && Number.isFinite(value)) {
                merged[code as CurrencyCode] = value
              }
            })
            mergedForStorage = merged
            return { rates: merged, lastUpdated: updatedAt }
          })
          window.localStorage.setItem(
            STORAGE_KEY_RATES,
            JSON.stringify({ rates: mergedForStorage, updatedAt }),
          )
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to fetch exchange rates')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchRates()
    return () => {
      cancelled = true
    }
  }, [lastUpdated])

  const convertFromBRL = React.useCallback(
    (amount: number) => {
      if (!Number.isFinite(amount)) return amount
      const rate = rates[currency] ?? FALLBACK_RATES[currency]
      if (rate == null || !Number.isFinite(rate)) return amount
      return amount * rate
    },
    [currency, rates],
  )

  const formatPrice = React.useCallback(
    (amount: number | null | undefined, opts?: { fallback?: string }) => {
      if (amount == null || Number.isNaN(Number(amount))) return opts?.fallback ?? ''
      const numeric = Number(amount)
      const rate = rates[currency] ?? FALLBACK_RATES[currency]
      const converted = rate == null || !Number.isFinite(rate) ? numeric : numeric * rate
      const locale = CURRENCY_LOCALE[currency] || 'en-US'
      const fractionDigits = FRACTION_DIGITS[currency] ?? 0
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits === 0 ? 0 : Math.max(fractionDigits, 2),
        }).format(converted)
      } catch {
        return converted.toLocaleString(locale, {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })
      }
    },
    [currency, rates],
  )

  const setCurrency = React.useCallback((code: CurrencyCode) => {
    if (!SUPPORTED_CURRENCIES.includes(code)) return
    setCurrencyState(code)
  }, [])

  const value = React.useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      rates,
      lastUpdated,
      loading,
      error,
      convertFromBRL,
      formatPrice,
    }),
    [convertFromBRL, currency, error, formatPrice, lastUpdated, loading, rates, setCurrency],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = React.useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return ctx
}
