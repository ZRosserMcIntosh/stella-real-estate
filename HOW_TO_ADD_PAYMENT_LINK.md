# How to Create Your Stripe Payment Link - Step by Step

## 🎯 What You Need to Do

Your checkout button currently shows an error because you need to create a **Stripe Payment Link** and add it to the code.

## 📝 Step 1: Create Payment Link in Stripe

1. **Go to Stripe Dashboard**:
   - Visit: https://dashboard.stripe.com/payment-links
   - Make sure you're in **LIVE MODE** (toggle in top left should be green/blue, not orange)

2. **Click "New" button** (top right)

3. **Fill in the form**:

   **Product section:**
   - Select your product: "Reserva de Plataforma Stella Real"
   - The price (R$ 2,970.00 or R$ 3.00) will auto-select

   **Customer information:**
   - ✅ Email address (required)
   - ☑️ Phone number (optional - recommended)
   - ☑️ Billing address (optional)

   **Payment methods:**
   - ✅ Card
   - ✅ Boleto (recommended for Brazil)
   - ☑️ Pix (if available and you want it)

   **After payment section:**
   - Choose: "Show confirmation page and redirect"
   - Redirect URL: `https://stella-real-estate.vercel.app/precos?success=true`

   **Optional settings:**
   - Allow promotion codes: ❌ (unless you want this)
   - Quantity: Fixed at 1
   - Tax collection: Configure if needed for Brazil

4. **Click "Create link"** button at the bottom

5. **Copy the link**:
   - You'll see a screen with your payment link
   - It looks like: `https://buy.stripe.com/live_XXXXXXXXXX`
   - Click "Copy link" or manually copy the full URL

## 💻 Step 2: Update Your Code

Open `/Users/rossermcintosh/Desktop/stella-real-estate/src/pages/Pricing.tsx`

Find line ~30 that says:
```typescript
const stripePaymentLink = 'https://buy.stripe.com/live_REPLACE_WITH_YOUR_ACTUAL_LINK'
```

Replace it with your actual link:
```typescript
const stripePaymentLink = 'https://buy.stripe.com/live_YOUR_ACTUAL_LINK_HERE'
```

## 🚀 Step 3: Deploy

```bash
git add src/pages/Pricing.tsx
git commit -m "feat: Add Stripe Payment Link"
git push origin main
```

Vercel will automatically redeploy.

## ✅ Step 4: Test

1. Go to: https://stella-real-estate.vercel.app/precos
2. Click "Garantir Minha Vaga"
3. You should be redirected to Stripe's checkout page
4. Complete the purchase with a real card
5. After payment, you'll be redirected back to /precos?success=true

## 🧪 Testing with Lower Price

If you want to test with R$ 3.00 instead of R$ 2,970:

1. In Stripe Dashboard, go to your product
2. Add a new price: R$ 3.00 (one-time)
3. Create a separate payment link for this test price
4. Use that link temporarily in your code
5. Test the full flow
6. Switch back to the R$ 2,970 link when ready

## 📊 After First Payment

Check these:
1. **Stripe Dashboard > Payments**: See the payment
2. **Stripe Dashboard > Customers**: See the customer created
3. Your email: Stripe sends receipt automatically

## 🆘 Troubleshooting

**"Payment link not configured" error on site?**
- You haven't replaced the placeholder link yet
- Update line 30 in Pricing.tsx with your real link

**"Could not be found" error from Stripe?**
- The link is incorrect or incomplete
- Make sure you copied the ENTIRE link including https://
- Verify you're in LIVE mode, not test mode

**Payment works but no webhook events?**
- Webhooks are separate from payment links
- Check: https://dashboard.stripe.com/webhooks
- Make sure your webhook endpoint is added and active

**Want to track who purchased?**
- Payment Links automatically collect customer email
- View in Stripe Dashboard > Customers
- Stripe sends them a receipt automatically

## 💡 Pro Tips

1. **Create multiple payment links** for different testing scenarios
2. **Use descriptive names** in Stripe so you know which is which
3. **Test with R$ 3.00 first** before using full price
4. **Enable Boleto** - very popular payment method in Brazil
5. **Save the link somewhere safe** - you'll need it again

## 🎉 You're Almost Done!

Once you add the payment link and push the code:
- ✅ One-click checkout will work
- ✅ Payments go directly to your Stripe account  
- ✅ Customers receive automatic receipts
- ✅ No more modals or complex flows

Just need to create the link and update one line of code! 🚀
