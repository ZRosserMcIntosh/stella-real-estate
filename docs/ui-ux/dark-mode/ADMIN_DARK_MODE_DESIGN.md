# Admin Dark Mode Design System

## Overview
The admin panel has been transformed to use a sleek, elegant dark mode inspired by the StellaPlatform page. This document outlines the design system and implementation guidelines.

## Color Palette

### Background
- **Primary Background**: `bg-slate-950` (Page background)
- **Secondary Background**: `bg-slate-900/80` (Header, cards)
- **Tertiary Background**: `bg-slate-800/80` (Card hover states, nested elements)
- **Dark Overlay**: `bg-slate-800/50` (Form inputs, disabled states)

### Text
- **Primary Text**: `text-slate-100` (Main headings, primary content)
- **Secondary Text**: `text-slate-300` (Navigation items, secondary content)
- **Tertiary Text**: `text-slate-400` (Labels, helper text)
- **Muted Text**: `text-slate-500` (Disabled, subtle text)

### Borders
- **Primary Border**: `border-slate-700/60` (Card borders, inputs)
- **Secondary Border**: `border-slate-800/50` (Subtle dividers)
- **Hover Border**: `border-slate-600/80` (Interactive states)

### Accent Colors (by section)
- **Default/Deal Room**: `indigo-600/80` (Primary accent)
- **Listings**: `indigo-600/80` (Consistent with default)
- **Company**: `indigo-600/80` (Analytics, Team, Site Admin)
- **CRM/Constelação**: `emerald-600/80` (Distinct green accent)
- **Ballet**: `pink-600/80` (Distinct pink accent)
- **Social Media**: `sky-600/80` (Distinct blue accent)
- **Website Builder**: `violet-600/80` (Distinct purple accent)
- **Developer**: `orange-600/80` (Distinct orange accent)

## Component Styles

### Cards
```tsx
className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20"
```

**Features:**
- Gradient background (slate-800 to slate-900)
- Backdrop blur for glass-morphism effect
- Subtle shadows
- Smooth hover transitions
- Rounded corners (rounded-2xl for large cards, rounded-lg for smaller elements)

### Buttons

**Primary Button (Active)**
```tsx
className="bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20"
```

**Secondary Button (Inactive)**
```tsx
className="text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
```

**Action Button**
```tsx
className="inline-flex items-center rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 hover:shadow-lg hover:shadow-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
```

### Form Inputs
```tsx
className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
```

**Features:**
- Dark background with semi-transparency
- Light text with slate-500 placeholders
- Indigo focus ring (subtle, not overpowering)
- Smooth transitions on focus

### Navigation Items

**Active Link:**
```tsx
'bg-[ACCENT]/80 text-white shadow-lg shadow-[ACCENT]/20'
```

**Inactive Link:**
```tsx
'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
```

### Dropdowns / Modals
```tsx
className="rounded-lg border border-slate-700/60 bg-slate-800/95 backdrop-blur-lg p-1 shadow-2xl shadow-slate-950/50"
```

### KPI Tiles
```tsx
className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20"
```

**Value Text:**
```tsx
className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300"
```

Creates a subtle gradient effect on numbers for elegance.

## Badge Styling

**Demo Badge**
```tsx
className="inline-flex items-center rounded-lg border border-amber-400/50 bg-amber-500/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200"
```

## Transitions & Animations

All interactive elements use smooth transitions:
```tsx
className="transition-all"  // Cards, buttons
className="transition-colors"  // Text, backgrounds
```

Focus states and hover states should have visual feedback through:
- Background color changes
- Shadow intensity increases
- Border color transitions
- Text color adjustments

## Typography

- **Headings**: `font-semibold` or `font-bold` in `text-slate-100`
- **Body Text**: `text-slate-300` for primary, `text-slate-400` for secondary
- **Labels**: `text-xs uppercase tracking-wide text-slate-400`
- **Links**: Colored with accent, darker on dark backgrounds

## Shadow System

- **Subtle**: `shadow-sm` (small inputs, borders)
- **Medium**: `shadow-lg shadow-slate-950/20` (cards, modals)
- **Strong**: `shadow-2xl shadow-slate-950/50` (dropdowns, overlays)
- **Accent Glow**: `shadow-lg shadow-[ACCENT]/20` or `shadow-lg shadow-[ACCENT]/30` (buttons, highlights)

## Implementation Checklist

When updating an admin page:

- [ ] Change background from `bg-white/bg-slate-50` to `bg-gradient-to-br from-slate-800/80 to-slate-900/80`
- [ ] Update text colors: `text-slate-900` → `text-slate-100`, `text-slate-600` → `text-slate-300`
- [ ] Update borders: `border-slate-200` → `border-slate-700/60`
- [ ] Update form inputs with dark styling
- [ ] Add backdrop blur to cards (`backdrop-blur-lg`)
- [ ] Update hover states with new color scheme
- [ ] Test focus states for accessibility
- [ ] Verify contrast ratios for WCAG compliance
- [ ] Test on both desktop and mobile viewports

## Pages Updated

✅ **AdminLayout.tsx** - Navigation header and sidebar
✅ **DealRoom.tsx** - KPI dashboard
✅ **Analytics.tsx** - Analytics page
✅ **Account.tsx** - Account settings

🔄 **In Progress**
- [ ] Team.tsx
- [ ] SiteAdmin.tsx
- [ ] DocumentVault.tsx
- [ ] Calendar.tsx
- [ ] CRM.tsx
- [ ] SocialMedia.tsx
- [ ] WebsiteBuilder.tsx
- [ ] ListingsForSale.tsx
- [ ] ListingsForRent.tsx
- [ ] ListingsNewProjects.tsx
- [ ] Ballet.tsx
- [ ] DeveloperLayout.tsx & sub-pages

## Layout Improvements

### Suggested Enhancements

1. **KPI Cards Grid**: Use 4-column grid on large screens for better data density
2. **Chart Containers**: Add gradient backgrounds to chart areas to distinguish from cards
3. **Filter Bar**: Place prominent filter controls with consistent styling
4. **Data Tables**: Add alternating row backgrounds with `bg-slate-800/30` and `bg-slate-800/50`
5. **Status Indicators**: Use colored dots with `animate-pulse` for live data
6. **Quick Actions**: Floating action buttons with gradient backgrounds
7. **Breadcrumbs**: Add navigation breadcrumbs in dark mode styling
8. **Empty States**: Custom illustrations or icons for empty dashboard states

## Performance Notes

- Backdrop blur is supported on modern browsers (Chrome 76+, Safari 13+, Firefox 103+)
- For older browsers, the fallback is solid colors without blur
- Use `will-change: transform` on hover states to optimize animations
- Consider lazy-loading chart components on DealRoom page

## Accessibility

- Maintain minimum contrast ratio of 4.5:1 for text
- Use `aria-label` on icon buttons
- Ensure focus states are clearly visible
- Test with screen readers (NVDA, JAWS)
- Keyboard navigation fully functional
- Color should not be the only indicator (use patterns/icons too)

## Future Enhancements

- [ ] Dark mode toggle (while maintaining dark default)
- [ ] Custom color themes
- [ ] Theme-specific accent colors per user role
- [ ] Animated gradient backgrounds on hero sections
- [ ] Real-time data visualization with smooth animations
- [ ] Mobile-optimized card layouts
