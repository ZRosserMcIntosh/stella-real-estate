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
      amount,
    } = req.body

    // Validate required fields
    if (!fullName || !cpf || !phone || !creciNumber || !creciUf || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' })
    }

    if (accountType === 'company' && (!companyName || !cnpj)) {
      return res.status(400).json({ error: 'Dados da empresa são obrigatórios' })
    }

    // Check if CRECI is already registered
    const { data: existingMember } = await supabase
      .from('founding_members')
      .select('creci_number')
      .eq('creci_number', creciNumber)
      .eq('creci_uf', creciUf)
      .single()

    if (existingMember) {
      return res.status(400).json({ error: 'Este CRECI já está cadastrado no programa Founding 100' })
    }

    // Check if email is already registered
    const { data: existingEmail } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return res.status(400).json({ error: 'Este email já está cadastrado' })
    }

    // Count current founding members
    const { count } = await supabase
      .from('founding_members')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')

    if (count && count >= 100) {
      return res.status(400).json({ error: 'Programa Founding 100 esgotado. Todas as vagas foram preenchidas.' })
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 297000, // Default R$ 2,970.00
      currency: 'brl',
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
        program: 'founding_100',
      },
      description: 'Founding 100 - Constellation Prime',
    })

    // Create pending founding member record
    const { error: insertError } = await supabase
      .from('founding_members')
      .insert({
        creci_number: creciNumber,
        creci_uf: creciUf,
        email,
        phone,
        full_name: fullName,
        cpf,
        account_type: accountType,
        company_name: companyName || null,
        cnpj: cnpj || null,
        number_of_partners: numberOfPartners ? parseInt(numberOfPartners) : null,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
        discount_percentage: 75,
        benefits_active: false,
      })

    if (insertError) {
      console.error('Error creating founding member:', insertError)
      return res.status(500).json({ error: 'Erro ao criar registro de membro' })
    }

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
