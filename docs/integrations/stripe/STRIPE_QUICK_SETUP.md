# Stripe + CRECI Integration - Quick Setup

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install stripe @vercel/node
```

### 2. Add Environment Variables
Copy to your `.env` file:
```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_FOUNDING_100_PRICE_ID="price_..."

# Supabase Admin
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# App
VITE_APP_URL="http://localhost:5173"
```

### 3. Run Database Migration
```bash
supabase db push
# or run /supabase/migrations/20251114000000_subscriptions_and_founding.sql in Supabase dashboard
```

## 📋 What Was Built

### New Database Tables
- `subscriptions` - Track user subscriptions
- `founding_members` - Max 100 members
- `user_profiles` - CRECI information

### API Endpoints
- `POST /api/stripe/create-checkout` - Start payment
- `POST /api/stripe/webhook` - Handle payment events

### UI Components
- `RealtorSignupModal` - 3-step signup flow with CRECI validation
- Updated `Pricing.tsx` - "Garantir Minha Vaga" button opens modal

## 🎯 User Flow

1. User clicks "Garantir Minha Vaga" on `/precos`
2. Modal opens:
   - **Step 1:** Create account (email, password, name)
   - **Step 2:** Enter CRECI number + UF (required for realtors/companies)
   - **Step 3:** Redirect to Stripe Checkout
3. User pays R$ 2,970
4. Webhook confirms payment
5. User gets:
   - 24 months Team plan
   - Founding member badge
   - Member #1-100

## 🔧 Stripe Setup

### Create Product in Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/products
2. Create product: "Founding 100 - Constellation Prime"
3. Price: R$ 2,970.00 (one-time, BRL)
4. Copy Price ID → `STRIPE_FOUNDING_100_PRICE_ID`

### Setup Webhook
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy secret → `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing

### Test Cards
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`

### Local Webhook Testing
```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

## 🔒 Security Checklist

- [ ] Added all Stripe keys to Vercel environment variables
- [ ] Never committed real keys to Git
- [ ] RLS enabled on all database tables
- [ ] Webhook signature verification enabled
- [ ] Service role key only used server-side

## 📝 CRECI Requirements

### For Realtors
- CRECI number (format: 12345-F or 12345-J)
- UF (state)
- Individual registration

### For Companies
- CRECI Jurídico number
- UF (state)
- Company name
- Corporate registration

## 📊 Database Queries

Check founding slots:
```sql
SELECT get_founding_slots_remaining();
```

View all founding members:
```sql
SELECT * FROM founding_members WHERE payment_status = 'completed' ORDER BY member_number;
```

Check user subscription:
```sql
SELECT * FROM subscriptions WHERE user_id = 'USER_UUID';
```

## 🐛 Troubleshooting

**No slots available:**
- Check: `SELECT count(*) FROM founding_members WHERE payment_status = 'completed'`
- Should be < 100

**Webhook not firing:**
- Verify webhook URL in Stripe dashboard
- Check webhook secret matches `.env`
- View logs in Stripe Dashboard > Webhooks

**Payment not updating database:**
- Check Supabase logs
- Verify service role key is correct
- Check webhook event was received

## 📚 Full Documentation

See `/docs/STRIPE_INTEGRATION_GUIDE.md` for complete details.

## 🎉 Next Steps

1. Run migration
2. Add Stripe keys to `.env`
3. Create Stripe product
4. Test signup flow
5. Deploy to Vercel
6. Configure production webhook

---

**Need help?** Check the full guide or Stripe logs for debugging.
