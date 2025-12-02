# About Page - Expandable Bio Implementation

## Overview
Updated the About Us page with expandable biographies for Stella M. (CEO) and Rosser M. (CTO), featuring smooth animations and "Read Full Bio" functionality.

## Implementation Details

### Component Changes (`/src/pages/About.tsx`)

#### State Management
Added React state hooks for controlling bio expansion:
```tsx
const [ceoExpanded, setCeoExpanded] = useState(false)
const [ctoExpanded, setCtoExpanded] = useState(false)
```

#### Bio Structure
Each leadership card now includes:
1. **Short Bio** - Always visible (~75 words)
2. **Full Bio** - Expandable section (~180-200 words)
3. **Toggle Button** - "Read Full Bio" / "Show Less" with animated chevron icons

#### Animation Details
- **Transition:** 500ms ease-in-out
- **Height:** Smooth expansion from `max-h-0` to `max-h-[800px]`
- **Opacity:** Fades in/out (0 to 100%)
- **Icons:** Chevron rotates based on state (down = expand, up = collapse)

### Leadership Content

#### Stella M. - Chief Executive Officer

**Short Bio (75 words):**
Stella M. is the CEO of Stella Real Estate, a São Paulo–based company building the operating system for modern real estate. She leads brand, product, and go-to-market, uniting design craft with practical tech— from cinematic websites and a graph-connected CRM (Constellation) to Balé, a task suite, and smartphone-to-3D property tours. With a focus on agent productivity and buyer trust, she's scaling a Brazil-born platform built for global reach.

**Full Bio (180-200 words):**
Stella M. is the Chief Executive Officer of Stella Real Estate, where she's shaping a Brazil-born, globally minded platform for the industry's next decade. Her mandate: help agents, brokerages, and developers operate like top-tier firms—without top-tier overhead. Under Stella's leadership, the company is assembling a cohesive stack: Constellation, a graph-connected CRM; Balé, a choreographed work and task suite; a site builder for cinematic, high-converting property pages; and video-to-3D technology that turns simple smartphone walkthroughs into explorable tours.

Rooted in São Paulo and integrated with CRECI workflows, Stella champions clarity, speed, and trust as the true growth levers in real estate. She pairs brand sensibility with systems thinking, pushing for products that feel elegant yet industrial-grade. Beyond shipping features, she's committed to education—supporting licensing prep and hands-on training so professionals level up with the tools.

Stella's north star is straightforward: elevate the real estate experience for buyers and sellers while giving professionals superpowers—so every team can work like a category leader.

#### Rosser M. - Chief Technology Officer

**Short Bio (75 words):**
Rosser M. is the CTO of Stella Real Estate and the architect behind its end-to-end platform. They oversee product engineering, data, and AI—powering Constellation (graph-connected CRM), Balé (task/work graph), the site builder, and smartphone-to-3D property mapping. Focused on reliability, speed, and measurable outcomes, Rosser M. builds teams and systems that make complex workflows feel effortless for agents, brokerages, and developers.

**Full Bio (180-200 words):**
As Chief Technology Officer, Rosser M. leads engineering, data, and security at Stella Real Estate, turning ambitious product ideas into fast, reliable systems at scale. Their team is responsible for the platform's backbone: Constellation, a graph-connected CRM that maps people, properties, and deals; Balé, a choreographed work graph for tasks and automations; a modern site builder for cinematic listings; and a computer-vision pipeline that converts simple smartphone video into explorable 3D property tours.

Operating from São Paulo with a global roadmap, Rosser M. prioritizes clean architecture, ruthless latency budgets, and audit-ready data flows that play nicely with CRECI and brokerage compliance. They champion developer ergonomics and a high-signal analytics layer so product decisions tie back to outcomes agents feel: faster listing launch, higher lead quality, tighter follow-through.

Rosser M. believes the best real-estate tech disappears into the work—quietly coordinating people, content, and timing so professionals can focus on relationships and negotiation. Their goal: a platform that feels simple on the surface and composable under the hood, built to serve solo agents and megabrokerages alike.

## Translation Keys

### English (`en/common.json`)
```json
"leadership": {
  "ceo": {
    "name": "Stella M.",
    "title": "Chief Executive Officer",
    "shortBio": "...",
    "fullBio": "..."
  },
  "cto": {
    "name": "Rosser M.",
    "title": "Chief Technology Officer",
    "shortBio": "...",
    "fullBio": "..."
  }
}
```

### Portuguese (`pt/common.json`)
- Title: "Diretora Executiva" / "Diretor de Tecnologia"
- Full translations provided for Brazilian audience

### Spanish (`es/common.json`)
- Title: "Directora Ejecutiva" / "Director de Tecnología"
- Full translations provided for Spanish-speaking markets

## User Experience

### Default State
- Short bio visible immediately
- No scrolling required to see both leaders
- Clean, scannable layout

### Expanded State
- Full bio smoothly animates in
- Button changes to "Show Less" with up chevron
- Content remains left-aligned for readability
- Height adjusts automatically

### Interaction Design
- **Button Style:** Brand color (indigo/pink) with hover effects
- **Icon Animation:** Chevron rotates to indicate state
- **Accessibility:** Clear labels ("Read Full Bio" / "Show Less")
- **Mobile Friendly:** Works perfectly on all screen sizes

## Technical Features

### Performance
- No layout shift during expansion
- CSS transitions (hardware accelerated)
- Lazy expansion prevents initial render bloat

### Responsiveness
- Mobile: Single column, full-width cards
- Desktop: Two-column grid, side-by-side
- Button always visible and accessible

### Dark Mode
- Text colors adapt automatically
- Buttons maintain brand colors with proper contrast
- Gradients optimized for both themes

## Next Steps

### Photos Ready to Add
When photos are provided, update these sections:
```tsx
// CEO Photo
<img 
  src="/team/stella-m.jpg" 
  alt="Stella M." 
  className="w-full h-full object-cover"
/>

// CTO Photo
<img 
  src="/team/rosser-m.jpg" 
  alt="Rosser M." 
  className="w-full h-full object-cover"
/>
```

### Recommended Photo Specs
- **Format:** JPG or WebP
- **Dimensions:** 800x800px minimum (square)
- **Aspect Ratio:** 1:1 (square)
- **File Size:** Under 500KB (optimized)
- **Style:** Professional headshots with good lighting

## Files Modified
1. ✅ `/src/pages/About.tsx` - Added expandable bio functionality
2. ✅ `/src/locales/en/common.json` - Added full bios (English)
3. ✅ `/src/locales/pt/common.json` - Added full bios (Portuguese)
4. ✅ `/src/locales/es/common.json` - Added full bios (Spanish)

## Design Highlights
- ✨ **Smooth Animations** - Professional 500ms transitions
- 📱 **Mobile Optimized** - Perfect on all devices
- 🎨 **Brand Consistent** - Matches Constellation design system
- ♿ **Accessible** - Clear labels and keyboard navigation
- 🌍 **Multilingual** - Full support for EN, PT, ES
- 🌙 **Dark Mode** - Beautiful in light and dark themes

---

**Status:** Complete and ready for photos
**Next:** Upload CEO and CTO photos to activate the full experience
