import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { stripe, FOUNDING_100_AMOUNT, FOUNDING_100_CURRENCY, getOrCreateStripeCustomer } from '../../src/lib/stripe'

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Check environment variables
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing Supabase credentials' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY environment variable')
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing STRIPE_SECRET_KEY' })
  }

  try {
    const { 
      userId, 
      email, 
      fullName,
      creciNumber,
      creciUf,
      userType = 'realtor' 
    } = req.body

    // Validate required fields
    if (!userId || !email || !fullName) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, email, fullName' 
      })
    }

    // Validate CRECI fields for realtor/company types
    if ((userType === 'realtor' || userType === 'company') && (!creciNumber || !creciUf)) {
      return res.status(400).json({ 
        error: 'CRECI number and UF are required for realtors and companies' 
      })
    }

    // Check if user exists in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
    if (authError || !authUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check available founding slots
    const { data: slotsData, error: slotsError } = await supabase.rpc('get_founding_slots_remaining')
    
    if (slotsError) {
      console.error('Error checking slots:', slotsError)
      return res.status(500).json({ error: 'Error checking available slots' })
    }

    if (slotsData <= 0) {
      return res.status(400).json({ 
        error: 'No founding slots remaining',
        slotsRemaining: 0 
      })
    }

    // Check if user already has a founding slot
    const { data: existingMember, error: memberError } = await supabase
      .from('founding_members')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingMember && !memberError) {
      return res.status(400).json({ 
        error: 'User already has a founding member slot',
        memberNumber: existingMember.member_number 
      })
    }

    // Create or get Stripe customer
    const stripeCustomer = await getOrCreateStripeCustomer(email, fullName, userId)

    // Create user profile if it doesn't exist
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        full_name: fullName,
        user_type: userType,
        creci_number: creciNumber || null,
        creci_uf: creciUf || null,
        creci_type: userType === 'company' ? 'corporate' : 'individual',
        creci_status: (creciNumber && creciUf) ? 'pending' : null,
        onboarding_completed: false,
      }, {
        onConflict: 'user_id'
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
    }

    // Reserve founding slot
    const { data: memberNumber, error: reserveError } = await supabase
      .rpc('reserve_founding_slot', { p_user_id: userId })

    if (reserveError) {
      console.error('Error reserving slot:', reserveError)
      return res.status(500).json({ error: 'Failed to reserve founding slot' })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      mode: 'payment',
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          price_data: {
            currency: FOUNDING_100_CURRENCY,
            product_data: {
              name: 'Founding 100 - Constellation Prime',
              description: '24 meses do plano Team grátis + benefícios vitalícios',
              images: [`${process.env.VITE_APP_URL || 'http://localhost:5173'}/contellation-logo.png`],
            },
            unit_amount: FOUNDING_100_AMOUNT,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/precos?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/precos?canceled=true`,
      metadata: {
        userId,
        memberNumber: memberNumber.toString(),
        planType: 'FOUNDING_100',
        creciNumber: creciNumber || '',
        creciUf: creciUf || '',
      },
      payment_intent_data: {
        metadata: {
          userId,
          memberNumber: memberNumber.toString(),
        },
      },
    })

    // Return checkout session URL
    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      memberNumber,
      slotsRemaining: slotsData - 1,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
