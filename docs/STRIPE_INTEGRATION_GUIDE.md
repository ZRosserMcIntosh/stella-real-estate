# Stripe Integration Setup Guide

## Overview

This guide covers the implementation of Stripe payment integration for the Founding 100 program with CRECI verification for realtors and real estate companies.

## Features Implemented

### 1. Database Schema (`/supabase/migrations/20251114000000_subscriptions_and_founding.sql`)
- **subscriptions** table - Tracks user subscription status and plans
- **founding_members** table - Tracks Founding 100 members (max 100)
- **user_profiles** table - Stores user information including CRECI validation
- Helper functions:
  - `get_founding_slots_remaining()` - Returns available Founding slots
  - `reserve_founding_slot(user_id)` - Reserves next available slot

### 2. Stripe Integration (`/src/lib/stripe.ts`)
- Stripe client initialization
- Helper functions for customer creation
- Price ID constants
- Currency formatting utilities

### 3. API Endpoints

#### `/api/stripe/create-checkout.ts`
Creates a Stripe Checkout session for the Founding 100 purchase.

**POST Request Body:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "fullName": "Full Name",
  "creciNumber": "12345-F",
  "creciUf": "SP",
  "userType": "realtor" | "company",
  "companyName": "Company Name (optional)"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/...",
  "memberNumber": 1,
  "slotsRemaining": 99
}
```

#### `/api/stripe/webhook.ts`
Handles Stripe webhook events for payment processing.

**Handled Events:**
- `checkout.session.completed` - Marks payment as complete, activates subscription
- `payment_intent.succeeded` - Confirms payment success
- `payment_intent.payment_failed` - Handles failed payments
- `customer.subscription.*` - Manages subscription lifecycle

### 4. Frontend Components

#### `RealtorSignupModal` (`/src/components/RealtorSignupModal.tsx`)
Three-step signup flow:
1. **Account Creation** - User creates Supabase auth account
2. **CRECI Verification** - User provides CRECI number and UF
3. **Payment Processing** - Redirects to Stripe Checkout

**Features:**
- Real-time slot availability check
- CRECI format validation
- Support for individual realtors and companies
- Progress indicator
- Error handling

#### Updated `Pricing.tsx`
- Modified "Garantir Minha Vaga" button to open signup modal
- Integrated RealtorSignupModal component

## Setup Instructions

### 1. Install Dependencies

```bash
npm install stripe @vercel/node
# or
yarn add stripe @vercel/node
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
# Stripe Keys (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"

# Stripe Webhook Secret (from Stripe Dashboard > Webhooks)
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# Application URL
VITE_APP_URL="http://localhost:5173"
```

### 3. Create Stripe Products & Prices

In your Stripe Dashboard (https://dashboard.stripe.com/test/products):

1. **Create Founding 100 Product:**
   - Name: "Founding 100 - Constellation Prime"
   - Price: R$ 2,970.00 (one-time payment)
   - Currency: BRL
   - Copy the Price ID and set as `STRIPE_FOUNDING_100_PRICE_ID`

2. **Create Subscription Products** (optional for future):
   - Solo Plan (Monthly/Annual)
   - Team Plan (Monthly/Annual)
   - Brokerage Plan (Monthly/Annual)

### 4. Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Set URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Run Database Migration

```bash
# Using Supabase CLI
supabase db push

# Or apply directly in Supabase Dashboard > SQL Editor
# Run the contents of /supabase/migrations/20251114000000_subscriptions_and_founding.sql
```

### 6. Configure Vercel (if deploying to Vercel)

Add all environment variables in Vercel project settings:
- Dashboard > Your Project > Settings > Environment Variables

Make sure to add both:
- Stripe keys in Vercel dashboard
- Stripe webhook endpoint pointing to your production URL

## Testing

### Test Locally

1. Use Stripe test mode keys (`sk_test_...`)
2. Run webhook locally with Stripe CLI:
```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Flow

1. Go to `/precos`
2. Click "Garantir Minha Vaga" in Founding 100 section
3. Fill in account details (Step 1)
4. Provide CRECI information (Step 2)
5. Complete payment in Stripe Checkout
6. Verify in Supabase:
   - Check `founding_members` table
   - Check `subscriptions` table
   - Check `user_profiles` table

## Security Notes

⚠️ **IMPORTANT:**
- Never commit real Stripe keys to Git
- Keep `STRIPE_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` secure
- Use environment variables for all sensitive data
- Verify webhook signatures in production
- Enable Row Level Security (RLS) on all tables

## Database Schema

### subscriptions
- Tracks active subscriptions
- Links to Stripe subscription and customer IDs
- Supports trial periods and cancellations

### founding_members
- Limited to 100 members (enforced by member_number)
- Tracks payment status
- Includes benefits metadata

### user_profiles
- Stores CRECI information
- Supports verification workflow
- Tracks onboarding completion

## Workflow

1. User clicks "Garantir Minha Vaga"
2. Modal opens with account creation form
3. User creates Supabase auth account
4. User provides CRECI details
5. System reserves a founding slot
6. API creates Stripe Checkout session
7. User redirects to Stripe for payment
8. On success, webhook updates database:
   - Marks founding member as paid
   - Creates 24-month Team subscription
   - Updates user profile
9. User receives confirmation and access

## Future Enhancements

- [ ] Email confirmation on successful payment
- [ ] Admin dashboard for CRECI verification
- [ ] Automatic CRECI validation via external API
- [ ] Subscription management dashboard
- [ ] Invoice generation
- [ ] Refund handling
- [ ] Proration for plan upgrades/downgrades

## Support

For issues or questions:
- Check Stripe Dashboard logs
- Check Supabase logs
- Review webhook delivery attempts in Stripe
- Contact support@stella.com

## Related Files

- `/supabase/migrations/20251114000000_subscriptions_and_founding.sql` - Database schema
- `/src/lib/stripe.ts` - Stripe utilities
- `/api/stripe/create-checkout.ts` - Checkout session creation
- `/api/stripe/webhook.ts` - Webhook handler
- `/src/components/RealtorSignupModal.tsx` - Signup UI
- `/src/pages/Pricing.tsx` - Pricing page with signup integration
- `/.env.example` - Environment variable template
