# Stripe Checkout Setup Guide

## Overview
Your Stripe integration is already built! This guide will walk you through the final steps to make it live.

## What's Already Done ✅
- Database schema with founding_members, subscriptions, and user_profiles tables
- Stripe client initialization (`/src/lib/stripe.ts`)
- API endpoint to create checkout sessions (`/api/stripe/create-checkout.ts`)
- Webhook handler for payment events (`/api/stripe/webhook.ts`)
- React signup modal with 3-step flow (`/src/components/RealtorSignupModal.tsx`)
- Integration with pricing page

## Setup Steps

### 1. Run Database Migration

First, execute the database migration to create the necessary tables:

```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Run in Supabase Dashboard
# Go to SQL Editor and run the file:
# /supabase/migrations/20251114000000_subscriptions_and_founding.sql
```

### 2. Configure Stripe Environment Variables

You need to add the following to your `.env` file:

```bash
# Stripe API Keys (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"

# Stripe Webhook Secret (configure in step 4)
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"

# Stripe Price ID for Founding 100 (create in step 3)
STRIPE_FOUNDING_100_PRICE_ID="price_YOUR_PRICE_ID"

# Supabase Service Role Key (from Supabase Settings > API)
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# App URL for redirects
VITE_APP_URL="http://localhost:5173"  # Change to your production URL when deploying
```

### 3. Create Stripe Product and Price

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Click "Add Product"
3. Fill in:
   - **Name**: Founding 100 - Constellation Prime
   - **Description**: 24 meses do plano Team grátis + benefícios vitalícios
   - **Pricing**: 
     - One-time payment
     - Price: R$ 2,970.00 BRL
   - Click "Save product"
4. Copy the **Price ID** (starts with `price_`) and add it to your `.env`:
   ```bash
   STRIPE_FOUNDING_100_PRICE_ID="price_YOUR_COPIED_PRICE_ID"
   ```

### 4. Configure Stripe Webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your endpoint URL:
   - Local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks
   - Production: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`) and add to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_YOUR_SIGNING_SECRET"
   ```

### 5. Testing Locally with Stripe CLI

Install the Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to http://localhost:5173/api/stripe/webhook

# The CLI will output a webhook signing secret - add this to your .env
```

### 6. Test the Checkout Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/precos`

3. Click "Garantir Minha Vaga" on the Founding 100 banner

4. Fill out the 3-step signup form:
   - Step 1: Create account (email, password, name)
   - Step 2: CRECI verification (number, UF)
   - Step 3: Automatic redirect to Stripe Checkout

5. Use [Stripe test cards](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future date for expiry, any 3-digit CVC

6. Complete payment and verify:
   - User is redirected back to `/precos?success=true`
   - Database records are created
   - Webhook events are received

### 7. Verify Database Records

After successful payment, check your Supabase tables:

```sql
-- Check founding members
SELECT * FROM founding_members ORDER BY created_at DESC LIMIT 10;

-- Check user profiles
SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 10;

-- Check subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;

-- Check remaining slots
SELECT get_founding_slots_remaining();
```

### 8. Deploy to Production

When ready for production:

1. **Update environment variables in Vercel/hosting**:
   - Use production Stripe keys (`sk_live_...`, `pk_live_...`)
   - Update `VITE_APP_URL` to your production domain
   - Add production webhook secret

2. **Create production Stripe webhook**:
   - Use production URL: `https://yourdomain.com/api/stripe/webhook`
   - Select same events as test mode
   - Add production signing secret to env vars

3. **Test with live mode disabled** first:
   - Stripe has a "test mode in production" feature
   - Verify everything works before going live

## Troubleshooting

### Webhook Not Working
- Check webhook signature verification in `/api/stripe/webhook.ts`
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check Stripe Dashboard > Webhooks for failed deliveries
- Use Stripe CLI to test locally: `stripe trigger checkout.session.completed`

### Checkout Session Not Creating
- Verify `STRIPE_SECRET_KEY` is set correctly
- Check API logs in browser console
- Verify Supabase Service Role Key has proper permissions
- Check that database migration was run successfully

### Payment Not Recording in Database
- Verify webhook is being received (check Stripe Dashboard)
- Check webhook handler logs
- Verify `SUPABASE_SERVICE_ROLE_KEY` has write permissions
- Check RPC functions are created: `get_founding_slots_remaining`, `reserve_founding_slot`

### Founding Slots Not Counting Down
- Verify database trigger `on_founding_member_payment_complete` exists
- Check subscriptions table for records
- Run `SELECT get_founding_slots_remaining();` to see current count

## Security Checklist

- [ ] Never commit `.env` file to git
- [ ] Use environment variables for all secrets
- [ ] Verify webhook signatures on every request
- [ ] Use Supabase RLS policies for database access
- [ ] Rate limit checkout endpoint to prevent abuse
- [ ] Log all payment attempts for audit trail
- [ ] Test with Stripe test mode before production
- [ ] Use HTTPS in production (required by Stripe)

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Next Steps

After basic checkout is working:

1. **Add success page**: Create `/precos/success` with order confirmation
2. **Email confirmations**: Send receipt via Stripe or custom email
3. **Account dashboard**: Show payment status and member benefits
4. **Admin panel**: View all founding members and payments
5. **Analytics**: Track conversion rates and payment metrics
