# Testing Social Media Connections - Summary

## TL;DR

Your connection button shows "connected" but **doesn't actually call OAuth**. The OAuth endpoints exist but aren't being used.

**To fix it:** Replace 15 lines of code in `SocialMedia.tsx` (lines 635-649) with new code that calls the OAuth endpoint.

---

## What's Happening Now

```javascript
Click "Connect" 
  → Database: INSERT { status: 'connected', access_token: NULL }
  → UI: Shows "Connected"
  → OAuth: NEVER HAPPENS ❌
```

## What Should Happen

```javascript
Click "Connect"
  → Browser: Redirect to Instagram/Facebook/X login
  → User: Logs in & approves your app
  → Platform: Redirects back to YOUR app with auth code
  → Database: INSERT { status: 'connected', access_token: 'ig_PAR...' }
  → UI: Shows "Connected to @yourname" with profile pic
  → Ready: Can now post to that account ✅
```

---

## Quick Fix: 3 Files to Change

### File 1: `.env` (Add credentials)

```bash
# Get these from Instagram Developer Dashboard
VITE_INSTAGRAM_CLIENT_ID=your_app_id
VITE_INSTAGRAM_CLIENT_SECRET=your_app_secret

# (Same for other platforms: FACEBOOK, X, LINKEDIN, etc)
```

### File 2: `src/pages/admin/SocialMedia.tsx` (Replace lines 635-649)

**DELETE:**
```typescript
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
```

**REPLACE WITH:**
```typescript
try {
  setError(null)
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
  window.location.href = authUrl
} catch (error) {
  updateLocalConnection(provider, 'disconnected')
  setError(error instanceof Error ? error.message : 'Connection failed')
}
```

### File 3: Done!

The OAuth endpoints already exist:
- ✅ `api/social/oauth/connect.ts`
- ✅ `api/social/oauth/callback.ts`

Nothing else needed!

---

## Test Flow

1. **Get OAuth Credentials**
   - Go to https://developers.facebook.com (for Instagram/Facebook)
   - Create an app
   - Copy App ID & App Secret
   - Add to `.env`

2. **Update Code**
   - Replace the mock connection code in `SocialMedia.tsx`
   - Save file
   - Restart dev server: `npm run dev`

3. **Test**
   - Go to Admin → Social Media → Channel Connections
   - Click "Connect" on Instagram
   - **Should redirect to Instagram login page**
   - Log in and approve
   - **Should redirect back to your app**
   - Shows "Connected"

4. **Verify**
   - Open Supabase dashboard
   - Run: `SELECT * FROM social_connections WHERE platform='instagram'`
   - Should see `access_token` populated (not NULL!)

---

## Why It's Currently Broken

In the UI code, when you click "Connect", it does this:

```typescript
const payload = {
  user_id: session.user.id,
  provider: 'instagram',
  status: 'connected',
  connected_at: new Date().toISOString(),
  // ⚠️ Missing: access_token, account_id, etc
}

await supabase
  .from('social_connections')
  .upsert(payload, { onConflict: 'user_id,provider' })
  // Just stores fake "connected" status in database
  // Never talks to Instagram's API
```

So the database shows "connected" but there's no actual OAuth token to use for posting.

---

## The Fix Is Already Built

The OAuth infrastructure is complete:

**Phase 2 (OAuth Implementation) already includes:**
- ✅ OAuth endpoints for all 11 platforms
- ✅ Token encryption/decryption
- ✅ State management for CSRF protection
- ✅ Profile fetching from each platform
- ✅ Token refresh logic

You just need to **wire it up in the UI**!

---

## After It's Working

Once real OAuth is connected, you can:

1. **See account info** (username, followers, profile pic)
2. **Schedule posts** (Phase 3 - already built)
3. **Publish to platforms** (Phase 4 - already built)
4. **Track analytics** (database ready)

---

## Documentation Files

I've created 3 guides in your repo:

| File | Purpose |
|------|---------|
| `OAUTH_QUICK_START.md` | Quick reference (read this first) |
| `OAUTH_CODE_CHANGE.md` | Exact line-by-line code to change |
| `TESTING_OAUTH_CONNECTIONS.md` | Comprehensive testing guide |

---

## Common Questions

**Q: Why doesn't it redirect to Instagram?**
A: The code is set to just toggle a local state instead of calling OAuth. Replace lines 635-649 with the new code.

**Q: Where do I get OAuth credentials?**
A: Go to the platform's developer dashboard:
- Instagram/Facebook: https://developers.facebook.com
- X/Twitter: https://developer.twitter.com
- LinkedIn: https://www.linkedin.com/developers/apps

**Q: What's the OAuth callback URL?**
A: 
- Local: `http://localhost:5173/api/social/oauth/callback`
- Production: `https://yourdomain.com/api/social/oauth/callback`

**Q: Does this break the UI?**
A: No! The UI will work exactly the same, just with real OAuth instead of fake connections.

**Q: Can I test without real OAuth credentials?**
A: Yes! Keep the current mock code for now, then implement real OAuth later. See `TESTING_OAUTH_CONNECTIONS.md` for mock setup.

---

## Next Steps

1. Read `OAUTH_QUICK_START.md` (5 min)
2. Get OAuth credentials from Instagram (10 min)
3. Add to `.env` (1 min)
4. Replace code in `SocialMedia.tsx` (5 min)
5. Restart dev server (30 sec)
6. Test! (2 min)

**Total time: ~20 minutes**

---

**Your system is 90% done. Just need to wire up the UI to the backend! 🚀**

See the other guides for detailed instructions.
