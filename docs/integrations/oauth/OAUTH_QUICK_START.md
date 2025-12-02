# Quick Start: Test OAuth Connections

## The Problem

You click "Connect" → status shows "connected" → but no actual OAuth happens.

## The Root Cause

In `src/pages/admin/SocialMedia.tsx`, the `handleConnect` function currently:

```typescript
// Currently does this (NO OAuth):
const currentStatus = connections[provider]?.status ?? 'disconnected'
updateLocalConnection(provider, current === 'connected' ? 'disconnected' : 'connected')

// Should do this (REAL OAuth):
window.location.href = authUrl  // Redirect to Instagram/Facebook/etc login
```

---

## Quickest Test: Check Database

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Run:

```sql
SELECT id, user_id, platform, status, connected_at, access_token 
FROM social_connections 
ORDER BY connected_at DESC;
```

**What you'll see:**
- Rows for each connection you clicked
- All showing `status = 'connected'`
- But `access_token = NULL` (no OAuth actually happened)

---

## Enable Real OAuth: 3 Steps

### Step 1: Get OAuth Credentials

Pick one platform to test with:

**Instagram (Easiest):**
1. Go to https://developers.facebook.com
2. Create App → Choose "Manage Business Integrations"
3. Go to Settings → Basic → Copy App ID & App Secret
4. Go to Instagram Basic Display → Settings → Set Redirect URIs to `http://localhost:5173/api/social/oauth/callback`

**X/Twitter:**
1. Go to https://developer.twitter.com/en/dashboard
2. Create App → Copy API Key & API Secret Manage
3. Set Redirect URIs (X calls them "OAuth 2.0 Redirect URIs") to `http://localhost:5173/api/social/oauth/callback`

**LinkedIn:**
1. Go to https://www.linkedin.com/developers/apps
2. Create App → Authorized Redirect URLs → Add `http://localhost:5173/api/social/oauth/callback`
3. Copy Client ID & Client Secret

### Step 2: Add to `.env`

```bash
# For Instagram
VITE_INSTAGRAM_CLIENT_ID=your_app_id_here
VITE_INSTAGRAM_CLIENT_SECRET=your_app_secret_here

# For X/Twitter
VITE_X_CLIENT_ID=your_api_key_here
VITE_X_CLIENT_SECRET=your_api_secret_here

# For LinkedIn
VITE_LINKEDIN_CLIENT_ID=your_client_id_here
VITE_LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

**Restart your dev server** after adding to `.env`

### Step 3: Update handleConnect

Replace this in `src/pages/admin/SocialMedia.tsx`:

```typescript
const handleConnect = async (provider: SocialConnector) => {
  if (!supabaseConfigured || !session) {
    setError('Sign in to connect social accounts.')
    return
  }

  const currentStatus = connections[provider]?.status ?? 'disconnected'

  if (currentStatus === 'connected') {
    // Handle disconnect - unchanged
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

  // NEW: Call real OAuth endpoint
  try {
    setError(null)
    setConnections(prev => ({
      ...prev,
      [provider]: { ...prev[provider], status: 'pending' as const }
    }))

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
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to initiate OAuth')
    }

    const { authUrl } = await response.json()
    
    // Redirect to platform's OAuth page
    window.location.href = authUrl
  } catch (error) {
    setConnections(prev => ({
      ...prev,
      [provider]: { ...prev[provider], status: 'error' as const }
    }))
    setError(error instanceof Error ? error.message : 'Connection failed')
  }
}
```

---

## Test It!

1. **Restart dev server** (so `.env` changes load)
2. Go to Admin → Social Media → Channel Connections
3. Click "Connect" on Instagram
4. You should be **redirected to Instagram's login page**
5. Log in and approve
6. Redirected back to your app
7. Connection shows as "connected"

**Check it worked:**

```sql
SELECT * FROM social_connections 
WHERE user_id = 'your_user_id' 
AND platform = 'instagram';
```

You should now see `access_token` populated!

---

## What Happens Behind the Scenes

```
1. Click Connect
   ↓
2. App calls /api/social/oauth/connect
   ↓
3. Server generates Instagram OAuth URL
   ↓
4. Browser redirects to Instagram login
   ↓
5. You log in & approve permissions
   ↓
6. Instagram redirects to /api/social/oauth/callback?code=xyz
   ↓
7. Server exchanges code for access token
   ↓
8. Server stores token in database
   ↓
9. Browser redirected back to admin page
   ↓
10. Shows "connected" with your Instagram account name
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Still just shows "connected" without redirect | Add real OAuth code to `handleConnect` + restart server |
| 404 on `/api/social/oauth/connect` | Check file exists at `api/social/oauth/connect.ts` |
| "Redirect URI mismatch" from Instagram | Update your app settings: Redirect URI = `http://localhost:5173/api/social/oauth/callback` |
| ".env values not loading" | Restart dev server after editing `.env` |
| Still no `access_token` in database | Check `/api/social/oauth/callback.ts` implementation |

---

## What to Test Next

After OAuth is working:

1. **Disconnect** - Click "Disconnect" on connected account
2. **See Account Info** - Display your Instagram username/avatar
3. **Create a Post** - Use the OAuth token to post something
4. **Check Results** - Post appears on your account

---

## Files Involved

| File | What It Does |
|------|--------------|
| `src/pages/admin/SocialMedia.tsx` | UI + handleConnect (update this) |
| `api/social/oauth/connect.ts` | Generates OAuth URL (already exists) |
| `api/social/oauth/callback.ts` | Handles OAuth redirect (already exists) |
| `src/lib/oauth/config.ts` | Platform OAuth configs (already exists) |
| `.env` | Your OAuth credentials (add to this) |

---

## Quick Debugging

Open browser console and run:

```javascript
// See current connections
fetch('http://localhost:5173/api/social/oauth/connect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ platform: 'instagram' })
})
.then(r => r.json())
.then(r => {
  console.log('Auth URL:', r.authUrl)
  // Uncomment to test redirect:
  // window.location.href = r.authUrl
})
.catch(e => console.error('Error:', e))
```

---

That's it! The OAuth endpoints already exist - you just need to:
1. Get OAuth credentials
2. Add them to `.env`
3. Update `handleConnect` to call the real endpoint

Let me know if you hit any issues!
