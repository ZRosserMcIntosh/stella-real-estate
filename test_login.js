// Test Supabase connection from production credentials
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://fxvxdvwiqgpypcqmljja.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dnhkdndpcWdweXBjcW1samphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTUwNzIsImV4cCI6MjA3NTkzMTA3Mn0.r3zL3sGlpBy5lM5cEK8SmIbAMwGh1NLIhqi661-IdmY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  console.log('Testing Supabase auth with production credentials...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  // Test 1: Check if the client is initialized
  console.log('\n1. Client initialized:', !!supabase)
  
  // Test 2: Try to get session (should be null)
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  console.log('2. Get session:', { hasSession: !!sessionData.session, error: sessionError?.message })
  
  // Test 3: Try a simple query to check connection
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('key')
    .limit(1)
  console.log('3. Database query test:', { hasData: !!settings, error: settingsError?.message })
  
  // Test 4: Check auth settings
  const { data: authSettings, error: authError } = await supabase.auth.getUser()
  console.log('4. Get user (should be null):', { hasUser: !!authSettings.user, error: authError?.message })
}

testAuth().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
