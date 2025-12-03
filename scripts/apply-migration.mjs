#!/usr/bin/env node

/**
 * Apply site_settings migration to Supabase
 * Creates site_settings and site_settings_history tables
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables (if .env file exists)
try {
  const dotenv = await import('dotenv')
  dotenv.config()
} catch {
  // dotenv not required
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('')
  console.error('Set these environment variables:')
  console.error('  VITE_SUPABASE_URL=your-project-url')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  console.error('')
  console.error('Or run the migration manually in Supabase Dashboard SQL Editor')
  console.error('File: supabase/migrations/20241203_create_site_settings_table.sql')
  process.exit(1)
}

console.log('🔄 Applying site_settings migration to Supabase...')
console.log('')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Read migration file
const migrationPath = join(__dirname, '../supabase/migrations/20241203_create_site_settings_table.sql')
const sql = readFileSync(migrationPath, 'utf-8')

try {
  // Execute the migration
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
  
  if (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('')
    console.error('Please run the migration manually in Supabase Dashboard:')
    console.error('  1. Go to https://supabase.com/dashboard')
    console.error('  2. Select your project')
    console.error('  3. Click "SQL Editor"')
    console.error('  4. Copy/paste contents of: supabase/migrations/20241203_create_site_settings_table.sql')
    console.error('  5. Click "Run"')
    process.exit(1)
  }
  
  console.log('✅ Migration applied successfully!')
  console.log('')
  console.log('Next steps:')
  console.log('  1. Go to https://www.stellareal.com.br/admin/site-admin in Chrome')
  console.log('  2. Select your 3 featured listings')
  console.log('  3. Click "Save Settings"')
  console.log('  4. Open Safari/Firefox - featured listings will now appear!')
  
} catch (err) {
  console.error('❌ Migration failed:', err.message)
  console.error('')
  console.error('Alternative: Run migration manually in Supabase Dashboard SQL Editor')
  console.error('File: supabase/migrations/20241203_create_site_settings_table.sql')
  process.exit(1)
}
