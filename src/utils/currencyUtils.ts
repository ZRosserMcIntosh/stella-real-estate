/**
 * Currency conversion utilities for BRL <-> USD conversions
 * Uses the same exchange rate API as the main CurrencyContext
 */

// Fallback exchange rate if API is unavailable
const FALLBACK_USD_TO_BRL = 5.0 // 1 USD = 5 BRL (approximate)

/**
 * Fetch current USD to BRL exchange rate from the API
 * Returns the rate or fallback if fetch fails
 */
export async function getUsdToBrlRate(): Promise<number> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/BRL')
    if (!res.ok) throw new Error(`Failed to load exchange rates (${res.status})`)
    const json = await res.json()
    
    if (json && json.result === 'success' && json.rates?.USD) {
      // API gives us BRL to USD rate, we need USD to BRL
      const brlToUsd = json.rates.USD
      return 1 / brlToUsd // Convert to USD to BRL
    }
    
    return FALLBACK_USD_TO_BRL
  } catch (error) {
    console.warn('Failed to fetch exchange rate, using fallback:', error)
    return FALLBACK_USD_TO_BRL
  }
}

/**
 * Convert USD to BRL
 */
export function convertUsdToBrl(usdAmount: number, exchangeRate: number): number {
  return Math.round(usdAmount * exchangeRate * 100) / 100 // Round to 2 decimals
}

/**
 * Convert BRL to USD
 */
export function convertBrlToUsd(brlAmount: number, exchangeRate: number): number {
  return Math.round((brlAmount / exchangeRate) * 100) / 100 // Round to 2 decimals
}

/**
 * Format currency input (handles R$ and $ formatting)
 */
export function formatCurrencyInput(value: string, currency: 'BRL' | 'USD'): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  
  const numericValue = Number(digits) / 100
  
  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericValue)
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericValue)
  }
}

/**
 * Parse formatted currency string to number
 */
export function parseCurrency(formattedValue: string): number | null {
  if (!formattedValue) return null
  const digits = formattedValue.replace(/\D/g, '')
  if (!digits) return null
  return Number(digits) / 100
}
