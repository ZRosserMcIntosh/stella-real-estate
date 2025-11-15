# Resolution Presets Feature

## Date Added
November 14, 2025

## Overview
Added automatic resolution presets to the Stella Branded Image Generator, optimized for various social media platforms starting with Instagram.

## Available Presets

### Instagram (Priority Presets)
1. **Instagram Post** - 1080×1080px (Square 1:1)
   - Perfect for feed posts
   - Default selection
   
2. **Instagram Story** - 1080×1920px (Vertical 9:16)
   - Full-screen vertical format
   - Also works for Reels

3. **Instagram Landscape** - 1080×608px (Landscape 16:9)
   - Horizontal orientation
   - Maximum width without cropping

### Other Social Media Platforms
4. **Facebook Post** - 1200×630px (Landscape 1.91:1)
5. **Twitter/X Post** - 1200×675px (Landscape 16:9)
6. **LinkedIn Post** - 1200×627px (Landscape)
7. **Pinterest Pin** - 1000×1500px (Vertical 2:3)
8. **YouTube Thumbnail** - 1280×720px (Landscape 16:9)
9. **TikTok Video** - 1080×1920px (Vertical 9:16)

### Custom Size
10. **Custom** - User-defined dimensions
    - Default: 1200×1600px
    - Adjustable width and height

## Features

### Responsive Scaling
The generator automatically scales logos and text based on the selected resolution:
- **Logo sizing**: Scales proportionally to canvas size
- **Text sizing**: Adjusts font size based on dimensions
- **Positioning**: Uses percentages for consistent layout
  - Stella Mary logo: 10% from top
  - Constellation: 40% from top
  - Ballet: 70% from top

### Smart Layout
- Minimum scale of 0.5 to prevent logos from becoming too small
- Proportional spacing maintained across all resolutions
- Text remains readable even on smaller dimensions

## How to Use

1. Navigate to `/admin/developer/visuals`
2. Select **⭐ Stella Branded Image**
3. Choose a resolution from the dropdown:
   - **Instagram Post** (default) for square images
   - **Instagram Story** for vertical content
   - Or any other platform preset
4. For custom sizes, select **Custom** and enter dimensions
5. Click **Generate Stella Branded Image**
6. Download the optimized image

## Technical Details

### Resolution Data Structure
```typescript
interface ResolutionPreset {
  name: string
  width: number
  height: number
  description: string
}
```

### Scaling Algorithm
```typescript
const scale = Math.min(width / 1200, height / 1600)
const logoScale = Math.max(0.5, scale)
const fontSize = Math.max(16, 32 * logoScale)
```

### Position Calculation
```typescript
// Percentage-based positioning
const stellaY = height * 0.1  // 10% from top
const constellationY = height * 0.4  // 40% from top
const balletY = height * 0.7  // 70% from top
```

## Benefits

### For Users
✅ One-click optimization for each platform  
✅ No need to remember dimensions  
✅ Automatic aspect ratio handling  
✅ Professional output guaranteed  
✅ Custom sizing when needed  

### For Content
✅ No cropping on any platform  
✅ Optimal quality for each use case  
✅ Consistent branding across channels  
✅ Platform-specific best practices  

## Platform-Specific Notes

### Instagram Post (1080×1080)
- **Best for**: Regular feed posts
- **Aspect ratio**: 1:1 (Square)
- **Display**: No cropping in feed

### Instagram Story (1080×1920)
- **Best for**: Stories and Reels
- **Aspect ratio**: 9:16 (Vertical)
- **Display**: Full-screen mobile view

### Instagram Landscape (1080×608)
- **Best for**: Landscape photos
- **Aspect ratio**: 16:9
- **Display**: Maximum width in feed

### Facebook Post (1200×630)
- **Best for**: Link previews and posts
- **Aspect ratio**: 1.91:1
- **Display**: Optimal for News Feed

### Twitter/X Post (1200×675)
- **Best for**: Tweet images
- **Aspect ratio**: 16:9
- **Display**: Expands to full width

### LinkedIn Post (1200×627)
- **Best for**: Professional posts
- **Aspect ratio**: ~1.91:1
- **Display**: Optimal in feed

### Pinterest Pin (1000×1500)
- **Best for**: Pin images
- **Aspect ratio**: 2:3 (Vertical)
- **Display**: Tall format for feed

### YouTube Thumbnail (1280×720)
- **Best for**: Video thumbnails
- **Aspect ratio**: 16:9 (HD)
- **Display**: Standard video thumbnail

### TikTok Video (1080×1920)
- **Best for**: Video covers
- **Aspect ratio**: 9:16 (Vertical)
- **Display**: Full-screen vertical

## UI Components

### Resolution Selector
- Dropdown with all presets
- Shows dimensions and aspect ratio
- Default: Instagram Post

### Custom Dimensions
- Only visible when "Custom" selected
- Separate width/height inputs
- Validates numeric input

### Current Size Display
- Shows active dimensions
- Updates in real-time
- Confirms selection before generation

## File Updates
- ✅ `src/pages/admin/developer/Visuals.tsx` - Added presets and responsive scaling
- ✅ Build successful - No errors

## Future Enhancements
- [ ] Save custom presets
- [ ] Batch generation for all platforms
- [ ] Preview different resolutions side-by-side
- [ ] Additional platform presets (WhatsApp, Telegram, etc.)
- [ ] Aspect ratio constraints
- [ ] Crop guides overlay

## Testing Checklist
- [x] Instagram Post generates correctly
- [x] Instagram Story maintains vertical layout
- [x] All presets render without errors
- [x] Custom sizing works properly
- [x] Logos scale appropriately
- [x] Text remains readable
- [x] Build successful

## Usage Statistics Priority
Based on social media importance:
1. **Instagram** (3 presets) - Most popular
2. **Facebook** (1 preset) - Wide reach
3. **Twitter/X** (1 preset) - Real-time engagement
4. **LinkedIn** (1 preset) - Professional network
5. **Pinterest** (1 preset) - Visual discovery
6. **YouTube** (1 preset) - Video platform
7. **TikTok** (1 preset) - Short-form video
8. **Custom** - Flexibility

## Conclusion
The resolution presets feature makes it effortless to create platform-optimized branded images. Starting with Instagram as the default ensures users get the most commonly needed format first, with easy access to all other major platforms.
