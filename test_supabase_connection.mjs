import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fxvxdvwiqgpypcqmljja.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dnhkdndpcWdweXBjcW1samphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1NTU4MDEsImV4cCI6MjA0NTEzMTgwMX0.5FcSC4DXVDjBq_ZqxwLTPCjCJo3XLGGGTdQXqm6RLTA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('')

// Test 1: Check if we can connect
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

console.log('')
console.log('📧 Test login with your email...')
console.log('This will help us see the exact error message from Supabase')
console.log('')

// Ask for credentials in a real scenario, but for testing we'll show what to do
console.log('To test your login, run:')
console.log('node -e "')
console.log('import(\\'@supabase/supabase-js\\').then(async ({createClient}) => {')
console.log('  const s = createClient(\\'https://fxvxdvwiqgpypcqmljja.supabase.co\\', \\'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\\');')
console.log('  const res = await s.auth.signInWithPassword({email: \\'YOUR_EMAIL\\', password: \\'YOUR_PASSWORD\\'});')
console.log('  console.log(res);')
console.log('});')
console.log('"')
