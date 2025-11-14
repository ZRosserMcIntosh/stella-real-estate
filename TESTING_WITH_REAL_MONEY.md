# Testing Stripe Checkout with Real Money

## ⚠️ IMPORTANT: Current Issue

The webhook endpoint is crashing because **environment variables are not set in Vercel**. Before testing with real money, you MUST add the environment variables.

## 🔧 Step 1: Add Environment Variables to Vercel

1. Go to: https://vercel.com/zrossermcintosh/stella-real-estate/settings/environment-variables

2. Add these variables:

### Required for Stripe:
```
STRIPE_SECRET_KEY = sk_test_YOUR_KEY (or sk_live_ for production)
STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_KEY (or pk_live_ for production)
STRIPE_WEBHOOK_SECRET = whsec_YOUR_WEBHOOK_SECRET
STRIPE_FOUNDING_100_PRICE_ID = price_YOUR_PRICE_ID
```

### Required for Supabase:
```
VITE_SUPABASE_URL = https://fxvxdvwiqgpypcqmljja.supabase.co
SUPABASE_SERVICE_ROLE_KEY = YOUR_SERVICE_ROLE_KEY
```

### Required for App:
```
VITE_APP_URL = https://stellarealestate.com (or your domain)
```

3. **Redeploy** after adding variables:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## 💰 Step 2: Create Test Product with Low Price

To test with real money safely, create a test product for R$ 3.00:

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add Product"
3. Fill in:
   - **Name**: Test - Founding 100 (R$ 3)
   - **Price**: 3.00 BRL (one-time)
4. Copy the **Price ID**
5. Temporarily update your Vercel env var:
   ```
   STRIPE_FOUNDING_100_PRICE_ID = price_NEW_TEST_PRICE_ID
   ```
6. Redeploy

## 🧪 Step 3: Test the Flow

1. Go to your site: https://stellarealestate.com/precos
2. Click "Garantir Minha Vaga"
3. Fill out the signup form with REAL email
4. Complete checkout with a REAL card
5. Pay R$ 3.00

### Use Your Own Card:
- Real card number
- Real expiry date
- Real CVC
- Real billing address

## ✅ Step 4: Verify Payment

After successful payment:

1. **Check Stripe Dashboard**: https://dashboard.stripe.com/test/payments
   - You should see the R$ 3.00 payment
   - Status should be "Succeeded"

2. **Check Webhook Events**: https://dashboard.stripe.com/test/webhooks
   - Click on your webhook endpoint
   - Check "Events" tab
   - Should see `checkout.session.completed` event
   - Status should be "Succeeded" (green checkmark)

3. **Check Supabase Database**:
   ```sql
   -- Check founding members
   SELECT * FROM founding_members ORDER BY created_at DESC LIMIT 1;
   
   -- Check user profile
   SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 1;
   
   -- Check subscription
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
   ```

## 🐛 Troubleshooting

### Webhook Still Crashing?
1. Check Vercel function logs: https://vercel.com/zrossermcintosh/stella-real-estate/logs
2. Look for errors in the webhook function
3. Verify all environment variables are set correctly
4. Make sure you redeployed after adding variables

### Payment Succeeded but No Database Record?
1. Check webhook delivery in Stripe Dashboard
2. Check webhook signing secret is correct
3. Check Supabase service role key has write permissions
4. Verify database migration was run

### Can't Complete Checkout?
1. Check browser console for errors
2. Verify `STRIPE_PUBLISHABLE_KEY` is set in Vercel
3. Check that `VITE_APP_URL` matches your domain
4. Make sure redirect URLs are correct

## 🚀 Step 5: Switch to Full Price (R$ 2,970)

Once testing with R$ 3.00 works:

1. Update `STRIPE_FOUNDING_100_PRICE_ID` back to your R$ 2,970 price
2. Redeploy
3. Test again (or wait for real customers)

## 💳 Step 6: Go Live with Production Keys

When ready for REAL payments:

1. Switch to live mode in Stripe Dashboard
2. Create production product (R$ 2,970 BRL)
3. Create production webhook endpoint
4. Update Vercel environment variables:
   ```
   STRIPE_SECRET_KEY = sk_live_YOUR_LIVE_KEY
   STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_LIVE_KEY
   STRIPE_WEBHOOK_SECRET = whsec_PRODUCTION_SECRET
   STRIPE_FOUNDING_100_PRICE_ID = price_PRODUCTION_PRICE_ID
   ```
5. Redeploy
6. Test with R$ 3.00 product first in live mode
7. Switch to R$ 2,970 when confident

## 📊 Monitoring

Keep an eye on:
- Stripe Dashboard > Payments (for successful charges)
- Stripe Dashboard > Webhooks (for event delivery)
- Vercel Logs (for API errors)
- Supabase Database (for data integrity)

## 🔒 Security Notes

- Never share API keys
- Keep service role key secret
- Monitor for suspicious activity
- Set up Stripe fraud protection
- Enable 3D Secure for high-value transactions

## 💡 Tips

1. **Test thoroughly** with R$ 3.00 before going to full price
2. **Monitor the first few** real transactions closely
3. **Have a refund policy** ready
4. **Test the webhook** is working by checking Stripe events
5. **Verify database records** are created correctly

## 🆘 If Something Goes Wrong

1. Issue refund in Stripe Dashboard immediately
2. Check Vercel logs for the error
3. Fix the issue and redeploy
4. Test again with R$ 3.00
5. Contact customer and explain (if needed)
