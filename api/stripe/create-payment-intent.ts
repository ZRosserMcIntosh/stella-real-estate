import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Log environment check
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY')
    return res.status(500).json({ error: 'Server configuration error: Missing Stripe key' })
  }
  
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials')
    return res.status(500).json({ error: 'Server configuration error: Missing Supabase credentials' })
  }

  try {
    const {
      fullName,
      cpf,
      phone,
      accountType,
      companyName,
      cnpj,
      numberOfPartners,
      creciNumber,
      creciUf,
      email,
      password,
      userId, // User ID passed from frontend after user creation
      amount,
    } = req.body

    // Validate required fields (CPF, CRECI, and phone are now optional for faster signup)
    // Check for both null/undefined and empty string
    if (!fullName?.trim() || !email?.trim() || !userId) {
      console.error('Validation failed - missing required fields:', { fullName, email, userId })
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    // Company fields only required if account type is company
    if (accountType === 'company' && companyName && !cnpj) {
      return res.status(400).json({ error: 'CNPJ é obrigatório para empresas' })
    }

    // Check if CRECI is already registered (only if provided)
    if (creciNumber && creciUf) {
      const { data: existingMember } = await supabase
        .from('founding_members')
        .select('creci_number')
        .eq('creci_number', creciNumber)
        .eq('creci_uf', creciUf)
        .eq('payment_status', 'paid')  // Only check for paid members
        .single()

      if (existingMember) {
        return res.status(400).json({ error: 'Este CRECI já está cadastrado no programa Founding 100' })
      }
    }

    // Check if email is already registered with a paid status
    const { data: existingEmail } = await supabase
      .from('founding_members')
      .select('email')
      .eq('email', email)
      .eq('payment_status', 'paid')  // Only check for paid members
      .single()

    if (existingEmail) {
      return res.status(400).json({ error: 'Este email já está cadastrado' })
    }

    // Count current founding members (only paid ones)
    const { count } = await supabase
      .from('founding_members')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')

    if (count && count >= 100) {
      return res.status(400).json({ error: 'Programa Founding 100 esgotado. Todas as vagas foram preenchidas.' })
    }

    // Calculate amount based on payment method to absorb fees
    // For PIX: reduce base by 3.5% so final charge = target amount
    // Target: R$ 99.00 (9900 cents)
    const baseAmount = amount || 9900 // R$ 99.00
    
    // PIX fee is 3.5% - calculate base amount so (base * 1.035) = target
    const pixAdjustedAmount = Math.round(baseAmount / 1.035)
    
    // Create Payment Intent with billing details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pixAdjustedAmount, // Reduced amount for PIX so final = baseAmount after 3.5% fee
      currency: 'brl',
      payment_method_types: ['card', 'pix'], // Re-enabled PIX with fee adjustment
      metadata: {
        fullName,
        cpf: cpf || '',
        phone: phone || '', // Optional - can be added later
        accountType,
        companyName: companyName || '',
        cnpj: cnpj || '',
        numberOfPartners: numberOfPartners || '',
        creciNumber: creciNumber || '',
        creciUf: creciUf || '',
        email,
        userId, // Store user ID to update their status when paid
        program: 'founding_100',
        originalAmount: baseAmount.toString(), // Store original target amount
        adjustedForPixFees: 'true',
      },
      description: 'Founding 100 - Constellation Prime',
      receipt_email: email,
    })

    // Don't create founding member record here - it's already created with 'pending' status
    // The webhook will update it to 'paid' when payment succeeds

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro ao criar pagamento' 
    })
  }
}
