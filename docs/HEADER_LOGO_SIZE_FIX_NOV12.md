# Header Logo Size Fix - November 12, 2025

## Issue
The header logo size adjustment in `/admin/site-admin` wasn't providing clear feedback when changing values. The preview wasn't dynamically updating, and users couldn't tell if their changes were taking effect.

## Root Cause
1. **Preview Not Responsive**: The preview section was using hardcoded `h-12` class instead of responding to the `headerLogoSize` state
2. **Lack of Visual Feedback**: No indication of current selected size or that changes need to be saved
3. **No Debug Info**: No console logging to verify settings were being loaded/saved

## Changes Made

### 1. Site Admin Page (`src/pages/admin/SiteAdmin.tsx`)

#### Enhanced Header Logo Size Selector
- Added current size indicator next to label: `(Current: {headerLogoSize})`
- Added console logging when size is changed
- Added prominent reminder to save settings
- Updated size descriptions to use Tailwind class notation (h-8-10, h-10-12, h-12-16)

#### Dynamic Preview Section
- Made preview container height responsive to selected size:
  - Small: `h-16 py-2`
  - Medium: `h-20 py-3`
  - Large: `h-28 py-4`
  
- Made preview image size responsive:
  - Small: `h-8 sm:h-10`
  - Medium: `h-10 sm:h-12`
  - Large: `h-12 sm:h-16`
  
- Added transition animation for smooth size changes
- Enhanced preview label to show current size mode (e.g., "Preview (Header Size) - LARGE")
- Added detailed size information in caption

### 2. Header Component (`src/components/Header.tsx`)

#### Debug Logging
- Added console.log statements to track when header logo settings are loaded
- Logs the entire settings object and specifically the size value
- Helps diagnose if settings are being retrieved correctly

#### CRECI Number Styling Update
**Changed from glowing yellow to metallic silver:**

**Before:**
```jsx
<span className="hidden sm:inline text-[10px] font-mono font-semibold text-yellow-500 dark:text-yellow-400" 
  style={{ textShadow: '0 0 8px rgba(234, 179, 8, 0.6), 0 0 16px rgba(234, 179, 8, 0.3)' }}>
  CRECI 309568
</span>
```

**After:**
```jsx
<span 
  className="hidden sm:inline text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500" 
  style={{ 
    textShadow: '1px 1px 0px rgba(255,255,255,0.15), -1px -1px 0px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }}
>
  CRECI 309568
</span>
```

**Metallic Effect Details:**
- Uses gradient background clipped to text for metallic sheen
- Slate color palette (400-500) for silver/steel appearance
- Embossed text shadow for 3D metallic effect
- Increased letter spacing for more polished look
- No glow effects - clean and professional

## Testing Checklist

### Admin Interface
- [ ] Navigate to `/admin/site-admin`
- [ ] Scroll to "Header Logo" section
- [ ] Change logo size dropdown from Medium to Small
  - Preview should shrink immediately
  - Label should show "(Current: small)"
  - Console should log: "Header logo size changed to: small"
- [ ] Change to Large
  - Preview should grow immediately
  - Label should update
- [ ] Click "Save Settings" button
  - Should show "Saved" message
- [ ] Refresh the page
  - Size should persist at last saved value

### Frontend Header
- [ ] Open browser console
- [ ] Navigate to homepage
- [ ] Check console for: "Header logo settings loaded: {header_logo_url: ..., header_logo_size: ...}"
- [ ] Check console for: "Header logo size set to: [size]"
- [ ] Verify header logo size matches admin setting
- [ ] Check CRECI number appearance:
  - Should have metallic silver gradient
  - Should have subtle embossed effect
  - Should NOT glow
  - Should be visible on desktop only (hidden on mobile)

### Cross-Browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

## Technical Notes

### Logo Size Configuration
The sizing system uses a config object in `Header.tsx`:

```typescript
const logoSizeConfig = {
  small: {
    height: 'h-8 sm:h-10',
    padding: 'py-2'
  },
  medium: {
    height: 'h-10 sm:h-12',
    padding: 'py-3'
  },
  large: {
    height: 'h-12 sm:h-16',
    padding: 'py-4'
  }
}
```

This ensures consistent sizing between the admin preview and the actual header.

### Storage
- Settings are stored in `site_settings` table with key `header_logo_size`
- Values: 'small', 'medium', or 'large'
- Retrieved via `getSiteSettings()` helper
- Falls back to localStorage if Supabase unavailable

## Future Improvements

1. **Real-time Preview**: Add iframe preview of actual header in admin
2. **Visual Size Comparison**: Show all three sizes side-by-side
3. **Responsive Testing**: Add mobile/tablet preview modes
4. **Undo/Redo**: Add ability to revert changes before saving
5. **Custom Sizes**: Allow px-based custom height input

## Related Files
- `/src/pages/admin/SiteAdmin.tsx`
- `/src/components/Header.tsx`
- `/src/lib/siteSettings.ts`
- `/docs/HEADER_FOOTER_LOGO_CUSTOMIZATION.md`
- `/docs/HEADER_LOGO_SIZE_AND_WATERMARK_FIX.md`
