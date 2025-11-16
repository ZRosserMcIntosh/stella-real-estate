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
    } = req.body

    // Validate required fields
    if (!fullName || !cpf || !phone || !creciNumber || !creciUf || !email || !userId) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    if (accountType === 'company' && (!companyName || !cnpj)) {
      return res.status(400).json({ error: 'Dados da empresa são obrigatórios' })
    }

    // Check if CRECI is already registered with paid status
    const { data: existingMember } = await supabase
      .from('founding_members')
      .select('creci_number')
      .eq('creci_number', creciNumber)
      .eq('creci_uf', creciUf)
      .eq('payment_status', 'paid')
      .single()

    if (existingMember) {
      return res.status(400).json({ error: 'Este CRECI já está cadastrado no programa Founding 100' })
    }

    // TEST AMOUNT: R$ 3.00 (300 cents)
    const testAmount = 300 // R$ 3.00 for testing
    
    // Create Payment Intent with test amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: testAmount,
      currency: 'brl',
      payment_method_types: ['card', 'pix'],
      metadata: {
        fullName,
        cpf,
        phone,
        accountType,
        companyName: companyName || '',
        cnpj: cnpj || '',
        numberOfPartners: numberOfPartners || '',
        creciNumber,
        creciUf,
        email,
        userId, // Store user ID to update later
        program: 'founding_100',
        isTest: 'true', // Mark as test payment
        originalAmount: '297000', // Store original amount for reference
      },
      description: 'Founding 100 - TEST PAYMENT - Constellation Prime',
      receipt_email: email,
    })

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating test payment intent:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Erro ao criar pagamento de teste' 
    })
  }
}
