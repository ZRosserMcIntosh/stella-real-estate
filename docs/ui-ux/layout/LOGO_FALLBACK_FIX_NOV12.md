# Logo Fallback Protection - November 12, 2025

## Issue
Logos were reverting to the orange ball placeholder on mobile devices (tested on 3 browsers), especially when images failed to load or took too long.

## Solution
Added robust `onError` handlers to all logo image elements to automatically fall back to the correct logo: `public/Variação de logotipo 6.png`

## Files Modified

### 1. `/src/App.tsx` - Hero Logo
**Location:** Lines ~578-590

Added `onError` handler to the hero logo image:
```tsx
<img
  src={heroLogoUrl}
  alt="Stella"
  className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/Variação de logotipo 6.png') {
      console.log('Hero logo failed to load, using fallback: /Variação de logotipo 6.png');
      target.src = '/Variação de logotipo 6.png';
    }
  }}
/>
```

### 2. `/src/components/Header.tsx` - Header Logo
**Location:** Lines ~165-185

Enhanced `onError` handler to try fallback before showing placeholder:
```tsx
<img
  src={headerLogoUrl}
  className={`${currentLogoSize.height} w-auto object-contain drop-shadow-sm transition-all duration-300`}
  alt={t('header.brand') as string}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/Variação de logotipo 6.png') {
      console.log('Header logo failed to load, trying fallback: /Variação de logotipo 6.png');
      target.src = '/Variação de logotipo 6.png';
    } else {
      console.log('Fallback logo also failed, showing placeholder');
      setLogoFailed(true);
    }
  }}
/>
```

### 3. `/src/components/Footer.tsx` - Footer Logo
**Location:** Lines ~245-260

Added `onError` handler to footer logo:
```tsx
<img 
  src={footerLogoUrl} 
  alt="Footer Logo" 
  className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/Variação de logotipo 6.png') {
      console.log('Footer logo failed to load, using fallback: /Variação de logotipo 6.png');
      target.src = '/Variação de logotipo 6.png';
    }
  }}
/>
```

## How It Works

1. **Primary Logo**: The app attempts to load the logo from Supabase storage (if configured)
2. **Initial Fallback**: If no custom logo is set, it loads `Variação de logotipo 6.png` from the public folder
3. **Error Protection**: If the primary logo fails to load (network issues, file not found, etc.), the `onError` handler automatically switches to the fallback
4. **Prevents Loops**: The handler checks if the current src is already the fallback to prevent infinite loops

## Benefits

✅ **Mobile Reliability**: Logos will consistently display on mobile devices, even with slow connections
✅ **Graceful Degradation**: If custom logos fail, users see the proper Stella Mary branding instead of placeholders
✅ **Debug Logging**: Console logs help identify when fallbacks are triggered
✅ **No Flashing**: The image element stays in place, just changes its source seamlessly

## Testing

Test on multiple devices/browsers:
- [ ] Desktop Chrome
- [ ] Desktop Safari  
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Firefox

### Test Scenarios:
1. **Normal Load**: Logo loads correctly from Supabase
2. **Network Failure**: Disconnect network after page starts loading
3. **Invalid URL**: Set an invalid logo URL in admin panel
4. **Slow Connection**: Throttle network to 3G speed

## Fallback File Location

```
/public/Variação de logotipo 6.png
```

This file must remain in the public folder and should not be deleted.

## Related Documentation

- [Logo System Guide](./LOGO_AND_PRIVACY_QUICK_REF.md)
- [Header Final Polish](./HEADER_FINAL_POLISH_NOV12.md)
- [Watermark & Logo Features](./WATERMARK_SIZE_AND_HERO_LOGO_SUMMARY.md)

---

**Last Updated:** November 12, 2025
