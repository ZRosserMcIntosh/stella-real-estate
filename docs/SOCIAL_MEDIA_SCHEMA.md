# Social Media Integration Database Schema

## Overview

This document describes the database schema for the Stella Real Estate social media integration feature. The schema enables users to connect their real social media accounts, schedule posts across multiple platforms, and track analytics.

## Tables

### `social_connections`
Stores the connection status between users and social media platforms.

**Purpose**: Track which platforms a user has connected to and their current status.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `user_id` (UUID, FK): Reference to Supabase auth user
- `provider` (TEXT): Platform identifier ('instagram', 'facebook', 'linkedin', 'x', 'tiktok', 'youtube', 'threads', 'pinterest', 'bluesky', 'mastodon', 'google_business')
- `status` (TEXT): Connection status ('connected', 'pending', 'error')
- `connected_at` (TIMESTAMPTZ): When the connection was established
- `auth_metadata` (JSONB): Additional OAuth metadata (scopes, etc.)
- `updated_at` (TIMESTAMPTZ): Last update timestamp

**Constraints**:
- Unique constraint on (user_id, provider) - one connection per platform per user
- RLS policies restrict to user's own connections

---

### `social_account_tokens`
Securely stores OAuth tokens for each connected social media account.

**Purpose**: Keep track of access tokens, refresh tokens, and token expiration times.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `connection_id` (UUID, FK): Reference to social_connections
- `access_token` (TEXT): OAuth access token (encrypted at rest in production)
- `refresh_token` (TEXT): OAuth refresh token (encrypted at rest in production)
- `token_expires_at` (TIMESTAMPTZ): When the access token expires
- `account_handle` (TEXT): Social media handle (@username or similar)
- `display_name` (TEXT): User's display name on the platform
- `profile_image_url` (TEXT): URL to profile picture
- `platform_account_id` (TEXT): Platform-specific user/account ID
- `created_at` (TIMESTAMPTZ): When token was stored
- `updated_at` (TIMESTAMPTZ): When token was last refreshed

**Constraints**:
- Foreign key to social_connections with cascade delete
- RLS policies restrict to marketing/staff roles

**Notes**: 
- In production, use Supabase Vault or similar encryption for tokens
- Tokens should be refreshed proactively before expiration

---

### `social_posts`
Stores draft, scheduled, and published social media posts.

**Purpose**: Central queue for all social content with scheduling, approval workflow, and multi-platform support.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `content` (TEXT): The post text/caption
- `platforms` (TEXT[]): Array of target platforms ['instagram', 'facebook', ...]
- `status` (TEXT): Post status ('draft', 'scheduled', 'queued', 'published', 'failed')
- `scheduled_at` (TIMESTAMPTZ): When to publish (NULL = manual/immediate)
- `posted_at` (TIMESTAMPTZ): When actually published (NULL = not yet posted)
- `timezone` (TEXT): User's timezone for scheduling (default 'UTC')
- `media_urls` (TEXT[]): Array of image/video URLs
- `campaign` (TEXT): Campaign name/identifier
- `notes` (TEXT): Internal notes
- `approval_required` (BOOLEAN): Whether post needs approval
- `approval_status` (TEXT): Approval state ('pending', 'approved', 'rejected')
- `failure_reason` (TEXT): Error message if publishing failed
- `created_by` (UUID, FK): User who created the post
- `owner_id` (UUID, FK): Team member who owns the post
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last modification

**Constraints**:
- Check constraint: platforms array must be non-empty and only contain valid platforms
- Index on `scheduled_at` for efficient queue lookups
- RLS policies restrict to marketing/staff

**Status Workflow**:
```
draft → scheduled (pending publish time)
draft → published (immediate publish)
scheduled → queued (about to publish)
queued → published (successfully published)
queued → failed (error during publishing)
failed → scheduled (retry after manual intervention)
```

---

### `social_analytics`
Stores performance metrics for published posts from each platform.

**Purpose**: Track engagement, reach, and performance metrics for each post on each platform.

**Fields**:
- `id` (UUID, PK): Unique identifier
- `post_id` (UUID, FK): Reference to social_posts (NULL for account-level analytics)
- `platform` (TEXT): Platform identifier
- `platform_post_id` (TEXT): Post ID from the social platform
- `impressions` (INT): Number of people who saw the post
- `engagement` (INT): Total engagement count
- `shares` (INT): Number of shares
- `comments` (INT): Number of comments
- `likes` (INT): Number of likes/reactions
- `fetched_at` (TIMESTAMPTZ): When metrics were last fetched
- `created_at` (TIMESTAMPTZ): Record creation time
- `updated_at` (TIMESTAMPTZ): Last update time

**Constraints**:
- Foreign key to social_posts with cascade delete
- Indexes on post_id and platform for efficient querying
- RLS policies restrict to marketing/staff

**Notes**:
- Records are created/updated when pulling analytics from platform APIs
- Consider implementing incremental analytics (only tracking changes since last fetch)

---

## Key Design Patterns

### Row-Level Security (RLS)
All tables use RLS with two policies:
- **Read**: Users with `is_staff()` or `is_marketing()` role
- **Manage**: Users with `is_marketing()` role

This ensures only marketing/staff can access social media features.

### Platform Array Storage
Using PostgreSQL arrays (`TEXT[]`) for platforms list allows:
- Multi-platform publishing in a single post
- Efficient filtering with `@>` operator
- Constraint checking to ensure valid platforms

### Cascading Deletes
- Deleting a `social_connection` cascades to delete associated tokens
- Deleting a `social_post` cascades to delete associated analytics

### Timezone Support
Posts store a timezone field to support scheduling across different user timezones. The backend should convert `scheduled_at` to UTC before storage and convert back to user timezone for display.

---

## Platform Support

Currently supported platforms in the schema:
1. **Instagram** - Feed and Stories (via Meta Graph API)
2. **Facebook** - Pages and Groups (via Meta Graph API)
3. **LinkedIn** - User and Company posts
4. **X (Twitter)** - Tweets and Threads
5. **TikTok** - Video posts
6. **YouTube** - Video uploads
7. **Threads** - User posts
8. **Pinterest** - Pins
9. **Bluesky** - Posts
10. **Mastodon** - Toots (federated)
11. **Google Business** - Business profile posts

---

## Future Enhancements

### 1. Rate Limiting
Add fields to track API usage per platform:
```sql
ALTER TABLE social_connections ADD COLUMN (
  api_calls_used INT DEFAULT 0,
  api_calls_reset_at TIMESTAMPTZ,
  rate_limit_tier TEXT DEFAULT 'free'
);
```

### 2. Content Library
For reusable content/templates:
```sql
CREATE TABLE social_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  media_urls TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. Engagement Tracking
For comments/DMs inbox:
```sql
CREATE TABLE social_interactions (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id),
  platform TEXT,
  interaction_type TEXT, -- 'comment', 'dm', 'mention', 'share'
  author_handle TEXT,
  content TEXT,
  engagement_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. Hashtag Management
For tracking and reusing hashtags:
```sql
CREATE TABLE social_hashtags (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  hashtag TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5. Approval Workflow
Track approval history:
```sql
CREATE TABLE post_approvals (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id),
  approved_by UUID REFERENCES auth.users(id),
  approval_comment TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Migration History

- **20251019121500** - Create social_posts table
- **20251019123000** - Create social_connections table  
- **20251102120000** - Create social_analytics table
- **20251102120100** - Create social_account_tokens table

---

## Prisma Client Usage

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a social connection
const connection = await prisma.socialConnection.create({
  data: {
    userId: 'user-uuid',
    provider: 'instagram',
    status: 'connected'
  }
})

// Store OAuth tokens
const tokens = await prisma.socialAccountToken.create({
  data: {
    connectionId: connection.id,
    accessToken: '...',
    refreshToken: '...',
    accountHandle: '@username'
  }
})

// Schedule a post
const post = await prisma.socialPost.create({
  data: {
    content: 'Check out our new listing!',
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    scheduledAt: new Date('2025-11-03T15:00:00Z'),
    createdBy: 'user-uuid'
  }
})

// Fetch scheduled posts for publishing
const toPublish = await prisma.socialPost.findMany({
  where: {
    status: 'scheduled',
    scheduledAt: {
      lte: new Date() // Published in the past
    }
  }
})

// Store analytics
const analytics = await prisma.socialAnalytic.create({
  data: {
    postId: post.id,
    platform: 'instagram',
    platformPostId: 'insta-post-id',
    impressions: 1500,
    likes: 45,
    comments: 12,
    shares: 3
  }
})
```

---

## Security Considerations

### Token Storage
- OAuth tokens should be encrypted at rest (use Supabase Vault)
- Never log or expose tokens in error messages
- Implement token rotation/refresh before expiration
- Use secure environment variables for API keys

### RLS Policies
- All tables enforce RLS to prevent unauthorized access
- Only marketing team members can manage posts
- User isolation is enforced at the database level

### Rate Limiting
- Implement API rate limiting to prevent abuse
- Consider platform-specific rate limits per connection
- Queue failed posts for retry with exponential backoff

### Data Privacy
- Store minimal personal data (handle, display name only)
- Don't store sensitive platform data unnecessarily
- Implement audit logging for post scheduling/publishing
