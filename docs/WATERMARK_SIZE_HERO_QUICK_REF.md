# Quick Reference: Watermark Size & Hero Logo

## Watermark Size Control

**Location:** `/admin/site-admin` → Image Watermark section

### Sizes
| Size | Image Dimensions | Text Size | Use Case |
|------|-----------------|-----------|-----------|
| Small | 100×40px | text-lg to 2xl | Luxury, minimal branding |
| Medium | 200×80px | text-2xl to 4xl | Standard use |
| Large | 300×120px | text-3xl to 5xl | Maximum visibility |

### How to Change
1. Go to `/admin/site-admin`
2. Scroll to "Image Watermark"
3. Select size from dropdown
4. Save

---

## Hero Logo Control

**Location:** `/admin/site-admin` → Homepage Hero Logo section

### Options
1. **Upload:** Click "Upload Logo" button
2. **URL:** Paste image URL in field
3. **Default:** Leave empty for Stella.png

### Supported Formats
- PNG (recommended for transparency)
- JPEG
- SVG
- WebP

### Best Practices
- Use white/light logos for dark backgrounds
- Recommended width: 800-1200px
- Keep file size under 500KB
- Test against video background

---

## Quick Troubleshooting

### Watermark
- **Not changing:** Hard refresh (Cmd+Shift+R)
- **Wrong size:** Verify you clicked Save
- **Not showing:** Check watermark is enabled

### Hero Logo
- **Not showing:** Verify URL is accessible
- **Upload fails:** Check Supabase storage permissions
- **Wrong size:** Logo scales automatically (expected)

---

## API Quick Reference

```typescript
// Get settings
const s = await getSiteSettings(['watermark_size', 'hero_logo_url'])

// Set watermark size
await setSiteSetting('watermark_size', 'large')

// Set hero logo
await setSiteSetting('hero_logo_url', 'https://example.com/logo.png')
```

---

## Defaults

- `watermark_size`: `'medium'`
- `hero_logo_url`: `''` (uses `/Stella.png`)

---

## Where They Apply

**Watermark Size:**
- All listing photos site-wide
- Project detail pages
- Homepage project cards

**Hero Logo:**
- Homepage hero section only
- Displays over background video/image
- Centered with drop shadow

---

## Documentation

- **Full Guide:** `WATERMARK_SIZE_AND_HERO_LOGO.md`
- **Summary:** `WATERMARK_SIZE_AND_HERO_LOGO_SUMMARY.md`
- **This File:** `WATERMARK_SIZE_HERO_QUICK_REF.md`
