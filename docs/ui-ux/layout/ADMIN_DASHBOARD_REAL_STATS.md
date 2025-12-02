# Admin Dashboard - Real Statistics Integration

## Overview
The admin dashboard `/admin` (Deal Room) now displays **real statistics** from the database instead of mock/random numbers. Each statistic tile shows actual data when available, or displays a **⚠️ warning indicator** when data is unavailable.

## Features Implemented

### 1. Real Data Connection
The dashboard now connects to Supabase to calculate real metrics from the `listings` table:

- **Active Listings Count**: Counts published listings by type (for_sale, for_rent, vacation_rental)
- **Total Value**: Sums the price of all active listings by type
- **Under Contract**: Tracks listings with status "under_contract" or "pending"
- **Closed This Month**: Counts listings sold/rented in current month
- **Average Price per m²**: Calculates from listings with both price and area data

### 2. Warning Indicators
When data is not available, each statistic shows a **⚠️** emoji in the bottom right corner:

```tsx
<WarningIndicator explanation="explanation text here" />
```

Clicking the ⚠️ opens a modal explaining:
- **Why the data is unavailable**
- **What needs to be done to enable it**
- **Which database fields or integrations are required**

### 3. Statistics Breakdown

#### Headline Metrics (Row 1)
| Metric | Data Source | Warning Condition |
|--------|-------------|-------------------|
| TCLV · Venda | Sum of `price` where `listing_type='for_sale'` and `status='published'` | No published sale listings |
| TCLV · Locação | Sum of `price * 12` where `listing_type='for_rent'` and `status='published'` | No published rental listings |
| TCLV · Temporada | *Not yet available* | Always shows ⚠️ - needs booking system integration |
| Ativos · Venda | Count where `listing_type='for_sale'` and `status='published'` | No active sale listings |
| Ativos · Locação | Count where `listing_type='for_rent'` and `status='published'` | No active rental listings |
| Ativos · Temporada | Count where `usage_type='vacation_rental'` and `status='published'` | No seasonal listings |
| Under Contract | Count + sum where `status IN ('under_contract', 'pending')` | No properties under contract |
| Fechados (MTD) | Count + sum where `status IN ('sold', 'rented')` and date >= start of month | No deals closed this month |

#### Additional KPIs (Row 2)
| Metric | Data Source | Warning Condition |
|--------|-------------|-------------------|
| Taxa de Conversão | *Not yet available* | Always shows ⚠️ - needs CRM lead tracking |
| Dias Médios em Mercado | *Not yet available* | Always shows ⚠️ - needs `listed_date` field |
| Preço Médio/m² | Average of `price / area` for sale listings | No listings with both price and area |
| Crescimento YoY | *Not yet available* | Always shows ⚠️ - needs 12 months historical data |

## File Structure

```
src/pages/admin/
├── DealRoom.tsx                    # Main dashboard component
└── dealroom/
    ├── types.ts                    # TypeScript interfaces
    └── statsService.ts             # NEW: Statistics fetching and calculations
```

## Key Functions

### `fetchDashboardStats()`
Located in `statsService.ts`, this function:
1. Queries all listings from Supabase
2. Filters and aggregates data for each metric
3. Returns a `DashboardStats` object with:
   - Calculated values (or `null` if unavailable)
   - `dataAvailable` flags for each metric

### `formatCurrency(value, compact?)`
Formats numbers as Brazilian Real currency:
- `formatCurrency(1500000)` → "R$ 1.500.000"
- `formatCurrency(1500000, true)` → "R$ 1.5M" (compact for tiles)

## Usage Example

```tsx
// DealRoom.tsx
const [stats, setStats] = useState<DashboardStats | null>(null)

useEffect(() => {
  async function loadStats() {
    const data = await fetchDashboardStats()
    setStats(data)
  }
  loadStats()
}, [])

// Display with warning if no data
<Tile 
  label="Ativos · Venda" 
  value={stats.activeForSale ?? 0}
  warning={!stats.dataAvailable.sales 
    ? 'No active sale listings found.' 
    : undefined
  }
/>
```

## Database Requirements

### Current Implementation Works With:
- `listings` table with columns:
  - `listing_type` ('for_sale', 'for_rent', 'new_project')
  - `status` ('draft', 'published', 'under_contract', 'pending', 'sold', 'rented')
  - `price` (numeric)
  - `area` (numeric, optional)
  - `usage_type` (text, optional - for vacation_rental)
  - `updated_at` (timestamp)

### Future Enhancements Need:
1. **Conversion Rate**: 
   - Add `leads` table with status tracking
   - Link leads to listings via foreign key

2. **Days on Market**:
   - Add `listed_date` column to `listings` table
   - Calculate: `current_date - listed_date`

3. **YoY Growth**:
   - Add `sold_date` or `closed_date` column
   - Requires at least 12 months of historical data

4. **Seasonal Revenue**:
   - Integration with booking system
   - Track booking dates and payment amounts

## Warning Messages

All warning messages are user-friendly and actionable:

✅ **Good Example:**
> "Conversion rate tracking requires CRM integration. Implement lead tracking to calculate this metric from inquiry to closed deal."

❌ **Avoid:**
> "Missing leads table in database"

## Testing

To test the dashboard:

1. **With No Data**: Dashboard shows all zeros with ⚠️ indicators
2. **With Some Listings**: Add listings via `/admin/listings/new-projects`
   - Set status to "published" to appear in active counts
   - Add price values to calculate totals
3. **With Closed Deals**: Change listing status to "sold" to see MTD metrics

## Future Improvements

- [ ] Add caching to `fetchDashboardStats()` (10-minute TTL)
- [ ] Implement real-time updates via Supabase subscriptions
- [ ] Add filter functionality (by date range, location, agent)
- [ ] Export stats to CSV/PDF
- [ ] Add comparison view (this month vs last month)
- [ ] Implement historical trending charts

## Related Files

- `/src/pages/admin/DealRoom.tsx` - Main dashboard
- `/src/pages/admin/dealroom/types.ts` - TypeScript interfaces
- `/src/pages/admin/dealroom/statsService.ts` - Statistics service
- `/supabase/migrations/20251013140000_unify_listings_drop_views_add_listing_type.sql` - Database schema

---

**Last Updated**: November 12, 2025
**Author**: GitHub Copilot
