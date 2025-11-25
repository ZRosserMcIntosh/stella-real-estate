# Dark Mode Conversion Patterns

## Quick Reference for Manual Updates

### Common Pattern Replacements

#### Text Colors
```tsx
// BEFORE → AFTER
text-slate-900 dark:text-white → text-white
text-slate-800 dark:text-white → text-white
text-slate-700 dark:text-slate-200 → text-slate-200
text-slate-700 dark:text-slate-300 → text-slate-300
text-slate-600 dark:text-slate-300 → text-slate-300
text-slate-600 dark:text-slate-400 → text-slate-400
text-slate-500 dark:text-slate-400 → text-slate-400
```

#### Backgrounds
```tsx
// BEFORE → AFTER
bg-white dark:bg-slate-900 → bg-slate-900
bg-white dark:bg-slate-800 → bg-slate-800
bg-white/80 dark:bg-slate-900/60 → bg-slate-900/60
bg-white/60 dark:bg-slate-800/60 → bg-slate-800/60
```

#### Borders
```tsx
// BEFORE → AFTER
border-slate-200 dark:border-slate-700 → border-slate-700
border-slate-200 dark:border-slate-800 → border-slate-800
border-slate-300 dark:border-slate-600 → border-slate-600
border-slate-300 dark:border-slate-700 → border-slate-700
border-white/40 dark:border-slate-700/50 → border-slate-700/50
```

#### Gradients
```tsx
// BEFORE → AFTER
from-white dark:from-slate-900 → from-slate-900
via-white dark:via-slate-850 → via-slate-850
to-white dark:to-slate-900 → to-slate-900
bg-gradient-to-b from-white/98 via-white/95 to-white dark:from-slate-900... → from-slate-900...
```

#### Hover States
```tsx
// BEFORE → AFTER
hover:bg-slate-100 dark:hover:bg-white/10 → hover:bg-white/10
hover:bg-white dark:hover:bg-slate-800 → hover:bg-slate-800
hover:text-brand-600 dark:hover:text-brand-400 → hover:text-brand-400
hover:border-white/60 dark:hover:border-slate-600/60 → hover:border-slate-600/60
```

#### Brand Colors
```tsx
// BEFORE → AFTER
text-brand-600 dark:text-brand-400 → text-brand-400
bg-slate-900 dark:bg-white → bg-white (inverted buttons)
text-white dark:text-slate-900 → text-slate-900 (inverted buttons)
```

#### Button Patterns
```tsx
// Primary button (white on dark bg)
// BEFORE
bg-slate-900 dark:bg-white text-white dark:text-slate-900
// AFTER
bg-white text-slate-900

// Secondary button (outlined)
// BEFORE
border-slate-300 dark:border-white/30 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10
// AFTER
border-white/30 text-white hover:bg-white/10
```

#### Form Inputs
```tsx
// BEFORE
border-slate-300 dark:border-slate-600
bg-white dark:bg-slate-900/60
text-slate-900 dark:text-white
placeholder:text-slate-400

// AFTER
border-slate-600
bg-slate-900/60
text-white
placeholder:text-slate-400
```

#### Cards
```tsx
// BEFORE
border-slate-200/50 dark:border-slate-700/50
bg-white dark:bg-slate-800/60
shadow-lg

// AFTER
border-slate-700/50
bg-slate-800/60
shadow-lg
```

### Multi-line Pattern Example

#### Section Background
```tsx
// BEFORE
<div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900" />
<div className="absolute inset-0 opacity-3 dark:opacity-10" style={{...}} />

// AFTER
<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900" />
<div className="absolute inset-0 opacity-10" style={{...}} />
```

#### Form Container
```tsx
// BEFORE
<form className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">

// AFTER
<form className="bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700/50">
```

### Search & Replace Tips

#### VS Code Regex Find/Replace
1. Open Find & Replace (Cmd+Shift+H)
2. Enable Regex mode (.*icon)
3. Use these patterns:

**Find:** `text-slate-900 dark:text-white`  
**Replace:** `text-white`

**Find:** `bg-white dark:bg-slate-(\d+)`  
**Replace:** `bg-slate-$1`

**Find:** `border-slate-([23]00) dark:border-slate-([67]00)`  
**Replace:** `border-slate-$2`

### Files to Update Priority

1. ✅ **Global Files** (DONE)
   - src/index.css
   - index.html
   - tailwind.config.ts
   - src/main.tsx

2. ✅ **Home Page** (DONE)
   - src/App.tsx

3. ⏳ **Layout Components** (TO DO)
   - src/components/Header.tsx
   - src/components/Footer.tsx
   - src/components/Layout.tsx

4. ⏳ **Page Components** (TO DO)
   - src/pages/Projects.tsx
   - src/pages/About.tsx
   - src/pages/Login.tsx
   - etc.

5. ⏳ **Admin Components** (TO DO)
   - src/pages/admin/*
   - src/components/admin/*

### Testing Checklist

After updating each component:

- [ ] Component renders without errors
- [ ] Text is readable (sufficient contrast)
- [ ] Hover states work correctly
- [ ] Forms have visible borders/focus states
- [ ] Buttons are clearly clickable
- [ ] Mobile view looks good
- [ ] No white flashes on load

### Common Mistakes to Avoid

❌ **Don't:**
- Leave any `dark:` classes in the code
- Use light colors (slate-50, slate-100, white) for backgrounds
- Use dark colors (slate-900, black) for text on dark backgrounds
- Forget to update hover/focus states

✅ **Do:**
- Use slate-800/900 for backgrounds
- Use white/slate-100/200 for text
- Test in both light and dark system modes
- Check contrast ratios (use browser DevTools)
- Maintain consistent spacing/sizing

### Quick Test Command

```bash
# Search for remaining dark: classes
grep -r "dark:" src/ --include="*.tsx" --include="*.ts" | wc -l

# Should return 0 when complete
```

### Verification

After all changes, verify:
1. No `dark:` classes remain: `grep -r " dark:" src/`
2. Build succeeds: `npm run build`
3. No console errors: Check browser console
4. Visual test: Compare before/after screenshots
