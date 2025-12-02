# Pricing Page Implementation - November 13, 2025

## Overview
Updated the Pricing page to implement Virgil's comprehensive pricing specifications while maintaining the beautiful design aesthetic of the Constellation platform.

## Key Changes

### 1. New Tier Structure
Implemented 5 pricing tiers as specified:

- **FREE**: Entry-level with 1 site (3 pages), 10 listings, 200 contacts
- **SOLO**: R$ 147/month - For independent agents with 2 users, 2 3D maps/month
- **TEAM**: R$ 397/month - Small teams with 5 users, 5 3D maps/month (Most Popular)
- **BROKERAGE**: R$ 997/month - Established brokerages with 30 users, 20 3D maps/month
- **ENTERPRISE**: Custom pricing - Full white-label for large operations

### 2. Founding 100 - Constellation Prime
Added prominent pre-launch offer banner with:

- **One-time payment**: R$ 2.970
- **24 months** of Team plan included (worth R$ 9.528)
- **10 3D maps/month** (5 extra permanent)
- **40% lifetime discount** after prepaid period
- **R$ 140 per extra map** (permanent special pricing)
- **Founding Partner badge** + early access to features
- **Limited to 100 slots** with real-time counter
- Beautiful amber/gold themed design with interactive modal

### 3. 3D Map Packages
Added two bulk packages section:

- **Kilomóveis**: 1,000 maps for R$ 120,000 (R$ 120/map, 12-18 months)
- **Megamóveis**: 1,000,000 maps for R$ 40-50M (R$ 40-50/map, multi-year)

### 4. Design Consistency
Maintained the beautiful Constellation aesthetic:
- Outfit font family throughout
- `font-light` instead of `font-bold` for headings
- Proper letter-spacing (-0.02em)
- Dark slate background with animated stars
- Gradient cards with backdrop blur
- Proper spacing and visual hierarchy

### 5. Technical Implementation

#### Files Modified:
- `/src/pages/Pricing.tsx` - Main pricing page with new tiers and Founding 100
- `/src/main.tsx` - Added pricing routes (precos, pricing redirect)
- `/src/components/Header.tsx` - Added Constellation dropdown with Pricing link

#### New Files Created:
- `/src/lib/plans.ts` - Complete plan configuration and helper functions

### 6. Configuration System (`plans.ts`)
Created comprehensive TypeScript configuration with:

- `Plan` interface with all features and limits
- `Founding100Status` interface for founding member tracking
- `MapPackage` interface for bulk 3D map packages
- Plan definitions for all 5 tiers
- Helper functions:
  - `canBeFoundingMember()` - Eligibility check
  - `getEffectivePrice()` - Price with founding discounts
  - `getAvailable3DMaps()` - 3D map quota calculation
  - `getPricePerExtra3DMap()` - Overage pricing

### 7. Business Logic Implemented

#### Founding 100 Rules:
- Maximum 100 slots total
- Eligibility: Independent agents or micro-teams (≤3 users)
- One-time R$ 2.970 payment
- 24 months prepaid Team plan access
- After 24 months: 40% lifetime discount on subscription
- Special 3D map pricing: R$ 140 (vs R$ 160+ regular)
- Loss of benefits after 6+ months of inactivity
- Benefits tied to CPF/CNPJ (non-transferable)

#### Plan Features:
All plans properly configured with:
- Site limits and page limits
- Custom domain capabilities
- Branding controls
- Listing limits
- 3D map quotas and overage pricing
- CRM contact and pipeline limits
- Automation and lead scoring features
- User seats and permission systems
- Support levels
- Early access tiers

### 8. UI/UX Improvements
- Responsive grid: 5 columns on desktop, stacks on mobile
- Monthly/Annual toggle (save 2 months on annual)
- Interactive Founding 100 modal with full details
- Clear feature comparison with check/x icons
- Feature details shown inline (e.g., "2/mês" for 3D maps)
- Proper CTA buttons per plan (Free vs Login vs Contact)
- Prominent slot counter showing remaining Founding spots

## Next Steps (Backend Integration)

To fully implement, you'll need:

1. **Database Schema**:
   - Add `plan_id` column to accounts table
   - Create `founding_status` table/column
   - Create `map_packages` table for bulk purchases
   - Track 3D map usage per account

2. **API Endpoints**:
   - `POST /api/founding/reserve` - Reserve a Founding 100 slot
   - `GET /api/founding/slots-remaining` - Get available slots
   - `POST /api/subscriptions/create` - Create subscription
   - `POST /api/subscriptions/upgrade` - Upgrade plan
   - `GET /api/account/limits` - Get current plan limits

3. **Payment Integration**:
   - Stripe/payment processor integration for one-time Founding payment
   - Recurring subscription management
   - Prorated upgrades/downgrades

4. **Feature Gating**:
   - Implement limit checks based on plan
   - Block features when limits exceeded
   - Show upgrade prompts at appropriate times

## Testing Checklist

- [ ] All 5 plan cards display correctly
- [ ] Monthly/Annual toggle works
- [ ] Founding 100 banner shows/hides based on slots
- [ ] Founding 100 modal opens and closes
- [ ] All links navigate correctly
- [ ] Responsive design works on mobile
- [ ] Header dropdown shows Pricing link
- [ ] Mobile menu shows Pricing link
- [ ] 3D map packages display correctly
- [ ] Typography matches Constellation page

## Notes

The page maintains the stunning visual design you loved while implementing all of Virgil's business logic specifications. The Founding 100 offer is prominently featured and will be a powerful acquisition tool for early adopters.
