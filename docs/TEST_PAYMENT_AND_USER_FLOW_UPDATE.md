# Test Payment & User Flow Update - November 16, 2025

## Overview
Restructured the Constellation signup flow to create users before payment and added a test payment endpoint.

## Key Changes

### 1. **New User Flow**
- **Before**: User creation happened after payment
- **After**: User creation happens at "Finish Registration" step
  1. User fills personal info (Step 1)
  2. User fills business info (Step 2)
  3. User sets email/password (Step 3)
  4. **Click "Finish Registration"** → Creates user account + founding_member record with `payment_status: 'pending'`
  5. User completes payment (Step 4)
  6. Webhook updates `payment_status: 'paid'`

### 2. **Test Payment Endpoint**
Created `/api/stripe/create-test-payment.ts` for testing with R$ 3.00 instead of R$ 2,970.00

**Features:**
- Same flow as production payment
- Charges only R$ 3.00 (300 cents)
- Marks payment in metadata as `isTest: 'true'`
- Still confirms user as realtor upon successful payment
- Allows email marketing to all registered users (paid or unpaid)

**Toggle in UI:**
- Added checkbox in credentials step: "Test Mode (R$ 3.00)"
- When enabled, uses test payment endpoint
- Shows "TEST MODE" badge in payment form

### 3. **Database Changes**
**founding_members table now tracks:**
- `payment_status: 'pending'` - User registered, hasn't paid yet
- `payment_status: 'paid'` - User paid successfully
- `payment_status: 'refunded'` - Payment was refunded

**Timeline:**
1. User fills form → Creates record with `pending` status
2. User pays → Webhook updates to `paid` status
3. Admin can send marketing emails to ALL users (pending + paid)

### 4. **Updated Files**

#### Frontend
**src/pages/constellation/ConstellationSignup.tsx**
- Added `userId` state to track created user
- Added `useTestPayment` state for test mode toggle
- Modified `handleCredentialsNext()`:
  - Creates Supabase auth user
  - Creates founding_member record with `pending` status
  - Creates payment intent with `userId` in metadata
- Simplified `handlePaymentSuccess()`:
  - Just navigates to admin (user already created)
- Changed button text: "Next: Payment" → "Finish Registration"
- Added test mode toggle checkbox in credentials step
- Updated PaymentForm to show correct price based on test mode

#### Backend APIs

**api/stripe/create-test-payment.ts** (NEW)
- Test payment endpoint charging R$ 3.00
- Includes `userId` in metadata
- Marks as test with `isTest: 'true'`

**api/stripe/create-payment-intent.ts** (UPDATED)
- Now requires `userId` parameter
- Removed `password` requirement (user already created)
- Added `userId` to payment intent metadata
- Changed comment: record already exists with pending status

**api/stripe/webhook.ts** (UPDATED)
- Modified `handlePaymentSucceeded()`:
  - Finds existing founding_member by `userId`
  - UPDATES record to `paid` instead of creating new one
  - Assigns member_number only to paid members
  - Logs test payments with [TEST] indicator

**vercel.json** (UPDATED)
- Added function configuration for `create-test-payment.ts`

#### package.json (UPDATED)
- Added `dev:vercel` script for local development with Vercel CLI

## Benefits

### 1. **Marketing Data Collection**
- All users captured in database immediately after registration
- Can send marketing emails to unpaid users
- Track conversion rate from registration to payment

### 2. **Better User Experience**
- Clear separation: registration vs payment
- User gets account even if payment fails
- Can retry payment later without re-entering info

### 3. **Testing**
- Test full flow with R$ 3.00
- No need to use real money for development
- Still creates real user accounts and founding_member records

### 4. **Analytics Tracking**
- See how many users start registration
- See how many complete registration (create account)
- See how many complete payment
- Calculate drop-off rates at each step

## How to Test

### Local Development
```bash
# Must use Vercel CLI for API routes to work
npm run dev:vercel
# or
vercel dev
```

### Test Payment Flow
1. Go to `/sub/constellation/signup`
2. Fill Steps 1-3 (personal, business, credentials)
3. **Enable "Test Mode (R$ 3.00)" checkbox**
4. Click "Finish Registration"
   - User account created
   - founding_member record created with `pending` status
5. Complete payment with test card (4242 4242 4242 4242)
6. Webhook updates founding_member to `paid` status
7. User redirected to admin dashboard

### Production Payment Flow
Same as above but DON'T enable test mode checkbox - charges R$ 2,970.00

## Database Queries

### Get all registered users (paid + unpaid)
```sql
SELECT * FROM founding_members;
```

### Get only paid members
```sql
SELECT * FROM founding_members WHERE payment_status = 'paid';
```

### Get pending registrations (for marketing)
```sql
SELECT email, full_name, created_at 
FROM founding_members 
WHERE payment_status = 'pending'
ORDER BY created_at DESC;
```

### Check conversion rate
```sql
SELECT 
  COUNT(*) as total_registered,
  SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_members,
  ROUND(SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as conversion_rate_pct
FROM founding_members;
```

## Important Notes

1. **Vercel CLI Required**: You MUST run `vercel dev` (not `npm run dev`) to test payment flow locally
2. **Test Mode**: Always use test mode during development to avoid real charges
3. **Webhook**: Make sure Stripe webhook is configured to point to your deployed endpoint
4. **Email Marketing**: founding_members table now contains all potential customers, not just paid ones

## Next Steps

1. Consider adding email automation for unpaid users
2. Add payment retry mechanism for pending users
3. Consider expiring pending registrations after X days
4. Add admin dashboard to view pending vs paid members
5. Consider adding discount codes for retargeting unpaid users
