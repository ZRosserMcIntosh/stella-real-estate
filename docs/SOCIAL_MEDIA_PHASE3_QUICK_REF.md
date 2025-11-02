# Phase 3: Post Scheduling - Quick Reference

**Status: ✅ COMPLETE**  
**Files Created: 8 files | Lines of Code: 1500+**

---

## 📦 What You Got

### Libraries (3 files)
1. **src/lib/social/posts.ts** (400+ lines)
   - Create, read, update, delete posts
   - Handle drafts and scheduling
   - Track post status
   - Approval workflows

2. **src/lib/social/queue.ts** (400+ lines)
   - Bull Redis job queue setup
   - Job management functions
   - Retry logic and error handling
   - Queue monitoring

3. **src/lib/social/scheduler.ts** (400+ lines)
   - Periodic post checking
   - Timezone conversion
   - Auto-queue scheduled posts
   - Job retry on failure

### API Endpoints (5 files)
1. **api/social/posts/create.ts** - POST create new post
2. **api/social/posts/update.ts** - PATCH/PUT edit post
3. **api/social/posts/delete.ts** - DELETE remove post
4. **api/social/posts/list.ts** - GET fetch posts
5. **api/social/posts/schedule.ts** - POST queue for publishing

### Documentation
- **docs/SOCIAL_MEDIA_PHASE3_COMPLETE.md** - 2000+ lines comprehensive guide
- **docs/SOCIAL_MEDIA_PHASE3_QUICK_REF.md** - This file

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install bull redis ioredis
```

### 2. Set Environment
```env
REDIS_URL=redis://localhost:6379
```

### 3. Start Redis
```bash
# With Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or locally
redis-server
```

### 4. Start Scheduler
```typescript
import { startScheduler } from 'src/lib/social/scheduler'

// On app startup
startScheduler()

// Scheduler now checks every 60 seconds for posts to publish
```

---

## 🎯 Core Functions

### Create a Post
```typescript
import { createPost } from 'src/lib/social/posts'

const post = await createPost({
  content: 'Hello world!',
  platforms: ['instagram', 'facebook'],
  mediaUrls: ['url1', 'url2'],
  scheduledAt: new Date('2025-11-02T14:00:00'),
  timezone: 'America/New_York',
  ownerId: 'user-123',
  createdBy: 'user-123',
})
```

### Get Posts
```typescript
import { getPostsByUser, getScheduledPosts } from 'src/lib/social/posts'

// All posts for user
const posts = await getPostsByUser('user-123')

// Posts ready to publish
const scheduled = await getScheduledPosts()
```

### Update Post
```typescript
import { updatePost } from 'src/lib/social/posts'

await updatePost('post-123', {
  content: 'Updated text',
  platforms: ['instagram'],
})
```

### Delete Post
```typescript
import { deletePost } from 'src/lib/social/posts'

await deletePost('post-123')
```

### Add to Queue
```typescript
import { addPublishJob } from 'src/lib/social/queue'

const job = await addPublishJob(post)
console.log(`Added job: ${job.id}`)
```

### Check Queue Status
```typescript
import { getPublishJobStatus, getQueueStats } from 'src/lib/social/queue'

const job = await getPublishJobStatus('job-123')
const stats = await getQueueStats()
```

### Get Scheduler Stats
```typescript
import { getSchedulerStats } from 'src/lib/social/scheduler'

const stats = await getSchedulerStats()
// { isRunning, scheduledPostsCount, queuedPostsCount, ... }
```

---

## 🌐 API Examples

### Create Post via API
```bash
curl -X POST http://localhost:5173/api/social/posts/create \
  -H "x-user-id: user-123" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "New listing!",
    "platforms": ["instagram", "facebook"],
    "scheduledAt": "2025-11-02T14:00:00Z",
    "timezone": "America/New_York"
  }'
```

### List Posts via API
```bash
curl http://localhost:5173/api/social/posts/list?status=scheduled \
  -H "x-user-id: user-123"
```

### Schedule Post via API
```bash
curl -X POST http://localhost:5173/api/social/posts/schedule \
  -H "x-user-id: user-123" \
  -H "Content-Type: application/json" \
  -d '{"postId": "post-123"}'
```

---

## 📊 Data Flow

```
User Interface
     ↓
API Endpoint (create/update/list)
     ↓
Post Library (CRUD operations)
     ↓
PostgreSQL Database
     
     + 
     
Scheduler (runs every 60 seconds)
     ↓
Check: "Is it time to publish?"
     ↓
Add to Queue (Bull)
     ↓
Job Queue executes at scheduled time
     ↓
Post publishes to platforms
```

---

## 🔍 Status Tracking

Post status flow:
```
draft → scheduled → queued → published ✓

If error:
... → failed → (user clicks retry)
        ↓
     scheduled → (try again)
        ↓
     published ✓
```

---

## 📝 Job States

Queue job states:
```
waiting   - Waiting for scheduled time
active    - Currently publishing
completed - Successfully published
failed    - Failed to publish (will retry)
```

---

## ⏰ Timezone Support

```typescript
// Automatically respects user's timezone
const post = await createPost({
  scheduledAt: new Date('2025-11-02T14:00:00'),
  timezone: 'America/New_York',
  // ... Scheduler will convert to UTC, then publish when UTC time matches
})
```

---

## 🔧 Configuration

### Queue Configuration
```typescript
// In src/lib/social/queue.ts

QUEUE_NAME = 'social-media-publishing'
REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

// Job retry settings
attempts: 3          // Try 3 times
backoff: 'exponential'  // Wait longer between retries
delay: <calculated>  // Based on scheduledAt
```

### Scheduler Configuration
```typescript
// In src/lib/social/scheduler.ts

CHECK_INTERVAL = 60000     // Check every 60 seconds
BATCH_SIZE = 50            // Process 50 posts per check
TIME_BUFFER = 5            // Publish within 5 seconds of scheduled time
```

---

## 🚨 Troubleshooting Quick Tips

| Problem | Solution |
|---------|----------|
| "Cannot find module bull" | `npm install bull redis` |
| "Redis connection refused" | Start Redis: `redis-server` or `docker run -d -p 6379:6379 redis` |
| Posts not publishing | Check scheduler running: `isSchedulerRunning()` |
| Job timeout | Increase `lockDuration` in queue config |
| High memory | Run `clearFailedJobs()` to clean up |
| Timezone issues | Verify `post.timezone` is IANA format |

---

## 📚 File Reference

| File | Purpose | Lines |
|------|---------|-------|
| src/lib/social/posts.ts | Database operations | 400+ |
| src/lib/social/queue.ts | Job queue management | 400+ |
| src/lib/social/scheduler.ts | Scheduling logic | 400+ |
| api/social/posts/create.ts | Create post endpoint | 120 |
| api/social/posts/update.ts | Update post endpoint | 80 |
| api/social/posts/delete.ts | Delete post endpoint | 80 |
| api/social/posts/list.ts | List posts endpoint | 80 |
| api/social/posts/schedule.ts | Schedule endpoint | 100 |

**Total: 1500+ lines of code**

---

## 🧪 Testing Checklist

```
□ Create a draft post
□ Update post content
□ Schedule post for near future
□ Watch scheduler pick it up
□ Verify post queued automatically
□ Wait and see it publish
□ Retry a failed post
□ Cancel a scheduled post
□ Test timezone conversion
□ Verify Redis connection
□ Monitor queue stats
```

---

## 🎓 Key Concepts

### Jobs
- Unit of work in the queue
- Each post = one job
- Jobs have status: waiting → active → completed/failed
- Failed jobs retry automatically

### Scheduler
- Runs every 60 seconds
- Finds posts where `scheduledAt == now`
- Adds them to the job queue
- Runs in background automatically

### Queue (Bull)
- Redis-backed job queue
- Stores jobs persistently
- Processes jobs at scheduled time
- Handles retries and failures

### Timezone
- User selects timezone (e.g., "America/New_York")
- Post scheduled for local time
- Scheduler converts to UTC
- Job executes when UTC matches

---

## 📞 Need More Help?

See full documentation:
```
docs/SOCIAL_MEDIA_PHASE3_COMPLETE.md
```

This file has:
- 2000+ lines of detailed explanations
- Architecture diagrams
- Code examples
- Database schema
- Troubleshooting guide
- Performance tips
- Testing guide

---

## 🚀 Next Phase

After Phase 3 (Scheduling), comes:

### Phase 4: Platform Publishing
- Actually publish to Instagram, Facebook, X, etc.
- Handle media uploads
- Track platform response codes
- Update post status based on platform feedback

---

**Phase 3: ✅ COMPLETE**  
**Ready for Phase 4? Say "Proceed with phase 4"**
