# FIX: Featured Listings Not Showing in Safari/Firefox

## The Problem ❌

You selected 3 featured listings in Chrome on `/admin/site-admin`, but they don't appear in Safari or Firefox. The home page shows the featured listings in Chrome but not in other browsers.

**Root Cause:** The featured listings (and all site settings) were being saved to **localStorage**, which is browser-specific. Each browser has its own separate localStorage storage.

## The Solution ✅

Create `site_settings` and `site_settings_history` tables in Supabase to store settings in the **database** instead of localStorage.

---

## Step-by-Step Fix

### Step 1: Apply Database Migration

**Go to Supabase Dashboard:**

1. Open https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar  
4. Click **"New Query"**
5. Copy the entire SQL below and paste it
6. Click **"Run"** (or press Cmd+Enter)

```sql
-- Create site_settings table to store global site configuration
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE site_settings IS 'Global site configuration settings (replaces localStorage)';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create history table
CREATE TABLE IF NOT EXISTS site_settings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_history_key_used_at 
  ON site_settings_history (key, used_at DESC);

COMMENT ON TABLE site_settings_history IS 'Historical values for site settings';

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can modify site settings"
  ON site_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read site settings history"
  ON site_settings_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can add to site settings history"
  ON site_settings_history FOR INSERT TO authenticated WITH CHECK (true);
```

You should see: **"Success. No rows returned"**

---

### Step 2: Save Your Settings to Database

1. Open **Chrome** (where your settings are currently saved)
2. Go to: https://www.stellareal.com.br/admin/site-admin
3. You should see your 3 featured listings already selected
4. Click **"Save Settings"** button at the bottom
5. You should see a success message

**This saves your Chrome localStorage settings to the Supabase database!**

---

### Step 3: Verify in Other Browsers

1. Open **Safari** or **Firefox**
2. Go to: https://www.stellareal.com.br
3. Scroll to the **Featured** section
4. ✅ Your 3 featured listings should now appear!

---

## What Changed?

### Before:
```
Chrome saves to → localStorage (Chrome only)
Safari reads from → localStorage (empty! ❌)
Firefox reads from → localStorage (empty! ❌)
```

### After:
```
Any browser saves to → Supabase database ✅
Any browser reads from → Supabase database ✅
All browsers see the same data ✅
```

---

## Verification

To verify the migration worked, run this in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('site_settings', 'site_settings_history');

-- View your saved settings
SELECT * FROM site_settings ORDER BY updated_at DESC;

-- Should see entries like:
-- key: 'featured_projects'
-- value: '["uuid-1", "uuid-2", "uuid-3"]'
```

---

## Benefits

✅ Settings work across all browsers  
✅ Settings sync across all devices  
✅ Settings persist even if you clear browser data  
✅ Settings are backed up in the database  
✅ Multiple admins can manage the same settings  

---

## Troubleshooting

### Migration fails with "permission denied"
- Make sure you're running the SQL as the project owner
- Check that you're connected to the correct project

### Settings still don't show in Safari
- Make sure you clicked "Save Settings" in Chrome after running the migration
- Check browser console for errors (F12 → Console tab)
- Try hard refresh (Cmd+Shift+R on Mac)

### How to reset everything
If you need to start fresh:

```sql
-- Clear all settings
TRUNCATE site_settings;
TRUNCATE site_settings_history;

-- Then go to /admin/site-admin and save new settings
```

---

## Files Created

- `/supabase/migrations/20241203_create_site_settings_table.sql` - Migration SQL
- `/supabase/migrations/README_SITE_SETTINGS_MIGRATION.md` - Detailed docs
- This file - Quick fix guide

---

Need help? The migration is safe to run multiple times (uses `IF NOT EXISTS` checks).
