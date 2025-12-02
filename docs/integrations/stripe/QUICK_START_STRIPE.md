# Quick Start: Stripe Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Add Stripe Keys to `.env`

Add these lines to your `/Users/rossermcintosh/Desktop/stella-real-estate/.env` file:

```bash
# ===========================================
# STRIPE CONFIGURATION
# ===========================================
# Get your keys from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"

# You'll get this after setting up webhook (Step 3)
STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET_HERE"

# You'll get this after creating product (Step 2)
STRIPE_FOUNDING_100_PRICE_ID="price_YOUR_PRICE_ID_HERE"

# ===========================================
# SUPABASE SERVICE ROLE
# ===========================================
# Get from: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/settings/api
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"

# ===========================================
# APP URL
# ===========================================
VITE_APP_URL="http://localhost:5173"
```

### Step 2: Create Stripe Product

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"Add Product"**
3. Fill in:
   ```
   Name: Founding 100 - Constellation Prime
   Description: 24 meses do plano Team grátis + benefícios vitalícios
   Pricing Model: One-time
   Price: 2970.00
   Currency: BRL (Brazilian Real)
   ```
4. Click **"Save product"**
5. Copy the **Price ID** (looks like `price_1ABC...`)
6. Update `.env`:
   ```bash
   STRIPE_FOUNDING_100_PRICE_ID="price_1ABC..."
   ```

### Step 3: Test Locally with Stripe CLI

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to http://localhost:5173/api/stripe/webhook
```

The CLI will output a webhook signing secret. Add it to `.env`:
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Step 4: Run Database Migration

```bash
# Navigate to project
cd /Users/rossermcintosh/Desktop/stella-real-estate

# If you have Supabase CLI installed:
supabase db push

# OR manually in Supabase Dashboard:
# 1. Go to: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/editor
# 2. Click "SQL Editor"
# 3. Copy/paste contents of: /supabase/migrations/20251114000000_subscriptions_and_founding.sql
# 4. Run the query
```

### Step 5: Test It!

```bash
# Start dev server
npm run dev
```

1. Go to: http://localhost:5173/precos
2. Click **"Garantir Minha Vaga"** button
3. Fill out the signup form
4. Use test card: **4242 4242 4242 4242**
5. Complete checkout

## 🎯 What to Check

After successful test payment:

### Check Stripe Dashboard
- Go to: https://dashboard.stripe.com/test/payments
- You should see the R$2,970.00 payment

### Check Supabase Database
1. Go to: https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/editor
2. Run these queries:

```sql
-- See founding members
SELECT * FROM founding_members ORDER BY created_at DESC;

-- See user profiles  
SELECT * FROM user_profiles ORDER BY created_at DESC;

-- Check remaining slots
SELECT get_founding_slots_remaining();
```

## 📝 Test Cards

Use these in Stripe test mode:

| Card Number | Result |
|------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Decline |
| 4000 0000 0000 9995 | ⚠️ Insufficient funds |

- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## 🐛 Common Issues

### "Missing environment variable"
→ Make sure all variables are added to `.env` and restart dev server

### "Failed to create checkout session"
→ Verify STRIPE_SECRET_KEY and SUPABASE_SERVICE_ROLE_KEY are correct

### "Webhook signature verification failed"
→ Ensure Stripe CLI is running and STRIPE_WEBHOOK_SECRET matches

### "No slots remaining"
→ Check database: `SELECT * FROM founding_members;` (should have < 100 records)

## 🚀 Ready for Production?

See full guide: `/STRIPE_CHECKOUT_SETUP_GUIDE.md`

1. Switch to live Stripe keys (sk_live_..., pk_live_...)
2. Create production webhook endpoint
3. Update VITE_APP_URL to production domain
4. Deploy to Vercel with environment variables
