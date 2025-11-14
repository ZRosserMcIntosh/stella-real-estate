import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Stripe webhook secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: any): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', message: 'This endpoint only accepts POST requests from Stripe' })
  }

  // Check environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY environment variable')
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing STRIPE_SECRET_KEY' })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable')
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing STRIPE_WEBHOOK_SECRET' })
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables')
    return res.status(500).json({ error: 'Server configuration error', details: 'Missing Supabase credentials' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).json({ 
      error: 'Webhook signature verification failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    })
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ 
      error: 'Webhook handler failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)
  
  const userId = session.metadata?.userId
  const memberNumber = session.metadata?.memberNumber
  const planType = session.metadata?.planType

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  if (planType === 'FOUNDING_100') {
    // Update founding member status
    const { error: updateError } = await supabase
      .from('founding_members')
      .update({
        payment_status: 'completed',
        payment_completed_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq('user_id', userId)
      .eq('member_number', parseInt(memberNumber || '0'))

    if (updateError) {
      console.error('Error updating founding member:', updateError)
    }

    // Create subscription for 24 months of Team plan
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 24)

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: 'TEAM',
        status: 'active',
        stripe_customer_id: session.customer as string,
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
        metadata: {
          founding_member: true,
          member_number: memberNumber,
          free_months: 24,
        },
      })

    if (subError) {
      console.error('Error creating subscription:', subError)
    }

    console.log(`Founding member #${memberNumber} payment completed for user ${userId}`)
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  const {
    fullName,
    cpf,
    phone,
    email,
    creciNumber,
    creciUf,
    accountType,
    companyName,
    cnpj,
    numberOfPartners,
  } = paymentIntent.metadata

  if (!email || !creciNumber || !creciUf || !fullName || !cpf) {
    console.error('Missing required metadata in payment intent')
    return
  }

  try {
    // Check if founding member already exists (shouldn't happen but safety check)
    const { data: existingMember } = await supabase
      .from('founding_members')
      .select('id')
      .eq('creci_number', creciNumber)
      .eq('creci_uf', creciUf)
      .eq('payment_status', 'paid')
      .single()

    if (existingMember) {
      console.log('Founding member already exists:', existingMember.id)
      return
    }

    // Get next member number
    const { count } = await supabase
      .from('founding_members')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'paid')

    const memberNumber = (count || 0) + 1

    if (memberNumber > 100) {
      console.error('Founding 100 program is full')
      return
    }

    // Create founding member record
    const { data: member, error: insertError } = await supabase
      .from('founding_members')
      .insert({
        member_number: memberNumber,
        email,
        phone: phone || null,
        full_name: fullName,
        cpf,
        account_type: accountType || 'individual',
        company_name: companyName || null,
        cnpj: cnpj || null,
        number_of_partners: numberOfPartners ? parseInt(numberOfPartners) : null,
        creci_number: creciNumber,
        creci_uf: creciUf,
        payment_amount: paymentIntent.amount / 100,
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: paymentIntent.customer as string,
        discount_percentage: 75,
        benefits_active: true,
        payment_completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating founding member:', insertError)
      return
    }

    console.log(`Founding member payment completed: ${fullName} (${email})`)

    // Create subscription for 24 months of Team plan
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 24)

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: member.user_id || null, // Will be null until user account is created
        plan_id: 'TEAM',
        status: 'active',
        stripe_customer_id: paymentIntent.customer as string,
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
        metadata: {
          founding_member: true,
          creci_number: creciNumber,
          creci_uf: creciUf,
          free_months: 24,
          discount_percentage: 75,
        },
      })

    if (subError) {
      console.error('Error creating subscription:', subError)
    }
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  const userId = paymentIntent.metadata?.userId
  const memberNumber = paymentIntent.metadata?.memberNumber
  
  if (userId && memberNumber) {
    // Update founding member status to pending (or could delete the record)
    await supabase
      .from('founding_members')
      .update({
        payment_status: 'pending',
      })
      .eq('user_id', userId)
      .eq('member_number', parseInt(memberNumber))
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  
  // Get customer to find user_id
  const customerId = subscription.customer as string
  
  // Find user by stripe_customer_id
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!existingSub) {
    console.log('No existing subscription found for customer:', customerId)
    return
  }

  // Update subscription
  await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscription.id,
      status: subscription.status as any,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
    })
    .eq('stripe_customer_id', customerId)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  
  const customerId = subscription.customer as string
  
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)
}
