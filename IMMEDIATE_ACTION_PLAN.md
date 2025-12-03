# 🚨 IMMEDIATE ACTION PLAN: Reduce Supabase Cache Usage

**Current Status:** 6.18 GB / 6 GB cached egress (103% - OVER LIMIT!)

## ⚡ Quick Wins (Do These First!)

### 1. ✅ Updated Vercel Cache Headers
**Status:** DONE ✓

I've updated your `vercel.json` to add proper `Cache-Control` headers:
- Static assets (images, videos) will be cached longer by browsers
- Reduces repeated downloads from Supabase
- **Expected Savings:** 30-40% reduction

**Next Step:** Deploy to Vercel
```bash
git add vercel.json
git commit -m "Add cache-control headers to reduce bandwidth"
git push
```

### 2. 🎥 Compress Video File (5.8MB → ~1-2MB)

Run the optimization script I created:

```bash
./scripts/optimize-video.sh
```

This will:
- Backup your original video
- Compress it by 60-80%
- Maintain good quality
- **Expected Savings:** ~4-5MB per view

### 3. 📦 Install React Query for Data Caching

This prevents duplicate API calls:

```bash
npm install @tanstack/react-query
```

Then update `src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
    },
  },
})

// Wrap your app:
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <CurrencyProvider>
      {/* rest of app */}
    </CurrencyProvider>
  </AuthProvider>
</QueryClientProvider>
```

**Expected Savings:** 40-50% reduction in duplicate queries

---

## 🎯 Medium Priority (This Week)

### 4. Optimize Header Component

Update `src/components/Header.tsx` to use React Query:

```typescript
import { useQuery } from '@tanstack/react-query'

// Replace the existing useEffect that fetches projects with:
const { data: projects = [], isLoading } = useQuery({
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
    return (data || []) as ProjectLite[]
  },
  staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  enabled: !!(import.meta as any).env?.VITE_SUPABASE_URL,
})
```

### 5. Use Image Optimization Utility

I've created `src/utils/imageOptimization.ts`. Use it like this:

```typescript
import { getOptimizedImageUrl, IMAGE_PRESETS } from '../utils/imageOptimization'

// Instead of:
<img src={listing.media[0].url} />

// Use:
<img 
  src={getOptimizedImageUrl(listing.media[0].url, IMAGE_PRESETS.card)} 
  loading="lazy"
  decoding="async"
/>
```

Apply this to:
- `/src/pages/Projects.tsx`
- `/src/pages/Imoveis.tsx`
- `/src/components/Header.tsx`
- All listing display components

---

## 📊 Expected Results

After implementing all quick wins:

| Optimization | Current Usage | After | Savings |
|--------------|---------------|-------|---------|
| Cache Headers | 6.18 GB | 4.3 GB | 30% |
| Video Compression | +5.8MB/view | +1.5MB/view | 74% |
| React Query | Multiple fetches | Cached | 50% |
| Image Optimization | Full size | Responsive | 60% |
| **TOTAL** | **6.18 GB** | **~1.5-2.5 GB** | **60-75%** |

---

## 🔍 Monitoring

### Check Current Usage
1. Go to https://supabase.com/dashboard
2. Navigate to your project
3. Click "Settings" → "Billing"
4. Monitor "Cached Egress" metric

### Set Up Alerts
1. In Supabase Dashboard
2. Settings → Billing
3. Enable email alerts at 80% threshold

---

## 📝 Implementation Checklist

**Today:**
- [x] Updated vercel.json with cache headers
- [ ] Deploy cache headers to production
- [ ] Run video optimization script
- [ ] Install React Query
- [ ] Update main.tsx with QueryClientProvider

**This Week:**
- [ ] Update Header component to use React Query
- [ ] Apply image optimization to all listing pages
- [ ] Add lazy loading to all images
- [ ] Test and verify cache reduction

**Monitor:**
- [ ] Check Supabase dashboard daily
- [ ] Track cache usage over 7 days
- [ ] Adjust if needed

---

## 🆘 If Still Over Limit

### Temporary Solutions:
1. **Upgrade to Pro Plan** ($25/month)
   - 250 GB cached egress included
   - Buys time to optimize

2. **Reduce Features Temporarily**
   - Disable video on homepage
   - Reduce listing image quality
   - Limit number of listings shown

### Long-Term Solutions:
1. **Move to CDN**
   - Cloudflare Images
   - Cloudinary
   - Vercel Blob Storage

2. **Implement PWA Caching**
   - Service Worker
   - Cache API responses locally
   - Offline-first approach

---

## 📞 Questions?

Check the detailed guide: `CACHE_OPTIMIZATION_GUIDE.md`

Or reach out if you need help implementing any of these changes!
