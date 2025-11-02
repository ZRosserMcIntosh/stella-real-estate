# Admin Dark Mode - Batch Update Instructions

## Quick Color Replacements

For large files with many styling patterns, use these bulk find-and-replace operations:

### 1. Background Colors
```
Find:    bg-white
Replace: bg-slate-800/50

Find:    bg-slate-50
Replace: bg-slate-900/30

Find:    dark:bg-slate-900
Replace: bg-slate-800/80
```

### 2. Text Colors  
```
Find:    text-slate-900
Replace: text-slate-100

Find:    text-slate-700
Replace: text-slate-300

Find:    text-slate-600
Replace: text-slate-400

Find:    text-slate-500
Replace: text-slate-500

Find:    dark:text-slate-300
Replace: text-slate-300

Find:    dark:text-white
Replace: text-slate-100
```

### 3. Border Colors
```
Find:    border-slate-200
Replace: border-slate-700/60

Find:    border-slate-100
Replace: border-slate-800/50

Find:    dark:border-slate-800
Replace: border-slate-700/60
```

### 4. Hover States
```
Find:    hover:bg-slate-100
Replace: hover:bg-slate-800/50

Find:    hover:border-brand-300
Replace: hover:border-pink-400/50

Find:    hover:text-brand-700
Replace: hover:text-pink-200

Find:    hover:shadow
Replace: hover:shadow-lg hover:shadow-pink-500/10
```

### 5. Specific Component Updates

#### Form Inputs
```
Find:    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
Replace: className="rounded-md border border-slate-700/60 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
```

#### Buttons (Secondary)
```
Find:    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
Replace: className="rounded-md border border-slate-700/60 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:border-slate-600/80 transition-all"
```

#### Cards
```
Find:    className="rounded-2xl border border-slate-200 bg-white p-4"
Replace: className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 transition-all shadow-lg shadow-slate-950/20"
```

#### Section Headers
```
Find:    className="text-lg font-semibold text-slate-900"
Replace: className="text-lg font-semibold text-slate-100"
```

#### Descriptions/Helper Text
```
Find:    className="text-sm text-slate-600"
Replace: className="text-sm text-slate-400"

Find:    className="text-xs text-slate-500"
Replace: className="text-xs text-slate-500"
```

## Files Needing Updates

### High Priority (Complex)
1. **SiteAdmin.tsx** (405 lines) - Many inputs and sections
2. **CRM.tsx** (1404 lines) - Large dashboard page
3. **SocialMedia.tsx** (2012 lines) - Large feature set
4. **ListingsNewProjects.tsx** (1678 lines) - Forms and tables
5. **ListingsForSale.tsx** (835 lines) - Form-heavy
6. **ListingsForRent.tsx** (821 lines) - Form-heavy

### Medium Priority
7. **Calendar.tsx** (164 lines)
8. **DocumentVault.tsx** (405 lines)
9. **DeveloperLayout.tsx** (75 lines) - Wrapper
10. Team sub-pages (OrgChart, Directory, etc.)

### Low Priority (Mostly Done)
- AdminLayout.tsx ✅
- DealRoom.tsx ✅
- Analytics.tsx ✅
- Account.tsx ✅
- Team.tsx ✅

## Implementation Order

### Phase 1: Simple Pages (30 mins)
1. Calendar.tsx
2. WebsiteBuilder.tsx (Check if it needs updates)

### Phase 2: Wrapper Components (15 mins)
1. DeveloperLayout.tsx

### Phase 3: Medium Complexity (45 mins)
1. DocumentVault.tsx
2. Team sub-pages

### Phase 4: Large Forms (2 hours)
1. ListingsForRent.tsx
2. ListingsForSale.tsx
3. ListingsNewProjects.tsx

### Phase 5: Complex Features (2.5 hours)
1. SiteAdmin.tsx
2. CRM.tsx
3. SocialMedia.tsx

## Testing Checklist

After each update:
- [ ] Page loads without visual glitches
- [ ] Text is readable (good contrast)
- [ ] Form inputs are visible and focusable
- [ ] Hover states work
- [ ] Mobile responsive (hamburger menu works)
- [ ] No placeholder text issues (dark text on dark background)
- [ ] Buttons have proper visual states
- [ ] Charts/graphs are readable
- [ ] Cards have proper layering/depth

## Visual Verification

After all updates, verify:
1. ✅ Consistent color scheme across all pages
2. ✅ All accent colors match (indigo, emerald, pink, sky, violet, orange)
3. ✅ No light-mode colors remaining
4. ✅ Text hierarchy maintained
5. ✅ Cards have proper shadows and depth
6. ✅ Mobile nav works smoothly
7. ✅ Dropdown menus styled correctly
8. ✅ Forms are fully functional

## Useful Search Patterns

Find all remaining light-mode issues:
```
Search: "bg-white|bg-slate-50|text-slate-900|border-slate-200"
Type: Regex (in VS Code Find)
```

## Troubleshooting

**Issue: Text is hard to read**
- Add `text-slate-100` for headings
- Add `text-slate-300` for body text
- Check contrast ratio (WCAG AA = 4.5:1)

**Issue: Buttons don't stand out**
- Add `shadow-lg shadow-[accent]/20` to active states
- Use proper background: `bg-[accent]-600/80`

**Issue: Borders are too bright/faint**
- Use `border-slate-700/60` consistently
- Hover: `border-slate-600/80`

**Issue: Focus states invisible**
- Add `focus:outline-none focus:ring-2 focus:ring-indigo-500/40`
- Test keyboard navigation

## Reference Colors

```typescript
// Backgrounds
Primary:   bg-slate-950
Secondary: bg-slate-900/80
Tertiary:  bg-slate-800/80
Input:     bg-slate-800/50

// Text
Primary:   text-slate-100
Secondary: text-slate-300
Tertiary:  text-slate-400
Muted:     text-slate-500

// Borders
Primary:   border-slate-700/60
Hover:     border-slate-600/80
Subtle:    border-slate-800/50

// Accents
Default:   indigo-600/80
CRM:       emerald-600/80
Ballet:    pink-600/80
Social:    sky-600/80
Builder:   violet-600/80
Dev:       orange-600/80

// Shadows
Subtle:    shadow-lg shadow-slate-950/20
Medium:    shadow-2xl shadow-slate-950/50
Accent:    shadow-lg shadow-[accent]/20
```

## Pro Tips

1. Use CSS classes consistently - avoid inline styles
2. Test both desktop and mobile views
3. Check accessibility with browser dev tools
4. Use backdrop blur for glass-morphism effect on overlays
5. Add smooth transitions: `transition-all` or `transition-colors`
6. Maintain semantic HTML - use proper tag hierarchy
7. Test with both light and dark system preferences
8. Use opacity for layering: `/80`, `/50`, `/30`

## Next Steps

1. Use find-and-replace for bulk updates
2. Test each page in isolation
3. Verify mobile responsiveness
4. Check keyboard navigation
5. Test with screen readers (accessibility)
6. Peer review styling for consistency
7. Document any custom patterns
