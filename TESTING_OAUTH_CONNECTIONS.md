# Testing Social Media Account Connections

## Current Status

Your UI is set up, but the `handleConnect` function in `SocialMedia.tsx` is currently **bypassing the real OAuth flow** and just marking accounts as "connected" in the database. This is why you only see "connected" without any OAuth redirect.

## How to Test Properly

### Option 1: Real OAuth Flow (Recommended)

To test the real OAuth connection, you need to:

#### Step 1: Update the handleConnect function to call the real OAuth endpoint

Replace the mock connection in `src/pages/admin/SocialMedia.tsx`:

```typescript
const handleConnect = async (provider: SocialConnector) => {
  if (!supabaseConfigured || !session) {
    setError('Sign in to connect social accounts.')
    return
  }

  const currentStatus = connections[provider]?.status ?? 'disconnected'

  if (currentStatus === 'connected') {
    // Handle disconnect
    const { error: disconnectError } = await supabase
      .from('social_connections')
      .delete()
      .eq('user_id', session.user.id)
      .eq('provider', provider)

    if (disconnectError) {
      setError(disconnectError.message ?? 'Unable to disconnect account.')
      return
    }

    updateLocalConnection(provider, 'disconnected')
    setError(null)
    return
  }

  // Call real OAuth endpoint
  try {
    setError(null)
    const response = await fetch('/api/social/oauth/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        platform: provider,
        userId: session.user.id,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      setError(error.error || 'Failed to initiate OAuth')
      return
    }

    const { authUrl } = await response.json()
    
    // Redirect to platform's OAuth page
    window.location.href = authUrl
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Connection failed')
  }
}
```

#### Step 2: Set up OAuth Credentials

For each platform you want to test, add the client ID and secret to your `.env` file:

```bash
# Instagram
VITE_INSTAGRAM_CLIENT_ID=your_instagram_app_id
VITE_INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret

# Facebook
VITE_FACEBOOK_CLIENT_ID=your_facebook_app_id
VITE_FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# X/Twitter
VITE_X_CLIENT_ID=your_twitter_app_id
VITE_X_CLIENT_SECRET=your_twitter_app_secret

# LinkedIn
VITE_LINKEDIN_CLIENT_ID=your_linkedin_app_id
VITE_LINKEDIN_CLIENT_SECRET=your_linkedin_app_secret
```

#### Step 3: Get OAuth Credentials

**For Instagram/Facebook:**
1. Go to https://developers.facebook.com
2. Create an app
3. Add "Instagram Basic Display" product
4. Get your App ID and App Secret

**For X/Twitter:**
1. Go to https://developer.twitter.com
2. Create an app
3. Get your API Key and API Secret

**For LinkedIn:**
1. Go to https://www.linkedin.com/developers/apps
2. Create an app
3. Get your Client ID and Client Secret

#### Step 4: Set Redirect URIs

In each platform's app settings, set the OAuth redirect URI to:

```
http://localhost:5173/api/social/oauth/callback
```

Or for production:
```
https://yourdomain.com/api/social/oauth/callback
```

#### Step 5: Test the Flow

1. Go to Admin → Social Media → Channel Connections
2. Click "Connect" on Instagram (or your test platform)
3. You should be **redirected to Instagram's login page**
4. Log in and approve permissions
5. **Redirected back to your app**
6. OAuth token should be stored in database

---

### Option 2: Mock OAuth Flow (For Development)

If you don't have OAuth credentials yet, use this mock flow for testing:

#### Create a mock OAuth handler

Add this file: `api/social/oauth/mock.ts`

```typescript
import type { IncomingMessage, ServerResponse } from 'http'

interface CustomRequest extends IncomingMessage {
  method?: string
  body?: any
}

interface CustomResponse extends ServerResponse {
  json?: (data: any) => void
}

export default async function handler(req: CustomRequest, res: CustomResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const { platform } = req.body

  // Return mock OAuth URL
  const mockAuthUrl = `https://mock-oauth.local/auth?platform=${platform}&redirect_uri=http://localhost:5173/api/social/oauth/callback&client_id=mock_client_id`

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ authUrl: mockAuthUrl }))
}
```

---

### Option 3: Check Database Directly

To see what's actually being saved:

#### Using Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Run this query:

```sql
SELECT * FROM social_connections;
```

#### Using SQL Command

```bash
psql postgresql://[user]:[password]@[host]/[database] -c "SELECT * FROM social_connections;"
```

#### Expected Output

```
┌─────────────────────────────────────┬───────────┬──────────┬─────────────────────────────────────┐
│ user_id                             │ platform  │ status   │ access_token                        │
├─────────────────────────────────────┼───────────┼──────────┼─────────────────────────────────────┤
│ 550e8400-e29b-41d4-a716-446655440000│ instagram │ connected│ ig_PAR(token data)...               │
└─────────────────────────────────────┴───────────┴──────────┴─────────────────────────────────────┘
```

---

## Testing Checklist

### Phase 1: UI/Local State
- [ ] Click "Connect" on a platform
- [ ] Status changes from "disconnected" to "pending"
- [ ] Button text changes to show platform name
- [ ] Error messages display if there are issues

### Phase 2: Database Storage
- [ ] Check `social_connections` table
- [ ] Verify connection record created with correct `user_id` and `platform`
- [ ] Check `status` is `connected`
- [ ] Verify `connected_at` timestamp is set

### Phase 3: OAuth Flow (Real)
- [ ] Click "Connect"
- [ ] Redirected to platform's login page
- [ ] Log in successfully
- [ ] Approve requested permissions
- [ ] Redirected back to your app
- [ ] Connection shows as "connected"
- [ ] OAuth token stored securely

### Phase 4: Account Information
- [ ] After connecting, display user's account name
- [ ] Show profile picture
- [ ] Show follower count (if available)
- [ ] Display account handle/username

### Phase 5: Disconnection
- [ ] Click "Disconnect" on connected account
- [ ] Status changes to "disconnected"
- [ ] Database record removed or status updated
- [ ] Can reconnect again

---

## Debugging Tips

### Check Browser Console

```javascript
// View connections state
console.log(connections)

// Test OAuth endpoint
fetch('/api/social/oauth/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    platform: 'instagram',
    userId: 'your_user_id'
  })
}).then(r => r.json()).then(console.log)
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Connect" button
4. Look for requests to:
   - `/api/social/oauth/connect` (should be POST)
   - Redirect to platform auth (should be external domain)
   - `/api/social/oauth/callback` (return from platform)

### Check Database Logs

In Supabase Dashboard:
1. Go to Auth → Logs
2. Look for OAuth events
3. See any errors during authentication

---

## Common Issues & Solutions

### Issue: "Just shows 'connected' without OAuth redirect"
**Cause:** Using mock flow instead of real OAuth  
**Solution:** 
1. Get real OAuth credentials from platform
2. Update `.env` with credentials
3. Uncomment real OAuth code in `handleConnect`

### Issue: "OAuth endpoint returns 404"
**Cause:** `/api/social/oauth/connect` endpoint missing or wrong path  
**Solution:**
1. Check file exists at `api/social/oauth/connect.ts`
2. Verify Vercel functions are deployed: `vercel --prod`
3. Check endpoint URL matches your domain

### Issue: "Redirect URI mismatch error"
**Cause:** OAuth redirect URI in app settings doesn't match your app  
**Solution:**
1. Go to platform's app settings
2. Update Redirect URI to match exactly:
   - Local: `http://localhost:5173/api/social/oauth/callback`
   - Production: `https://yourdomain.com/api/social/oauth/callback`

### Issue: "Token not storing in database"
**Cause:** Database permissions or table schema issue  
**Solution:**
1. Check `social_connections` table exists
2. Check RLS (Row Level Security) policies allow inserts
3. Check table schema matches expected columns
4. Run migration: `prisma migrate deploy`

### Issue: "Can't see account info after connecting"
**Cause:** Profile fetching not implemented  
**Solution:**
1. Check `/api/social/oauth/callback` stores access token
2. Implement `getAccountInfo()` in publisher
3. Fetch and display user profile after OAuth

---

## Next Steps

1. **Choose your approach:**
   - Real OAuth (recommended for production)
   - Mock OAuth (good for development)
   - Database inspection (for debugging)

2. **Get OAuth credentials** from your chosen platforms

3. **Update the `handleConnect` function** with real OAuth logic

4. **Test the flow** from start to finish

5. **Add account info display** after successful connection

6. **Implement publishing** using the OAuth tokens

---

## Quick Test Script

Run this in browser console to test without UI:

```javascript
const testConnection = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User:', user)

    // Try to initiate OAuth
    const response = await fetch('/api/social/oauth/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'instagram',
        userId: user.id
      })
    })

    const result = await response.json()
    console.log('OAuth Response:', result)

    if (result.authUrl) {
      console.log('Would redirect to:', result.authUrl)
      // Uncomment to actually redirect:
      // window.location.href = result.authUrl
    }
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testConnection()
```

---

## Summary

Your current implementation **stores connection state locally and in the database**, but **doesn't perform real OAuth authentication**. To fully test:

1. Update `handleConnect` to call the real OAuth endpoint
2. Get OAuth credentials from the platforms
3. Set up the callback handler
4. Test the complete OAuth flow

Would you like me to help implement the real OAuth flow, or do you want to stick with the mock setup for now?
