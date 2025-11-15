# Stella Branded Image Generator

## Overview
Added a fully functional image generator under `/admin/developer/visuals` that creates a branded composite image featuring the Stella Mary logo, Constellation logo with text, and Ballet logo with text on a dark blue background.

## Date Added
November 14, 2025

## Location
- **Route**: `/admin/developer/visuals`
- **Component**: `src/pages/admin/developer/Visuals.tsx`
- **Generator Type**: "Stella Branded Image" (⭐)

## Features

### What It Generates
A 1200x1600px PNG image with:
1. **Dark Slate Background** - Uses slate-950 (#020617) matching the Pricing page
2. **Stella Mary Logo** - Positioned at top center (200px height)
3. **Constellation Logo** - Middle section with "CONSTELLATION" text below
   - Logo: 120px height
   - Text: Indigo-200 (#c7d2fe) with letter-spacing
   - Font: Outfit, sans-serif
4. **Ballet Logo** - Lower section with "BALLET" text below
   - Logo: 120px height
   - Text: Pink-300 (#f9a8d4) with letter-spacing
   - Font: Outfit, sans-serif

### How It Works
1. Uses HTML5 Canvas API for client-side image generation
2. Loads three logo images from `/public` directory:
   - `/stella-logo.png` (Stella Mary header logo)
   - `/contellation-logo.png` (Constellation CRM logo)
   - `/ballet-new-logo.png` (Ballet automation logo)
3. Renders logos with proper sizing and positioning
4. Adds styled text labels matching the Pricing page design
5. Exports as downloadable PNG file

### Usage Instructions
1. Navigate to `/admin/developer/visuals`
2. Click on "⭐ Stella Branded Image" card
3. Review the configuration (shows what will be generated)
4. Click "Generate Stella Branded Image" button
5. Wait for logos to load and image to render
6. Preview the generated image
7. Click "Download PNG" to save the file
8. Or click "Copy Data URL" to get the base64 data URL

## Technical Implementation

### Canvas-Based Generation
```typescript
const generateStellaBrandedImage = async () => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  
  // Set dimensions
  canvas.width = 1200
  canvas.height = 1600
  
  // Dark slate background (matches Pricing page)
  ctx.fillStyle = '#020617' // slate-950
  ctx.fillRect(0, 0, width, height)
  
  // Load and position logos
  // ... (loads Stella, Constellation, Ballet)
  
  // Add styled text labels
  // ... (CONSTELLATION and BALLET text)
  
  // Export to PNG
  const dataUrl = canvas.toDataURL('image/png')
}
```

### Styling Details
- **Constellation Text**: 
  - Color: `#c7d2fe` (indigo-200/80)
  - Letter-spacing: `0.4em`
  - Font: Outfit, uppercase
  - Matches the styling in `src/pages/Pricing.tsx` line 433

- **Ballet Text**:
  - Color: `#f9a8d4` (pink-400/90)
  - Letter-spacing: `0.4em`
  - Font: Outfit, uppercase
  - Matches the styling in `src/pages/Pricing.tsx` line 440

### Logo Files Used
- `/public/stella-logo.png` - Main Stella Mary logo from header
- `/public/contellation-logo.png` - Constellation stars icon
- `/public/ballet-new-logo.png` - Ballet ballerina icon

## Output Format
- **Format**: PNG
- **Dimensions**: 1200x1600 pixels
- **File naming**: `stella-branded-{timestamp}.png`
- **Download method**: Direct browser download via `<a>` element

## Use Cases
1. Social media graphics
2. Marketing materials
3. Presentation slides
4. Email signatures
5. Partnership announcements
6. Product showcase images

## Future Enhancements
Potential improvements:
- [ ] Customizable dimensions
- [ ] Multiple background color options
- [ ] Adjustable logo sizes
- [ ] Additional text fields
- [ ] Multiple export formats (JPEG, WebP, SVG)
- [ ] Background gradient options
- [ ] Logo glow/shadow effects
- [ ] Batch generation with variations

## Files Modified
- ✅ Updated `src/pages/admin/developer/Visuals.tsx`
  - Added `stella-branded` image type
  - Implemented canvas-based generation
  - Added download and preview functionality
  - Uses same styling as Pricing page

## Related Files
- `src/pages/Pricing.tsx` (lines 420-442) - Original logo styling reference
- `public/stella-logo.png` - Stella Mary logo
- `public/contellation-logo.png` - Constellation logo
- `public/ballet-new-logo.png` - Ballet logo
