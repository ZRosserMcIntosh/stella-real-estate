// Script to apply CRECI optional migration
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://fxvxdvwiqgpypcqmljja.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dnhkdndpcWdweXBjcW1samphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTUwNzIsImV4cCI6MjA3NTkzMTA3Mn0.r3zL3sGlpBy5lM5cEK8SmIbAMwGh1NLIhqi661-IdmY'

console.log('🔄 Applying CRECI optional migration...\n')
console.log('This will make cpf, creci_number, and creci_uf optional in founding_members table\n')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Read and execute migration SQL
const sql = readFileSync('supabase/migrations/20251204_make_creci_optional.sql', 'utf-8')

// Split into individual statements and execute
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

console.log(`Executing ${statements.length} SQL statements...\n`)

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i] + ';'
  console.log(`[${i + 1}/${statements.length}] Executing...`)
  
  try {
    const { error } = await supabase.rpc('exec', { sql: stmt })
    if (error) {
      console.error(`❌ Error:`, error.message)
      console.error('\nPlease run the migration manually in Supabase Dashboard:')
      console.error('1. Go to https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/sql')
      console.error('2. Copy contents of: supabase/migrations/20251204_make_creci_optional.sql')
      console.error('3. Paste and click Run')
      process.exit(1)
    }
    console.log(`✅ Success`)
  } catch (err) {
    console.error(`❌ Error:`, err.message)
    console.error('\nAlternative: Run migration manually in Supabase Dashboard:')
    console.error('1. Go to https://supabase.com/dashboard/project/fxvxdvwiqgpypcqmljja/sql')
    console.error('2. Copy contents of: supabase/migrations/20251204_make_creci_optional.sql')
    console.error('3. Paste and click Run')
    process.exit(1)
  }
}

console.log('\n✅ Migration completed!')
console.log('\nThe following fields are now optional in founding_members:')
console.log('  - cpf')
console.log('  - creci_number')
console.log('  - creci_uf')
console.log('  - phone (was already optional)')
console.log('\nYou can now sign up without providing these fields!')
