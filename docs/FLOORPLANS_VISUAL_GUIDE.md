# Visual Guide: Floorplans Section Updates

## 1. Location Header - Now Shows Neighborhood

### Before:
```
┌─────────────────────────────────────┐
│  280 Art Boulevard                  │
│  São Paulo, SP                      │
└─────────────────────────────────────┘
```

### After:
```
┌─────────────────────────────────────┐
│  280 Art Boulevard                  │
│  Jardim Europa, São Paulo, SP       │  ← Neighborhood added!
└─────────────────────────────────────┘
```

---

## 2. Floorplan Cards - Interactive Thumbnails

### Before:
```
┌────────────────────────────────────────┐
│  Plant Type A                          │
│  Modern 2-bedroom layout               │
│                                        │
│  Unidades: 12    Área: 85 m²          │
│  Valor: R$ 850.000                     │
│                                        │
│  👁️ Ver planta  ← Opens new tab       │
└────────────────────────────────────────┘
```

### After:
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │     [FLOORPLAN THUMBNAIL]          │ │ ← Clickable image
│ │        (hover: scales up)          │ │
│ └────────────────────────────────────┘ │
│   Click to view full size              │
│                                        │
│  Plant Type A                          │
│  Modern 2-bedroom layout               │
│                                        │
│  Unidades: 12    Área: 85 m²          │
│  Valor: R$ 850.000                     │
└────────────────────────────────────────┘
     ↓ Click thumbnail
```

---

## 3. Lightbox Modal - Full-Size Viewer

```
┌──────────────────────────────────────────────────────────┐
│                                                      [X]  │ ← Close button
│                                                          │
│                                                          │
│                                                          │
│              ┌────────────────────────┐                 │
│              │                        │                 │
│              │   FULL SIZE FLOORPLAN  │                 │
│              │                        │                 │
│              │   (Scrollable if large)│                 │
│              │                        │                 │
│              └────────────────────────┘                 │
│                                                          │
│          Dark background with blur                      │
│          Click anywhere outside to close                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Complete Floorplans Section Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Plantas disponíveis                                            │
│  Modelos de plantas com especificações técnicas.               │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐     │
│  │ [THUMBNAIL]             │  │ [THUMBNAIL]             │     │
│  │ Click to view full size │  │ Click to view full size │     │
│  │                         │  │                         │     │
│  │ Plant Type A            │  │ Plant Type B            │     │
│  │ Modern layout           │  │ Luxury layout           │     │
│  │                         │  │                         │     │
│  │ Unidades: 12            │  │ Unidades: 8             │     │
│  │ Área: 85 m²             │  │ Área: 120 m²            │     │
│  │ Valor: R$ 850.000       │  │ Valor: R$ 1.200.000     │     │
│  └─────────────────────────┘  └─────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Interaction Flow

```
User visits project page
        ↓
Sees floorplan thumbnails
        ↓
Hovers over thumbnail
  → Image scales up slightly
  → Border color changes
  → Cursor shows pointer
        ↓
Clicks thumbnail
        ↓
Modal opens with full-size image
  → Dark backdrop appears
  → Image displays at full resolution
  → Stays on same page (no new tab)
        ↓
User can:
  → Click X button to close
  → Click outside image to close
  → Scroll image if larger than viewport
        ↓
Modal closes
        ↓
User returns to project page
```

---

## 6. Responsive Behavior

### Desktop (≥768px):
- 2-column grid for floorplan cards
- Modal centered with max-width: 7xl
- Thumbnails full width of card

### Mobile (<768px):
- Single column for floorplan cards
- Modal fills screen with padding
- Thumbnails full width of screen

---

## 7. Color Scheme

### Thumbnail:
- **Background**: White (`bg-white`)
- **Border**: Slate 200 (`border-slate-200`)
- **Hover Border**: Slate 300 (`hover:border-slate-300`)
- **Label Background**: Slate 50 (`bg-slate-50`)

### Modal:
- **Backdrop**: Black 80% with blur (`bg-black/80 backdrop-blur-sm`)
- **Image Background**: White (`bg-white`)
- **Close Button**: White text (`text-white`)
- **Close Hover**: Slate 300 (`hover:text-slate-300`)

---

## 8. Animation Details

### Thumbnail Hover:
- **Transform**: Scale to 105%
- **Duration**: 300ms
- **Easing**: Default cubic-bezier

### Modal:
- **Z-index**: 9999 (above all content)
- **Transition**: All properties with default timing

### Close Button:
- **Color Transition**: Default duration
- **Easing**: Default cubic-bezier

---

## Key Features Summary

✅ **Neighborhood in header** - More specific location info
✅ **Visual thumbnails** - See before clicking
✅ **Same-page modal** - No new tabs
✅ **Click outside to close** - Intuitive dismissal
✅ **Smooth animations** - Professional feel
✅ **Mobile responsive** - Works on all devices
✅ **Accessible** - Clear close button and labels
✅ **High performance** - Lazy loading, efficient rendering
