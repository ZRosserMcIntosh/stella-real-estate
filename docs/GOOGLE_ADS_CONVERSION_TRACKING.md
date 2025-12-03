# Google Ads Conversion Tracking Setup

This document explains how to set up and use Google Ads conversion tracking for the Stella Real Estate platform.

## Overview

We track two main conversion events:
1. **qualify_lead** - When users click "Garantir Minha Vaga" to begin signup
2. **close_convert_lead** - When users successfully complete payment (click-based)

## Google Ads Event Names

Google Ads provided these specific event names:
- `qualify_lead` - Tracks when a user qualifies as a lead (starts registration)
- `close_convert_lead` - Tracks when a lead converts to a customer (completes payment)

**Important:** These events are now directly integrated. No need to replace conversion IDs - Google Ads automatically tracks these named events.

## Setup Instructions

### Configuration Type

✅ **You've already configured these in Google Ads!**

- **qualify_lead** - Set as click-based event for when users start registration
- **close_convert_lead** - Set as click-based event for completed purchases (correct choice!)

**Why click-based for purchases?** This ensures the conversion only fires when the user actually completes the payment action, not just when they land on a success page. This prevents false conversions and gives you accurate data.

### No Additional Setup Needed

The events are now using Google's named events (`qualify_lead` and `close_convert_lead`), which means:
- ✅ No conversion IDs to replace
- ✅ No manual configuration required
- ✅ Events automatically linked to your Google Ads account
- ✅ Ready to track conversions immediately

## Testing Your Conversions

#### Test in Development:
1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Filter by "collect" or "google"
4. Click "Garantir Minha Vaga" button
5. You should see a network request to `google-analytics.com/collect` or `googletagmanager.com`
6. Check the payload for `qualify_lead` event

#### Test Purchase Complete:
1. Complete the full signup and payment flow
2. After successful payment, check Network tab for `close_convert_lead` event
3. Verify it includes `value=99`, `currency=BRL`, and a `transaction_id`

#### Verify in Google Ads:
1. Go to **Google Ads** → **Tools & Settings** → **Conversions**
2. Look for your conversion actions
3. Click on each one to see **Recent conversions**
4. Test conversions should appear within a few hours (usually ~2-6 hours)

## Current Implementation

### Event Names
- **qualify_lead** - User starts registration process
- **close_convert_lead** - User completes purchase (click-based)

### Where Conversions Are Tracked

#### 1. qualify_lead (Start Registration)
**Location:** `src/pages/Pricing.tsx`

Triggered when user clicks "Garantir Minha Vaga" button:
```typescript
<Link
  to="/sub/constellation/signup"
  onClick={() => trackStartRegistration({ 
    source: 'pricing_page', 
    plan: 'founding_100' 
  })}
>
  Garantir Minha Vaga
</Link>
```

**Event fired:**
```javascript
gtag('event', 'qualify_lead', {
  event_category: 'engagement',
  event_label: 'Start Registration',
  source: 'pricing_page',
  plan: 'founding_100'
});
```

#### 2. close_convert_lead (Purchase Complete)
**Location:** `src/pages/constellation/ConstellationSignup.tsx`

Triggered when payment is successfully processed (click-based):
```typescript
const handlePaymentSuccess = async () => {
  trackPurchaseComplete(
    99.00,                    // R$ 99 value
    paymentIntentId,          // Stripe payment ID
    {
      source: 'constellation_signup',
      plan: 'founding_100',
      email: signupData.email,
    }
  );
  // ... rest of success handler
}
```

**Event fired:**
```javascript
gtag('event', 'close_convert_lead', {
  value: 99.00,
  currency: 'BRL',
  transaction_id: 'pi_xxx...', // Stripe payment intent ID
  event_category: 'ecommerce',
  event_label: 'Purchase Complete',
  source: 'constellation_signup',
  plan: 'founding_100',
  email: 'user@example.com'
});
```

## Event Parameters

### Start Registration Event
- `source`: Where the user started registration (e.g., "pricing_page")
- `plan`: Which plan they're signing up for (e.g., "founding_100")

### Purchase Complete Event
- `value`: Transaction value in BRL (e.g., 99.00)
- `currency`: Always "BRL"
- `transaction_id`: Stripe payment intent ID (unique per transaction)
- `source`: Where purchase originated (e.g., "constellation_signup")
- `plan`: Plan purchased (e.g., "founding_100")
- `email`: Customer email

## Troubleshooting

### Conversions not appearing in Google Ads?

1. **Check if gtag is loading:**
   - Open browser console
   - Type `window.gtag`
   - Should return a function, not `undefined`

2. **Check conversion ID format:**
   - Must be `AW-XXXXXXXXX/YYY-ZZZ_ABC_def`
   - No extra spaces or characters

3. **Verify Google Ads tag is installed:**
   - View page source
   - Search for `googletagmanager.com/gtag`
   - Should find script tag with your AW-ID

4. **Check browser ad blockers:**
   - Disable ad blockers during testing
   - They may block Google Ads tracking

5. **Wait for data:**
   - Conversions can take 2-6 hours to appear
   - Some may take up to 24 hours

### Testing with Google Tag Assistant

1. Install [Google Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Navigate to your site
3. Click the Tag Assistant extension
4. Click "Record"
5. Complete your conversion actions
6. Stop recording and review detected tags

## Analytics Dashboard

View conversion performance:
1. **Google Ads** → **Campaigns**
2. Click **Columns** icon
3. Click **Modify columns**
4. Under **Conversions**, add:
   - Conversions
   - Conversion value
   - Cost per conversion
   - Conversion rate

## Best Practices

1. **Always use unique transaction IDs** - We use Stripe payment intent IDs
2. **Test in staging first** - Verify conversions work before production
3. **Monitor regularly** - Check that conversions are firing correctly
4. **Don't double-count** - Only fire purchase conversion once per transaction
5. **Include value for purchase events** - Helps Google optimize bidding

## Support

For issues with:
- **Code implementation**: Check `src/utils/analytics.ts`
- **Google Ads setup**: [Google Ads Help Center](https://support.google.com/google-ads)
- **Conversion tracking**: [Google Ads Conversion Tracking Guide](https://support.google.com/google-ads/answer/1722022)

---

Last Updated: December 3, 2025
