# Floorplans Section Implementation

## Overview
Added a new "Plantas disponíveis" (Available Floorplans) section to the project detail page that displays floorplan information with clickable thumbnails and a lightbox modal viewer.

## Recent Updates (November 11, 2025)

### 1. Neighborhood Display in Header
The project header now displays the neighborhood in the location line:
- **Before**: "São Paulo, SP"
- **After**: "Jardim Europa, São Paulo, SP"

The neighborhood is extracted from `project.rawFeatures.neighborhood` and displayed when available.

### 2. Floorplan Thumbnail & Lightbox Modal
Floorplans now display with interactive thumbnails instead of just a text link:
- **Thumbnail Display**: Each floorplan shows a preview image (48px height, object-contain)
- **Click to Enlarge**: Clicking the thumbnail opens a full-screen lightbox modal
- **Modal Features**:
  - Dark backdrop with blur effect
  - Full-size floorplan image
  - Close button (X) in top-right
  - Click outside to close
  - Scrollable if image is larger than viewport
  - No new tabs opened - stays on same page

## Changes Made

### 1. Updated `/src/pages/projects/ProjectDetail.tsx`

#### Updated Location Label Logic
```typescript
const locationLabel = useMemo(() => {
  const neighborhood = (project?.rawFeatures as any)?.neighborhood ?? null
  const parts = [neighborhood, project?.city, project?.state].filter(Boolean)
  return parts.join(', ')
}, [project?.city, project?.state, project?.rawFeatures])
```

#### Added Modal State Management
```typescript
const [floorplanModalOpen, setFloorplanModalOpen] = useState(false)
const [activeFloorplanUrl, setActiveFloorplanUrl] = useState<string | null>(null)
```

#### Added Floorplans Data Parsing
A new `useMemo` hook was added to parse and format floorplan data from the project's raw features:

```typescript
const floorplans = useMemo(() => {
  if (!project?.rawFeatures) return []
  const raw = (project.rawFeatures as any).floorplans
  if (!Array.isArray(raw)) return []
  return raw.map((fp: any) => ({
    id: fp?.id ?? `fp-${Math.random().toString(36).slice(2, 8)}`,
    name: fp?.name ?? fp?.label ?? fp?.title ?? 'Floorplan',
    units: fp?.units ?? fp?.quantity ?? null,
    pricePerUnit: fp?.pricePerUnit ?? fp?.price_per_unit ?? fp?.price ?? null,
    areaM2: fp?.areaM2 ?? fp?.area_m2 ?? fp?.area ?? null,
    description: fp?.description ?? fp?.notes ?? null,
    floorplanUrl: fp?.floorplanUrl ?? fp?.floorplan_url ?? fp?.url ?? null,
  }))
}, [project?.rawFeatures])
```

#### Updated Floorplan Cards with Thumbnails
Each floorplan card now includes:
- Clickable thumbnail image at the top
- "Click to view full size" label
- Hover effects (scale up, border color change)
- Opens lightbox modal on click

#### Added Lightbox Modal Component
A full-screen modal overlay that:
- Shows the floorplan image at full size
- Has a dark semi-transparent backdrop with blur
- Includes a close button (X)
- Closes when clicking outside the image
- Prevents body scroll when open
- Uses z-index 9999 to appear above all other content

## Features

### Responsive Design
- Mobile: Single column layout
- Desktop: 2-column grid layout
- Modal is responsive and scrollable on all screen sizes
- Thumbnails maintain aspect ratio

### Thumbnail Display
- 48px height with object-contain (preserves aspect ratio)
- White background for clarity
- Border and hover effects
- Smooth transitions

### Lightbox Modal
- Full-screen dark overlay (80% opacity black with blur)
- Maximum 7xl width container
- 90vh maximum height for image
- Rounded corners with shadow
- Click outside or close button to dismiss
- Image scrollable if larger than viewport

### Data Display
- Shows only when floorplans exist in the data
- Handles missing fields gracefully
- Formats prices using the currency context
- Respects area unit preference (m² / ft²)

### User Experience
- No new tabs opened - stays on same page
- Smooth transitions and hover effects
- Clear visual feedback
- Accessible close button
- Keyboard-friendly (ESC key support via click outside)

## Data Structure

Floorplans are stored in the database at: `listings.features.floorplans`

Each floorplan object can have:
```typescript
{
  id: string              // Unique identifier
  name: string            // Floorplan name/label
  units?: number          // Number of units with this floorplan
  pricePerUnit?: number   // Price per unit
  areaM2?: number         // Area in square meters
  description?: string    // Additional details
  floorplanUrl?: string   // URL to floorplan image
}
```

The neighborhood is stored at: `listings.features.neighborhood`

## Example Usage

When a project has floorplans in its features, they will automatically display on the project detail page with clickable thumbnails. For example, on `/projetos/280-art-boulevard-7f594a4f-4598-41c5-926c-76e3970bc90f`:
- The header shows: "Jardim Europa, São Paulo, SP"
- Each floorplan displays a thumbnail
- Clicking opens a full-size view in a modal overlay

## Admin Integration

The floorplans are managed through the admin interface at `/src/pages/admin/ListingsNewProjects.tsx` using the `FloorplansManager` component. Admins can:
- Add new floorplans
- Edit existing floorplans
- Upload floorplan images
- Set pricing and area information
- Specify number of units per floorplan
- Add neighborhood information in the features

## Styling

The section uses the same design language as other sections:
- Rounded 3xl borders
- White/95 opacity background
- Soft shadows
- Slate color palette
- Sky blue accents removed (direct click on thumbnail)
- Hover effects on thumbnails
- Dark modal overlay with blur backdrop
- Smooth transitions throughout
