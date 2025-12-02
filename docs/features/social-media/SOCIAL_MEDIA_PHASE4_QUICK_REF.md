# Social Media Publishing - Phase 4 Quick Reference

## File Structure

```
src/lib/social/
├── publishers.ts          ← Platform-specific publishers
├── mediaHandler.ts        ← Media processing & validation
└── publishing.ts          ← Publishing orchestrator

api/social/
├── publish.ts             ← POST /api/social/publish
└── publish-status.ts      ← GET /api/social/publish-status
```

## Quick Start

### 1. Publish a Post

```typescript
import { publishToSocialMedia } from '@/lib/social/publishing'

const result = await publishToSocialMedia(
  'post_123',        // Post ID
  'user_456',        // User ID
  ['instagram', 'facebook']  // Platforms
)

console.log(`Success: ${result.successCount}/${result.totalPlatforms}`)
```

### 2. Check Status

```typescript
import { publishingOrchestrator } from '@/lib/social/publishing'

const stats = publishingOrchestrator.getStats()
console.log(`Published: ${stats.successfulJobs}`)
console.log(`Failed: ${stats.failedJobs}`)
```

### 3. Retry Failed

```typescript
import { retryPublishing } from '@/lib/social/publishing'

await retryPublishing('post_123', 'user_456', ['facebook'])
```

## API Endpoints

### POST /api/social/publish

Publish post to platforms.

**Request:**
```bash
curl -X POST /api/social/publish \
  -H "x-user-id: user_123" \
  -H "Content-Type: application/json" \
  -d '{"postId":"post_456","platforms":["instagram","facebook"]}'
```

**Response:**
```json
{
  "success": true,
  "jobId": "job_1234567890_abc",
  "successCount": 2,
  "failureCount": 0,
  "results": [...]
}
```

### GET /api/social/publish-status

Get publishing statistics.

**Requests:**
```bash
# Overall stats
curl '/api/social/publish-status?stats=true'

# Platform stats
curl '/api/social/publish-status?platform=instagram'

# General status
curl '/api/social/publish-status'
```

## Main Classes

### PublishingOrchestrator

```typescript
import { publishingOrchestrator } from '@/lib/social/publishing'

// Publish
const result = await publishingOrchestrator.publishPost(
  postId, userId, ['instagram', 'facebook']
)

// Retry
await publishingOrchestrator.retryPublishing(postId, userId)

// Stats
const stats = publishingOrchestrator.getStats()
const igStats = orchestrator.getPlatformStats('instagram')
```

### Publisher (Base Class)

```typescript
import { createPublisher } from '@/lib/social/publishers'

const publisher = createPublisher('instagram', {
  accessToken: 'token_123',
  accountId: 'account_456'
})

// Check connection
const ok = await publisher.checkConnection()

// Get account info
const account = await publisher.getAccountInfo()

// Publish
const result = await publisher.publish('Caption text', [
  { url: 'https://...jpg', type: 'image' }
])
```

### MediaHandler

```typescript
import { MediaHandler, validateMediaForPlatform } from '@/lib/social/mediaHandler'

const handler = new MediaHandler('instagram')

// Validate
await handler.validateMedia(file, 'image')

// Get requirements
handler.getMaxFileSize('image')           // MB
handler.getRecommendedDimensions()        // { width, height }
handler.getSupportedFormats()             // ['jpg', 'png', 'mp4', ...]

// Process
const mediaId = await handler.processMedia(url, 'image', token)

// Tips
getMediaTips('instagram')
```

## Platforms

### Fully Implemented

- **Instagram** - Feed posts, carousels
- **Facebook** - Page posts, photos, videos
- **X/Twitter** - Tweets, threads
- **LinkedIn** - Professional posts
- **Instagram** - (alias for X)

### Stub (Ready for Implementation)

- **TikTok** - Video posts
- **YouTube** - Video uploads
- **Threads** - Text posts
- **Pinterest** - Pins
- **Bluesky** - Posts
- **Mastodon** - Toots
- **Google Business** - Business posts

## Common Patterns

### Validate Before Publishing

```typescript
import { validateMediaForPlatform } from '@/lib/social/mediaHandler'

const file = event.target.files[0]
const validation = await validateMediaForPlatform(
  'instagram', file, 'image'
)

if (!validation.valid) {
  console.error(validation.error)
  return
}

// Safe to publish
```

### Handle Partial Failure

```typescript
const result = await publishToSocialMedia(postId, userId, platforms)

if (!result.overallSuccess) {
  const failed = result.results
    .filter(r => !r.success)
    .map(r => r.platform)

  console.log(`Failed on: ${failed.join(', ')}`)

  // Retry failed platforms
  await retryPublishing(postId, userId, failed)
}
```

### Get Platform Stats

```typescript
const igStats = publishingOrchestrator.getPlatformStats('instagram')

console.log(`Attempts: ${igStats.attempts}`)
console.log(`Success rate: ${(igStats.successes/igStats.attempts*100).toFixed(1)}%`)
console.log(`Last attempt: ${igStats.lastAttempt}`)
```

### Custom Error Handling

```typescript
try {
  const result = await publishToSocialMedia(postId, userId, platforms)

  result.results.forEach(r => {
    if (!r.success) {
      // Platform-specific error handling
      if (r.error.includes('Token')) {
        // Re-authenticate
      } else if (r.error.includes('too large')) {
        // Reduce media size
      }
    }
  })
} catch (error) {
  console.error('Publishing failed:', error.message)
}
```

## Platform Requirements

### Image Specs

| Platform | Max Size | Max Dimensions | Formats |
|----------|----------|-----------------|---------|
| Instagram | 8MB | 1080×1350 | JPG, PNG, MP4, MOV |
| Facebook | 10MB | 1200×1200 | JPG, PNG, GIF, MP4 |
| X | 15MB | 1200×675 | JPG, PNG, GIF, MP4 |
| LinkedIn | 20MB | 1200×627 | JPG, PNG, MP4, MOV |
| TikTok | 288MB | 1080×1920 | MP4, MOV, AVI, JPG |
| YouTube | 256GB | 1920×1080 | MP4, MOV, AVI, FLV |
| Threads | 8MB | 1080×1350 | JPG, PNG, MP4 |
| Pinterest | 25MB | 1500×2000 | JPG, PNG, GIF, WEBP |

### Video Specs

| Platform | Max Duration | Max Size |
|----------|--------------|----------|
| Instagram | 60s | 100MB |
| Facebook | 240s | 4GB |
| X | 140s | 512MB |
| LinkedIn | 600s | 5GB |
| TikTok | 600s | 288MB |
| YouTube | ∞ | 256GB |
| Google Business | 30s | 100MB |

## Debugging

### Log Publishing Results

```typescript
const result = await publishToSocialMedia(postId, userId, platforms)

result.results.forEach(r => {
  console.log(`[${r.platform}]`, {
    success: r.success,
    url: r.url,
    error: r.error,
    timestamp: r.timestamp
  })
})
```

### Check Platform Connection

```typescript
import { createPublisher } from '@/lib/social/publishers'

const publisher = createPublisher('instagram', {
  accessToken: token,
  accountId: accountId
})

const connected = await publisher.checkConnection()
const account = await publisher.getAccountInfo()

console.log('Connected:', connected)
console.log('Account:', account)
```

### Get Media Requirements

```typescript
import { getAllMediaRequirements, getMediaTips } from '@/lib/social/mediaHandler'

const requirements = getAllMediaRequirements()
console.log(requirements.instagram)

const tips = getMediaTips('instagram')
tips.forEach(tip => console.log('- ' + tip))
```

## Response Types

### PublishResult

```typescript
{
  platform: string      // 'instagram'
  success: boolean      // true/false
  postId?: string       // Platform post ID
  url?: string          // Link to post
  message: string       // Status message
  error?: string        // Error if failed
  timestamp: Date       // When published
  mediaIds?: string[]   // Uploaded media IDs
}
```

### PublishingJobResult

```typescript
{
  jobId: string                    // Unique job ID
  postId: string                   // Post ID
  results: PublishResult[]          // Per-platform results
  overallSuccess: boolean           // All succeeded?
  totalPlatforms: number            // Total platforms
  successCount: number              // Succeeded count
  failureCount: number              // Failed count
  completedAt: Date                 // Completion time
}
```

### PublishingStats

```typescript
{
  totalJobs: number                // Total jobs run
  successfulJobs: number           // All platforms worked
  failedJobs: number               // All platforms failed
  partialSuccessJobs: number       // Some worked
  lastJobTime?: Date               // Last job timestamp
  platformStats: {                 // Per-platform stats
    [platform]: {
      attempts: number
      successes: number
      failures: number
      lastAttempt?: Date
    }
  }
}
```

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot connect to platform" | Token expired or invalid | Re-authenticate |
| "File too large" | Media exceeds limit | Reduce file size |
| "Invalid format" | Format not supported | Convert to supported format |
| "Token expired" | OAuth token invalid | Re-authenticate via /oauth/connect |
| "Post not found" | Invalid post ID | Verify post ID exists |
| "No connected accounts" | No OAuth connections for platform | Connect account via /oauth/connect |
| "Platform not supported" | Invalid platform name | Use valid platform name |

## Testing

### Unit Test Example

```typescript
describe('MediaHandler', () => {
  it('should validate Instagram image', async () => {
    const handler = new MediaHandler('instagram')
    const file = new File(['content'], 'test.jpg')
    
    await expect(handler.validateMedia(file, 'image'))
      .resolves.not.toThrow()
  })
})
```

### Integration Test Example

```typescript
describe('PublishingOrchestrator', () => {
  it('should publish to multiple platforms', async () => {
    const result = await publishingOrchestrator.publishPost(
      'test_post', 'test_user', ['instagram', 'facebook']
    )
    
    expect(result.results).toHaveLength(2)
    expect(result.totalPlatforms).toBe(2)
  })
})
```

## See Also

- [Full Documentation](./SOCIAL_MEDIA_PHASE4_COMPLETE.md)
- [Phase 3 (Scheduling)](./SOCIAL_MEDIA_PHASE3_COMPLETE.md)
- [Phase 2 (OAuth)](./SOCIAL_MEDIA_PHASE2_COMPLETE.md) (docs may be in root)
- [Phase 1 (Database)](./prisma.md)
