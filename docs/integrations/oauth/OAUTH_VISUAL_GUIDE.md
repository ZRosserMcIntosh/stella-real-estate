# Visual Guide: OAuth Flow vs Current Implementation

## Current Implementation ❌

```
Your App (SocialMedia.tsx)
    │
    ├─ User clicks "Connect"
    │
    ├─ handleConnect() called
    │
    ├─ Creates fake "connected" record
    │
    └─ Stores in database:
        {
          user_id: 'abc123',
          platform: 'instagram',
          status: 'connected',
          access_token: NULL  ← ❌ Problem: No token!
        }
    
    Result: Shows "Connected" but can't post
```

## Proper OAuth Flow ✅

```
Your App (SocialMedia.tsx)
    │
    ├─ User clicks "Connect"
    │
    ├─ handleConnect() calls /api/social/oauth/connect
    │
    └─ Browser redirects to:
        https://api.instagram.com/oauth/authorize?client_id=xxx&redirect_uri=http://localhost:5173/api/social/oauth/callback
            │
            │ [User is on Instagram.com]
            │
            ├─ User logs in
            ├─ User approves your app
            │
            └─ Instagram redirects to:
                http://localhost:5173/api/social/oauth/callback?code=abc123&state=xyz
                    │
                    ├─ /api/social/oauth/callback receives code
                    │
                    ├─ Exchanges code for access_token with Instagram API
                    │
                    └─ Stores in database:
                        {
                          user_id: 'abc123',
                          platform: 'instagram',
                          status: 'connected',
                          access_token: 'ig_PAR...'  ← ✅ Real token!
                        }
                    
                    ├─ Stores in encrypted form
                    │
                    └─ Browser redirected back to Admin page
                        │
                        └─ Shows "Connected to @yourinstagramhandle" ✅
```

---

## Code Change: Visual Diff

### BEFORE (Lines 635-649)

```
635  │ const payload = {
636  │   user_id: session.user.id,
637  │   provider,
638  │   status: 'connected' as const,
639  │   connected_at: new Date().toISOString(),
640  │ }
641  │
642  │ const { error: connectError } = await supabase
643  │   .from('social_connections')
644  │   .upsert(payload, { onConflict: 'user_id,provider' })
645  │
646  │ if (connectError) {
647  │   setError(connectError.message ?? 'Unable to connect account.')
648  │   return
649  │ }
650  │
651  │ updateLocalConnection(provider, 'connected')
652  │ setError(null)
```

### AFTER (Replace with)

```
635  │ try {
636  │   setError(null)
637  │   updateLocalConnection(provider, 'pending')
638  │
639  │   const response = await fetch('/api/social/oauth/connect', {
640  │     method: 'POST',
641  │     headers: {
641  │       'Content-Type': 'application/json',
642  │       'Authorization': `Bearer ${session.access_token}`,
643  │     },
644  │     body: JSON.stringify({
645  │       platform: provider,
646  │       userId: session.user.id,
647  │     }),
648  │   })
649  │
650  │   if (!response.ok) {
651  │     const errorData = await response.json()
652  │     updateLocalConnection(provider, 'error')
653  │     throw new Error(errorData.error || 'Failed to initiate OAuth')
654  │   }
655  │
656  │   const { authUrl } = await response.json()
657  │   window.location.href = authUrl
658  │ } catch (error) {
659  │   updateLocalConnection(provider, 'disconnected')
660  │   setError(error instanceof Error ? error.message : 'Connection failed')
661  │ }
```

---

## What Each Line Does

### Lines 635-637: Setup
```typescript
try {
  setError(null)                              // Clear old errors
  updateLocalConnection(provider, 'pending')  // Show loading state
```

### Lines 639-648: Make OAuth Request
```typescript
  const response = await fetch('/api/social/oauth/connect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,  // User's session
    },
    body: JSON.stringify({
      platform: provider,         // 'instagram', 'facebook', etc.
      userId: session.user.id,    // Current user ID
    }),
  })
```

### Lines 650-654: Error Handling
```typescript
  if (!response.ok) {
    const errorData = await response.json()
    updateLocalConnection(provider, 'error')  // Show error state
    throw new Error(errorData.error || 'Failed to initiate OAuth')
  }
```

### Lines 656-657: Redirect to OAuth
```typescript
  const { authUrl } = await response.json()         // Get Instagram OAuth URL
  window.location.href = authUrl                    // Redirect user to Instagram login
```

### Lines 658-661: Catch Errors
```typescript
} catch (error) {
  updateLocalConnection(provider, 'disconnected')   // Show disconnected
  setError(error instanceof Error ? error.message : 'Connection failed')
}
```

---

## File Structure: Where Everything Lives

```
Your App
│
├─ src/pages/admin/SocialMedia.tsx ← UI (you change this)
│  └─ handleConnect() ← Replace lines 635-649
│
├─ api/social/oauth/
│  ├─ connect.ts ← Generates OAuth URL (already exists ✅)
│  └─ callback.ts ← Handles OAuth redirect (already exists ✅)
│
├─ src/lib/oauth/
│  ├─ config.ts ← Platform configs (already exists ✅)
│  └─ handler.ts ← OAuth logic (already exists ✅)
│
└─ Database
   └─ social_connections table ← Stores tokens (ready ✅)
```

---

## Testing: Step by Step

### Step 1: Prepare
```bash
# Terminal 1: Make sure dev server running
npm run dev
# Should see: ✓ ready in X ms
```

### Step 2: Get Credentials
```
1. Go to https://developers.facebook.com
2. Create App (or use existing)
3. Go to App Settings → Basic
4. Copy App ID and App Secret
```

### Step 3: Add to .env
```bash
# Create or edit .env in project root
VITE_INSTAGRAM_CLIENT_ID=your_app_id_123
VITE_INSTAGRAM_CLIENT_SECRET=your_app_secret_xyz

# Restart dev server after editing .env
npm run dev
```

### Step 4: Update Code
```bash
# Edit src/pages/admin/SocialMedia.tsx
# Find line 635: const payload = {
# Replace lines 635-649 with new code
# Save file
```

### Step 5: Test
```
1. Go to http://localhost:5173/admin/social-media
2. Scroll to "Channel connections"
3. Click "Connect" next to Instagram
4. Should be redirected to instagram.com login
5. Log in
6. Should redirect back with "Connected"
```

### Step 6: Verify
```sql
-- In Supabase dashboard, run:
SELECT * FROM social_connections 
WHERE platform = 'instagram' 
ORDER BY connected_at DESC;

-- Should see:
-- ✅ access_token filled in (not NULL)
-- ✅ status = 'connected'
-- ✅ account_id filled in
```

---

## Common Issues & Solutions

### Issue 1: Still just shows "Connected" without redirect

**Solution:** 
```
1. Did you replace the code? Check lines 635-649
2. Did you restart dev server? (Ctrl+C then npm run dev)
3. Is .env loaded? Check browser console: localStorage.getItem('VITE_INSTAGRAM_CLIENT_ID')
```

### Issue 2: 404 on /api/social/oauth/connect

**Solution:**
```
1. Check file exists: api/social/oauth/connect.ts
2. Is it deployed? (for production, need: vercel --prod)
3. Check file path is correct
```

### Issue 3: Redirect URI mismatch error

**Solution:**
```
1. Go to Instagram App Settings
2. Set OAuth Redirect URIs to EXACTLY:
   http://localhost:5173/api/social/oauth/callback
3. Click "Save Changes"
4. Wait 5 seconds
5. Try again
```

### Issue 4: access_token NULL in database

**Solution:**
```
1. Check OAuth callback was called:
   - Browser DevTools → Network → find /api/social/oauth/callback request
   - Should see successful response
2. Check callback code is handling token correctly
3. Check token encryption not failing
```

---

## After It Works

Once you see real `access_token` in database:

✅ **You can now:**
- See account info (username, followers)
- Create posts in database
- Schedule posts for publishing
- Publish posts to Instagram
- Get analytics

✅ **All built already:**
- Phase 1: Database (done)
- Phase 2: OAuth (done)
- Phase 3: Scheduling (done)
- Phase 4: Publishing (done)

You just needed to **connect them!**

---

## Summary

| Part | Current Status | What to Do |
|------|---|---|
| UI Button | ✅ Exists | No change needed |
| OAuth Endpoints | ✅ Built | No change needed |
| Database | ✅ Ready | No change needed |
| handleConnect() | ❌ Incomplete | Replace lines 635-649 |
| .env | ❌ Missing | Add credentials |

**Effort:** 20 minutes
**Result:** Full OAuth integration working! 🚀

---

See the other guides for:
- **OAUTH_QUICK_START.md** - Quick reference
- **OAUTH_CODE_CHANGE.md** - Exact line-by-line changes
- **TESTING_OAUTH_CONNECTIONS.md** - Comprehensive testing guide
