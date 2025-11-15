import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fxvxdvwiqgpypcqmljja.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dnhkdndpcWdweXBjcW1samphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1NTU4MDEsImV4cCI6MjA0NTEzMTgwMX0.5FcSC4DXVDjBq_ZqxwLTPCjCJo3XLGGGTdQXqm6RLTA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Testing Supabase Authentication...\n')

// Test connection
try {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.log('❌ Session check error:', error.message)
  } else {
    console.log('✅ Connection successful')
    console.log('Current session:', data.session ? 'Logged in' : 'Not logged in')
  }
} catch (err) {
  console.log('❌ Connection failed:', err.message)
}

console.log('\n' + '='.repeat(60))
console.log('POSSIBLE ISSUES:')
console.log('='.repeat(60))
console.log('\n1. User account does not exist in auth.users')
console.log('   - Solution: Create account via signup')
console.log('\n2. Email not confirmed')
console.log('   - Solution: Check confirmation email or disable email confirmation')
console.log('\n3. Wrong password')
console.log('   - Solution: Use forgot password flow')
console.log('\n4. Account exists but password was never set')
console.log('   - Solution: Use forgot password to set one')
console.log('\n' + '='.repeat(60))
console.log('\nNext steps:')
console.log('1. Run check_rosser_auth.sql in Supabase dashboard')
console.log('2. Check if email confirmation is required in Supabase Auth settings')
console.log('3. Try the forgot password flow to reset your password')
