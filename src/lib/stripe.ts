import Stripe from 'stripe'

// Initialize Stripe with the secret key
// This should only be used server-side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

// Price IDs for different plans (configure these in your Stripe dashboard)
export const STRIPE_PRICE_IDS = {
  FOUNDING_100: process.env.STRIPE_FOUNDING_100_PRICE_ID || 'price_founding_100',
  SOLO_MONTHLY: process.env.STRIPE_SOLO_MONTHLY_PRICE_ID || 'price_solo_monthly',
  SOLO_ANNUAL: process.env.STRIPE_SOLO_ANNUAL_PRICE_ID || 'price_solo_annual',
  TEAM_MONTHLY: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || 'price_team_monthly',
  TEAM_ANNUAL: process.env.STRIPE_TEAM_ANNUAL_PRICE_ID || 'price_team_annual',
  BROKERAGE_MONTHLY: process.env.STRIPE_BROKERAGE_MONTHLY_PRICE_ID || 'price_brokerage_monthly',
  BROKERAGE_ANNUAL: process.env.STRIPE_BROKERAGE_ANNUAL_PRICE_ID || 'price_brokerage_annual',
}

export const FOUNDING_100_AMOUNT = 297000 // Amount in cents (R$ 2,970.00)
export const FOUNDING_100_CURRENCY = 'brl'

/**
 * Helper function to create a Stripe customer
 */
export async function createStripeCustomer(email: string, name?: string, metadata?: Record<string, string>) {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  })
}

/**
 * Helper function to get or create a Stripe customer
 */
export async function getOrCreateStripeCustomer(email: string, name?: string, userId?: string) {
  // Try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  return await createStripeCustomer(email, name, userId ? { userId } : undefined)
}

/**
 * Format amount for display (convert from cents to BRL)
 */
export function formatBRL(amountInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100)
}
