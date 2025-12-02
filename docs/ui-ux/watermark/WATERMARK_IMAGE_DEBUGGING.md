# Watermark Image Upload - Debugging Guide

## Issue: PNG Watermark Not Showing

If your uploaded PNG watermark isn't appearing on images, follow this debugging guide.

---

## Step 1: Check Browser Console

The watermark component now has debug logging:

1. **Open Browser Console** (F12 → Console tab)
2. **Refresh the page** with a listing image
3. **Look for these messages**:

```javascript
// What you should see:
"Watermark config loaded: {enabled: true, type: 'image', imageUrl: 'https://...', ...}"
"Watermark image loaded successfully: https://..."

// If image fails to load:
"Watermark image failed to load: https://..."
```

---

## Step 2: Verify Settings Are Saved

### Check in Admin Panel:
1. Go to `/admin/site-admin`
2. Scroll to "Image Watermark" section
3. Verify:
   - ✅ Watermark enabled checkbox is **checked**
   - ✅ Type is set to **"Image/Logo Watermark"**
   - ✅ Image URL field has a **URL** (not empty)
   - ✅ Click **Save** (important!)

### Check in Browser Console:
```javascript
// In browser console, run:
localStorage.getItem('site:watermark_type')
localStorage.getItem('site:watermark_image_url')

// Should return:
"image"
"https://...your-uploaded-image-url..."
```

---

## Step 3: Verify Image URL is Accessible

### Test the Image URL:
1. Copy the image URL from admin panel
2. Paste it in a new browser tab
3. Image should load directly

**If image doesn't load:**
- URL might be incorrect
- Supabase bucket might not be public
- Image might have been deleted
- CORS issue

---

## Step 4: Check Supabase Storage

### Verify Upload Succeeded:
1. Go to **Supabase Dashboard** → Storage
2. Navigate to **`listings`** bucket
3. Open **`watermark`** folder
4. Your uploaded PNG should be there

### Check Public Access:
1. Click the image file
2. Click **"Get URL"** or **"Copy URL"**
3. Paste URL in browser - should load
4. If "Access Denied" error:
   - Bucket needs to be public
   - Or add proper RLS policies

---

## Step 5: Common Issues & Fixes

### Issue 1: Image URL is Empty
**Symptoms:** Console shows `imageUrl: ""`

**Solution:**
```
1. Re-upload the image in admin panel
2. Make sure you click "Save" after upload
3. Refresh the page
4. Check console for new URL
```

### Issue 2: Image URL is Blob URL
**Symptoms:** URL starts with `blob:http://localhost...`

**Solution:**
```
This means upload failed and it's using local preview.
1. Check Supabase storage bucket exists
2. Run the SQL setup script (see WATERMARK_UPLOAD_TROUBLESHOOTING.md)
3. Re-upload the image
```

### Issue 3: CORS Error
**Symptoms:** Console shows "CORS policy" error

**Solution:**
```
1. Supabase bucket needs proper CORS settings
2. In Supabase Dashboard → Storage → Settings
3. Add CORS rule:
   {
     "allowedOrigins": ["*"],
     "allowedHeaders": ["*"],
     "allowedMethods": ["GET"]
   }
```

### Issue 4: Image Too Large
**Symptoms:** Image doesn't show or looks wrong

**Solution:**
```
1. Watermark images are limited to 200x80px display size
2. Use a smaller logo (recommended: 400x200px or similar)
3. PNG with transparent background works best
```

### Issue 5: Wrong File Type
**Symptoms:** Image doesn't load

**Solution:**
```
1. Use PNG format (best for transparency)
2. SVG works too
3. JPEG works but won't have transparency
4. Avoid very large files (>1MB)
```

---

## Step 6: Fallback Behavior

The component now has **automatic fallback**:
- If image fails to load, it will show **text watermark** instead
- This prevents listings from appearing without any watermark

**How it works:**
```
1. Try to load image watermark
2. If successful → show image
3. If failed → fallback to text watermark
4. Console logs the failure reason
```

---

## Step 7: Manual Testing

### Test 1: Can You See the Image in Preview?
```
1. Go to /admin/site-admin
2. Upload or paste image URL
3. Look for "Current watermark image" preview below
4. If preview shows → URL is valid
5. If preview doesn't show → URL is invalid
```

### Test 2: Save and Reload
```
1. Configure watermark settings
2. Click Save
3. Open a new browser tab
4. Go to homepage or project page
5. Open browser console
6. Look for "Watermark config loaded" message
7. Check if imageUrl is populated
```

### Test 3: Force Refresh
```
Sometimes browser cache causes issues:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
2. Or: Clear browser cache
3. Or: Open in incognito/private window
```

---

## Step 8: Advanced Debugging

### Check localStorage:
```javascript
// Open browser console and run:
Object.keys(localStorage).filter(k => k.startsWith('site:')).forEach(k => {
  console.log(k, '=', localStorage.getItem(k))
})

// Should show:
// site:watermark_enabled = true
// site:watermark_type = image
// site:watermark_image_url = https://...
```

### Check Database (if using Supabase):
```sql
-- In Supabase SQL Editor:
SELECT * FROM site_settings 
WHERE key LIKE 'watermark%';

-- Should return rows like:
-- watermark_enabled | true
-- watermark_type | image
-- watermark_image_url | https://...
```

### Network Tab:
```
1. Open DevTools → Network tab
2. Refresh page with listing
3. Find request for watermark image
4. Check:
   - Status code (200 = success)
   - Response (should be image data)
   - Any error messages
```

---

## Quick Fixes

### Fix 1: Re-upload Image
```
1. Go to /admin/site-admin
2. Delete current URL (clear the input)
3. Upload image again
4. Save
5. Hard refresh page
```

### Fix 2: Use Direct URL
```
1. Upload your logo to Imgur or another host
2. Get direct image URL
3. Paste in "Watermark Image URL" field
4. Save
5. Test
```

### Fix 3: Switch to Text Temporarily
```
1. Change type to "Text Watermark"
2. Enter "STELLA"
3. Save
4. Verify text watermark works
5. This confirms the issue is image-specific
```

### Fix 4: Check File Permissions
```
If using Supabase:
1. Dashboard → Storage → listings bucket
2. Make sure bucket is public
3. Or run the SQL setup script
4. See: /docs/sql/setup-watermark-storage.sql
```

---

## What to Report

If issue persists, share these details:

1. **Console Logs:**
   - Copy "Watermark config loaded" message
   - Copy any error messages

2. **Image URL:**
   - What's the full URL?
   - Can you open it directly in browser?

3. **Settings:**
   - Is watermark enabled?
   - Type = "image"?
   - URL populated?

4. **Network:**
   - Any CORS errors?
   - Any 404 errors for image?

5. **Storage:**
   - Is image in Supabase storage?
   - Can you see it in dashboard?

---

## Expected Behavior

### When Working:
```
1. Upload image in admin
2. Image appears in preview below
3. Click Save
4. Visit listing page
5. Console logs: "Watermark config loaded" with imageUrl
6. Console logs: "Watermark image loaded successfully"
7. Image watermark appears on photos
```

### When Not Working:
```
1. Console logs: "Watermark config loaded" but imageUrl is empty or wrong
2. OR: Console logs: "Watermark image failed to load"
3. Fallback text watermark appears instead
4. Fix the issue based on error message
```

---

## Pro Tips

1. **PNG with transparency** works best for watermarks
2. **White or light-colored logos** show well with drop shadow
3. **Keep logos simple** - complex designs may not look good small
4. **Test on light AND dark photos** before finalizing
5. **URL must be publicly accessible** - no authentication required

---

## Still Not Working?

1. **Try text watermark first** to verify system works
2. **Use Imgur or similar** to host image temporarily
3. **Check browser console** for specific error messages
4. **Verify Supabase storage** is properly configured
5. **Share console logs** for more specific help

The debug logging added will show exactly where the issue is! 🔍
