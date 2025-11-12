# Watermark System - Quick Reference Guide

## 🎯 Two Watermark Options

### Option 1: Text Watermark
```
Perfect for: Simple branding, copyright notices
Example: "STELLA", "© STELLA 2025"
Pros: Always crisp, easy to customize, loads instantly
```

### Option 2: Image/Logo Watermark  
```
Perfect for: Brand logos, custom designs
Example: Your company logo
Pros: Professional branding, recognizable, unique
Recommendation: Use PNG with transparent background
```

---

## ⚙️ Settings Location

**Admin Panel**: `/admin/site-admin`  
**Section**: "Image Watermark" (below Featured Listings)

---

## 🚀 Quick Setup

### Text Watermark (30 seconds)
1. ✅ Enable watermark checkbox
2. ✅ Type: "Text Watermark"
3. ✅ Text: "STELLA" (or your text)
4. ✅ Opacity: 15%
5. ✅ Position: "bottom-right" or "center"
6. ✅ Save

### Image Watermark (2 minutes)
1. ✅ Enable watermark checkbox
2. ✅ Type: "Image/Logo Watermark"
3. ✅ Upload your logo (PNG recommended)
4. ✅ Opacity: 20%
5. ✅ Position: "center" or "bottom-right"
6. ✅ Preview and adjust
7. ✅ Save

---

## 📊 Opacity Guide

```
5-10%   = Very subtle (hardly noticeable)
10-15%  = Subtle (visible but not intrusive) ⭐ RECOMMENDED
15-20%  = Moderate (clearly visible)
20-30%  = Strong (very visible)
30-50%  = Very strong (may distract from photo)
```

---

## 📍 Position Guide

```
┌──────────────────────────┐
│ Top-L   Top-C   Top-R   │
│                          │
│ Mid-L   Center  Mid-R   │
│                          │
│ Bot-L   Bot-C   Bot-R   │ ⭐ Bot-R & Center most popular
└──────────────────────────┘
```

---

## 🎨 Design Tips

### For Text Watermarks
✅ Keep it SHORT (5-15 characters)  
✅ Use uppercase for impact  
✅ Add copyright symbol © if desired  
✅ Avoid special characters  

❌ Don't make it too long  
❌ Don't use multiple lines  

### For Image Watermarks
✅ Use PNG with transparent background  
✅ White or light-colored logos work best  
✅ Simple, recognizable designs  
✅ High resolution (will be scaled down)  

❌ Avoid JPEG with solid backgrounds  
❌ Don't use overly complex logos  
❌ Avoid dark logos (hard to see)  

---

## 🔄 Workflow

```
1. Go to /admin/site-admin
2. Scroll to "Image Watermark"
3. Enable watermark
4. Choose type (Text or Image)
5. Configure settings
6. Use LIVE PREVIEW to see results
7. Adjust opacity/position as needed
8. Save
9. Visit a listing page to verify
10. Adjust if needed
```

---

## 💡 Use Cases

### Text Watermark - Best For:
- Simple copyright protection
- Company name branding
- Quick setup needed
- Minimal design requirements

### Image Watermark - Best For:
- Strong brand identity
- Professional real estate companies
- Marketing materials
- Distinctive logo protection

---

## 🎯 Recommended Settings

### Conservative (Professional)
```
Type: Image/Logo
Opacity: 15%
Position: bottom-right
```

### Balanced (Standard)
```
Type: Text
Text: "STELLA"
Opacity: 18%
Position: center
```

### Bold (High Protection)
```
Type: Image/Logo
Opacity: 25%
Position: center
```

---

## ⚡ Quick Commands

**Enable quickly:**
- Navigate to `/admin/site-admin`
- Check "Enable watermark on listing images"
- Click Save

**Disable quickly:**
- Uncheck "Enable watermark on listing images"
- Click Save

**Switch types:**
- Change "Watermark Type" dropdown
- Configure new type settings
- Click Save

---

## 📱 Preview Before Saving

The admin panel includes a **live preview**:
- Shows exactly how watermark will look
- Updates in real-time as you adjust settings
- Test different positions/opacity
- No need to save to preview

---

## 🛠️ Technical Notes

**Image Upload:**
- Uploaded to: `listings/watermark/` bucket
- Max display size: 200x80px
- Supported formats: PNG, JPG, SVG, WebP
- Recommended: PNG with alpha transparency

**Performance:**
- CSS-based overlay (very fast)
- No server-side image processing
- Works with lazy loading
- ~1-2ms per image render

**Storage:**
- Settings stored in database
- Falls back to localStorage
- Changes apply instantly site-wide

---

## 🔍 Troubleshooting

**Not showing?**
→ Check watermark is enabled  
→ Verify settings saved  
→ Clear browser cache  

**Too faint?**
→ Increase opacity to 20-25%  
→ Try different position  
→ Use image watermark for more impact  

**Too strong?**
→ Decrease opacity to 10-12%  
→ Use lighter/smaller logo  
→ Try bottom-right position  

**Image not loading?**
→ Re-upload the image  
→ Try using direct URL  
→ Check image file is valid  
→ Verify storage bucket permissions  

---

## 📋 Checklist

Before going live:
- [ ] Watermark enabled
- [ ] Type selected (text or image)
- [ ] Settings configured
- [ ] Preview looks good
- [ ] Saved settings
- [ ] Tested on actual listing page
- [ ] Checked mobile view
- [ ] Verified on multiple photos
- [ ] Team approved appearance
- [ ] Documentation updated

---

## 🎓 Pro Tips

1. **Start subtle** (15% opacity) and increase if needed
2. **Test on dark AND light photos** before finalizing
3. **Use image watermark** for stronger brand presence
4. **Keep backups** of your watermark logo file
5. **Document your settings** for team reference
6. **Test mobile view** - watermark scales responsively
7. **Update seasonally** if desired (optional text changes)

---

## 📞 Need Help?

Refer to full documentation:
- `/docs/WATERMARK_SYSTEM.md` - Complete system docs
- `/docs/WATERMARK_IMAGE_UPLOAD_UPDATE.md` - Image feature details
- `/docs/WATERMARK_INTEGRATION_GUIDE.md` - Developer guide

---

**Status**: ✅ Ready to Use  
**Last Updated**: November 11, 2025  
**Version**: 2.0 (Image Upload Support)
