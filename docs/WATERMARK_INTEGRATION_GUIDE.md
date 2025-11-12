# Watermark Integration Guide

## Quick Start: Adding Watermarks to Existing Components

This guide shows how to integrate the new `WatermarkedImage` component into existing listing display components.

---

## Example 1: ListingsForSale.tsx

### Before (Current Code)
```tsx
<img src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

### After (With Watermark)
```tsx
import WatermarkedImage from '../../components/WatermarkedImage'

// In the render:
<WatermarkedImage src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

**Location**: Line ~735 in `/src/pages/admin/ListingsForSale.tsx`

---

## Example 2: ListingsForRent.tsx

### Before
```tsx
<img src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

### After
```tsx
import WatermarkedImage from '../../components/WatermarkedImage'

// In the render:
<WatermarkedImage src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

**Location**: Line ~720 in `/src/pages/admin/ListingsForRent.tsx`

---

## Example 3: ListingsNewProjects.tsx

### Before
```tsx
<img src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

### After
```tsx
import WatermarkedImage from '../../components/WatermarkedImage'

// In the render:
<WatermarkedImage src={thumb} alt={l.title} className="w-full h-40 object-cover rounded-md" />
```

**Multiple locations**: 
- Line ~1627 (thumbnail in listing card)
- Line ~1977 (existing media manager)

---

## Example 4: ProjectDetail.tsx (Public Facing)

### Before
```tsx
<img
  src={activeImage.url}
  alt={activeImage.alt || activeImage.caption || project.name}
  className="w-full h-auto"
/>
```

### After
```tsx
import WatermarkedImage from '../../components/WatermarkedImage'

// Main gallery image:
<WatermarkedImage
  src={activeImage.url}
  alt={activeImage.alt || activeImage.caption || project.name}
  className="w-full h-auto"
/>

// Thumbnail images in gallery:
<WatermarkedImage
  src={image.url}
  alt={image.alt || image.caption || `${project.name} ${idx + 1}`}
  className="w-full aspect-[4/3] object-cover transition-transform duration-200 hover:scale-105"
/>
```

**Location**: Lines ~313 and ~375 in `/src/pages/projects/ProjectDetail.tsx`

---

## Example 5: Selectively Disable Watermark

For images that shouldn't have watermarks (team photos, logos):

```tsx
import WatermarkedImage from '../../components/WatermarkedImage'

// Team member photo (NO watermark)
<WatermarkedImage 
  src={member.photoUrl} 
  alt={member.name}
  className="w-24 h-24 rounded-full"
  disableWatermark={true}
/>

// Company logo (NO watermark)
<WatermarkedImage 
  src="/stella-logo.png" 
  alt="Stella Real Estate"
  disableWatermark={true}
/>
```

---

## Bulk Migration Script

If you need to update many files at once, here's a pattern to search and replace:

### Search Pattern (regex):
```regex
<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"[^>]*/>
```

### Replace Pattern:
```tsx
<WatermarkedImage src={$1} alt={$2} className="$3" />
```

### Don't forget to add the import:
```tsx
import WatermarkedImage from '../../components/WatermarkedImage'
```

---

## Files to Update (Priority Order)

### High Priority (Public Facing - Most Important)
1. ✅ `/src/pages/projects/ProjectDetail.tsx` - Main project gallery
2. `/src/pages/Listings.tsx` - If listing cards are implemented
3. `/src/components/FeaturedProjects.tsx` - If this component exists
4. Any homepage components displaying property images

### Medium Priority (Admin Preview)
5. `/src/pages/admin/ListingsForSale.tsx` - Listing previews
6. `/src/pages/admin/ListingsForRent.tsx` - Listing previews
7. `/src/pages/admin/ListingsNewProjects.tsx` - Project previews

### Low Priority (Internal Only)
8. Admin thumbnails in forms (optional)
9. Image management interfaces (optional)

---

## Testing Checklist

After integrating watermarks:

- [ ] Visit `/admin/site-admin`
- [ ] Enable watermark
- [ ] Set text to "STELLA"
- [ ] Set opacity to 15%
- [ ] Set position to "center" or "bottom-right"
- [ ] Click "Save"
- [ ] Visit a listing page with images
- [ ] Verify watermark appears correctly
- [ ] Test different positions
- [ ] Test different opacity levels
- [ ] Check mobile responsiveness
- [ ] Verify performance (no slowdown)
- [ ] Disable watermark and verify images display normally

---

## Common Issues & Solutions

### Issue: Import path is wrong
**Solution**: Adjust the import path based on file location:
- From `/src/pages/projects/`: `'../../components/WatermarkedImage'`
- From `/src/pages/admin/`: `'../../components/WatermarkedImage'`
- From `/src/components/`: `'./WatermarkedImage'`

### Issue: TypeScript errors about props
**Solution**: The component accepts all standard img attributes via `...rest`:
```tsx
<WatermarkedImage 
  src={url} 
  alt={title}
  className="..."
  loading="lazy"
  onLoad={() => console.log('loaded')}
  // Any other img attributes work
/>
```

### Issue: Watermark appears but looks wrong
**Solution**: Adjust settings in admin panel:
- Too faint? Increase opacity to 20-25%
- Too bold? Decrease opacity to 10-12%
- Wrong position? Try different positions from dropdown
- Text too long? Keep it short (5-10 characters)

---

## Performance Notes

The `WatermarkedImage` component:
- Loads settings once per mount (cached in component state)
- Uses CSS overlays (no canvas/image processing)
- Zero server-side overhead
- Minimal client-side performance impact (~1-2ms per image)
- Works with lazy loading, srcset, and other img features

---

## Next Steps

1. Start with high-priority public-facing pages
2. Test thoroughly on one page before rolling out
3. Update admin preview pages next
4. Create a task to audit all image uses in the codebase
5. Document any custom implementations in this file

---

## Questions?

Refer to `/docs/WATERMARK_SYSTEM.md` for full system documentation.
