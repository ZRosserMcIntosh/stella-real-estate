# Google Ads Conversion Tracking Setup

This document explains how to set up and use Google Ads conversion tracking for the Stella Real Estate platform.

## Overview

We track two main conversion events:
1. **Start Registration** - When users click "Garantir Minha Vaga" to begin signup
2. **Purchase Complete** - When users successfully complete payment

## Setup Instructions

### 1. Get Your Google Ads Conversion IDs

1. Go to [Google Ads](https://ads.google.com)
2. Click **Tools & Settings** (wrench icon) → **Conversions**
3. Click the **+ New conversion action** button
4. Choose **Website**
5. Create two conversion actions:

#### Conversion Action 1: "Start Registration"
- **Goal**: Lead
- **Name**: "Constellation - Start Registration"
- **Value**: Don't use a value
- **Count**: One
- **Click-through conversion window**: 30 days
- **View-through conversion window**: 1 day

#### Conversion Action 2: "Purchase Complete"
- **Goal**: Purchase
- **Name**: "Constellation - Purchase Complete"
- **Value**: Use different values for each conversion
- **Count**: One
- **Click-through conversion window**: 90 days
- **View-through conversion window**: 1 day

6. After creating each conversion, Google will give you a **Conversion ID** and **Conversion Label** in this format:
   ```
   AW-123456789/AbC-dEf_GhI_jKlM
   ```
   Where:
   - `AW-123456789` is your Conversion ID
   - `AbC-dEf_GhI_jKlM` is the Conversion Label

### 2. Update the Code

Open `src/utils/analytics.ts` and replace the placeholders:

```typescript
// Find this line for Start Registration:
send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',

// Replace with your actual values, for example:
send_to: 'AW-123456789/AbC-dEf_GhI_jKlM',

// Do the same for Purchase Complete
```

**Example:**
```typescript
export const trackStartRegistration = (eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_event_start_registration', {
      send_to: 'AW-123456789/AbC-dEf_GhI_jKlM', // ← Replace this
      event_category: 'engagement',
      event_label: 'Start Registration',
      ...eventParams,
    });
  }
};

export const trackPurchaseComplete = (
  value: number,
  transactionId?: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_event_purchase', {
      send_to: 'AW-987654321/XyZ-aBc_DeF_gHiJ', // ← Replace this
      value: value,
      currency: 'BRL',
      transaction_id: transactionId,
      event_category: 'ecommerce',
      event_label: 'Purchase Complete',
      ...eventParams,
    });
  }
};
```

### 3. Test Your Conversions

#### Test in Development:
1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Filter by "collect" or "google"
4. Click "Garantir Minha Vaga" button
5. You should see a network request to `google-analytics.com/collect` or `googletagmanager.com`
6. Check the payload for `conversion_event_start_registration`

#### Test Purchase Complete:
1. Complete the full signup and payment flow
2. After successful payment, check Network tab for `conversion_event_purchase`

#### Verify in Google Ads:
1. Go to **Google Ads** → **Tools & Settings** → **Conversions**
2. Look for your conversion actions
3. Click on each one to see **Recent conversions**
4. Test conversions should appear within a few hours (usually ~2-6 hours)

### 4. Enable Google Ads Tag (if needed)

If you haven't already added the Google Ads tag to your site:

1. In Google Ads, go to **Tools & Settings** → **Setup** → **Tag Manager**
2. Get your Google Ads ID (format: `AW-123456789`)
3. Add to `index.html` (if not already there):

```html
<!-- Google Ads Tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-123456789"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-123456789');
</script>
```

**Note:** You should already have Google Analytics set up (`G-6GBRVEVG2L`), so you may just need to add the `gtag('config', 'AW-...')` line.

## Current Implementation

### Where Conversions Are Tracked

#### 1. Start Registration
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

#### 2. Purchase Complete
**Location:** `src/pages/constellation/ConstellationSignup.tsx`

Triggered when payment is successfully processed:
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
