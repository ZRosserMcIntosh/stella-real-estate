# Create Stripe Payment Link

## Step 1: Go to Stripe Dashboard

1. Go to: https://dashboard.stripe.com/products
2. Make sure you're in **LIVE MODE** (toggle in top left)
3. Find your product: "Reserva de Plataforma Stella Real"

## Step 2: Create Payment Link

1. Click on your product
2. Scroll to the "Pricing" section
3. Click on your price (R$ 2,970.00 or R$ 3.00 if testing)
4. Click "Create payment link" button (top right)

## Step 3: Configure Payment Link

Fill in:
- **Name**: Founding 100 - Constellation Prime
- **Collect customer information**: ✅ Email address, ✅ Phone number (optional)
- **Allow promotion codes**: ❌ (unless you want this)
- **After payment**: Custom message
  - Message: "Obrigado! Você garantiu sua vaga no Founding 100. Entraremos em contato em breve com mais detalhes."
- **Redirect URL**: `https://stella-real-estate.vercel.app/precos?success=true`

## Step 4: Get the Payment Link

1. Click "Create link"
2. Copy the payment link URL - it will look like:
   ```
   https://buy.stripe.com/XXXXXXXX
   ```
3. This is your checkout URL!

## Step 5: Update Pricing.tsx

Replace the `handleDirectCheckout` function with your actual payment link:

```typescript
const handleDirectCheckout = () => {
  setCheckoutLoading(true)
  // Replace with your actual Stripe Payment Link
  window.location.href = 'https://buy.stripe.com/YOUR_PAYMENT_LINK'
}
```

That's it! No more modals, no more complex flows. Just direct checkout! 🎉
