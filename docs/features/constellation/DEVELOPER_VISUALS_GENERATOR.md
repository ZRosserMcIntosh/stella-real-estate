# Visual Asset Generator - Developer Tools

## Overview
Added a new "Visuals" tab under `/admin/developer` that provides tools for creating various types of images and graphics for the Stella platform.

## Location
- **Route**: `/admin/developer/visuals`
- **Component**: `src/pages/admin/developer/Visuals.tsx`

## Features

The Visual Asset Generator includes 5 different image creation tools:

### 1. 🖼️ OG Image / Meta Card
Generate Open Graph images for social media previews
- Custom page title and description
- Configurable background and text colors
- Perfect for SEO and social sharing

### 2. 🏠 Property Placeholder
Create placeholder images for listings without photos
- Multiple property types (Apartment, House, Commercial, Land)
- Custom property names
- Configurable dimensions and export formats (PNG, JPEG, WebP)

### 3. 👤 Team Avatar
Generate professional avatars with initials and brand colors
- Full name input for automatic initial generation
- Multiple size options (128x128, 256x256, 512x512)
- Various background styles (Gradient, Solid, Pattern)

### 4. ✨ Logo Variant
Create logo variations for different backgrounds and sizes
- Multiple logo styles (Full Logo, Icon Only, Wordmark, Monochrome)
- Background options (Transparent, White, Dark, Brand Color)
- Various export sizes including SVG

### 5. 📱 Social Media Post
Design branded social media graphics
- Platform-specific dimensions:
  - Instagram Post (1080x1080)
  - Instagram Story (1080x1920)
  - Facebook Post (1200x630)
  - Twitter Card (1200x675)
  - LinkedIn Post (1200x627)
- Custom headlines and subheadlines
- Multiple template styles

## Implementation Notes

### Current State
The component is currently a **UI framework** with form inputs and controls. The actual image generation logic is placeholder-based and logs to console.

### Next Steps for Full Implementation
To make this fully functional, you can integrate:

1. **Canvas API** - Use HTML5 Canvas for client-side image generation
2. **html2canvas** - Library for converting DOM elements to images
3. **Server-side generation** - Create API endpoints that use libraries like:
   - Sharp (Node.js image processing)
   - Puppeteer (browser automation for screenshots)
   - Jimp (JavaScript image manipulation)
4. **Third-party services** - Integrate with services like:
   - Cloudinary
   - Imgix
   - Uploadcare

### Example Integration Point
```typescript
const handleGenerate = async (type: ImageType) => {
  // Call your image generation API
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      config: formData // your form inputs
    })
  });
  
  const { imageUrl } = await response.json();
  setGeneratedImages([...generatedImages, imageUrl]);
};
```

## Usage
1. Navigate to `/admin/developer`
2. Click on the "Visuals" tab
3. Select the type of image you want to create
4. Fill in the form with your desired parameters
5. Click "Generate" to create the image
6. Download the generated image from the results list

## Files Modified
- ✅ Created `src/pages/admin/developer/Visuals.tsx`
- ✅ Updated `src/pages/admin/DeveloperLayout.tsx` (added Visuals tab)
- ✅ Updated `src/main.tsx` (added import and route)

## Date Added
November 14, 2025
