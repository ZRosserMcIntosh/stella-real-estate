# Social Media Integration - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                             │
│                    /admin/social-media routes                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ - SocialMedia.tsx: Main component                            │   │
│  │ - Publishing tab: Create/schedule posts                      │   │
│  │ - Analytics tab: View engagement metrics                     │   │
│  │ - Engage tab: Comments/DMs inbox                             │   │
│  │ - Library tab: Content templates                             │   │
│  │ - Pricing tab: Billing management                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         Backend (Node.js)                            │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ API Routes                                                   │   │
│  │ ├─ POST /api/social/oauth/connect - Start OAuth flow        │   │
│  │ ├─ GET  /api/social/oauth/callback - Handle redirect        │   │
│  │ ├─ POST /api/social/posts/schedule - Save scheduled post    │   │
│  │ ├─ POST /api/social/posts/publish - Publish immediately    │   │
│  │ ├─ DELETE /api/social/posts/:id - Delete/cancel post        │   │
│  │ ├─ GET  /api/social/posts - List user's posts              │   │
│  │ ├─ GET  /api/social/analytics - Fetch metrics               │   │
│  │ └─ POST /api/social/disconnect - Remove connection          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
         ┌───────────────────────┬───────────────────────┐
         ↓                       ↓                       ↓
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │  Supabase   │      │   Redis     │      │   External  │
    │  Database   │      │   Cache/    │      │   APIs      │
    │             │      │   Queue     │      │             │
    │ ┌─────────┐ │      │             │      │ ┌─────────┐ │
    │ │Socials  │ │      │ ┌─────────┐ │      │ │Instagram│ │
    │ │Posts    │ │      │ │Job Queue│ │      │ │Facebook │ │
    │ │Conns    │ │      │ │Publish  │ │      │ │LinkedIn │ │
    │ │Tokens   │ │      │ │Schedule │ │      │ │Twitter  │ │
    │ │Analytics│ │      │ └─────────┘ │      │ │TikTok   │ │
    │ └─────────┘ │      │             │      │ │YouTube  │ │
    │ (RLS, Auth) │      │ (Bull)      │      │ │etc.     │ │
    └─────────────┘      └─────────────┘      └─────────────┘
         ↑                       ↑                       
         └───────────────────────┴───────────────────────
```

---

## OAuth Flow Diagram

```
┌──────────────┐                  ┌──────────────┐
│   Frontend   │                  │   Backend    │
│ (React App)  │                  │  (Node API)  │
└──────┬───────┘                  └──────┬───────┘
       │                                 │
       │ User clicks "Connect Instagram" │
       ├────────────────────────────────→│
       │                                 │ 1. Generate state token
       │                                 │ 2. Create auth URL
       │                                 │
       │← ─ ─ ─ ─ Auth URL ─ ─ ─ ─ ─ ──│
       │                                 │
       │ Redirect to Instagram auth      │
       ├─────────────────────────────────→ Instagram
       │                                  │
       │                                  │ User grants permission
       │                                  │
       │← ─ ─ Redirect with code & state ─┤
       │                                  │
       │ Redirect backend callback        │
       ├────────────────────────────────→│
       │                                 │ 3. Verify state token
       │                                 │ 4. Exchange code for token
       │                                 │ 5. Fetch user profile
       │                                 │ 6. Store connection
       │                                 │ 7. Encrypt & store token
       │                                 │
       │← ─ ─ ─ Success/Error ─ ─ ─ ─ ─│
       │                                 │
```

---

## Post Publishing Flow

```
┌─────────────────────────────────────────────────────────┐
│ User creates post with scheduling in UI                 │
└──────────────────────┬──────────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ POST /api/social/posts       │
        │ {                            │
        │   content: "...",            │
        │   platforms: ['insta', ...], │
        │   scheduledAt: ISO string,   │
        │   mediaUrls: [...]           │
        │ }                            │
        └──────────────────┬───────────┘
                           ↓
        ┌──────────────────────────────┐
        │ Validate user connected to   │
        │ all requested platforms      │
        └──────────────────┬───────────┘
                           ↓
        ┌──────────────────────────────┐
        │ Create SocialPost in DB      │
        │ Status: 'draft' or           │
        │ 'scheduled'                  │
        └──────────────────┬───────────┘
                           ↓
        ┌──────────────────────────────┐
        │ Queue job for publishing     │
        │ (if scheduledAt)             │
        └──────────────────┬───────────┘
                           ↓
    ┌──────────────────────────────────────────────────────┐
    │ When scheduled time arrives:                        │
    │                                                     │
    │ 1. Bull/Agenda picks up job                         │
    │ 2. Fetch post from DB                              │
    │ 3. Update status to 'queued'                        │
    │ 4. For each platform:                              │
    │    a. Get OAuth token                              │
    │    b. Call platform publish API                    │
    │    c. Save platform post ID                        │
    │ 5. Update status to 'published'                    │
    │ 6. Save posted_at timestamp                        │
    └──────────────────┬───────────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ If publish fails:            │
        │ 1. Update status to 'failed' │
        │ 2. Save error reason         │
        │ 3. Retry with exponential    │
        │    backoff (configurable)    │
        └──────────────────────────────┘
```

---

## Analytics Collection Flow

```
┌─────────────────────────────────────┐
│ Scheduled Analytics Job Runs        │
│ (Every 1-6 hours)                   │
└──────────────────┬──────────────────┘
                   ↓
    ┌──────────────────────────────────┐
    │ Find all published posts from     │
    │ last 24 hours                    │
    └──────────────────┬───────────────┘
                       ↓
    ┌──────────────────────────────────┐
    │ For each post, for each platform:│
    │                                  │
    │ 1. Get OAuth token              │
    │ 2. Call platform analytics API  │
    │    - Impressions               │
    │    - Engagement                │
    │    - Likes, comments, shares   │
    │ 3. Upsert SocialAnalytic record │
    │ 4. Update fetchedAt timestamp   │
    └──────────────────┬───────────────┘
                       ↓
    ┌──────────────────────────────────┐
    │ Store metrics in DB              │
    │ (indexed by post + platform)     │
    └──────────────────┬───────────────┘
                       ↓
    ┌──────────────────────────────────┐
    │ Frontend dashboard queries DB    │
    │ and displays real-time metrics   │
    └──────────────────────────────────┘
```

---

## Database Relationships

```
                                 ┌────────────────────────────┐
                                 │   auth.users (Supabase)    │
                                 │   (user_id UUID)           │
                                 └────────────────┬───────────┘
                                                  │
                                 ┌────────────────▼───────────┐
                                 │  social_connections       │
                                 ├────────────────────────────┤
                                 │ id (PK)                    │
                                 │ user_id (FK to auth.users) │
                                 │ provider (platform type)   │
                                 │ status                     │
                                 │ auth_metadata (OAuth info) │
                                 └────────────────┬───────────┘
                                                  │
                                 ┌────────────────▼───────────────┐
                                 │  social_account_tokens         │
                                 ├────────────────────────────────┤
                                 │ id (PK)                        │
                                 │ connection_id (FK)             │
                                 │ access_token (encrypted)       │
                                 │ refresh_token (encrypted)      │
                                 │ token_expires_at               │
                                 │ account_handle                 │
                                 │ platform_account_id            │
                                 └────────────────────────────────┘
                                 
                                 ┌────────────────────────────┐
                                 │     social_posts           │
                                 ├────────────────────────────┤
                                 │ id (PK)                    │
                                 │ content (TEXT)             │
                                 │ platforms (TEXT[] array)   │
                                 │ status (state machine)     │
                                 │ scheduled_at               │
                                 │ posted_at                  │
                                 │ media_urls (TEXT[] array)  │
                                 │ created_by (FK to users)   │
                                 └────────────────┬───────────┘
                                                  │
                                 ┌────────────────▼───────────┐
                                 │   social_analytics         │
                                 ├────────────────────────────┤
                                 │ id (PK)                    │
                                 │ post_id (FK)               │
                                 │ platform                   │
                                 │ impressions                │
                                 │ engagement                 │
                                 │ likes, comments, shares    │
                                 │ fetched_at                 │
                                 └────────────────────────────┘
```

---

## API Request/Response Examples

### 1. Connect Account

**Request:**
```http
GET /api/social/oauth/connect?platform=instagram&userId=user-uuid
```

**Response:**
```json
{
  "url": "https://api.instagram.com/oauth/authorize?client_id=xxx&state=yyy&..."
}
```

User is redirected to this URL.

---

### 2. Create & Schedule Post

**Request:**
```http
POST /api/social/posts

{
  "content": "Check out our new luxury listings in Miami! 🌴 #realestate",
  "platforms": ["instagram", "facebook"],
  "mediaUrls": [
    "https://bucket.supabase.co/image1.jpg",
    "https://bucket.supabase.co/image2.jpg"
  ],
  "scheduledAt": "2025-11-05T09:00:00Z",
  "timezone": "America/New_York",
  "campaign": "November Listings"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Check out our new luxury listings in Miami! 🌴 #realestate",
  "platforms": ["instagram", "facebook"],
  "status": "scheduled",
  "scheduledAt": "2025-11-05T09:00:00Z",
  "timezone": "America/New_York",
  "createdAt": "2025-11-02T10:30:45Z",
  "createdBy": "user-uuid"
}
```

---

### 3. Get Analytics

**Request:**
```http
GET /api/social/analytics?postId=550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000",
  "analytics": [
    {
      "platform": "instagram",
      "platformPostId": "18123456789",
      "impressions": 1250,
      "engagement": 87,
      "likes": 65,
      "comments": 15,
      "shares": 7,
      "engagementRate": 6.96,
      "fetchedAt": "2025-11-05T12:30:00Z"
    },
    {
      "platform": "facebook",
      "platformPostId": "109876543210_987654321",
      "impressions": 856,
      "engagement": 42,
      "likes": 28,
      "comments": 12,
      "shares": 2,
      "engagementRate": 4.91,
      "fetchedAt": "2025-11-05T12:30:00Z"
    }
  ],
  "totalReach": 2106,
  "totalEngagement": 129,
  "averageEngagementRate": 5.93
}
```

---

## State Machine: Post Status

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │   DRAFT     │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
   ┌────────┐       ┌──────────┐      ┌──────────┐
   │ SAVED  │       │SCHEDULED │      │PUBLISHED │
   │        │       │ (pending)│      │          │
   └────────┘       └──────┬───┘      └──────────┘
                           │
              ┌────────────┴───────────┐
              ↓                        ↓
         ┌────────┐           ┌──────────┐
         │QUEUED  │           │  FAILED  │
         └────┬───┘           └──────┬───┘
              │                      │
              └─────────┬────────────┘
                        ↓
                 ┌──────────┐
                 │PUBLISHED │
                 └──────────┘

Transitions:
draft → scheduled (with scheduledAt)
draft → published (immediate publish)
scheduled → queued (when time arrives)
queued → published (success)
queued → failed (error during publish)
failed → scheduled (retry)
scheduled → draft (cancel/edit)
```

---

## Token Lifecycle

```
1. User connects account
   ↓
2. OAuth redirect to platform
   ↓
3. Exchange code for tokens
   ↓
4. Store in social_account_tokens
   - accessToken (encrypted)
   - refreshToken (encrypted)
   - tokenExpiresAt (timestamp)
   ↓
5. Use token for API calls
   ↓
6. Check token expiration before each use
   ↓
7. If expired, refresh token
   ↓
8. Store refreshed token
   ↓
9. Retry original operation
   ↓
10. If refresh fails, update connection status to 'error'
    → Notify user to reconnect
```

---

## Error Handling & Retry Strategy

```
Publishing attempt
    ↓
Success?
├─ YES → Update status to 'published'
├─ NO
   ├─ Temporary error (rate limit, timeout)?
   │  └─ Exponential backoff retry
   │     ├─ Attempt 1: wait 2s
   │     ├─ Attempt 2: wait 4s
   │     ├─ Attempt 3: wait 8s
   │     └─ If all fail → status='failed', notify user
   │
   └─ Permanent error (invalid token, deleted post)?
      └─ status='failed'
         └─ Save error reason
         └─ Mark connection status='error'
         └─ Notify user to fix issue
```

---

## Caching Strategy

```
Reddit Queue Job (Poll every 1 min):
  └─ Find posts with scheduledAt <= now
     └─ Queue for publishing

Analytics Job (Poll every 6 hours):
  └─ Find published posts
     └─ Fetch metrics from platforms
     └─ Cache in DB
     └─ Invalidate cache when new post published

Connection Cache:
  └─ Cache valid tokens in Redis
     └─ TTL: token_expires_at - 5 min
     └─ Fallback to DB if cache miss

Post Cache:
  └─ Cache user's post list in Redis
     └─ TTL: 5 minutes
     └─ Invalidate on create/update/delete
```

---

## Deployment Checklist

- [ ] All migrations applied to Supabase
- [ ] Prisma models generated
- [ ] OAuth credentials obtained for all platforms
- [ ] Environment variables configured
- [ ] Redis instance running
- [ ] Bull/Agenda job queue configured
- [ ] Rate limiting configured
- [ ] Error monitoring set up
- [ ] Database backups configured
- [ ] API rate limiting enabled
- [ ] CORS policies configured
- [ ] RLS policies verified
- [ ] Encryption for tokens enabled
- [ ] Logging and monitoring set up
