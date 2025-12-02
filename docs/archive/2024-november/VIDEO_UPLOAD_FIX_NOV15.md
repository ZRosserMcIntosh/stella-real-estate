# Video Upload Fix - November 15, 2024

## Issue
Video uploads for the home page header background were failing silently due to empty error handling blocks. Users wouldn't see any feedback when uploads failed, making it appear as if the feature was broken.

## Root Cause
The video upload handler in `SiteAdmin.tsx` had an empty `catch {}` block that swallowed all errors without any user feedback or console logging.

## Solution

### Changes Made

**File: `src/pages/admin/SiteAdmin.tsx`**

#### 1. Hero Video Upload Handler (Lines ~301-327)
- **Before**: Empty catch block that silently failed
- **After**: Comprehensive error handling with:
  - User feedback messages via `setMsg()`
  - Console error logging for debugging
  - Filename sanitization to prevent special character issues
  - Fallback to local blob URL if Supabase not configured or has permission issues
  - Success messages to confirm upload completion

#### 2. Hero Fallback Image Upload Handler (Lines ~225-252)
- **Before**: Empty catch block that silently failed  
- **After**: Same comprehensive error handling pattern as video upload

### Key Improvements

1. **User Feedback**
   - Shows "Uploading video..." or "Uploading image..." during upload
   - Shows success message "✓ Video uploaded successfully!" on completion
   - Shows detailed error messages on failure
   - Messages auto-dismiss after 2-5 seconds

2. **Error Handling**
   - Catches and logs all errors to console
   - Provides user-friendly error messages
   - Detects permission/RLS issues specifically
   - Falls back to local preview if storage upload fails

3. **Filename Sanitization**
   - Normalizes unicode characters
   - Removes special characters that could cause issues
   - Replaces problematic chars with underscores
   - Prevents upload failures due to filename issues

4. **Local Development Support**
   - Works without Supabase configuration
   - Uses `URL.createObjectURL()` for local preview
   - Notifies user when running in local mode

## Technical Details

### Upload Flow

```typescript
1. User selects file
   ↓
2. Show "Uploading..." message
   ↓
3. Check if in demo mode → Show error & abort
   ↓
4. Check if Supabase configured
   ↓ No
   5a. Create local blob URL → Show success message
   ↓ Yes
   5b. Sanitize filename
   ↓
   6. Upload to Supabase storage bucket 'listings'
   ↓
   7. Get public URL
   ↓
   8. Update state & show success message
   
If error:
   → Log to console
   → Check if RLS/permission error
   → If yes: Fall back to local preview
   → Show error message to user
   → Clear input for retry
```

### Storage Structure

**Videos:** `listings/hero-video/{timestamp}_{sanitized_filename}`
**Images:** `listings/hero-fallback/{timestamp}_{sanitized_filename}`

### Supported Formats

**Videos:**
- MP4 (recommended)
- WebM
- OGG

**Images:**
- All image formats (PNG, JPEG, WebP, SVG, etc.)

## Testing

### Test Scenarios

1. **Successful Upload (with Supabase)**
   - Upload a video → Should see "Uploading video..." then "✓ Video uploaded successfully!"
   - Video preview should appear below
   - URL should be populated in input field

2. **Local Mode (without Supabase)**
   - Upload a video → Should see "✓ Video loaded locally"
   - Video preview works but using blob URL
   - Won't persist across page reloads

3. **Permission Error**
   - If storage bucket has RLS issues
   - Should see "Upload failed: Storage bucket permissions not configured"
   - Falls back to local preview automatically

4. **Invalid File**
   - Try uploading wrong format → Should see error message
   - Input clears for retry

5. **Demo Mode**
   - Upload attempt shows "Demo mode: uploads are disabled"

## Usage

1. Go to **Admin → Site Admin**
2. Scroll to "Optional uploaded hero video" section
3. Click **Upload** button
4. Select your video file (MP4 recommended)
5. Wait for upload (message shows progress)
6. Verify preview appears below
7. Click **Save Settings** at bottom to persist

## Benefits

### Performance
- Self-hosted videos load faster than YouTube embeds
- No external dependencies or third-party blocking
- Better control over video quality and compression
- No YouTube branding or related videos

### Reliability
- Works even if YouTube is blocked/slow
- No network issues with external services
- Video is always available
- Better mobile performance

### Control
- Full control over video file
- Can optimize for web delivery
- No ads or distractions
- Custom aspect ratios and formats

## Recommendations

1. **Video Optimization**
   - Use MP4 with H.264 codec for best compatibility
   - Compress for web (aim for < 10MB if possible)
   - Consider 1920x1080 or lower resolution
   - Use tools like HandBrake or FFmpeg to optimize

2. **File Size**
   - Keep videos short (10-30 seconds loop)
   - Compress without losing too much quality
   - Test on mobile devices for load times

3. **Fallback Image**
   - Always upload a fallback image
   - Used when video fails to load
   - Provides better UX on slower connections

## Troubleshooting

### Upload Button Does Nothing
- Check browser console for errors
- Verify Supabase storage bucket exists
- Check bucket is named 'listings'

### "Upload failed: Storage bucket permissions not configured"
- RLS policies may need adjustment
- Or bucket doesn't exist
- Fallback to local preview should work

### Video Doesn't Appear After Upload
1. Check if `heroVideoUploadedUrl` is set (should see preview)
2. Verify you clicked "Save Settings" button at bottom
3. Check browser console for loading errors
4. Try hard refresh (Cmd+Shift+R)

### Video Works Locally But Not on Live Site
- Verify Supabase storage bucket is public
- Check CORS settings
- Ensure video URL is accessible publicly
- Check content-type header is correct

---

**Date**: November 15, 2024
**Impact**: Medium - Fixes broken video upload feature
**Breaking Changes**: None - Only improvements to existing functionality
