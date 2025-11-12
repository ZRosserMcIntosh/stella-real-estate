# Watermark Image Upload - Troubleshooting Guide

## Common Upload Errors & Solutions

### Error: "Upload failed: Storage bucket permissions not configured"

**Cause**: Supabase storage bucket doesn't have proper permissions/policies set up.

**Solution**:

1. **Go to Supabase Dashboard** → Your Project → Storage
2. **Find or Create** the `listings` bucket
3. **Set up RLS Policies**:

```sql
-- Allow authenticated users to upload to watermark folder
CREATE POLICY "Allow authenticated uploads to watermark" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listings' AND (storage.foldername(name))[1] = 'watermark');

-- Allow public read access to watermark images
CREATE POLICY "Public watermark access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'listings' AND (storage.foldername(name))[1] = 'watermark');
```

4. **Or make bucket public** (simpler but less secure):
   - In Supabase Dashboard
   - Go to Storage → `listings` bucket
   - Click Settings → Make Public

---

### Error: "Upload failed: Storage bucket 'listings' not found"

**Cause**: The storage bucket doesn't exist yet.

**Solution**:

1. **Go to Supabase Dashboard** → Storage
2. **Click "New Bucket"**
3. **Name it**: `listings`
4. **Set as Public** (or configure RLS policies)
5. **Save**

---

### Error: "Upload failed: row-level security policy"

**Cause**: RLS is enabled but no policies allow uploads.

**Solution**:

**Option A - Disable RLS (Quick Fix)**:
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**Option B - Add Proper Policies (Recommended)**:
```sql
-- Allow all authenticated users to upload
CREATE POLICY "Authenticated can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'listings');

-- Allow public read
CREATE POLICY "Public can read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'listings');
```

---

### Error: "Upload failed: Failed to get public URL"

**Cause**: Bucket is not public, so public URL cannot be generated.

**Solution**:

1. Make the bucket public in Supabase Dashboard
2. Or use signed URLs (more complex)
3. Or paste direct URL instead of uploading

---

## Alternative: Use Direct URL Instead

If upload continues to fail, you can paste a direct image URL:

### Option 1: Use External Image Hosting
1. Upload your logo to:
   - Imgur
   - Cloudinary
   - Your own server
   - Google Drive (make public)
2. Copy the direct image URL
3. Paste it in the "Watermark Image URL" field
4. Save

### Option 2: Use Supabase Manually
1. Go to Supabase Dashboard → Storage → `listings`
2. Create folder: `watermark`
3. Manually upload your logo file
4. Click the file → Copy URL
5. Paste URL in admin panel

### Option 3: Use Local Preview (Dev Only)
- The system will automatically fall back to local blob URLs
- These work for testing but won't persist across sessions
- Image will show "local preview" message

---

## Quick Fix: Enable All Permissions

If you just want it to work quickly (for development):

```sql
-- Run these in Supabase SQL Editor:

-- 1. Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'listings';

-- 2. Allow all operations
CREATE POLICY "Allow all operations" ON storage.objects
FOR ALL TO public
USING (bucket_id = 'listings')
WITH CHECK (bucket_id = 'listings');
```

⚠️ **Note**: This is less secure. For production, use proper RLS policies.

---

## Checking Current Setup

### Verify Bucket Exists:
```sql
SELECT * FROM storage.buckets WHERE id = 'listings';
```

### Check Policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

### Test Upload Manually:
1. Supabase Dashboard → Storage
2. Navigate to `listings` bucket
3. Try uploading a file manually
4. If this fails, permissions are the issue

---

## Understanding the Upload Flow

```
1. User selects file
   ↓
2. File uploaded to: listings/watermark/{timestamp}_{filename}
   ↓
3. Supabase returns upload confirmation
   ↓
4. Get public URL for the file
   ↓
5. Save URL to site settings
   ↓
6. WatermarkedImage component uses URL
```

**If any step fails**, you'll see an error message.

---

## Error Messages Explained

| Error Message | Meaning | Fix |
|--------------|---------|-----|
| "Upload failed: Storage bucket permissions not configured" | RLS blocking upload | Add upload policy or disable RLS |
| "Storage bucket 'listings' not found" | Bucket doesn't exist | Create bucket in Supabase |
| "row-level security policy" | RLS enabled, no matching policy | Add policies or disable RLS |
| "Failed to get public URL" | Bucket not public | Make bucket public |
| "Upload failed: [network error]" | Connection issue | Check internet/Supabase status |

---

## Recommended Setup (Production)

```sql
-- 1. Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true);

-- 2. Allow authenticated uploads to watermark folder
CREATE POLICY "watermark_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- 3. Allow public read access
CREATE POLICY "watermark_read" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- 4. Allow updates (optional, for replacing logos)
CREATE POLICY "watermark_update" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);
```

---

## Still Not Working?

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading again
4. Look for error messages
5. Share the full error for more specific help

### Check Network Tab
1. Open DevTools → Network tab
2. Try uploading
3. Find the POST request to Supabase
4. Check response status (200 = success, 4xx/5xx = error)
5. View response body for error details

### Verify Environment Variables
Check that these are set in your `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Workaround: Manual URL Entry

If all else fails, you can always:
1. Upload logo anywhere (Imgur, Dropbox, etc.)
2. Get direct URL to image
3. Paste URL in the admin panel
4. Save
5. Watermark will work perfectly!

**This bypasses the upload system entirely and is 100% reliable.**

---

## Need More Help?

1. Check Supabase Dashboard → Storage for error messages
2. Review Supabase logs for detailed error info
3. Test with a different image file (maybe file is too large?)
4. Try the manual URL entry workaround
5. Share the specific error message from console

The system has fallbacks, so even if upload fails, you can still use watermarks by pasting URLs!
