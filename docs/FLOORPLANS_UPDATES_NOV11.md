# Floorplans Section Updates - November 11, 2025

## Summary of Changes

Two major improvements were made to the project detail page:

### ✅ 1. Neighborhood Display in Project Header

**Before:**
```
280 Art Boulevard
São Paulo, SP
```

**After:**
```
280 Art Boulevard
Jardim Europa, São Paulo, SP
```

The location now includes the neighborhood when available from `project.rawFeatures.neighborhood`.

---

### ✅ 2. Interactive Floorplan Thumbnails with Lightbox Modal

**Before:**
- Text link "Ver planta" that opened in a new tab
- No preview of the floorplan

**After:**
- Clickable thumbnail image (192px width, 48px height)
- Hover effects with scale animation
- Opens full-size floorplan in a lightbox modal **on the same page**
- No new tabs opened

---

## Technical Implementation

### Location Label Update
```typescript
const locationLabel = useMemo(() => {
  const neighborhood = (project?.rawFeatures as any)?.neighborhood ?? null
  const parts = [neighborhood, project?.city, project?.state].filter(Boolean)
  return parts.join(', ')
}, [project?.city, project?.state, project?.rawFeatures])
```

### Floorplan Modal State
```typescript
const [floorplanModalOpen, setFloorplanModalOpen] = useState(false)
const [activeFloorplanUrl, setActiveFloorplanUrl] = useState<string | null>(null)
```

### Thumbnail Structure
Each floorplan card now starts with:
```tsx
<button
  type="button"
  onClick={() => {
    setActiveFloorplanUrl(fp.floorplanUrl)
    setFloorplanModalOpen(true)
  }}
  className="w-full mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all group cursor-pointer"
>
  <img
    src={fp.floorplanUrl}
    alt={fp.name}
    className="w-full h-48 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
  />
  <div className="px-3 py-2 bg-slate-50 text-xs text-slate-600 text-center group-hover:bg-slate-100 transition-colors">
    Click to view full size
  </div>
</button>
```

### Lightbox Modal
```tsx
{floorplanModalOpen && activeFloorplanUrl && (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={() => setFloorplanModalOpen(false)}
  >
    <div className="relative max-w-7xl max-h-[90vh] w-full">
      {/* Close button */}
      <button
        type="button"
        onClick={() => setFloorplanModalOpen(false)}
        className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300 transition-colors"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Image */}
      <div
        className="overflow-auto max-h-[90vh] rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activeFloorplanUrl}
          alt="Floorplan"
          className="w-full h-auto bg-white rounded-lg shadow-2xl"
        />
      </div>
    </div>
  </div>
)}
```

---

## User Experience Improvements

### Neighborhood Display
- ✅ More specific location information
- ✅ Better context for property location
- ✅ Automatically displays when available in data

### Floorplan Viewer
- ✅ **No new tabs** - stays on the same page
- ✅ **Visual preview** before clicking
- ✅ **Quick access** to full-size image
- ✅ **Easy dismissal** - click outside or close button
- ✅ **Smooth animations** throughout
- ✅ **Mobile-friendly** responsive design
- ✅ **Accessible** with clear close button

---

## Visual Design

### Thumbnail Card
- **Size**: Full width of card, 48px height
- **Background**: White for image, slate-50 for label
- **Border**: Slate-200, changes to slate-300 on hover
- **Animation**: Image scales to 105% on hover
- **Corners**: Rounded-xl (12px)

### Modal Overlay
- **Background**: Black 80% opacity with blur
- **Z-index**: 9999 (above all content)
- **Max Width**: 7xl (80rem)
- **Max Height**: 90vh
- **Image**: White background, rounded-lg, shadow-2xl
- **Close Button**: White X icon, positioned top-right

---

## Testing Checklist

- [x] TypeScript compilation - No errors
- [x] Neighborhood displays in header
- [x] Thumbnails render correctly
- [x] Modal opens on thumbnail click
- [x] Modal closes on X button click
- [x] Modal closes on backdrop click
- [x] Image scrolls if larger than viewport
- [x] Responsive on mobile
- [x] Hover effects work properly
- [x] No new tabs opened

---

## Files Modified

1. `/src/pages/projects/ProjectDetail.tsx` - Main implementation
2. `/docs/FLOORPLANS_SECTION.md` - Updated documentation

---

## Example URL

Test these changes on: `/projetos/280-art-boulevard-7f594a4f-4598-41c5-926c-76e3970bc90f`

---

## Next Steps

To add floorplans to a project:
1. Go to admin panel at `/admin/listings`
2. Edit the project
3. Scroll to "Floorplans" section
4. Add floorplan with name, units, area, price, and image URL
5. Save the project
6. View on the public project detail page
