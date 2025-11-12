# Header Logo Size & Watermark Center Fix

## Summary
Two improvements to the site admin and display features:
1. **Header Logo Size Control** - Adjustable logo size with automatic header padding
2. **Watermark Center Position Fix** - Properly centered watermarks

## 1. Header Logo Size Control

### Feature Overview
Allows admins to control the header logo size with three presets that automatically adjust:
- Logo height (responsive for mobile and desktop)
- Header top/bottom padding
- Overall header proportions

### Size Options

| Size   | Logo Height (Mobile) | Logo Height (Desktop) | Header Padding | Use Case |
|--------|---------------------|---------------------|----------------|----------|
| Small  | 32px (h-8)          | 40px (h-10)         | py-2 (0.5rem)  | Compact, minimal design |
| Medium | 40px (h-10)         | 48px (h-12)         | py-3 (0.75rem) | Standard, balanced |
| Large  | 48px (h-12)         | 64px (h-16)         | py-4 (1rem)    | Prominent, brand-focused |

### Implementation Details

**Modified Files:**
1. `src/lib/siteSettings.ts` - Added `header_logo_size` key
2. `src/components/Header.tsx` - Dynamic sizing logic
3. `src/pages/admin/SiteAdmin.tsx` - Admin UI control

**Technical Approach:**
```typescript
const logoSizeConfig = {
  small: {
    height: 'h-8 sm:h-10',
    padding: 'py-2'
  },
  medium: {
    height: 'h-10 sm:h-12',
    padding: 'py-3'
  },
  large: {
    height: 'h-12 sm:h-16',
    padding: 'py-4'
  }
}
```

**Benefits:**
- **Responsive**: Different sizes for mobile (sm:) and desktop
- **Proportional**: Padding scales with logo size
- **Automatic**: Header height adjusts without manual CSS
- **Consistent**: All navigation elements scale together

### Admin UI Location
`/admin/site-admin` → "Header Logo" section → "Header Logo Size" dropdown

**Options:**
- Small (Compact Header)
- Medium (Standard) - Default
- Large (Prominent)

**Description shown:**
> "Adjusts logo height and header padding. Small: 32px-40px, Medium: 40px-48px, Large: 48px-64px"

### Usage Example

**Before (Fixed Size):**
- Logo always 40px-48px
- Header padding always py-3
- No flexibility for different design needs

**After (Adjustable):**
1. Go to `/admin/site-admin`
2. Scroll to "Header Logo" section
3. Select size from dropdown:
   - **Small**: Minimalist sites, lots of nav items
   - **Medium**: Balanced, standard use
   - **Large**: Brand-heavy, fewer nav items
4. Click "Save All Settings"
5. Refresh to see changes

### Visual Impact

**Small Header:**
```
┌─────────────────────────────────────┐
│ [Logo 32px] Nav Nav Nav Nav    USER │  ← py-2 padding
└─────────────────────────────────────┘
```

**Medium Header (Default):**
```
┌─────────────────────────────────────┐
│                                      │
│ [Logo 40px] Nav Nav Nav Nav    USER │  ← py-3 padding
│                                      │
└─────────────────────────────────────┘
```

**Large Header:**
```
┌─────────────────────────────────────┐
│                                      │
│                                      │
│ [Logo 48px] Nav Nav Nav Nav    USER │  ← py-4 padding
│                                      │
│                                      │
└─────────────────────────────────────┘
```

## 2. Watermark Center Position Fix

### Issue
Watermarks with `position: center` appeared **slightly left of true center** due to nested div structure causing transform calculations to be off.

### Root Cause
Previous implementation:
```tsx
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <div className="inline-block">
    <img className="max-w-[25%]" />
  </div>
</div>
```

**Problem:**
- Outer div positioned at center with transforms
- Inner `inline-block` div created extra wrapper
- Percentage-based `max-w` on inner image
- Transform calculated from outer div, not actual content size
- Result: Shifted left because transform didn't account for nested structure

### Solution
**Flattened structure** - removed wrapper div:
```tsx
<img 
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[25%]"
/>
```

**Benefits:**
- Transform calculates from actual element
- No intermediate wrapper affecting positioning
- Cleaner DOM structure
- True mathematical center

### Modified File
`src/components/WatermarkedImage.tsx`

**Changes:**
1. Removed wrapper `<div>` with opacity/positioning
2. Applied all classes directly to watermark element (img or text div)
3. Moved `pointer-events-none` and `select-none` to watermark element
4. Consolidated styling into single element

### Before vs After

**Before (Incorrect):**
```
Image Container
├── Watermark Wrapper (absolute, positioned, transformed)
│   └── Content Wrapper (inline-block)
│       └── Watermark Image/Text (sized)
```

**After (Correct):**
```
Image Container
├── Watermark Image/Text (absolute, positioned, transformed, sized)
```

### Testing
To verify the fix:

1. Go to `/admin/site-admin`
2. Enable watermark
3. Set position to "Center"
4. Upload test image to any listing
5. View on frontend
6. **Expected:** Watermark perfectly centered horizontally and vertically
7. **Measure:** Use browser dev tools to verify equal distances from edges

### All Positions Now Working
The fix ensures **all 9 positions** work correctly:

| Position | Horizontal | Vertical | Transform |
|----------|-----------|----------|-----------|
| top-left | left-4 | top-4 | none |
| top-center | left-1/2 | top-4 | -translate-x-1/2 |
| top-right | right-4 | top-4 | none |
| center-left | left-4 | top-1/2 | -translate-y-1/2 |
| **center** | **left-1/2** | **top-1/2** | **-translate-x-1/2 -translate-y-1/2** |
| center-right | right-4 | top-1/2 | -translate-y-1/2 |
| bottom-left | left-4 | bottom-4 | none |
| bottom-center | left-1/2 | bottom-4 | -translate-x-1/2 |
| bottom-right | right-4 | bottom-4 | none |

### Code Changes Detail

**Removed:**
```tsx
<div 
  className={`absolute ${positionClass} pointer-events-none select-none`}
  style={{ opacity, mixBlendMode }}
>
  <div className="inline-block">
    {/* watermark content */}
  </div>
</div>
```

**Added:**
```tsx
{watermarkConfig.type === 'image' ? (
  <img 
    className={`absolute ${positionClass} ${imageSizeClass} pointer-events-none select-none`}
    style={{ opacity, mixBlendMode }}
  />
) : (
  <div 
    className={`absolute ${positionClass} ${textSizeClass} pointer-events-none select-none`}
    style={{ opacity, mixBlendMode }}
  >
    {text}
  </div>
)}
```

## Combined Benefits

### Header Logo Size
✅ Flexible design options
✅ Automatic proportional scaling
✅ Responsive (mobile + desktop)
✅ Easy admin control
✅ No custom CSS needed

### Watermark Center Fix
✅ True mathematical center
✅ Works with all watermark sizes
✅ Cleaner DOM structure
✅ Better performance
✅ All positions now accurate

## Database Schema

New setting added:

| Key | Type | Values | Default |
|-----|------|--------|---------|
| `header_logo_size` | string | "small" \| "medium" \| "large" | "medium" |

## Testing Checklist

### Header Logo Size
- [ ] Small size: Logo 32px-40px, compact header
- [ ] Medium size: Logo 40px-48px, standard header
- [ ] Large size: Logo 48px-64px, prominent header
- [ ] Padding adjusts with logo size
- [ ] Responsive on mobile (sm: breakpoint)
- [ ] All nav items still visible
- [ ] Setting persists after refresh

### Watermark Center Position
- [ ] Center position truly centered
- [ ] No horizontal shift
- [ ] No vertical shift
- [ ] Works with small watermark
- [ ] Works with medium watermark
- [ ] Works with large watermark
- [ ] Works with text watermark
- [ ] Works with image watermark
- [ ] All other positions still work

## Browser Compatibility

Both features use standard CSS:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (desktop + iOS)
- ✅ Mobile browsers

## Performance Impact

**Header Logo Size:**
- No performance impact
- Pure CSS solution
- No JavaScript calculations
- Single setting load on mount

**Watermark Fix:**
- Improved performance (fewer DOM nodes)
- Reduced nesting
- Faster paint/layout
- Better memory usage

## Migration Notes

**Existing Sites:**
- Header logo will use "medium" size by default
- No visual changes unless setting is modified
- All existing watermarks will now center correctly
- No database migration needed

## Future Enhancements

### Potential Additions:
1. **Custom logo sizes** - Allow px value input
2. **Per-page logo sizes** - Different sizes for different pages
3. **Animated size transitions** - Smooth header resizing on scroll
4. **Logo size presets** - Save custom size combinations
5. **Auto-detect optimal size** - Based on logo aspect ratio

## Related Features

- [Logo Customization](./HEADER_FOOTER_LOGO_CUSTOMIZATION.md)
- [Watermark System](./WATERMARK_SIZE_AND_HERO_LOGO.md)
- [Site Admin Panel](./admin/README.md)

---

**Last Updated:** November 12, 2025
**Features:** Header Logo Size Control, Watermark Center Fix
