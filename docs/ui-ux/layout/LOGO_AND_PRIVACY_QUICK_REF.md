# Logo & Privacy Features - Quick Reference

## Summary
All logo customization, favicon, and privacy protection features in one place.

## Features at a Glance

### 🖼️ Logo Customization (4 locations)
1. **Hero Logo** - Homepage hero overlay
2. **Header Logo** - Top navigation bar (added padding for better spacing)
3. **Footer Logo** - Bottom of footer (optional)
4. **Favicon** - Browser tab icon

### 🔒 Privacy Protection (3 options)
1. **Disable Right-Click** - Blocks context menus
2. **Disable Text Selection** - Prevents text copying
3. **Disable Image Dragging** - Stops drag-and-drop saves

### ✨ Visual Enhancements
- **CRECI Number** - Gold color with glowing effect

## Admin Access
**Location:** `/admin/site-admin`

All settings in one scrollable page with sections for:
- Watermark settings
- Hero logo
- Header logo (with improved spacing)
- Footer logo
- **NEW:** Favicon
- **NEW:** Privacy settings

## Quick Actions

### Upload a Logo
1. Go to `/admin/site-admin`
2. Find desired logo section
3. Paste URL or click "Choose File"
4. Preview appears automatically
5. Click "Save All Settings"

### Change Favicon
1. Go to `/admin/site-admin`
2. Scroll to "Favicon" section
3. Upload 32x32 or 64x64 PNG
4. Click "Save All Settings"
5. Refresh browser to see changes

### Enable Privacy Protection
1. Go to `/admin/site-admin`
2. Scroll to "Site Privacy & Protection"
3. Check desired options:
   - ☑ Disable Right-Click
   - ☑ Disable Text Selection
   - ☑ Disable Image Dragging
4. Click "Save All Settings"
5. Refresh to apply

## Storage Paths (Supabase)
- Watermarks: `listings/watermark/`
- Hero Logos: `listings/hero-logo/`
- Header Logos: `listings/header-logo/`
- Footer Logos: `listings/footer-logo/`
- Favicons: `listings/favicon/`

## Setting Keys
```typescript
// Logo Settings
'hero_logo_url'
'header_logo_url'
'footer_logo_url'
'favicon_url'

// Privacy Settings
'disable_right_click'     // "true" | "false"
'disable_text_selection'  // "true" | "false"
'disable_image_dragging'  // "true" | "false"
```

## Header Improvements
**Logo Padding:** Added `pr-6` (1.5rem) to logo container for better spacing from navigation buttons. Prevents logo from appearing squished against "NOVOS PROJETOS" button.

## CRECI Enhancement
**Before:** Gray, subtle text
**After:** Gold/yellow with glowing effect

```css
/* CRECI Styling */
text-yellow-500 dark:text-yellow-400
font-semibold
text-shadow: 0 0 8px rgba(234, 179, 8, 0.6),
             0 0 16px rgba(234, 179, 8, 0.3)
```

## Privacy Protection Limitations
⚠️ **Important:** These are basic deterrents, not absolute protection:
- Browser dev tools can still access content
- Screenshots cannot be prevented
- Source code is publicly accessible
- Determined users can bypass protections

Use watermarks for critical image protection!

## Common Tasks

### Full Site Branding Setup
1. Upload hero logo (homepage)
2. Upload header logo (navigation)
3. Upload footer logo (optional)
4. Upload favicon (32x32 PNG)
5. Save all settings
6. Verify on frontend

### Maximum Protection Setup
1. Enable watermarks on all images
2. Enable all 3 privacy options
3. Set watermark to medium or large
4. Use image-based watermark (logo)
5. Save all settings

### Professional Look
1. Upload high-quality logos (SVG or PNG with transparency)
2. Use consistent branding across all logos
3. Enable CRECI gold glow (automatic)
4. Add footer logo for extra polish
5. Set custom favicon for brand recognition

## Testing Checklist

Logo Testing:
- [ ] Hero logo displays on homepage
- [ ] Header logo has proper spacing
- [ ] Footer logo appears at bottom
- [ ] Favicon shows in browser tab
- [ ] All logos scale properly on mobile

Privacy Testing:
- [ ] Right-click blocked when enabled
- [ ] Text cannot be selected when enabled
- [ ] Images cannot be dragged when enabled
- [ ] Watermarks appear on images
- [ ] Settings persist after refresh

Visual Testing:
- [ ] CRECI number glows gold in header
- [ ] Header logo not squished against buttons
- [ ] All logos load without errors
- [ ] Dark mode colors correct

## Troubleshooting

**Favicon not updating:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Clear browser cache
- Check favicon URL is valid
- Verify image is 32x32 or 64x64 pixels

**Header logo squished:**
- Fixed! Now has `pr-6` padding
- Spacing automatic based on logo size
- No manual adjustment needed

**Privacy settings not working:**
- Click "Save All Settings" in admin
- Refresh the page
- Check browser console for errors
- Settings must be "true" in database

**CRECI not glowing:**
- Check browser supports text-shadow
- Verify gold color is visible
- Test in both light and dark modes

## File Locations

Modified files for all features:
```
src/lib/siteSettings.ts          # Added 4 new setting keys
src/App.tsx                      # Privacy settings + favicon
src/components/Header.tsx        # Logo padding + CRECI styling
src/components/Footer.tsx        # Footer logo
src/pages/admin/SiteAdmin.tsx    # Admin UI for all features
```

## Documentation
- [Full Privacy & Favicon Guide](./FAVICON_AND_PRIVACY_SETTINGS.md)
- [Watermark & Logos Guide](./WATERMARK_SIZE_AND_HERO_LOGO.md)
- [Header/Footer Logos](./HEADER_FOOTER_LOGO_CUSTOMIZATION.md)

---

**Last Updated:** November 12, 2025
**Features:** Favicon, Privacy Settings, CRECI Gold, Header Logo Spacing
