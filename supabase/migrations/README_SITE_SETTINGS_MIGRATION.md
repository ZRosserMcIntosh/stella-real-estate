# Site Settings Database Migration

## Problem
The featured listings and other site settings were being stored in **localStorage**, which is browser-specific. This means:
- Settings saved in Chrome were not visible in Safari or Firefox
- Settings were not shared across devices
- Settings were lost when clearing browser data

## Solution
Created `site_settings` and `site_settings_history` tables in Supabase to store settings in the database.

## How to Apply This Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the contents of `20241203_create_site_settings_table.sql`
6. Click "Run" or press Cmd/Ctrl + Enter

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
cd /Users/rossermcintosh/Desktop/stella-real-estate
supabase db push
```

### Option 3: Manual SQL Execution

Connect to your Supabase database and run:

```bash
psql "postgresql://postgres.fxvxdvwiqgpypcqmljja:Stella&Rosser777@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
```

Then copy/paste the migration SQL.

## Verification

After running the migration, verify the tables were created:

```sql
-- Check if tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('site_settings', 'site_settings_history');

-- Verify RLS policies
SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('site_settings', 'site_settings_history');
```

## Migrating Existing localStorage Data

After the migration is applied, the next time you save settings in Site Admin:
1. The app will try to save to Supabase first
2. If successful, it will use the database
3. Your Chrome settings will be saved to the database
4. Safari/Firefox will now see the same settings

**You don't need to manually migrate data** - just go to Site Admin in Chrome and click "Save Settings" to persist your current selections to the database.

## Tables Created

### `site_settings`
- Stores current values for all site configuration
- Key-value store with timestamps
- RLS enabled for security

### `site_settings_history`
- Stores historical values (e.g., previously used video IDs)
- Allows quick selection of recent values
- Auto-populated when settings are changed

## Next Steps

1. ✅ Apply the migration using one of the methods above
2. ✅ Go to https://www.stellareal.com.br/admin/site-admin in Chrome
3. ✅ Select your 3 featured listings (if not already selected)
4. ✅ Click "Save Settings"
5. ✅ Open Safari/Firefox and check https://www.stellareal.com.br - featured listings should now appear!
6. ✅ Check the home page in all browsers - featured listings should be consistent

## Rollback

If you need to rollback this migration:

```sql
DROP TABLE IF EXISTS site_settings_history;
DROP TABLE IF EXISTS site_settings;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

The app will automatically fallback to localStorage if these tables don't exist.
