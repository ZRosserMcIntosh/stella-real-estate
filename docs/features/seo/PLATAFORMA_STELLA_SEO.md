# Plataforma Stella - SEO and Social Media Preview Setup

## What Was Done

We've configured the `/plataforma-stella` page to display proper Open Graph metadata when shared on WhatsApp, iMessage, Facebook, Twitter, and other social media platforms.

## Changes Made

### 1. Installed react-helmet-async
```bash
npm install react-helmet-async
```

### 2. Updated `src/main.tsx`
- Added `HelmetProvider` wrapper around the entire app to enable dynamic meta tag management
- This allows individual pages to override the default meta tags

### 3. Updated `src/pages/StellaPlatform.tsx`
- Added `Helmet` component with comprehensive Open Graph and Twitter Card metadata
- Configured to use the constellation logo (`/contellation-logo.png`)
- Set up proper page title, description, and canonical URL
- Includes WhatsApp-specific optimization

### 4. Updated `index.html`
- Added default Open Graph tags as fallback for pages without specific metadata
- Added Twitter Card metadata
- Set default social preview image to constellation logo

## Metadata Included

The `/plataforma-stella` page now includes:

- **Page Title**: "Plataforma Stella - Tecnologia Imobiliária Completa"
- **Description**: "A Plataforma Stella oferece soluções integradas de CRM, automação de tarefas, gestão de leads e muito mais para profissionais do mercado imobiliário."
- **Preview Image**: Constellation logo (`/contellation-logo.png` - 840x840px)
- **Open Graph Tags**: Optimized for Facebook, WhatsApp, LinkedIn
- **Twitter Card**: Optimized for Twitter/X
- **Canonical URL**: Set to the proper page URL

## How to Test

### Local Testing
1. Build the project: `npm run build`
2. Preview the build: `npm run preview`
3. Open the page: `http://localhost:4173/plataforma-stella`

### Testing Social Media Preview

#### Option 1: Facebook/Meta Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your production URL: `https://yourdomain.com/plataforma-stella`
3. Click "Debug" to see how it will appear on Facebook/WhatsApp

#### Option 2: Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your production URL: `https://yourdomain.com/plataforma-stella`
3. Preview the Twitter card

#### Option 3: LinkedIn Post Inspector
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your production URL
3. See how it will appear on LinkedIn

#### Option 4: WhatsApp Link Preview
- Simply send the link in a WhatsApp chat (after deploying to production)
- WhatsApp will automatically fetch and display the preview with the constellation logo

### After Deployment to Vercel

1. Deploy your changes to Vercel
2. Use any of the testing tools above with your production URL
3. If the preview doesn't update immediately, use the debugger tools to force a refresh
4. WhatsApp typically caches previews, so you may need to wait or clear cache

## Important Notes

### Image Optimization
- Current logo is 840x840px, which works well
- For optimal Facebook/WhatsApp display, consider creating a 1200x630px variant specifically for Open Graph
- The image should be publicly accessible (no authentication required)

### Dynamic URLs
- The component automatically detects the current domain using `window.location.origin`
- Works in both development and production environments

### Cache Busting
- Social media platforms cache link previews for performance
- After updating metadata, use debugger tools to force a refresh
- Facebook/WhatsApp may take 24-48 hours to update cached previews naturally

### Vercel Configuration
- The `vercel.json` rewrites ensure all routes serve the SPA correctly
- No additional Vercel configuration needed for Open Graph to work

## File Structure
```
/public/
  contellation-logo.png     # 840x840px - Social media preview image
  stella-favicon.png        # Browser favicon

/src/
  main.tsx                  # HelmetProvider wrapper
  pages/
    StellaPlatform.tsx      # Page-specific SEO metadata
  
index.html                  # Default meta tags (fallback)
```

## Troubleshooting

### Preview not showing
1. Check that the logo is accessible: `https://yourdomain.com/contellation-logo.png`
2. Verify meta tags in browser dev tools (Elements tab)
3. Use Facebook Debugger to see what tags are being read
4. Clear social media cache using debugger tools

### Wrong image showing
1. Clear social media platform cache using their debugger tools
2. Verify the image URL in the meta tags
3. Check that the image is served without authentication

### Preview shows "Vercel" instead of content
- This means meta tags aren't being properly injected
- Verify `HelmetProvider` is wrapping the app in `main.tsx`
- Ensure the build process completed successfully
- Check browser console for any errors

## Related Documentation
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [WhatsApp Link Preview](https://developers.facebook.com/docs/whatsapp/link-previews)
