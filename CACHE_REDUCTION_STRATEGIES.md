# Emergency Cache Reduction Measures

## Immediate Actions (If Over Limit)

### 1. Check Current Billing Cycle
First, find out when your billing cycle resets:
1. Go to Supabase Dashboard → Settings → Billing
2. Look for "Current billing period" dates
3. If it resets soon (next few days), wait it out
4. If it's mid-cycle, take action below

---

## 🚨 Option 1: Reduce Database Queries (Immediate Effect)

The optimizations we deployed will help, but here's more:

### A. Increase React Query Cache Times

Update `src/main.tsx` to cache even longer:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000,  // 30 minutes (was 5)
      gcTime: 60 * 60 * 1000,     // 1 hour (was 10 min)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### B. Add Browser Storage Cache

For listings data, cache in localStorage:

```typescript
// src/utils/storageCache.ts
const CACHE_VERSION = 'v1'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_VERSION}_${key}`)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(`${CACHE_VERSION}_${key}`)
      return null
    }
    
    return data as T
  } catch {
    return null
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`${CACHE_VERSION}_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.warn('Failed to cache data:', error)
  }
}
```

---

## 🎯 Option 2: Reduce Image Quality Temporarily

Lower image quality to reduce bandwidth:

Update `src/utils/imageOptimization.ts`:

```typescript
export const IMAGE_PRESETS = {
  thumbnail: { width: 150, quality: 60 },  // Was: 200, 75
  card: { width: 300, quality: 65 },       // Was: 400, 80
  preview: { width: 600, quality: 70 },    // Was: 800, 85
  hero: { width: 1000, quality: 75 },      // Was: 1200, 90
  fullscreen: { width: 1600, quality: 80 },// Was: 1920, 90
} as const
```

This can reduce bandwidth by another 30-50%.

---

## 🔧 Option 3: Move Static Assets to Vercel

Move large static files from Supabase to Vercel (doesn't count against Supabase):

### Files to Move:
- `public/video/office-3D.mp4` (already local - good!)
- Team photos in `public/people/`
- Static logos and icons

### Verify Static Assets Are Local:
All files in `public/` folder are served by Vercel, NOT Supabase ✅

**This means your video is already NOT using Supabase bandwidth!** 🎉

---

## 💰 Option 4: Upgrade to Pro Plan (Recommended)

**Cost:** $25/month
**Benefits:**
- 250 GB cached egress (vs 6 GB free)
- 100 GB database size (vs 500 MB free)
- Automatic backups
- Priority support

**ROI:** If your business relies on the platform, $25/month is worth the peace of mind.

[Upgrade Here](https://supabase.com/pricing)

---

## 📊 Option 5: Implement CDN for Supabase Storage

Use Cloudflare or another CDN in front of Supabase Storage:

### Setup Cloudflare CDN:
1. Create Cloudflare account (free tier available)
2. Add your domain
3. Configure Cloudflare to proxy Supabase Storage URLs
4. Set aggressive caching rules

**Benefits:**
- Cloudflare serves cached images (doesn't hit Supabase)
- Free tier includes 100 GB/month
- Better global performance

---

## 🎪 Option 6: Lazy Load More Aggressively

We added lazy loading, but we can be even more aggressive:

### Intersection Observer with Threshold:

```typescript
// src/components/LazyImage.tsx
import { useEffect, useRef, useState } from 'react'

export function LazyImage({ src, alt, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : undefined}
      alt={alt}
      {...props}
    />
  )
}
```

---

## 📉 Option 7: Pagination Instead of Loading All Listings

Currently loading all projects at once. Add pagination:

```typescript
// Limit results per page
const ITEMS_PER_PAGE = 6

const { data: projects = [] } = useQuery({
  queryKey: ['projects', page],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
    
    if (error) throw error
    return data
  },
})
```

---

## 🔍 Option 8: Analyze What's Using Cache

Check Supabase Storage analytics:

1. Go to Supabase Dashboard → Storage
2. Check which bucket is using most bandwidth
3. Identify heavy files
4. Optimize or remove them

---

## ⚡ Quick Wins (Do These Now)

### 1. Check Billing Cycle Reset Date
- If it resets in < 7 days, just wait
- Optimizations will prevent future overages

### 2. Increase React Query Cache (30 seconds to do)
```bash
# Edit src/main.tsx
staleTime: 30 * 60 * 1000,  // Change from 5 to 30 minutes
```

### 3. Monitor Usage Daily
- Watch Supabase dashboard for next 3-5 days
- Should see usage rate slow down significantly

### 4. Consider Pro Plan
- $25/month
- Solves problem immediately
- Worth it for peace of mind

---

## 📊 Expected Results Timeline

| Time | Expected Cache Usage |
|------|---------------------|
| **Now** | 6.18 GB (103% of limit) |
| **24 hours** | ~6.3 GB (growth slowed 80%) |
| **48 hours** | ~6.4 GB (new growth minimal) |
| **Next billing cycle** | ~1.5-2.5 GB (60-75% reduction) |

**Key Point:** You'll see the BIGGEST impact in the **next billing cycle** when it resets to 0 GB and starts fresh with all our optimizations active.

---

## 🎯 My Recommendation

**Short Term (Today):**
1. ✅ Check when billing cycle resets
2. ✅ If close to reset, wait it out
3. ✅ If mid-cycle, consider Pro Plan upgrade ($25/month)

**Medium Term (This Week):**
1. ✅ Monitor cache usage daily
2. ✅ Verify optimizations are working (check image URLs in DevTools)
3. ✅ Increase React Query cache time to 30 minutes

**Long Term (Next Month):**
1. ✅ After billing cycle resets, monitor growth
2. ✅ Should stay under 3 GB with current optimizations
3. ✅ If still high, implement Cloudflare CDN

---

## 🆘 If You're Getting Errors

If Supabase blocks requests due to over-limit:

1. **Immediate:** Upgrade to Pro Plan
2. **Temporary:** Reduce number of listings shown
3. **Emergency:** Contact Supabase support for temporary increase

---

**Bottom Line:** The optimizations we made will prevent future buildup, but can't erase the 6.18 GB already used. Best approach is to either wait for billing reset or upgrade to Pro ($25/month).

Want me to implement any of these additional optimizations?
