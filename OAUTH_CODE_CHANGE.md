# Enable Real OAuth: Exact Code Change

## Current Code (Lines 602-650 in SocialMedia.tsx)

```typescript
const handleConnect = async (provider: SocialConnector) => {
  if (supabaseConfigured && !session && !isDemo) {
    setError('Sign in to connect social accounts.')
    return
  }

  if (!supabaseConfigured || !session || isDemo) {
    const current = connections[provider]?.status ?? 'disconnected'
    updateLocalConnection(provider, current === 'connected' ? 'disconnected' : 'connected')
    setError(null)
    return
  }

  const currentStatus = connections[provider]?.status ?? 'disconnected'

  if (currentStatus === 'connected') {
    // ... disconnect logic (keep as-is)
  }

  // ❌ PROBLEM: This just marks it as connected WITHOUT OAuth
  const payload = {
    user_id: session.user.id,
    provider,
    status: 'connected' as const,
    connected_at: new Date().toISOString(),
  }

  const { error: connectError } = await supabase
    .from('social_connections')
    .upsert(payload, { onConflict: 'user_id,provider' })

  if (connectError) {
    setError(connectError.message ?? 'Unable to connect account.')
    return
  }

  updateLocalConnection(provider, 'connected')
  setError(null)
}
```

---

## New Code: Replace the Connection Logic

Replace lines 635-649 with this:

```typescript
  // ✅ NEW: Call real OAuth endpoint
  try {
    setError(null)
    
    // Show loading state
    updateLocalConnection(provider, 'pending')

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
      updateLocalConnection(provider, 'error')
      throw new Error(errorData.error || 'Failed to initiate OAuth')
    }

    const { authUrl } = await response.json()
    
    // Redirect to platform's OAuth page
    window.location.href = authUrl
  } catch (error) {
    updateLocalConnection(provider, 'disconnected')
    setError(error instanceof Error ? error.message : 'Connection failed')
  }
}
```

---

## Step-by-Step: Make the Change

### 1. Open the file
```bash
src/pages/admin/SocialMedia.tsx
```

### 2. Find line 635

Look for:
```typescript
const payload = {
  user_id: session.user.id,
  provider,
  status: 'connected' as const,
  connected_at: new Date().toISOString(),
}
```

### 3. Replace lines 635-649

Delete everything from `const payload = {` through the end of the `handleConnect` function.

Paste the new code above.

### 4. Save file

The file should now redirect to OAuth pages when you click "Connect"!

---

## Before & After

### BEFORE (What happens now)
```
Click "Connect" 
  → Shows "pending" briefly
  → Database record created with status="connected"
  → Shows "connected" 
  → No OAuth happens ❌
```

### AFTER (What should happen)
```
Click "Connect"
  → Shows "pending"
  → Calls /api/social/oauth/connect
  → Gets authUrl for Instagram
  → Redirects to Instagram login
  → You log in & approve
  → Instagram redirects back to callback
  → Database gets access_token
  → Shows "connected" with your account name ✅
```

---

## What Each Part Does

```typescript
// 1. Set error to null (clear any old errors)
setError(null)

// 2. Show "pending" status (loading state)
updateLocalConnection(provider, 'pending')

// 3. Call the OAuth endpoint (already exists!)
const response = await fetch('/api/social/oauth/connect', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({
    platform: provider,      // 'instagram', 'facebook', etc
    userId: session.user.id, // Current user
  }),
})

// 4. Check if successful
if (!response.ok) {
  // If failed, show error and set status to 'error'
  updateLocalConnection(provider, 'error')
  throw new Error(errorData.error || 'Failed to initiate OAuth')
}

// 5. Get the OAuth URL from response
const { authUrl } = await response.json()

// 6. Redirect to platform's login page
window.location.href = authUrl

// 7. User logs in on platform
// 8. Platform redirects to callback endpoint
// 9. Token stored in database
// 10. Back to your app (all automatic!)
```

---

## Files That Already Exist

These don't need changes - they already do the OAuth work:

✅ `api/social/oauth/connect.ts` - Generates OAuth URLs
✅ `api/social/oauth/callback.ts` - Handles OAuth redirect  
✅ `src/lib/oauth/config.ts` - Platform configurations
✅ `src/lib/oauth/handler.ts` - OAuth logic

You just needed to connect them! 🎉

---

## Test After Change

1. Restart dev server
2. Go to Admin → Social Media → Channel Connections
3. Click "Connect" next to Instagram
4. **You should be redirected to Instagram's login page**
5. Log in and approve
6. **Redirected back to your app**
7. Shows "Connected to @yourinstagramhandle" (or similar)

---

## Still Not Working?

Check these in order:

```bash
# 1. Is /api/social/oauth/connect endpoint responding?
curl http://localhost:5173/api/social/oauth/connect \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"platform":"instagram","userId":"test_user"}'

# Should return: {"authUrl":"https://...instagram..."}
```

```javascript
// 2. Open browser console and check:
console.log('Session:', session)  // Should show current user
console.log('Access token:', session?.access_token)  // Should be string
```

```sql
-- 3. Check database after auth attempt:
SELECT * FROM social_connections 
WHERE platform = 'instagram' 
ORDER BY connected_at DESC;
-- Should show your connection with access_token populated
```

---

## Common Mistakes

❌ **Forgetting to restart dev server** after adding `.env` vars
→ Restart: `npm run dev`

❌ **Redirect URI mismatch in platform settings**
→ Set to exactly: `http://localhost:5173/api/social/oauth/callback`

❌ **Not in demo mode but haven't logged in**
→ Log in first before connecting

❌ **Using old browser tab**
→ Open fresh tab/window after change

---

## That's it!

The OAuth infrastructure is already built. You just need to:

1. Add `.env` vars (Instagram Client ID & Secret)
2. Replace the mock connection code with real OAuth code
3. Test!

The rest happens automatically. 🚀
