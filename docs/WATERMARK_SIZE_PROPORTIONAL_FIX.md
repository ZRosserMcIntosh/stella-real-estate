# Watermark Size Fix - Proportional Scaling

**Date:** November 12, 2025  
**Issue:** Watermark sizes were inconsistent between thumbnails and main images  
**Status:** ✅ Fixed

---

## The Problem

When using small/medium/large watermark sizes:
- **Thumbnails:** Watermark appeared too large
- **Main images:** Watermark appeared too small
- **Root cause:** Fixed pixel sizes (e.g., `max-w-[100px]`) don't scale with image size

### Example of the Issue
```
Thumbnail (200px wide):
- 100px watermark = 50% of image (way too big!)

Main image (1200px wide):
- 100px watermark = 8% of image (too small!)
```

---

## The Solution

Changed from **fixed pixel sizes** to **percentage-based sizes** that scale proportionally with the image.

### Before (Fixed Pixels)
```typescript
image: {
  small: 'max-w-[100px] max-h-[40px]',
  medium: 'max-w-[200px] max-h-[80px]',
  large: 'max-w-[300px] max-h-[120px]'
}
```

### After (Percentage-Based)
```typescript
image: {
  small: 'max-w-[15%] max-h-[15%]',   // 15% of image size
  medium: 'max-w-[25%] max-h-[25%]',  // 25% of image size
  large: 'max-w-[35%] max-h-[35%]'    // 35% of image size
}
```

---

## How It Works Now

### Image Watermarks
- **Small:** 15% of the image dimensions
- **Medium:** 25% of the image dimensions
- **Large:** 35% of the image dimensions

**Result:** Watermark maintains the same visual proportion whether on a thumbnail or full-size image.

### Text Watermarks
Changed from responsive breakpoints to fluid scaling:

**Before:**
```typescript
small: 'text-lg sm:text-xl md:text-2xl'  // Jumps at breakpoints
```

**After:**
```typescript
small: 'text-[clamp(0.75rem, 2vw, 1rem)]'  // Smoothly scales
```

Using `clamp()` ensures:
- Minimum size: Readable on small screens
- Maximum size: Not too large on big screens
- Fluid scaling: Smooth size changes

---

## Visual Comparison

### Thumbnail (300×200px)
- **Before:** 100px watermark = 33% (huge!)
- **After:** 15% watermark = 45px (perfect!)

### Main Image (1200×800px)
- **Before:** 100px watermark = 8% (tiny!)
- **After:** 15% watermark = 180px (perfect!)

---

## Files Changed

✅ `src/components/WatermarkedImage.tsx`
- Changed image size classes from pixels to percentages
- Changed text size classes from responsive to `clamp()`

✅ `src/pages/admin/SiteAdmin.tsx`
- Updated preview to match new percentage-based sizing
- Text preview now uses inline `fontSize` with `clamp()`

---

## Benefits

1. **Consistency:** Watermark looks the same relative size on all images
2. **Proportional:** Scales perfectly with image dimensions
3. **Responsive:** Works on any screen size
4. **Predictable:** What you see in preview matches live site

---

## Size Guide (Updated)

| Size | Image % | Text Size | Visual Result |
|------|---------|-----------|---------------|
| Small | 15% | clamp(0.75rem, 2vw, 1rem) | Subtle, minimal |
| Medium | 25% | clamp(1rem, 3vw, 1.5rem) | Balanced |
| Large | 35% | clamp(1.25rem, 4vw, 2rem) | Prominent |

---

## Testing

To verify the fix:

1. **Go to any listing with photos**
2. **Check thumbnails** (small images in gallery)
3. **Check main image** (large hero image)
4. **Watermark should appear proportionally the same size on both**

### Example Test Cases

**Thumbnail Gallery:**
- Row of 6 thumbnails
- Each ~150-200px wide
- Watermark should be small but visible

**Main Image:**
- Large hero image
- 800-1200px wide
- Watermark should be larger but maintain same visual proportion

---

## Technical Details

### CSS `clamp()` Function

Syntax: `clamp(min, preferred, max)`

**Example:**
```css
font-size: clamp(0.75rem, 2vw, 1rem);
```

- `0.75rem` = Minimum size (12px)
- `2vw` = Preferred size (2% of viewport width)
- `1rem` = Maximum size (16px)

**Result:** Font size fluidly scales between 12px and 16px based on viewport.

### Percentage-Based Sizing

```css
max-w-[15%]
```

- Width is 15% of the **parent container**
- Parent = the image itself (wrapped in relative container)
- Scales automatically with image size

---

## Edge Cases Handled

✅ **Very small images** (< 100px): Watermark won't get smaller than text minimum  
✅ **Very large images** (> 2000px): Watermark won't exceed 35% of image  
✅ **Portrait images:** Percentages work on both width and height  
✅ **Landscape images:** Aspect ratio maintained via `object-contain`

---

## Backward Compatibility

✅ **Fully Compatible**
- Existing watermarks continue to work
- Size setting defaults to "medium"
- No database changes needed
- No breaking changes

---

## Performance Impact

- **None:** CSS-only changes
- No JavaScript calculations needed
- Browser handles scaling natively
- Same render performance

---

## Related Documentation

- `WATERMARK_SIZE_AND_HERO_LOGO.md` - Main feature docs
- `WATERMARK_SIZE_AND_HERO_LOGO_SUMMARY.md` - Implementation summary
- `WATERMARK_SIZE_HERO_QUICK_REF.md` - Quick reference

---

## Summary

**Problem:** Fixed pixel watermark sizes didn't scale with image dimensions  
**Solution:** Changed to percentage-based sizing (15%, 25%, 35%)  
**Result:** Watermarks now appear proportionally consistent on all image sizes

The watermark will now look the same relative size whether it's on a thumbnail or a full-size image! 🎉
