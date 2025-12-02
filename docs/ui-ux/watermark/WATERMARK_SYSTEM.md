# Watermark System Documentation

## Overview
A comprehensive watermark system has been implemented to protect listing images across the Stella Real Estate platform. The system allows administrators to add a subtle, mostly transparent watermark overlay to all photos on listings.

---

## Components

### 1. **Site Settings Library** (`src/lib/siteSettings.ts`)
Extended to support watermark configuration with four new settings:
- `watermark_enabled`: Boolean flag to enable/disable watermarks
- `watermark_text`: Custom text to display as watermark (default: "STELLA")
- `watermark_opacity`: Opacity value from 0.05 to 0.5 (default: 0.15 = 15%)
- `watermark_position`: Position on image (9 options: top-left, top-center, top-right, center-left, center, center-right, bottom-left, bottom-center, bottom-right)

### 2. **WatermarkedImage Component** (`src/components/WatermarkedImage.tsx`)
A reusable React component that:
- Wraps standard `<img>` elements
- Automatically loads watermark settings from site configuration
- Applies watermark overlay when enabled
- Supports all standard image props
- Includes `disableWatermark` prop to exclude specific images (e.g., logos, team photos)

**Usage Example:**
```tsx
import WatermarkedImage from '../components/WatermarkedImage'

// Standard usage - watermark will be applied if enabled
<WatermarkedImage 
  src={listing.thumbnail} 
  alt={listing.title}
  className="w-full h-40 object-cover rounded-md"
/>

// Disable watermark for specific images
<WatermarkedImage 
  src={teamMember.photo} 
  alt={teamMember.name}
  className="w-24 h-24 rounded-full"
  disableWatermark={true}
/>
```

### 3. **Admin Panel UI** (`src/pages/admin/SiteAdmin.tsx`)
New "Image Watermark" section added to Site Admin with:
- **Enable/Disable Toggle**: Turn watermarks on/off globally
- **Text Input**: Customize watermark text (max 50 characters)
- **Opacity Slider**: Visual slider from 5% to 50% opacity
- **Position Selector**: Dropdown with 9 position options
- **Live Preview**: Real-time preview showing how watermark will appear

---

## Features

### Subtle & Professional
- Default opacity of 15% ensures watermark is visible but not intrusive
- White text with drop-shadow for visibility on any background
- Large, bold, widely-tracked text for brand recognition

### Flexible Configuration
- **Enable/Disable**: Quick toggle for watermarks
- **Custom Text**: Use company name, copyright symbol, or custom branding
- **Adjustable Opacity**: From very subtle (5%) to clearly visible (50%)
- **9 Position Options**: Place watermark anywhere on the image

### Performance Optimized
- Settings loaded once per page/component
- CSS-based overlay (no server-side image processing)
- Minimal impact on page load times
- Works with existing image infrastructure

### Backward Compatible
- If disabled, renders standard `<img>` elements
- No breaking changes to existing components
- Can be selectively disabled per image

---

## Implementation Guide

### For Developers

#### Step 1: Import the Component
```tsx
import WatermarkedImage from '../components/WatermarkedImage'
```

#### Step 2: Replace `<img>` Tags
Replace standard image tags with the watermarked component:

**Before:**
```tsx
<img src={listing.photo} alt={listing.title} className="w-full h-auto" />
```

**After:**
```tsx
<WatermarkedImage src={listing.photo} alt={listing.title} className="w-full h-auto" />
```

#### Step 3: (Optional) Disable for Specific Images
For images that shouldn't have watermarks (team photos, logos, icons):
```tsx
<WatermarkedImage 
  src={logo} 
  alt="Company Logo" 
  disableWatermark={true}
/>
```

### For Administrators

#### Accessing Watermark Settings
1. Navigate to `/admin/site-admin` in the admin panel
2. Scroll to the "Image Watermark" section
3. Enable the watermark checkbox
4. Configure text, opacity, and position
5. Use the live preview to see changes in real-time
6. Click "Save" to apply settings site-wide

#### Best Practices
- **Text**: Keep it short and recognizable (e.g., "STELLA", "© STELLA")
- **Opacity**: Start at 15% and adjust based on your image types
- **Position**: Bottom-right or center are most common for real estate
- **Testing**: Enable on a test environment first to ensure it looks good across all images

---

## Where to Apply Watermarks

### Recommended (Apply Watermarks)
✅ Listing gallery images  
✅ Property thumbnail images  
✅ Project detail photos  
✅ Featured property images  
✅ Virtual tour stills  

### Not Recommended (Disable Watermarks)
❌ Team member photos  
❌ Company logos  
❌ UI icons and badges  
❌ Floor plans (optional - may obscure details)  
❌ Marketing graphics with text  

---

## Technical Details

### Database Schema
The watermark settings are stored in the `site_settings` table:
```sql
key                    | value
-----------------------|------------------
watermark_enabled      | 'true' | 'false'
watermark_text         | 'STELLA'
watermark_opacity      | '0.15'
watermark_position     | 'center'
```

### CSS Implementation
The watermark uses absolute positioning with CSS transforms:
- White text with large, bold font
- `drop-shadow` for visibility on any background
- `pointer-events: none` to prevent interaction
- `select-none` to prevent text selection
- `mix-blend-mode: normal` for consistent rendering

### Browser Compatibility
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Responsive design (text scales with viewport)

---

## Maintenance

### Updating Watermark Globally
Watermark changes take effect immediately after saving in Site Admin. No cache clearing or deployment needed.

### Testing
1. Enable watermark in Site Admin
2. Visit a listing page with images
3. Verify watermark appears at correct position and opacity
4. Test on mobile devices for responsiveness
5. Disable and verify images display normally

### Troubleshooting

**Watermark not appearing?**
- Check if watermark is enabled in Site Admin
- Verify the component is using `WatermarkedImage` instead of `<img>`
- Check browser console for errors loading settings

**Watermark too visible or not visible enough?**
- Adjust opacity slider in Site Admin (recommended: 10-20%)
- Lighter images may need higher opacity
- Darker images may need lower opacity

**Position looks wrong?**
- Try different position options in the dropdown
- Preview shows real-time changes
- Center or bottom-right are usually best

---

## Future Enhancements

Potential improvements for future versions:
- [ ] Multiple watermark styles per listing type
- [ ] Image-specific opacity based on image brightness
- [ ] Upload custom watermark images/logos
- [ ] Rotation/angle options
- [ ] A/B testing different watermark configurations
- [ ] Watermark analytics (does it deter image theft?)

---

## Security & Legal

### Copyright Protection
While watermarks provide a visual deterrent, they can be removed with sufficient effort. For legal protection:
- Include copyright notices in image metadata
- Register important images with copyright office
- Use takedown procedures for infringement
- Consider additional DRM for high-value properties

### Performance
Watermarks add minimal overhead:
- ~1-2ms per image render
- No server-side processing
- No additional HTTP requests
- CSS-only implementation

---

## Summary

The watermark system provides:
✅ **Easy Management**: Configure from admin panel  
✅ **Brand Protection**: Subtle watermark on all listing images  
✅ **Flexibility**: Enable/disable, customize text, opacity, position  
✅ **Performance**: Fast, CSS-based, no server processing  
✅ **User Friendly**: Simple integration, backward compatible  

For questions or issues, refer to this documentation or contact the development team.
