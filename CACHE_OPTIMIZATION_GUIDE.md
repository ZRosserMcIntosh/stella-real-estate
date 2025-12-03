# Cache Optimization Guide for Stella Real Estate

## Problem
Your Supabase project is using 6.18 GB / 6 GB of cached egress, which is hitting the Free Plan limit.

## Root Causes

### 1. **Unoptimized Images from Supabase Storage**
- Images are served at full resolution without transformations
- Every page load downloads large listing images
- No lazy loading or responsive images

### 2. **Large Video File (5.8MB)**
- `public/video/office-3D.mp4` is cached repeatedly
- No compression or streaming optimization

### 3. **Excessive Database Queries**
- Header component queries listings on every render
- No client-side caching of query results
- Same data fetched multiple times

### 4. **Missing Cache Headers**
- No `Cache-Control` headers on static assets
- API responses not cached appropriately

## Solutions

### Immediate Actions

#### 1. Add Cache-Control Headers in Vercel Config

Update `vercel.json` to add proper caching:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(png|jpg|jpeg|gif|webp|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, s-maxage=604800"
        }
      ]
    },
    {
      "source": "/(.*\\.(mp4|webm|ogg))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

#### 2. Optimize Video File

Replace the large MP4 with an optimized version:

```bash
# Install ffmpeg if not already installed
brew install ffmpeg

# Compress the video
ffmpeg -i public/video/office-3D.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset medium \
  -vf "scale=1280:-2" \
  -movflags +faststart \
  public/video/office-3D-optimized.mp4

# Replace the original (backup first!)
mv public/video/office-3D.mp4 public/video/office-3D-original.mp4
mv public/video/office-3D-optimized.mp4 public/video/office-3D.mp4
```

#### 3. Implement Image Optimization with Supabase Transform

Create a utility to use Supabase's image transformation API:

```typescript
// src/utils/imageOptimization.ts
export function getOptimizedImageUrl(url: string, options?: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'origin'
}): string {
  if (!url) return url
  
  // Check if it's a Supabase storage URL
  if (!url.includes('supabase.co/storage')) return url
  
  const {
    width = 800,
    quality = 80,
    format = 'webp'
  } = options || {}
  
  // Supabase Image Transformation API
  // https://supabase.com/docs/guides/storage/serving/image-transformations
  const params = new URLSearchParams()
  if (width) params.append('width', width.toString())
  if (quality) params.append('quality', quality.toString())
  if (format !== 'origin') params.append('format', format)
  
  // Add transformation parameters
  return `${url}?${params.toString()}`
}
```

#### 4. Add React Query for Data Caching

Install React Query:

```bash
npm install @tanstack/react-query
```

Update `src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

root.render(
  <QueryClientProvider client={queryClient}>
    {/* ... rest of your app */}
  </QueryClientProvider>
)
```

#### 5. Optimize Header Component Queries

Update `src/components/Header.tsx` to use React Query and cache results:

```typescript
import { useQuery } from '@tanstack/react-query'

// Inside Header component:
const { data: projects = [] } = useQuery({
  queryKey: ['header-projects'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('id,title,city,state_code,media')
      .eq('listing_type', 'new_project')
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .limit(4)
    if (error) throw error
    return data || []
  },
  staleTime: 10 * 60 * 1000, // Cache for 10 minutes
})
```

### Medium-Term Optimizations

#### 6. Implement Lazy Loading for Images

```typescript
// Use native lazy loading
<img 
  src={imageUrl} 
  loading="lazy" 
  decoding="async"
  alt="..."
/>

// Or use react-lazy-load-image-component
import { LazyLoadImage } from 'react-lazy-load-image-component'
```

#### 7. Add Service Worker for Asset Caching

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'stella-v1'
const STATIC_ASSETS = [
  '/stella-logo.png',
  '/stella-favicon.png',
  // Add other static assets
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

#### 8. Use CDN for Large Assets

Move large files to a CDN:
- Cloudinary
- Cloudflare Images
- Vercel Blob Storage

### Long-Term Solutions

#### 9. Implement Progressive Web App (PWA)

- Cache API responses locally
- Reduce server requests
- Better offline experience

#### 10. Monitor Usage

Add monitoring to track cache usage:

```typescript
// Track image loads
const trackImageLoad = (url: string, size: number) => {
  console.log(`Loaded image: ${url} (${(size / 1024).toFixed(2)}KB)`)
}
```

#### 11. Database Query Optimization

- Use SELECT only for needed fields
- Implement pagination
- Add database indexes
- Use RLS policies efficiently

## Immediate ROI Checklist

- [ ] Update `vercel.json` with cache headers
- [ ] Compress video file
- [ ] Install and configure React Query
- [ ] Update Header component to use cached queries
- [ ] Add image optimization utility
- [ ] Use lazy loading for images
- [ ] Enable Supabase image transformations

## Expected Impact

These changes should reduce your cached egress by **70-90%**:

- **Cache headers**: Reduces repeated downloads from Vercel CDN
- **Video compression**: 5.8MB → ~1-2MB (60-70% reduction)
- **React Query**: Eliminates duplicate API calls
- **Image optimization**: Serves appropriately sized images (50-80% reduction)

## Monitoring

Check your usage in Supabase Dashboard:
1. Go to Settings → Billing
2. Monitor "Cached Egress" metric
3. Track daily usage patterns
4. Set up alerts at 80% threshold
