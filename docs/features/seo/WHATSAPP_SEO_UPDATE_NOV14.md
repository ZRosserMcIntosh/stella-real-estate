# WhatsApp Link Preview & SEO Optimization - November 14, 2025

## Summary
Updated SEO meta tags and Open Graph images to provide better WhatsApp link previews in Portuguese, reflecting the actual page content and Brazilian real estate market focus. Changed logo background from white to dark blue (#0f172a) for better brand consistency.

## Changes Made

### 1. SEO Meta Tags - Portuguese Optimization

#### Pricing Page (`/precos`)
- **Title**: `Stella Real Estate - Preços e Planos`
- **Description**: "Plataforma imobiliária completa com CRM, automação e gestão de leads. Planos flexíveis para corretores, equipes e incorporadoras. Tecnologia moderna para o mercado imobiliário brasileiro."

#### Platform Page (`/plataforma-stella`)
- **Title**: `Stella Real Estate - Plataforma Imobiliária`
- **Description**: "Plataforma imobiliária completa com CRM, automação, gestão de leads e inteligência artificial. Tecnologia moderna para corretores e incorporadoras brasileiras."

#### Default/Home (index.html)
- **Title**: `Stella Real Estate - Plataforma Imobiliária Moderna`
- **Description**: "Plataforma imobiliária completa com tecnologia moderna. CRM, automação, gestão de leads e inteligência artificial para o mercado imobiliário brasileiro."

### 2. Open Graph Image - Dark Blue Background

Created new Open Graph image optimized for WhatsApp previews:

**File**: `public/stella-og-image.png`
- **Size**: 1200x630px (optimal for WhatsApp/social media)
- **Background**: Dark blue (#0f172a / slate-950)
- **Logo**: Centered and scaled to 80% of image
- **Format**: PNG with optimization

**Updated all pages to use**:
```html
<meta property="og:image" content="/stella-og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### 3. Portuguese Language Optimization

All descriptions now:
- ✅ Use Portuguese language naturally
- ✅ Reference Brazilian real estate market specifically ("mercado imobiliário brasileiro")
- ✅ Highlight key platform features (CRM, automação, gestão de leads, IA)
- ✅ Target specific user types (corretores, equipes, incorporadoras)
- ✅ Emphasize modern technology positioning

### 4. Script Created

**File**: `scripts/create-og-image.py`
- Python script using PIL/Pillow
- Generates OG image from existing logo
- Dark blue background matching site theme
- Automatically centers and scales logo
- Can be rerun if logo changes

## Technical Details

### Open Graph Protocol
All pages now include proper OG tags:
- `og:type` - website
- `og:url` - full page URL
- `og:title` - page-specific Portuguese title
- `og:description` - detailed Portuguese description
- `og:image` - new dark blue background image
- `og:image:width` - 1200
- `og:image:height` - 630
- `og:site_name` - Stella Real Estate
- `og:locale` - pt_BR

### Twitter Cards
Matching Twitter Card tags for consistency:
- `twitter:card` - summary_large_image
- `twitter:title` - matches OG title
- `twitter:description` - matches OG description
- `twitter:image` - matches OG image

## WhatsApp Link Preview Behavior

When sharing links on WhatsApp, users will now see:

### Before
- Title: "Stella Real Estate"
- Description: "A clean, mobile-first real estate site with React, Vite, and Tailwind."
- Image: Logo on white background

### After
- Title: "Stella Real Estate - Preços e Planos" (or relevant page)
- Description: Detailed Portuguese description with real estate keywords
- Image: Logo on rich dark blue background

## Files Modified

1. `index.html` - Default meta tags
2. `src/pages/Pricing.tsx` - SEO metadata
3. `src/pages/StellaPlatform.tsx` - SEO metadata and image reference
4. `scripts/create-og-image.py` - New script created
5. `public/stella-og-image.png` - New image generated

## Testing

To test WhatsApp previews:
1. Share any page URL in WhatsApp
2. WhatsApp will scrape the meta tags
3. Preview should show Portuguese title/description
4. Image should show logo on dark blue background

Note: WhatsApp caches link previews. To force refresh:
- Use WhatsApp's debug tool: https://developers.facebook.com/tools/debug/
- Or share with `?v=2` query parameter to bypass cache

## Future Improvements

Consider adding page-specific OG images for:
- Projects showcase pages
- About page with team photos
- Blog/news articles

## Brand Consistency

✅ Dark blue background (#0f172a) matches:
- Site header/footer theme
- Primary brand color palette
- Overall visual identity

## Keywords & SEO Focus

All descriptions now include:
- "plataforma imobiliária" - real estate platform
- "CRM" - customer relationship management
- "automação" - automation
- "gestão de leads" - lead management
- "mercado imobiliário brasileiro" - Brazilian real estate market
- "corretores" - real estate agents
- "incorporadoras" - developers
- "tecnologia moderna" - modern technology
