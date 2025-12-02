# Watermark Size Control & Hero Logo Customization

**Date:** November 12, 2025  
**Features:** Watermark size adjustment + Homepage hero logo customization

## Overview

Two new customization features have been added to the Site Admin panel:

1. **Watermark Size Control** - Adjust the size of watermarks on listing images
2. **Hero Logo Control** - Change the logo displayed on the homepage hero overlay

---

## 1. Watermark Size Control

### What It Does

Allows you to adjust the size of watermarks (both text and image) on all listing photos.

### Available Sizes

- **Small** - Subtle, minimal presence
  - Image: 100px × 40px max
  - Text: 1xl - 2xl font size
  
- **Medium** (default) - Balanced visibility
  - Image: 200px × 80px max
  - Text: 2xl - 4xl font size
  
- **Large** - Maximum prominence
  - Image: 300px × 120px max
  - Text: 3xl - 5xl font size

### How to Use

1. Go to `/admin/site-admin`
2. Scroll to **"Image Watermark"** section
3. Find the **"Size"** dropdown
4. Select your preferred size
5. Check the **Preview** below to see how it looks
6. Click **Save**

### Technical Details

**Setting Key:** `watermark_size`  
**Allowed Values:** `small`, `medium`, `large`  
**Default:** `medium`

**Component:** `WatermarkedImage.tsx`  
**Size Classes:**
```typescript
const sizeClasses = {
  image: {
    small: 'max-w-[100px] max-h-[40px]',
    medium: 'max-w-[200px] max-h-[80px]',
    large: 'max-w-[300px] max-h-[120px]'
  },
  text: {
    small: 'text-lg sm:text-xl md:text-2xl',
    medium: 'text-2xl sm:text-3xl md:text-4xl',
    large: 'text-3xl sm:text-4xl md:text-5xl'
  }
}
```

### Use Cases

- **Small**: For high-end luxury properties where you want minimal branding
- **Medium**: Standard size for most properties
- **Large**: For maximum brand presence or when watermark needs to be very visible

---

## 2. Hero Logo Control

### What It Does

Allows you to customize the logo displayed on the homepage hero overlay (the large logo that appears over the background video/image).

### Features

- Upload a custom logo image
- Paste a URL from an external source
- Falls back to default `Stella.png` if no custom logo set
- Live preview on dark background
- Supports PNG, JPEG, SVG, WebP formats

### How to Use

#### Option A: Upload Image
1. Go to `/admin/site-admin`
2. Scroll to **"Homepage Hero Logo"** section
3. Click **"Upload Logo"** button
4. Select your logo file (PNG recommended for transparency)
5. Image uploads to Supabase storage bucket
6. Preview appears below
7. Click **Save**

#### Option B: Paste URL
1. Go to `/admin/site-admin`
2. Scroll to **"Homepage Hero Logo"** section
3. Paste image URL in **"Logo Image URL"** field
4. Preview updates automatically
5. Click **Save**

#### Option C: Use Default
1. Leave the **"Logo Image URL"** field empty
2. Click **Save**
3. Homepage will use the default `/Stella.png` logo

### Technical Details

**Setting Key:** `hero_logo_url`  
**Storage Bucket:** `listings` (folder: `hero-logo/`)  
**Supported Formats:** PNG, JPEG, SVG, WebP  
**Display Size:** h-32 sm:h-40 md:h-48 lg:h-56 (responsive)

**Files Modified:**
- `src/lib/siteSettings.ts` - Added `hero_logo_url` setting
- `src/pages/admin/SiteAdmin.tsx` - Added hero logo UI section
- `src/App.tsx` - Modified hero logo to use setting

**Code:**
```tsx
// In App.tsx
const [heroLogoUrl, setHeroLogoUrl] = useState<string>('')

// Load from settings
const s = await getSiteSettings(['hero_logo_url'])
if (s.hero_logo_url) setHeroLogoUrl(s.hero_logo_url)

// Use in hero section
<img
  src={heroLogoUrl || "/Stella.png"}
  alt="Stella"
  className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
/>
```

### Best Practices

1. **Logo Format**
   - Use PNG with transparent background for best results
   - SVG works great for scalability
   - Avoid very large files (keep under 500KB)

2. **Logo Dimensions**
   - Recommended: 800px - 1200px width
   - Maintain aspect ratio
   - Logo should be horizontal or square
   - Will scale responsively

3. **Logo Style**
   - White or light-colored logos work best
   - Component adds drop shadow automatically
   - Test against dark backgrounds (hero video)

4. **Testing**
   - Check preview in admin panel
   - View on actual homepage
   - Test on different screen sizes
   - Verify logo is legible over video

### Storage Details

**Upload Process:**
1. File is sanitized (accents removed, special chars replaced)
2. Uploaded to `listings/hero-logo/{timestamp}_{filename}`
3. Public URL is generated
4. URL saved to `site_settings` table

**Fallback Behavior:**
- If upload fails: Shows error, offers local preview
- If no logo set: Uses default `/Stella.png`
- If URL invalid: Falls back to default

---

## Admin UI Updates

### New Controls Added

#### Watermark Section
- **Size Dropdown** (added after Position dropdown)
  - Small, Medium, Large options
  - Shows description below dropdown
  - Preview updates in real-time

#### Hero Logo Section (new section)
- **Logo Image URL** input field
- **Upload Logo** button with file picker
- **Current Hero Logo** preview (if logo set)
- **Preview on Dark Background** (simulates homepage)

### Save Function Updated

The save function now includes:
```typescript
setSiteSetting('watermark_size', watermarkSize),
setSiteSetting('hero_logo_url', heroLogoUrl.trim()),
```

---

## Database Schema

### New Settings Keys

```sql
-- Watermark size
INSERT INTO site_settings (key, value) 
VALUES ('watermark_size', 'medium');

-- Hero logo URL
INSERT INTO site_settings (key, value) 
VALUES ('hero_logo_url', 'https://example.com/logo.png');
```

### Migration Notes

- No database migration required
- Settings are inserted on first save
- Default values handled in code
- Backward compatible (missing settings use defaults)

---

## Testing Checklist

### Watermark Size

- [ ] **Admin UI**
  - [ ] Size dropdown appears
  - [ ] Can select small/medium/large
  - [ ] Description updates on selection
  - [ ] Preview shows correct size
  - [ ] Save button works

- [ ] **Frontend Display**
  - [ ] Small size displays correctly
  - [ ] Medium size displays correctly
  - [ ] Large size displays correctly
  - [ ] Works with text watermarks
  - [ ] Works with image watermarks
  - [ ] Responsive on mobile/tablet/desktop

### Hero Logo

- [ ] **Admin UI**
  - [ ] URL input field appears
  - [ ] Can paste URL
  - [ ] Upload button works
  - [ ] File picker opens
  - [ ] Upload completes successfully
  - [ ] Preview shows uploaded logo
  - [ ] Dark background preview accurate
  - [ ] Save button works

- [ ] **Frontend Display**
  - [ ] Custom logo displays on homepage
  - [ ] Logo scales responsively
  - [ ] Drop shadow visible
  - [ ] Legible over video background
  - [ ] Falls back to default if empty
  - [ ] Works on all device sizes

---

## Troubleshooting

### Watermark Size Not Changing

**Issue:** Size dropdown changes but watermark size stays the same

**Solutions:**
1. Make sure you clicked **Save** after changing size
2. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+F5)
3. Check browser console for errors
4. Verify setting saved: Check localStorage or database

### Hero Logo Not Showing

**Issue:** Uploaded logo but homepage still shows default

**Solutions:**
1. Click **Save** after uploading
2. Hard refresh homepage
3. Check if logo URL is valid (open in new tab)
4. Verify Supabase storage bucket is public
5. Check browser console for CORS errors

### Upload Failed

**Issue:** "Upload failed" error when uploading logo

**Solutions:**
1. **Storage bucket not configured:**
   - Run SQL setup script for storage bucket
   - Make bucket public or add RLS policies
   
2. **File too large:**
   - Compress image to under 1-2MB
   - Use online tools to optimize
   
3. **Invalid file type:**
   - Use PNG, JPEG, SVG, or WebP only
   - Check file extension is correct

### Logo Preview Doesn't Match Homepage

**Issue:** Logo looks different in admin preview vs homepage

**Explanation:**
- Admin preview uses smaller size (h-24)
- Homepage uses responsive sizes (h-32 to h-56)
- This is expected behavior
- Logo scales but maintains aspect ratio

---

## API Reference

### Site Settings

```typescript
// Get watermark size
const settings = await getSiteSettings(['watermark_size'])
const size = settings.watermark_size || 'medium'

// Set watermark size
await setSiteSetting('watermark_size', 'large')

// Get hero logo URL
const settings = await getSiteSettings(['hero_logo_url'])
const logoUrl = settings.hero_logo_url || ''

// Set hero logo URL
await setSiteSetting('hero_logo_url', 'https://example.com/logo.png')
```

### Component Props

```typescript
// WatermarkedImage component (no props changed)
<WatermarkedImage 
  src="image.jpg" 
  alt="Property"
  disableWatermark={false}  // Optional
/>

// Size is automatically loaded from settings
// No need to pass size prop
```

---

## Future Enhancements

### Potential Features

1. **Per-Listing Watermark Size**
   - Override global size for specific listings
   - Useful for different property types

2. **Hero Logo Animation**
   - Fade in on page load
   - Subtle pulse or glow effect

3. **Multiple Logo Variants**
   - Light version for dark backgrounds
   - Dark version for light backgrounds
   - Auto-switch based on video

4. **Logo Position Control**
   - Currently center-only
   - Add top-left, top-right options

5. **Size Presets**
   - Add "Extra Small" option
   - Add "Extra Large" option
   - Custom size input

---

## Notes

- Watermark size affects ALL listing images globally
- Hero logo only affects homepage hero section
- Both settings are site-wide (not per-user)
- Changes take effect immediately after save
- Compatible with existing watermark system
- No breaking changes to existing functionality

---

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify Supabase storage configuration
4. Test with default values first
5. Check other watermark/hero docs for related info

---

## Related Documentation

- `WATERMARK_SYSTEM.md` - Core watermark system
- `WATERMARK_IMAGE_UPLOAD_UPDATE.md` - Image watermark feature
- `WATERMARK_INTEGRATION_COMPLETE.md` - Page integration
- `WATERMARK_IMAGE_DEBUGGING.md` - Troubleshooting guide
