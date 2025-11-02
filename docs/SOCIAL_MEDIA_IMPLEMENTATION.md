# Social Media Integration Implementation Guide

## Phase 1: Database Setup ✅

The database schema has been created with the following tables:

### Created Files:
1. **Prisma Models** (`prisma/schema.prisma`)
   - `SocialConnection` - Track connected accounts
   - `SocialPost` - Schedule and manage posts
   - `SocialAccountToken` - Store OAuth tokens
   - `SocialAnalytic` - Track engagement metrics

2. **Database Migrations**
   - `20251019121500_create_social_posts.sql` - Social posts table with RLS
   - `20251019123000_create_social_connections.sql` - Connection tracking with RLS
   - `20251102120000_create_social_analytics.sql` - Analytics storage
   - `20251102120100_create_social_account_tokens.sql` - Token management

3. **Type Definitions** (`src/types/social.ts`)
   - All TypeScript interfaces
   - Platform-specific OAuth types
   - Error classes
   - Request/response types

4. **Documentation** (`docs/SOCIAL_MEDIA_SCHEMA.md`)
   - Complete schema reference
   - Design patterns explained
   - Security considerations
   - Future enhancement ideas

---

## Phase 2: OAuth Authentication (Next Steps)

### 2.1 Create OAuth Config Manager

Create `src/lib/oauth/config.ts`:
```typescript
import type { OAuthConfig, SocialPlatform } from '../../types/social'

const oauthConfigs: Record<SocialPlatform, OAuthConfig> = {
  instagram: {
    provider: 'instagram',
    clientId: process.env.INSTAGRAM_CLIENT_ID!,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/oauth/callback`,
    scopes: ['instagram_basic', 'instagram_content_publishing'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://graph.instagram.com/v18.0/oauth/access_token'
  },
  facebook: {
    provider: 'facebook',
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/oauth/callback`,
    scopes: ['pages_manage_posts', 'pages_read_engagement'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token'
  },
  x: {
    provider: 'x',
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/social/oauth/callback`,
    scopes: ['tweet.write', 'users.read'],
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token'
  },
  // ... other platforms
}

export function getOAuthConfig(platform: SocialPlatform): OAuthConfig {
  const config = oauthConfigs[platform]
  if (!config) throw new Error(`No OAuth config for platform: ${platform}`)
  return config
}
```

### 2.2 Create OAuth Flow Handler

Create `src/lib/oauth/handler.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import type { SocialPlatform, OAuthUserProfile } from '../../types/social'

const prisma = new PrismaClient()

export async function generateAuthUrl(
  userId: string,
  platform: SocialPlatform
): Promise<string> {
  const config = getOAuthConfig(platform)
  
  // Generate CSRF state token
  const state = crypto.randomBytes(32).toString('hex')
  await redis.set(`oauth:state:${state}`, userId, 'EX', 300) // 5 min expiry
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    state,
  })
  
  return `${config.authUrl}?${params.toString()}`
}

export async function handleOAuthCallback(
  code: string,
  state: string,
  platform: SocialPlatform
): Promise<void> {
  // Verify state token
  const userId = await redis.get(`oauth:state:${state}`)
  if (!userId) throw new Error('Invalid or expired state token')
  
  const config = getOAuthConfig(platform)
  
  // Exchange code for token
  const tokenResponse = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  })
  
  const tokens = await tokenResponse.json()
  
  // Fetch user profile
  const profile = await fetchUserProfile(platform, tokens.access_token)
  
  // Store connection and tokens
  const connection = await prisma.socialConnection.upsert({
    where: { userId_provider: { userId, provider: platform } },
    update: { status: 'connected' },
    create: {
      userId,
      provider: platform,
      status: 'connected',
    },
  })
  
  await prisma.socialAccountToken.upsert({
    where: { connectionId: connection.id },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiresAt: tokens.expires_in 
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
    },
    create: {
      connectionId: connection.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      tokenExpiresAt: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
      accountHandle: profile.handle,
      displayName: profile.displayName,
      profileImageUrl: profile.profileImageUrl,
      platformAccountId: profile.id,
    },
  })
  
  await redis.del(`oauth:state:${state}`)
}

async function fetchUserProfile(
  platform: SocialPlatform,
  accessToken: string
): Promise<OAuthUserProfile> {
  // Platform-specific profile fetching
  if (platform === 'instagram') {
    const res = await fetch(
      `https://graph.instagram.com/me?fields=id,username,name&access_token=${accessToken}`
    )
    const data = await res.json()
    return {
      id: data.id,
      handle: data.username,
      displayName: data.name,
    }
  }
  // ... implement for other platforms
  
  throw new Error(`Profile fetching not implemented for ${platform}`)
}
```

### 2.3 Create API Route

Create `api/social/oauth/connect.ts`:
```typescript
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { generateAuthUrl } from '@/lib/oauth/handler'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const platform = searchParams.get('platform')
  const userId = searchParams.get('userId')
  
  if (!platform || !userId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }
  
  const authUrl = await generateAuthUrl(userId, platform as any)
  return NextResponse.json({ url: authUrl })
}
```

---

## Phase 3: Post Scheduling

### 3.1 Create Post Service

Create `src/lib/social/posts.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import type { SocialPost, CreateSocialPostRequest } from '../../types/social'

const prisma = new PrismaClient()

export async function createPost(
  userId: string,
  data: CreateSocialPostRequest
): Promise<SocialPost> {
  // Verify user has connected the platforms
  const connections = await prisma.socialConnection.findMany({
    where: {
      userId,
      provider: { in: data.platforms },
      status: 'connected',
    },
  })
  
  if (connections.length !== data.platforms.length) {
    throw new Error('Not all platforms are connected')
  }
  
  return prisma.socialPost.create({
    data: {
      content: data.content,
      platforms: data.platforms,
      mediaUrls: data.mediaUrls || [],
      scheduledAt: data.scheduledAt,
      timezone: data.timezone,
      campaign: data.campaign,
      notes: data.notes,
      status: data.scheduledAt ? 'scheduled' : 'draft',
      approvalRequired: data.approvalRequired,
      createdBy: userId,
    },
  })
}

export async function getScheduledPosts(
  userId: string
): Promise<SocialPost[]> {
  return prisma.socialPost.findMany({
    where: {
      createdBy: userId,
      status: { in: ['draft', 'scheduled'] },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function publishPost(postId: string): Promise<void> {
  const post = await prisma.socialPost.findUnique({
    where: { id: postId },
    include: {
      // Get tokens for publishing
    },
  })
  
  if (!post) throw new Error('Post not found')
  
  // Publish to each platform
  for (const platform of post.platforms) {
    try {
      await publishToPlatform(platform, post)
    } catch (error) {
      // Log error, mark as failed
    }
  }
  
  // Update post status
  await prisma.socialPost.update({
    where: { id: postId },
    data: {
      status: 'published',
      postedAt: new Date(),
    },
  })
}
```

### 3.2 Create Publishing Queue

Create `src/lib/social/queue.ts` using Bull or similar:
```typescript
import Queue from 'bull'
import { publishPost } from './posts'

export const publishQueue = new Queue('social-publish', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
})

publishQueue.process(async (job) => {
  const { postId } = job.data
  await publishPost(postId)
})

export async function schedulePostPublish(
  postId: string,
  scheduledAt: Date
): Promise<void> {
  await publishQueue.add(
    { postId },
    { 
      delay: Math.max(0, scheduledAt.getTime() - Date.now()),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    }
  )
}
```

---

## Phase 4: Platform-Specific Publishing

### 4.1 Instagram/Facebook Publishing

Create `src/lib/social/platforms/meta.ts`:
```typescript
export async function publishToInstagram(
  post: SocialPost,
  accessToken: string
): Promise<string> {
  const endpoint = 'https://graph.instagram.com/v18.0/me/media'
  
  const payload: Record<string, any> = {
    media_type: post.mediaUrls.length > 1 ? 'CAROUSEL' : 'IMAGE',
    caption: post.content,
  }
  
  if (post.mediaUrls.length === 1) {
    payload.image_url = post.mediaUrls[0]
  } else if (post.mediaUrls.length > 1) {
    payload.children = post.mediaUrls.map(url => ({
      media_type: 'IMAGE',
      image_url: url,
    }))
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`Instagram publish failed: ${result.error?.message}`)
  }
  
  return result.id
}
```

### 4.2 X/Twitter Publishing

Create `src/lib/social/platforms/twitter.ts`:
```typescript
export async function publishToX(
  post: SocialPost,
  accessToken: string
): Promise<string> {
  const endpoint = 'https://api.twitter.com/2/tweets'
  
  const payload = {
    text: post.content,
  }
  
  if (post.mediaUrls.length > 0) {
    // Upload media first, then attach
    const mediaIds = await Promise.all(
      post.mediaUrls.map(url => uploadXMedia(url, accessToken))
    )
    payload.media = { media_ids: mediaIds }
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`Twitter publish failed: ${result.detail}`)
  }
  
  return result.data.id
}

async function uploadXMedia(
  mediaUrl: string,
  accessToken: string
): Promise<string> {
  // Download media and upload to Twitter
  const response = await fetch(mediaUrl)
  const buffer = await response.buffer()
  
  // Multi-part upload to https://upload.twitter.com/1.1/media/upload.json
  // Returns media_id
}
```

### 4.3 LinkedIn Publishing

Create `src/lib/social/platforms/linkedin.ts`:
```typescript
export async function publishToLinkedIn(
  post: SocialPost,
  accessToken: string,
  personId: string
): Promise<string> {
  const endpoint = 'https://api.linkedin.com/v2/ugcPosts'
  
  const payload = {
    author: `urn:li:person:${personId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.Share': {
        shareCommentary: {
          text: post.content,
        },
        shareMediaCategory: post.mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
        media: post.mediaUrls.map(url => ({
          status: 'READY',
          description: {
            text: 'Image',
          },
          media: url,
          title: {
            text: 'Image',
          },
        })),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'LinkedIn-Version': '202401',
    },
    body: JSON.stringify(payload),
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(`LinkedIn publish failed: ${result.message}`)
  }
  
  return result.id
}
```

---

## Phase 5: Analytics Collection

### 5.1 Create Analytics Service

Create `src/lib/social/analytics.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import type { SocialPost, SocialPlatform } from '../../types/social'

const prisma = new PrismaClient()

export async function fetchAnalytics(
  post: SocialPost,
  token: string
): Promise<void> {
  for (const platform of post.platforms) {
    const metrics = await fetchPlatformMetrics(platform, post, token)
    
    await prisma.socialAnalytic.upsert({
      where: {
        postId_platform: {
          postId: post.id,
          platform,
        },
      },
      update: {
        impressions: metrics.impressions,
        engagement: metrics.engagement,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        fetchedAt: new Date(),
      },
      create: {
        postId: post.id,
        platform,
        platformPostId: post.id,
        impressions: metrics.impressions,
        engagement: metrics.engagement,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
      },
    })
  }
}

async function fetchPlatformMetrics(
  platform: SocialPlatform,
  post: SocialPost,
  token: string
) {
  if (platform === 'instagram') {
    return fetchInstagramMetrics(post.id, token)
  }
  if (platform === 'x') {
    return fetchTwitterMetrics(post.id, token)
  }
  // ... implement for other platforms
}
```

---

## Environment Variables Required

Add to `.env.local`:

```env
# OAuth Credentials
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret

FACEBOOK_CLIENT_ID=your_client_id
FACEBOOK_CLIENT_SECRET=your_client_secret

TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret

LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

TIKTOK_CLIENT_ID=your_client_id
TIKTOK_CLIENT_SECRET=your_client_secret

YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# Redis for job queue
REDIS_HOST=localhost
REDIS_PORT=6379

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Next: Step 2 - OAuth Flow Implementation

Once the database schema is in place and migrations are applied, the next step is to implement:

1. OAuth configuration and flow handlers
2. API routes for connecting accounts
3. Token refresh and storage
4. Error handling and token expiration management

This will be followed by post scheduling, platform-specific publishing, and analytics collection.

---

## Testing Checklist

- [ ] Database migrations applied successfully
- [ ] Prisma models generated correctly
- [ ] OAuth flow connects account and stores tokens
- [ ] Scheduled posts are created in database
- [ ] Posts publish successfully to each platform
- [ ] Analytics are collected after publishing
- [ ] Token refresh works when expired
- [ ] Error handling for failed publishes
- [ ] RLS policies prevent unauthorized access
- [ ] Rate limiting works correctly
