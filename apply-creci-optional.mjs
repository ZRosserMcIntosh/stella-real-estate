import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://fxvxdvwiqgpypcqmljja.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dnh2d2lxZ3B5cGNxbWxqamEiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzMwODU3MDMxLCJleHAiOjIwNDY0MzMwMzF9.qZMkj0bFqPPo7m9nTbzQfmBzF3TJVS0gBm7Zi8dOh8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('Applying CRECI optional migration...')
  
  const migrationPath = path.join(__dirname, 'supabase/migrations/20251204_make_creci_optional.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')
  
  // Split by semicolon and execute each statement
  const statements = sql.split(';').filter(s => s.trim().length > 0)
  
  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })
      if (error) {
        console.error('Error executing statement:', error)
      } else {
        console.log('✓ Statement executed')
      }
    } catch (err) {
      // Supabase client doesn't have direct SQL execution, we need to use the database URL
      console.log('Cannot execute via Supabase client, need direct database access')
      break
    }
  }
}

// Better approach: Use the existing test connection script
console.log('To apply this migration, run:')
console.log('node run-migration.mjs')
