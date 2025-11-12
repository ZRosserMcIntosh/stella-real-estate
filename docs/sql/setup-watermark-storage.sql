-- Watermark Storage Setup Script
-- Run this in Supabase SQL Editor to configure storage for watermark uploads

-- ============================================
-- STEP 1: Create the listings bucket (if not exists)
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- ============================================
-- STEP 2: Enable RLS (if not already enabled)
-- ============================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop existing policies (clean slate)
-- ============================================

DROP POLICY IF EXISTS "watermark_upload" ON storage.objects;
DROP POLICY IF EXISTS "watermark_read" ON storage.objects;
DROP POLICY IF EXISTS "watermark_update" ON storage.objects;
DROP POLICY IF EXISTS "watermark_delete" ON storage.objects;

-- ============================================
-- STEP 4: Create watermark upload policy
-- ============================================

-- Allow authenticated users to upload to watermark folder
CREATE POLICY "watermark_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- ============================================
-- STEP 5: Create public read policy
-- ============================================

-- Allow anyone to view watermark images
CREATE POLICY "watermark_read" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- ============================================
-- STEP 6: Create update policy (optional)
-- ============================================

-- Allow authenticated users to update/replace watermark images
CREATE POLICY "watermark_update" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- ============================================
-- STEP 7: Create delete policy (optional)
-- ============================================

-- Allow authenticated users to delete old watermark images
CREATE POLICY "watermark_delete" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'listings' AND 
  (storage.foldername(name))[1] = 'watermark'
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bucket exists and is public
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'listings';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE 'watermark%'
ORDER BY policyname;

-- ============================================
-- ALTERNATIVE: Quick & Simple Setup (Less Secure)
-- ============================================

/*
If you want a simpler setup for development (less secure):

-- Make bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'listings';

-- Allow all operations (no authentication required)
CREATE POLICY "allow_all_listings" ON storage.objects
FOR ALL TO public
USING (bucket_id = 'listings')
WITH CHECK (bucket_id = 'listings');

-- Note: This is NOT recommended for production!
*/

-- ============================================
-- SUCCESS!
-- ============================================

-- After running this script:
-- 1. Go to /admin/site-admin in your app
-- 2. Navigate to Image Watermark section
-- 3. Try uploading a logo - it should work now!
-- 4. If still failing, check browser console for specific errors

SELECT 'Watermark storage setup complete! ✓' as status;
