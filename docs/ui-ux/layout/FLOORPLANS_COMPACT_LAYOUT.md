# Compact Floorplan Layout - November 11, 2025

## Overview
Reorganized the floorplan cards to be more compact with information displayed in rows at the top and the thumbnail at the bottom.

## New Layout Structure

### Before (Vertical Layout):
```
┌────────────────────────────────┐
│  [LARGE THUMBNAIL]             │
│  Click to view full size       │
│                                │
│  Plant Type A                  │
│  Description text here         │
│                                │
│  Unidades: 12                  │
│  Área: 85 m²                   │
│                                │
│  Valor: R$ 850.000             │
└────────────────────────────────┘
```

### After (Compact Layout):
```
┌────────────────────────────────┐
│  Plant Type A                  │
│                                │
│  Valor          Unidades  Área │
│  R$ 850.000     12        85m² │
│                                │
│  Description text (2 lines)    │
│                                │
│  [COMPACT THUMBNAIL]           │
│  Click to view full size       │
└────────────────────────────────┘
```

## Key Changes

### 1. Layout Order
- ✅ **Title first** - Immediate identification
- ✅ **Info in compact 3-column grid** - Price, Units, Area side-by-side
- ✅ **Description (if exists)** - Truncated to 2 lines max
- ✅ **Thumbnail last** - Visual preview at bottom

### 2. Size Reductions
- **Padding**: `p-5` → `p-4` (20px → 16px)
- **Thumbnail height**: `h-48` (192px) → `h-32` (128px)
- **Label text**: `text-xs` (12px) → `text-[10px]` (10px)
- **Info labels**: `text-xs` (12px) → `text-[10px]` (10px)
- **Info values**: `text-base` (16px) → `text-sm` (14px)
- **Description**: `text-sm` (14px) → `text-xs` (12px)

### 3. Compact Info Grid
```tsx
<dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm mb-3">
  <div>
    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Valor</dt>
    <dd className="text-sm font-semibold text-slate-900 leading-tight">{displayPrice}</dd>
  </div>
  <div>
    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Unidades</dt>
    <dd className="text-sm font-semibold text-slate-900 leading-tight">{fp.units}</dd>
  </div>
  <div>
    <dt className="text-[10px] uppercase tracking-wider text-slate-500">Área</dt>
    <dd className="text-sm font-semibold text-slate-900 leading-tight">{formatArea(fp.areaM2)}</dd>
  </div>
</dl>
```

### 4. Description Truncation
- Added `line-clamp-2` utility class
- Limits description to 2 lines
- Adds ellipsis (...) if text overflows

## Visual Comparison

### Old Card Height (approx):
- Thumbnail: 192px
- Padding & spacing: ~60px
- Info section: ~120px
- **Total: ~372px**

### New Card Height (approx):
- Title: 24px
- Info grid: 32px
- Description: 32px (if exists)
- Thumbnail: 128px
- Padding & spacing: ~40px
- **Total: ~256px** (when description present)
- **Total: ~224px** (without description)

**Space saved: ~116-148px per card (31-40% reduction)**

## Responsive Grid

The 2-column grid remains on medium+ screens:
```tsx
<div className="mt-6 grid gap-6 md:grid-cols-2">
```

- **Mobile**: Single column (full width cards)
- **Desktop**: 2 columns (side-by-side cards)

## Complete Card Structure

```tsx
<article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
  {/* Title */}
  <h3 className="text-base font-semibold text-slate-900 mb-3">
    {fp.name}
  </h3>
  
  {/* Compact 3-column info grid */}
  <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm mb-3">
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-slate-500">Valor</dt>
      <dd className="text-sm font-semibold text-slate-900 leading-tight">{displayPrice}</dd>
    </div>
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-slate-500">Unidades</dt>
      <dd className="text-sm font-semibold text-slate-900 leading-tight">{fp.units}</dd>
    </div>
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-slate-500">Área</dt>
      <dd className="text-sm font-semibold text-slate-900 leading-tight">{formatArea(fp.areaM2)}</dd>
    </div>
  </dl>

  {/* Description (if exists) - max 2 lines */}
  {fp.description && (
    <p className="text-xs text-slate-600 mb-3 line-clamp-2">
      {fp.description}
    </p>
  )}

  {/* Compact thumbnail */}
  <button
    type="button"
    onClick={() => {
      setActiveFloorplanUrl(fp.floorplanUrl)
      setFloorplanModalOpen(true)
    }}
    className="w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all group cursor-pointer"
  >
    <img
      src={fp.floorplanUrl}
      alt={fp.name}
      className="w-full h-32 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
    />
    <div className="px-2 py-1.5 bg-slate-50 text-[10px] text-slate-600 text-center group-hover:bg-slate-100 transition-colors">
      Click to view full size
    </div>
  </button>
</article>
```

## Benefits

✅ **More compact** - ~31-40% height reduction per card
✅ **Better information hierarchy** - Key data at top
✅ **Easier scanning** - Price, units, and area in one row
✅ **Still interactive** - Thumbnail remains clickable
✅ **Cleaner look** - Less vertical spacing
✅ **More content visible** - Users see more without scrolling

## Typography Scale

| Element | Font Size | Line Height |
|---------|-----------|-------------|
| Title | 16px (base) | 24px (1.5) |
| Info Labels | 10px | 16px |
| Info Values | 14px (sm) | 20px (tight) |
| Description | 12px (xs) | 16px |
| Thumbnail Label | 10px | 14px |

## Spacing

| Element | Margin/Padding |
|---------|----------------|
| Card Padding | 16px (p-4) |
| Title Bottom | 12px (mb-3) |
| Info Grid Bottom | 12px (mb-3) |
| Description Bottom | 12px (mb-3) |
| Grid Gap X | 16px (gap-x-4) |
| Grid Gap Y | 8px (gap-y-2) |

## Color Scheme (Unchanged)

- **Background**: White 90% (`bg-white/90`)
- **Border**: Slate 200 (`border-slate-200`)
- **Title**: Slate 900 (`text-slate-900`)
- **Labels**: Slate 500 (`text-slate-500`)
- **Values**: Slate 900 (`text-slate-900`)
- **Description**: Slate 600 (`text-slate-600`)

## Files Modified

- `/src/pages/projects/ProjectDetail.tsx` - Updated floorplan card layout

## Testing Checklist

- [x] TypeScript compilation - No errors
- [x] Info displays in 3-column row
- [x] Description truncates to 2 lines
- [x] Thumbnail is more compact (128px height)
- [x] Modal still works on click
- [x] Hover effects preserved
- [x] Responsive on mobile
- [x] All spacing consistent
