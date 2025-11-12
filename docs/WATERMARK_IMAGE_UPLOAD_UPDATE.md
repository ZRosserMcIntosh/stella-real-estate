# Watermark System - Image Upload Update

## New Feature: Custom Watermark Image/Logo

The watermark system has been enhanced to support custom image/logo uploads in addition to text watermarks!

---

## What's New

### Watermark Type Selection
You can now choose between:
1. **Text Watermark** - Display custom text (e.g., "STELLA", "© STELLA REAL ESTATE")
2. **Image/Logo Watermark** - Upload your company logo or custom watermark image

### Image Upload Support
- Upload PNG, JPG, or other image formats
- **Best Practice**: Use PNG with transparent background for professional results
- Images automatically scale to appropriate size (max 200x80px on display)
- Upload to Supabase storage or use direct URL

---

## How to Use

### Admin Panel (`/admin/site-admin`)

1. **Enable Watermark**
   - Check "Enable watermark on listing images"

2. **Select Watermark Type**
   - Choose "Text Watermark" for text-based watermarks
   - Choose "Image/Logo Watermark" for logo/image watermarks

3. **Configure Based on Type**

   **For Text Watermark:**
   - Enter your text (max 50 characters)
   - Recommended: "STELLA", "© STELLA", or your company name
   
   **For Image Watermark:**
   - Option A: Paste direct URL to your logo
   - Option B: Click "Upload" to upload from your computer
   - Preview shows your uploaded logo
   - **Tip**: Use PNG with transparent background for best results

4. **Adjust Settings**
   - Set opacity (5% - 50%, recommended: 15-20%)
   - Choose position (9 options available)
   - Use live preview to see results

5. **Save Settings**
   - Click "Save" to apply changes site-wide

---

## Image Recommendations

### Best Formats
✅ **PNG with transparency** - Professional look, blends with any background  
✅ **SVG** - Scales perfectly at any size  
✅ White or light-colored logos - Shows well with drop shadow  

### Avoid
❌ JPEG with background - May clash with listing photos  
❌ Very detailed logos - May become unclear at small sizes  
❌ Dark logos without transparency - May be hard to see  

### Sizing
- Images display at max 200px wide × 80px tall
- Aspect ratio is maintained
- Smaller, simpler logos work best
- High-resolution images recommended (will be scaled down)

---

## Technical Details

### New Settings
```typescript
watermark_type: 'text' | 'image'
watermark_image_url: string  // URL to uploaded image
```

### Storage
- Images uploaded to Supabase storage bucket: `listings/watermark/`
- Falls back to blob URLs in demo mode
- Supports direct URLs for externally hosted images

### Component Behavior
The `WatermarkedImage` component now:
- Checks `watermark_type` setting
- If type is 'image' and URL exists: displays image watermark
- Otherwise: displays text watermark (default behavior)

---

## Usage Examples

### Example 1: Text Watermark
```
Type: Text Watermark
Text: "STELLA"
Opacity: 15%
Position: Bottom Right
```

### Example 2: Logo Watermark
```
Type: Image/Logo Watermark
Image: [Upload company logo PNG]
Opacity: 20%
Position: Center
```

### Example 3: Copyright Symbol with Text
```
Type: Text Watermark
Text: "© STELLA 2025"
Opacity: 12%
Position: Bottom Center
```

---

## Advanced Tips

### Creating a Good Watermark Logo

1. **Start with your company logo**
   - Export as PNG with transparent background
   - Remove any text if logo is complex
   - Keep aspect ratio roughly 2:1 or 3:1 (horizontal)

2. **Optimize for watermark use**
   - Make it white or light gray
   - Add subtle glow/shadow in design tool
   - Keep it simple and recognizable
   - Test at small sizes

3. **Export settings**
   - Resolution: 800x400px or similar (will be scaled)
   - Format: PNG-24 with alpha channel
   - Compression: Minimal (quality is important)

### Switching Between Text and Image

You can switch at any time:
- Change "Watermark Type" dropdown
- Previous settings are preserved
- Preview updates in real-time
- Save to apply changes

### Testing Different Styles

1. Upload an image, set opacity to 15%, save
2. View a listing page to see results
3. Adjust opacity if needed (try 10%, 20%, 25%)
4. Try different positions
5. Compare with text watermark option

---

## Troubleshooting

### Image watermark not showing?
- ✅ Check that watermark is enabled
- ✅ Verify watermark type is set to "Image/Logo"
- ✅ Confirm image URL is valid and accessible
- ✅ Try uploading image again
- ✅ Check browser console for loading errors

### Image looks too small/large?
- Component auto-scales to max 200x80px
- Upload a higher resolution version
- Consider using text watermark for better sizing control

### Image has unwanted background?
- Re-export as PNG with transparency
- Use image editing tool to remove background
- Or switch to text watermark

### Upload fails?
- Check that Supabase storage bucket "listings" exists
- Verify bucket permissions are set correctly
- Try using direct URL instead of upload
- In demo mode, uploads create local blob URLs only

---

## API Reference

### WatermarkedImage Component

```tsx
<WatermarkedImage 
  src={imageUrl}
  alt="Description"
  className="your-classes"
  disableWatermark={false}  // Optional: disable for this image
/>
```

### Supported watermark configurations

**Text Mode:**
```typescript
{
  type: 'text',
  text: 'STELLA',
  opacity: 0.15,
  position: 'center'
}
```

**Image Mode:**
```typescript
{
  type: 'image',
  imageUrl: 'https://...logo.png',
  opacity: 0.20,
  position: 'bottom-right'
}
```

---

## Migration from Text-Only

If you were using the text watermark:
1. Your existing text settings are preserved
2. New "Type" field defaults to "text"
3. No action needed - continues working as before
4. Switch to "Image/Logo" when ready to use logo watermark

---

## Summary

You can now:
✅ Upload custom logo/image watermarks  
✅ Switch between text and image types  
✅ Preview both styles in real-time  
✅ Use PNG with transparency for best results  
✅ Upload to Supabase or use direct URLs  

The watermark system is now more flexible and professional, supporting both text and branded logo watermarks!
