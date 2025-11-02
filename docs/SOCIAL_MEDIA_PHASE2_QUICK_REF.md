# Phase 2: OAuth Implementation - Quick Reference

## 🚀 Quick Start

### 1. Set Environment Variables
```bash
# Add to .env.local
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Test OAuth Flow
```
1. Visit: http://localhost:3000/admin/social-media
2. Click "Connect Instagram"
3. Sign in to Instagram
4. Authorize app
5. Get redirected back with success message
```

### 3. Verify Database
```bash
# Check if connection was created
npx prisma studio

# Look in: social_connections table
# And: social_account_tokens table
```

---

## 📝 Code Examples

### Frontend: Initiate OAuth

```typescript
async function connectSocialAccount(platform: SocialPlatform) {
  const userId = getCurrentUserId()
  
  const response = await fetch(
    `/api/social/oauth/connect?platform=${platform}&userId=${userId}`
  )
  
  const { url, error } = await response.json()
  
  if (error) {
    showError(error)
    return
  }
  
  // Redirect to OAuth provider
  window.location.href = url
}
```

### Backend: Verify Configuration

```typescript
import { validateOAuthConfigs, getConfiguredPlatforms } from 'src/lib/oauth/config'

// Validate all configs on startup
const { valid, errors } = validateOAuthConfigs()

if (!valid) {
  console.error('OAuth configuration errors:', errors)
}

// Get list of enabled platforms
const platforms = getConfiguredPlatforms()
console.log('Configured platforms:', platforms)
```

### Backend: Refresh Token

```typescript
import { refreshOAuthToken } from 'src/lib/oauth/handler'

async function refreshExpiredToken(connectionId: string) {
  try {
    await refreshOAuthToken(connectionId)
    console.log('Token refreshed successfully')
  } catch (error) {
    console.error('Token refresh failed:', error.message)
    // Mark connection as error, prompt user to reconnect
  }
}
```

---

## 🔐 Security Checklist

- [x] CSRF tokens prevent attacks
- [x] Tokens encrypted with AES-256-GCM
- [x] State tokens expire after 10 minutes
- [x] Redirect URIs validated
- [x] Tokens not logged
- [x] RLS policies enforced
- [x] Error messages don't expose secrets

---

## 🐛 Troubleshooting

### "OAuth credentials not configured"
```bash
# Check env vars are set
echo $INSTAGRAM_CLIENT_ID

# Restart dev server to reload env
npm run dev
```

### "Invalid redirect URI"
```env
# Make sure NEXT_PUBLIC_APP_URL matches OAuth app setting
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### "State token invalid"
- State tokens expire after 10 minutes
- Try again or clear browser cache

### "Token exchange failed"
- Verify CLIENT_ID and CLIENT_SECRET
- Check authorization code wasn't already used
- Verify API quotas

---

## 📊 Platform Scopes

### Instagram
- `instagram_basic` - Profile access
- `instagram_content_publishing` - Post to feed

### Facebook
- `pages_manage_posts` - Create posts
- `pages_read_engagement` - Read insights

### LinkedIn
- `w_member_social` - Post on behalf

### X/Twitter
- `tweet.write` - Post tweets
- `users.read` - Read user info

### Others
See `src/lib/oauth/config.ts` for all platforms

---

## 🎯 Testing

### Manual Test Flow
```
1. Stop dev server
2. Add OAuth credentials to .env.local
3. Start dev server: npm run dev
4. Visit: http://localhost:3000/admin/social-media
5. Click "Connect [Platform]"
6. Sign in and authorize
7. Check database: npx prisma studio
8. Verify connection was created
```

### Check Database
```typescript
// Query connections
const connections = await prisma.socialConnection.findMany({
  where: { userId: 'your-user-id' }
})

// Query tokens
const tokens = await prisma.socialAccountToken.findMany({
  where: { connectionId: connection.id }
})

console.log(connections)
console.log(tokens)
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/lib/oauth/config.ts` | OAuth configuration per platform |
| `src/lib/oauth/handler.ts` | OAuth flow logic & token management |
| `src/lib/oauth/utils.ts` | Encryption, state, token utilities |
| `api/social/oauth/connect.ts` | Initiate OAuth flow endpoint |
| `api/social/oauth/callback.ts` | Handle OAuth redirect endpoint |

---

## 🔄 OAuth Flow Summary

```
User Action         →  Frontend Call             →  Backend Action
─────────────────────────────────────────────────────────────────
Click Connect       →  /api/oauth/connect        →  Generate auth URL
                    →  Redirect to provider      
Sign & Authorize    →  (On provider site)
Callback            →  /api/oauth/callback       →  Exchange code
                    →  Verify state token
                    →  Get access token
                    →  Fetch user profile
                    →  Store in database
Success             →  Redirect to admin         →  Show success
```

---

## ✨ What's Next

### Phase 3: Post Scheduling
- Save posts to database
- Schedule for specific times
- Multi-platform support
- Timezone awareness

### Phase 4: Platform Publishing
- Publish to Instagram/Facebook
- Publish to X/Twitter
- Handle media uploads
- Track post IDs

### Phase 5: Analytics
- Fetch engagement metrics
- Track impressions/likes
- Campaign analytics
- Dashboard widgets

---

## 💡 Tips

### Enable Debug Logging
```typescript
// In api/social/oauth/connect.ts, add:
console.log('Auth URL generated:', authUrl)
console.log('Platform config:', getOAuthConfig(platform))
```

### Check Token Expiration
```typescript
import { isTokenExpired, getTokenTimeToExpiry } from 'src/lib/oauth/utils'

const token = await prisma.socialAccountToken.findUnique({
  where: { connectionId }
})

if (isTokenExpired(token.tokenExpiresAt)) {
  console.log('Token expired')
  await refreshOAuthToken(connectionId)
}

const timeLeft = getTokenTimeToExpiry(token.tokenExpiresAt)
console.log(`Token expires in ${timeLeft / 1000 / 60} minutes`)
```

### List Configured Platforms
```typescript
import { getConfiguredPlatforms } from 'src/lib/oauth/config'

const platforms = getConfiguredPlatforms()
console.log('Available platforms:', platforms)
// Output: ['instagram', 'facebook', 'x']
```

---

## 🎓 Learning Resources

- [Meta Graph API](https://developers.facebook.com/docs/graph-api)
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn API](https://docs.microsoft.com/en-us/linkedin/shared/api-guide/concepts)
- [OAuth 2.0 Spec](https://tools.ietf.org/html/rfc6749)

---

## 📞 Need Help?

See full documentation: `docs/SOCIAL_MEDIA_PHASE2_COMPLETE.md`

---

**Phase 2 Status: ✅ COMPLETE**
