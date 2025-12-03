# Google Ads Conversion Tracking - Constellation Signup

## ✅ Implementation Complete

Google Ads conversion tracking has been implemented for successful Constellation membership purchases.

---

## 🎯 Conversion Event Details

### Event Name
**`purchase`** - Standard Google Ads e-commerce conversion event

### When It Fires
The conversion event fires when a user:
1. ✅ Completes Stripe payment successfully
2. ✅ Lands on the Constellation Dashboard (`/constellation/dashboard`)
3. ✅ Has `payment_status === 'paid'` in the database

### Event Parameters
```javascript
{
  transaction_id: memberData?.stripe_payment_intent_id || memberData?.id,
  value: 99.00,              // Membership price in BRL
  currency: 'BRL',
  items: [{
    item_id: 'constellation_membership',
    item_name: 'Constellation Founding Member',
    price: 99.00,
    quantity: 1
  }]
}
```

---

## 📍 Implementation Location

**File:** `src/pages/constellation/ConstellationDashboard.tsx`

**Code Added:**
```typescript
// Fire Google Ads conversion event when payment is confirmed
useEffect(() => {
  if (paymentStatus === 'paid' && !conversionTracked && typeof window !== 'undefined' && window.gtag) {
    console.log('🎉 Firing Google Ads purchase conversion event')
    
    // Fire Google Ads conversion event
    window.gtag('event', 'purchase', {
      transaction_id: memberData?.stripe_payment_intent_id || memberData?.id || 'unknown',
      value: 99.00,
      currency: 'BRL',
      items: [{
        item_id: 'constellation_membership',
        item_name: 'Constellation Founding Member',
        price: 99.00,
        quantity: 1
      }]
    })
    
    setConversionTracked(true)
  }
}, [paymentStatus, conversionTracked, memberData])
```

---

## 🔄 User Flow

```
1. User clicks "Garantir Minha Vaga" button
   ↓
2. Fills out signup form
   ↓
3. Completes Stripe payment
   ↓
4. Stripe webhook updates founding_members table
   - payment_status: 'paid'
   - stripe_payment_intent_id: 'pi_xxxxx'
   - payment_completed_at: timestamp
   ↓
5. User redirected to /constellation/dashboard
   ↓
6. Dashboard loads and checks payment_status
   ↓
7. If payment_status === 'paid':
   ✅ Google Ads 'purchase' event fires
   ✅ Success screen displays
   ✅ Conversion tracked ONCE (conversionTracked flag prevents duplicates)
```

---

## 🎨 Success Page Display

When `payment_status === 'paid'`, the user sees:

```
┌──────────────────────────────────────┐
│    ✓ (Green checkmark icon)         │
│                                      │
│   Bem-vindo à Constellation!         │
│                                      │
│   Obrigado, [Name]!                  │
│   Membro Fundador                    │
│                                      │
│   ┌────────────────────────────┐    │
│   │ Status: Pago               │    │
│   │ Email: user@example.com    │    │
│   │ CRECI: 123456/SP           │    │
│   │ Membro desde: 03/12/2025   │    │
│   └────────────────────────────┘    │
│                                      │
│   [Construtor de Sites]              │
│   [Voltar ao Portal] [Sair]          │
└──────────────────────────────────────┘
```

**This is the page where the conversion tracks!** ✅

---

## 🛡️ Deduplication Strategy

The implementation includes safeguards to prevent duplicate conversion tracking:

### 1. State Flag
```typescript
const [conversionTracked, setConversionTracked] = useState(false)
```

### 2. Conditional Check
```typescript
if (paymentStatus === 'paid' && !conversionTracked && window.gtag) {
  // Fire event
  setConversionTracked(true)
}
```

### 3. Dependencies
```typescript
useEffect(() => {
  // Only fires when these values change
}, [paymentStatus, conversionTracked, memberData])
```

**Result:** Conversion fires **once per page load** when conditions are met.

---

## 📊 Google Ads Setup

### In Google Ads Dashboard:

1. **Go to:** Tools & Settings → Measurement → Conversions
2. **Create New Conversion Action:**
   - Source: Website
   - Category: Purchase
   - Value: Use transaction-specific value
   - Count: One (recommended for purchases)

3. **Use Event Snippet:**
   - We're using the `gtag.js` global site tag (already installed)
   - Event name: `purchase`
   - No need to add additional snippets

4. **Verify in Google Tag Assistant:**
   - Install Chrome extension "Tag Assistant Legacy"
   - Visit `/constellation/dashboard` after completing payment
   - Should see `purchase` event fired

---

## 🧪 Testing

### Test in Development:

1. **Check Console:**
```javascript
// Should see this log when conversion fires:
"🎉 Firing Google Ads purchase conversion event"
```

2. **Check Network Tab:**
   - Filter by "google-analytics.com" or "google.com/pagead"
   - Look for request with event=purchase

3. **Use Google Tag Assistant:**
   - Should show "purchase" event with correct parameters

### Test in Production:

1. Complete real Stripe payment (or use test mode)
2. Get redirected to dashboard
3. Open browser console
4. Should see conversion log
5. Check Google Ads conversions report (24-48 hours for data)

---

## 📈 Conversion Value Tracking

### Fixed Value
Currently using fixed value: **R$ 99.00**

```typescript
value: 99.00,
currency: 'BRL',
```

### Dynamic Value (Future)
If you have variable pricing, update to:

```typescript
value: memberData?.amount_paid || 99.00,
currency: 'BRL',
```

---

## 🔍 Debugging

### Check if gtag is loaded:
```javascript
// In browser console:
typeof window.gtag
// Should return: "function"
```

### Check if event fired:
```javascript
// In browser console after conversion:
window.dataLayer
// Should show purchase event in array
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| gtag not defined | Check if Google Analytics is loaded in `index.html` |
| Event not firing | Check payment_status in database |
| Duplicate conversions | Check conversionTracked flag |
| Wrong transaction ID | Verify stripe_payment_intent_id in founding_members table |

---

## 🎯 Integration with Existing Analytics

This conversion tracking works alongside your existing analytics:

**File:** `src/utils/analytics.ts`
- ✅ `trackPurchaseComplete()` - Fires GA4 "close_convert_lead" event
- ✅ NEW: Dashboard fires "purchase" event for Google Ads

**Both events fire** when payment is successful:
1. GA4 custom event: `close_convert_lead`
2. Google Ads event: `purchase`

This allows you to:
- Track conversions in Google Ads
- Track conversions in GA4
- Compare data between both platforms

---

## 📝 Database Schema Reference

### founding_members table fields used:

```sql
- payment_status: 'pending' | 'paid'
- stripe_payment_intent_id: 'pi_xxxxx' (transaction ID)
- payment_completed_at: timestamp
- full_name: user name
- email: user email
- creci_number: CRECI registration
- creci_uf: CRECI state
- member_number: founding member number
```

---

## 🚀 Next Steps

### Optional Enhancements:

1. **Track Begin Checkout:**
   Add conversion tracking when user starts payment:
   ```typescript
   window.gtag('event', 'begin_checkout', {
     value: 99.00,
     currency: 'BRL',
   })
   ```

2. **Track Add to Cart (when user clicks signup):**
   ```typescript
   window.gtag('event', 'add_to_cart', {
     value: 99.00,
     currency: 'BRL',
   })
   ```

3. **Enhanced E-commerce:**
   Add more detailed item information:
   ```typescript
   items: [{
     item_id: 'constellation_membership',
     item_name: 'Constellation Founding Member',
     item_category: 'Membership',
     item_variant: 'Founding',
     price: 99.00,
     quantity: 1
   }]
   ```

---

## 📚 Documentation Links

- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722022)
- [GA4 Purchase Event](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce#purchase)
- [gtag.js Reference](https://developers.google.com/tag-platform/gtagjs/reference)

---

## ✅ Checklist

- [x] Added gtag declaration to ConstellationDashboard.tsx
- [x] Implemented purchase event in useEffect
- [x] Added deduplication logic (conversionTracked flag)
- [x] Included transaction ID from Stripe
- [x] Set proper value and currency
- [x] Added console log for debugging
- [x] Tested that event only fires once per page load
- [ ] Verify in Google Ads dashboard (after deployment)
- [ ] Check conversion data in 24-48 hours

---

**Implementation Date:** December 3, 2025
**Deployed:** Ready to commit and push
**Event Location:** `/constellation/dashboard` (when payment_status === 'paid')

🎉 Google Ads purchase conversion tracking is ready!
