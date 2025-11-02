# Social Media Integration - Quick Reference

## Phase 1: Database Setup ✅ COMPLETE

### What's Ready Now

#### Database Tables
- ✅ `social_connections` - Track which platforms are connected
- ✅ `social_account_tokens` - Store OAuth tokens and credentials
- ✅ `social_posts` - Manage all posts (draft, scheduled, published)
- ✅ `social_analytics` - Track engagement metrics

#### Prisma Models
- ✅ `SocialConnection`
- ✅ `SocialAccountToken`
- ✅ `SocialPost`
- ✅ `SocialAnalytic`

#### TypeScript Types
- ✅ All API request/response types
- ✅ Platform-specific OAuth types
- ✅ Error classes
- ✅ 11 social platforms supported

---

## Quick Start: How to Add OAuth for a Platform

### 1. Register App on Platform
Get OAuth credentials from the platform's developer console.

### 2. Add to Environment Variables
```bash
PLATFORM_CLIENT_ID=xxx
PLATFORM_CLIENT_SECRET=xxx
```

### 3. Create OAuth Config
Edit `src/lib/oauth/config.ts`:
```typescript
const oauthConfigs: Record<SocialPlatform, OAuthConfig> = {
  instagram: { /* ... */ },
  // Add your platform:
  myplatform: {
    provider: 'myplatform',
    clientId: process.env.MYPLATFORM_CLIENT_ID!,
    clientSecret: process.env.MYPLATFORM_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/oauth/callback`,
    scopes: ['scope1', 'scope2'],
    authUrl: 'https://platform.com/oauth/authorize',
    tokenUrl: 'https://platform.com/oauth/token'
  }
}
```

### 4. Implement Platform Adapter
Create `src/lib/social/platforms/myplatform.ts`:
```typescript
export async function publishToMyPlatform(
  post: SocialPost,
  accessToken: string
): Promise<string> {
  // Implement posting logic
}

export async function fetchMyPlatformMetrics(
  postId: string,
  accessToken: string
): Promise<PostMetrics> {
  // Implement analytics fetching
}
```

### 5. Register in Publishing Router
Edit `src/lib/social/publish.ts`:
```typescript
export async function publishToPlatform(
  platform: SocialPlatform,
  post: SocialPost,
  token: string
): Promise<string> {
  switch (platform) {
    case 'instagram':
      return publishToInstagram(post, token)
    case 'myplatform':
      return publishToMyPlatform(post, token)
    // ...
  }
}
```

---

## Quick Start: Schedule a Post

```typescript
import { PrismaClient } from '@prisma/client'
import type { CreateSocialPostRequest } from '@/types/social'

const prisma = new PrismaClient()

const post = await prisma.socialPost.create({
  data: {
    content: 'Check out our new listings! 🏡',
    platforms: ['instagram', 'facebook'],
    mediaUrls: ['https://example.com/image1.jpg'],
    scheduledAt: new Date('2025-11-05T15:00:00Z'),
    timezone: 'America/New_York',
    campaign: 'November Listings',
    createdBy: 'user-uuid',
    status: 'scheduled'
  }
})
```

---

## Quick Start: Connect an Account

```typescript
// User clicks "Connect Instagram"
// → Frontend calls: GET /api/social/oauth/connect?platform=instagram&userId=xxx
// → Backend generates auth URL
// → User redirected to Instagram OAuth
// → Instagram redirects to: /api/social/oauth/callback?code=xxx&state=yyy
// → Backend exchanges code for token
// → Stores connection and token in database

// After this, user can schedule posts to Instagram
```

---

## Platforms & API Endpoints

| Platform | Auth Endpoint | Publish Endpoint | Analytics Endpoint |
|----------|--------------|------------------|-------------------|
| Instagram | `api.instagram.com` | `graph.instagram.com/v18.0/me/media` | `graph.instagram.com/me/insights` |
| Facebook | `facebook.com/v18.0` | `graph.facebook.com/v18.0/{page}/feed` | `graph.facebook.com/{post}/insights` |
| LinkedIn | `linkedin.com/oauth/v2` | `api.linkedin.com/v2/ugcPosts` | `api.linkedin.com/v2/analytics` |
| X/Twitter | `twitter.com/i/oauth2` | `api.twitter.com/2/tweets` | `api.twitter.com/2/tweets/search` |
| TikTok | `tiktok.com/oauth/authorize` | `api.tiktok.com/v1/video/publish` | `api.tiktok.com/v1/analytics` |
| YouTube | `accounts.google.com/o/oauth2/auth` | `youtube.googleapis.com/v3/videos` | `youtube.googleapis.com/v3/analytics` |
| Threads | `threads.instagram.com/oauth` | `graph.threads.com/me/threads` | `graph.threads.com/me/insights` |
| Pinterest | `api.pinterest.com/oauth` | `api.pinterest.com/v5/pins` | `api.pinterest.com/v5/analytics` |
| Bluesky | `bsky.social/xrpc/com.atproto.server` | `bsky.social/xrpc/app.bsky.feed.post` | `bsky.social/xrpc/app.bsky.feed` |
| Mastodon | `{instance}/oauth/authorize` | `{instance}/api/v1/statuses` | `{instance}/api/v1/accounts/verify_credentials` |
| Google Business | `businessprofiles.googleapis.com` | `businessprofiles.googleapis.com/v1` | `businessprofiles.googleapis.com/v1/accounts/{account}` |

---

## Database Query Examples

### Find All Connected Platforms
```typescript
const connections = await prisma.socialConnection.findMany({
  where: { userId: 'user-id' }
})

connections.forEach(c => {
  console.log(`${c.provider}: ${c.status}`)
})
```

### Get Upcoming Posts
```typescript
const upcoming = await prisma.socialPost.findMany({
  where: {
    status: 'scheduled',
    scheduledAt: { gte: new Date() }
  },
  orderBy: { scheduledAt: 'asc' }
})
```

### Get Posts Ready to Publish (Past Scheduled Time)
```typescript
const ready = await prisma.socialPost.findMany({
  where: {
    status: 'scheduled',
    scheduledAt: { lte: new Date() }
  }
})
```

### Get Campaign Performance
```typescript
const campaign = await prisma.socialAnalytic.findMany({
  where: {
    post: {
      campaign: 'Summer Promotion'
    }
  }
})

const totalEngagement = campaign.reduce((sum, a) => sum + a.engagement, 0)
const totalReach = campaign.reduce((sum, a) => sum + a.impressions, 0)
```

### Get Failed Posts
```typescript
const failed = await prisma.socialPost.findMany({
  where: {
    status: 'failed'
  }
})

failed.forEach(p => {
  console.log(`Post ${p.id} failed: ${p.failureReason}`)
})
```

---

## Common Patterns

### Publishing a Post Immediately
```typescript
await prisma.socialPost.create({
  data: {
    content: 'Post content',
    platforms: ['instagram'],
    status: 'draft', // Or 'queued' to go immediately
    createdBy: userId
  }
})

// Then call publish function
await publishPost(postId)
```

### Scheduling a Post
```typescript
await prisma.socialPost.create({
  data: {
    content: 'Post content',
    platforms: ['instagram'],
    scheduledAt: new Date('2025-11-10T09:00:00Z'),
    timezone: 'America/New_York',
    status: 'scheduled'
  }
})

// Queue will pick it up at scheduled time
```

### Retry Failed Post
```typescript
await prisma.socialPost.update({
  where: { id: postId },
  data: {
    status: 'scheduled',
    scheduledAt: new Date(),
    failureReason: null
  }
})
```

### Get Account Info
```typescript
const connection = await prisma.socialConnection.findFirst({
  where: { userId, provider: 'instagram' }
})

const token = await prisma.socialAccountToken.findFirst({
  where: { connectionId: connection.id }
})

console.log(`Connected as: @${token.accountHandle}`)
```

---

## Monitoring & Troubleshooting

### Check Token Status
```typescript
const token = await prisma.socialAccountToken.findUnique({
  where: { id: tokenId }
})

if (token.tokenExpiresAt && token.tokenExpiresAt < new Date()) {
  console.log('Token expired, needs refresh')
}
```

### Track Post Lifecycle
```typescript
const post = await prisma.socialPost.findUnique({
  where: { id: postId }
})

console.log(`Status: ${post.status}`)
console.log(`Created: ${post.createdAt}`)
console.log(`Scheduled: ${post.scheduledAt}`)
console.log(`Published: ${post.postedAt}`)
console.log(`Error: ${post.failureReason}`)
```

### Get Recent Analytics
```typescript
const recent = await prisma.socialAnalytic.findMany({
  where: {
    fetchedAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }
  },
  orderBy: { engagement: 'desc' }
})
```

---

## Environment Setup

### 1. Copy Template
```bash
cp .env.example .env.local
```

### 2. Add OAuth Credentials
```env
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret
# ... repeat for other platforms
```

### 3. Configure Infrastructure
```env
REDIS_HOST=localhost
REDIS_PORT=6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Test Connection
```bash
npx prisma db execute --stdin < /dev/null
```

---

## Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Open database explorer
npx prisma studio

# Apply pending migrations
npx supabase migration up

# Create new migration (after schema changes)
npx prisma migrate dev --name description

# Check for schema drift
npx prisma validate

# Format schema
npx prisma format
```

---

## Next Phase: OAuth Implementation

When ready, move to implementing:

1. `src/lib/oauth/config.ts` - OAuth configurations
2. `src/lib/oauth/handler.ts` - Authorization flow
3. `api/social/oauth/connect.ts` - Start authorization
4. `api/social/oauth/callback.ts` - Handle callback
5. `src/lib/social/platforms/` - Platform adapters
6. Job queue for scheduled publishing

See `SOCIAL_MEDIA_IMPLEMENTATION.md` for detailed code examples.

---

## Support Files

- **Schema Reference**: `docs/SOCIAL_MEDIA_SCHEMA.md`
- **Implementation Guide**: `docs/SOCIAL_MEDIA_IMPLEMENTATION.md`
- **Type Definitions**: `src/types/social.ts`
- **Migrations**: `supabase/migrations/202511*_social*`

---

## Status

**Phase 1: Database Setup** - ✅ COMPLETE

Ready to start Phase 2 (OAuth Implementation)?
