# Stripe Integration Checklist

## ✅ Completed
- [x] Text color lightened to `text-slate-500`
- [x] Changed to "3 a 5 novas contas"
- [x] Database migration file created
- [x] Stripe utility functions created
- [x] API endpoints for checkout and webhooks created
- [x] RealtorSignupModal component with 3-step flow
- [x] Integration with pricing page
- [x] TypeScript errors fixed
- [x] Stripe API version updated to latest

## 📋 Next Steps (In Order)

### 1. Get Stripe API Keys
- [ ] Go to: https://dashboard.stripe.com/test/apikeys
- [ ] Copy **Publishable key** (pk_test_...)
- [ ] Copy **Secret key** (sk_test_...)

### 2. Get Supabase Service Role Key
- [ ] Go to: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/settings/api
- [ ] Copy **service_role** key (under "Project API keys")

### 3. Update .env File
Add these lines to `/Users/rossermcintosh/Desktop/stella-real-estate/.env`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"  # Get this in step 6
STRIPE_FOUNDING_100_PRICE_ID="price_YOUR_PRICE_ID"  # Get this in step 4

# Supabase Service Role
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"

# App URL
VITE_APP_URL="http://localhost:5173"
```

### 4. Create Stripe Product
- [ ] Go to: https://dashboard.stripe.com/test/products
- [ ] Click "Add Product"
- [ ] Name: Founding 100 - Constellation Prime
- [ ] Price: R$ 2,970.00 BRL (one-time)
- [ ] Copy the Price ID (price_...)
- [ ] Add to .env as `STRIPE_FOUNDING_100_PRICE_ID`

### 5. Run Database Migration
- [ ] Option A: Run `supabase db push`
- [ ] Option B: Copy SQL from `/supabase/migrations/20251114000000_subscriptions_and_founding.sql` into Supabase SQL Editor

### 6. Set Up Local Webhook Testing
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to http://localhost:5173/api/stripe/webhook
```
- [ ] Copy the webhook signing secret (whsec_...)
- [ ] Add to .env as `STRIPE_WEBHOOK_SECRET`

### 7. Test the Flow
```bash
# Restart dev server
npm run dev
```

- [ ] Go to: http://localhost:5173/precos
- [ ] Click "Garantir Minha Vaga"
- [ ] Fill out signup form
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] Verify redirect to success page
- [ ] Check Stripe Dashboard for payment
- [ ] Check Supabase database for records

### 8. Verify Database
Run in Supabase SQL Editor:
```sql
SELECT * FROM founding_members ORDER BY created_at DESC;
SELECT * FROM user_profiles ORDER BY created_at DESC;
SELECT * FROM subscriptions ORDER BY created_at DESC;
SELECT get_founding_slots_remaining();
```

## 🎯 Quick Test Commands

```bash
# Test checkout API locally
curl -X POST http://localhost:5173/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-id","email":"test@example.com","fullName":"Test User","creciNumber":"12345-F","creciUf":"SP","userType":"realtor"}'

# Trigger test webhook
stripe trigger checkout.session.completed

# View webhook logs
stripe listen --print-secret
```

## 📚 Reference Documents
- Full Setup Guide: `/STRIPE_CHECKOUT_SETUP_GUIDE.md`
- Quick Start: `/QUICK_START_STRIPE.md`
- Stripe Testing Cards: https://stripe.com/docs/testing

## ⚠️ Important Notes
- Never commit `.env` file
- Always test in test mode first
- Verify webhooks are working before going live
- Check Stripe Dashboard for failed payments
- Monitor Supabase logs for errors

## 🚀 Production Deployment
When ready for production:
- [ ] Switch to live Stripe keys (sk_live_, pk_live_)
- [ ] Create production webhook in Stripe Dashboard
- [ ] Update VITE_APP_URL to production domain
- [ ] Add all env vars to Vercel
- [ ] Test end-to-end in production
