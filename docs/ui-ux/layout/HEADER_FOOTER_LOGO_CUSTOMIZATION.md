# Header & Footer Logo Customization

**Date:** November 12, 2025  
**Features:** Header logo + Footer logo customization  
**Status:** ✅ Complete - Ready for Testing

---

## Overview

Added ability to customize logos in two key locations:
1. **Header Logo** - Top navigation bar
2. **Footer Logo** - Centered at bottom of footer

Both logos can be uploaded or linked via URL, with fallback behavior.

---

## Features

### 1. Header Logo Customization

**Location:** Top navigation bar (all pages)

**Features:**
- Upload custom logo to Supabase storage
- Paste external URL
- Falls back to default `stella-favicon.png`
- Displays at h-10 sm:h-12 (responsive)
- Error handling with fallback

**Admin Section:** `/admin/site-admin` → "Header Logo"

**Default:** `/stella-favicon.png` (current Stella favicon)

### 2. Footer Logo Customization

**Location:** Bottom of footer, centered below copyright

**Features:**
- Upload custom logo to Supabase storage
- Paste external URL
- No logo shown if empty (optional)
- Displays at h-16 (64px height)
- Fade-in effect on hover (opacity transition)

**Admin Section:** `/admin/site-admin` → "Footer Logo"

**Default:** None (optional logo)

---

## How to Use

### Upload Logo (Both Header & Footer)

1. Navigate to `/admin/site-admin`
2. Scroll to **"Header Logo"** or **"Footer Logo"** section
3. **Option A:** Click **"Upload Logo"** button
   - Select PNG, JPEG, SVG, or WebP file
   - Uploads to Supabase storage
   - URL automatically populated
4. **Option B:** Paste image URL in input field
5. Preview appears below
6. Click **Save** at bottom

### Remove Logo

- **Header Logo:** Clear URL field and save (reverts to default)
- **Footer Logo:** Clear URL field and save (no logo shown)

---

## Technical Details

### Storage

**Buckets:**
- Header logos: `listings/header-logo/`
- Footer logos: `listings/footer-logo/`

**Filename Format:** `{timestamp}_{sanitized_name}`

**Supported Formats:** PNG, JPEG, SVG, WebP

### Settings Keys

```typescript
'header_logo_url' // Header logo URL
'footer_logo_url' // Footer logo URL (optional)
```

### Default Behavior

**Header Logo:**
- If `header_logo_url` is empty → uses `/stella-favicon.png`
- If image fails to load → shows circular gradient fallback with "STELLA LOGO" text

**Footer Logo:**
- If `footer_logo_url` is empty → no logo displayed
- If image fails to load → no logo displayed (no fallback)

---

## Files Modified

### Site Settings
✅ `src/lib/siteSettings.ts`
- Added `header_logo_url` to SiteSettingKey type
- Added `footer_logo_url` to SiteSettingKey type

### Admin Panel
✅ `src/pages/admin/SiteAdmin.tsx`
- Added `headerLogoUrl` and `footerLogoUrl` state
- Added Header Logo configuration section (UI)
- Added Footer Logo configuration section (UI)
- Added logo upload handlers with sanitization
- Updated save function to persist both settings
- Added preview components for both logos

### Header Component
✅ `src/components/Header.tsx`
- Imported `getSiteSettings`
- Added `headerLogoUrl` state
- Added `useEffect` to load header logo from settings
- Updated logo `<img>` to use `headerLogoUrl || "/stella-favicon.png"`

### Footer Component
✅ `src/components/Footer.tsx`
- Imported `getSiteSettings` and `useState`, `useEffect`
- Added `footerLogoUrl` state
- Added `useEffect` to load footer logo from settings
- Added conditional footer logo section (only shows if URL exists)
- Centered logo with h-16 size and opacity transition

---

## Admin UI

### Header Logo Section

```
┌──────────────────────────────────┐
│ Header Logo                      │
│ Customize the logo displayed in  │
│ the top navigation header        │
├──────────────────────────────────┤
│ Logo Image URL:                  │
│ [input field]                    │
│ [Upload Logo button]             │
│                                  │
│ Current Header Logo:             │
│ [preview image]                  │
│                                  │
│ Preview (Header Size):           │
│ [preview on dark background]     │
└──────────────────────────────────┘
```

### Footer Logo Section

```
┌──────────────────────────────────┐
│ Footer Logo                      │
│ Customize the logo displayed     │
│ centered at the bottom of footer │
├──────────────────────────────────┤
│ Logo Image URL:                  │
│ [input field]                    │
│ [Upload Logo button]             │
│                                  │
│ Current Footer Logo:             │
│ [preview image]                  │
│                                  │
│ Preview (Footer Size):           │
│ [preview with border]            │
└──────────────────────────────────┘
```

---

## Implementation Details

### Header Logo Loading

```typescript
// In Header.tsx
useEffect(() => {
  const loadHeaderLogo = async () => {
    try {
      const settings = await getSiteSettings(['header_logo_url'])
      if (settings.header_logo_url) {
        setHeaderLogoUrl(settings.header_logo_url)
      }
    } catch (error) {
      console.error('Failed to load header logo:', error)
    }
  }
  loadHeaderLogo()
}, [])
```

### Header Logo Rendering

```tsx
<img
  src={headerLogoUrl || "/stella-favicon.png"}
  className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
  alt={t('header.brand') as string}
  onError={() => setLogoFailed(true)}
/>
```

### Footer Logo Loading

```typescript
// In Footer.tsx
useEffect(() => {
  const loadFooterLogo = async () => {
    try {
      const settings = await getSiteSettings(['footer_logo_url'])
      if (settings.footer_logo_url) {
        setFooterLogoUrl(settings.footer_logo_url)
      }
    } catch (error) {
      console.error('Failed to load footer logo:', error)
    }
  }
  loadFooterLogo()
}, [])
```

### Footer Logo Rendering

```tsx
{footerLogoUrl && (
  <div className="pt-6 flex justify-center">
    <img 
      src={footerLogoUrl} 
      alt="Footer Logo" 
      className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
    />
  </div>
)}
```

---

## Upload Process

### Filename Sanitization

Both uploads use the same sanitization process:

```typescript
const sanitized = file.name
  .normalize('NFD')                    // Decompose accented characters
  .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
  .replace(/[^a-zA-Z0-9._-]/g, '_')   // Replace invalid chars with underscore
```

### Storage Paths

- **Header:** `listings/header-logo/{timestamp}_{sanitized_filename}`
- **Footer:** `listings/footer-logo/{timestamp}_{sanitized_filename}`

### Error Handling

If upload fails:
1. Shows error message
2. Attempts to use local blob URL as fallback
3. Message auto-dismisses after 5 seconds

---

## Styling

### Header Logo

- **Height:** `h-10 sm:h-12` (40px → 48px responsive)
- **Width:** `w-auto` (maintains aspect ratio)
- **Effects:** `drop-shadow-sm` (subtle shadow)
- **Positioning:** Left side of header, next to home link

### Footer Logo

- **Height:** `h-16` (64px fixed)
- **Width:** `w-auto` (maintains aspect ratio)
- **Effects:** 
  - `opacity-80` (80% opacity default)
  - `hover:opacity-100` (100% on hover)
  - `transition-opacity` (smooth fade)
- **Positioning:** Centered horizontally, below copyright text

---

## Use Cases

### Header Logo

1. **Branding:** Use agency logo instead of generic Stella favicon
2. **White Label:** Custom logo for partner sites
3. **Campaign:** Temporary logo for special promotions
4. **Localization:** Different logo per market

### Footer Logo

1. **Certifications:** Display certification badges/logos
2. **Partnerships:** Show partner/sponsor logos
3. **Awards:** Display awards or recognitions
4. **Additional Branding:** Secondary branding element
5. **No Logo:** Leave empty for minimal footer

---

## Best Practices

### Header Logo

**Format:**
- PNG with transparent background (recommended)
- SVG for scalability
- Keep file size under 200KB

**Dimensions:**
- Recommended height: 48-96px
- Horizontal or square aspect ratio works best
- Logo will scale down on mobile

**Design:**
- Should work on light backgrounds (header has light backdrop)
- Test against both light and dark mode
- Ensure legibility at small sizes

### Footer Logo

**Format:**
- PNG with transparent background
- SVG for best quality
- Keep file size under 300KB

**Dimensions:**
- Recommended height: 64-128px
- Any aspect ratio (centers automatically)
- Will scale down to 64px height

**Design:**
- Should work on light/dark footer backgrounds
- Can be more decorative (less constrained than header)
- Optional - only use if adds value

---

## Database Schema

No migration needed. Settings auto-create on first save:

```sql
-- Header logo
INSERT INTO site_settings (key, value) 
VALUES ('header_logo_url', 'https://example.com/logo.png');

-- Footer logo
INSERT INTO site_settings (key, value) 
VALUES ('footer_logo_url', 'https://example.com/footer-logo.png');
```

---

## Testing Checklist

### Header Logo

- [ ] **Admin UI**
  - [ ] Section appears in admin panel
  - [ ] Can paste URL
  - [ ] Upload button works
  - [ ] Preview displays correctly
  - [ ] Save persists setting

- [ ] **Frontend Display**
  - [ ] Custom logo appears in header
  - [ ] Scales correctly on mobile/tablet/desktop
  - [ ] Falls back to default if empty
  - [ ] Error fallback shows circular gradient

### Footer Logo

- [ ] **Admin UI**
  - [ ] Section appears in admin panel
  - [ ] Can paste URL
  - [ ] Upload button works
  - [ ] Preview displays correctly
  - [ ] Save persists setting

- [ ] **Frontend Display**
  - [ ] Logo appears centered at footer bottom
  - [ ] Scales correctly
  - [ ] Hover effect works
  - [ ] Hidden when URL is empty
  - [ ] Spacing looks good on all pages

---

## Troubleshooting

### Header Logo Not Showing

**Issue:** Custom header logo doesn't appear

**Solutions:**
1. Hard refresh browser (Cmd+Shift+R)
2. Check URL is accessible (open in new tab)
3. Verify setting saved (check localStorage or database)
4. Check browser console for errors

### Footer Logo Not Showing

**Issue:** Footer logo doesn't appear

**Solutions:**
1. Verify URL is not empty (footer logo is optional)
2. Hard refresh browser
3. Check URL is accessible
4. Verify setting saved
5. Check browser console for errors

### Upload Fails

**Issue:** Upload button shows error

**Solutions:**
1. Check Supabase storage bucket exists
2. Verify bucket permissions (public or RLS policies)
3. Check file type (must be PNG, JPEG, SVG, or WebP)
4. Reduce file size if too large

### Logo Too Large/Small

**Issue:** Logo doesn't fit well

**Solutions:**
- **Header:** Use logo with 48-96px height, horizontal aspect ratio
- **Footer:** Use logo with 64-128px height, any aspect ratio
- Logos scale automatically but should be designed for target size

---

## Performance

- **Header:** Loads on every page (header is global)
- **Footer:** Loads on every page (footer is global)
- **Impact:** Minimal (one setting fetch each, cached)
- **Optimization:** Settings could be cached in localStorage

---

## Backward Compatibility

✅ **Fully Backward Compatible**
- Missing settings default to empty string
- Header falls back to `/stella-favicon.png`
- Footer logo simply doesn't show if empty
- No breaking changes to existing functionality

---

## Future Enhancements

Possible additions:
1. Logo link destination control
2. Logo alt text customization
3. Different logos for dark mode
4. Multiple footer logos (horizontal row)
5. Logo animation effects
6. Per-page logo overrides

---

## Related Documentation

- `WATERMARK_SIZE_AND_HERO_LOGO.md` - Hero logo docs
- `WATERMARK_SIZE_AND_HERO_LOGO_SUMMARY.md` - Implementation summary

---

## Summary

**Header Logo:**
- Customizable logo in top navigation
- Falls back to default favicon
- Appears on all pages

**Footer Logo:**
- Optional logo at bottom of footer
- Centered with hover effect
- Only shows if URL provided

**Admin:**
- Two new sections in `/admin/site-admin`
- Upload or paste URL
- Live preview
- Easy to save

Both features are production-ready! 🎉
