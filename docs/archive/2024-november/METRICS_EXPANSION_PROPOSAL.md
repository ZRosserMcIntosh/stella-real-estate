# Dashboard Metrics Expansion Proposal

## Current Metrics (8)
✅ Already implemented with tooltips:
1. **TCLV · Venda** - Total Closed Loan Value (Sales)
2. **Ativos · Venda** - Active Sales Listings
3. **TCLV · Locação** - Total Closed Loan Value (Rentals)
4. **Ativos · Locação** - Active Rental Listings
5. **TCLV · Temporada** - Total Closed Loan Value (Short-term)
6. **Ativos · Temporada** - Active Short-term Listings
7. **Under Contract** - Pending closings
8. **Fechados MTD** - Closed this month

## New Phase 1 Metrics (4)
🔄 Recently added with tooltips:
1. **Conversion Rate** - % of leads converting to deals (18.5% with trend)
2. **Days on Market** - Average days to sell/lease (45 days)
3. **Price per m²** - Market pricing benchmark
4. **YoY Growth** - Year-over-year deal growth (+12%)

---

## Proposed Phase 2 Metrics (12-16 additional)

### Sales Performance (4 metrics)
```
| Metric | Description | Example | Tooltip |
|--------|-------------|---------|---------|
| Avg Deal Size | Average transaction value | $450K | "Average sales price for sold properties this period" |
| Pipeline Value | Estimated value of in-progress deals | $3.2M | "Total value of all properties in contract/negotiation" |
| Sales Velocity | Days from listing to contract | 18 days | "Average days to get first offer after listing" |
| Repeat Clients | % of deals from repeat buyers | 24% | "Percentage of sales to previous clients or referrals" |
```

### Market Health (4 metrics)
```
| Metric | Description | Example | Tooltip |
|--------|-------------|---------|---------|
| Market Absorption | Months of inventory at current pace | 3.2 mo | "How many months to sell all current inventory" |
| Price Trends | MoM price change | +2.3% | "Average price change month-over-month" |
| Listings Expiring | Expiring listings (stale inventory) | 12 | "Listings approaching expiration dates" |
| New Listings MTD | New properties added this month | 28 | "Fresh inventory brought to market" |
```

### Team Performance (3 metrics)
```
| Metric | Description | Example | Tooltip |
|--------|-------------|---------|---------|
| Top Agent | Best performing agent MTD | João (6 sales) | "Agent with most transactions this month" |
| Closing Rate | % of pipeline reaching closing | 68% | "Percentage of contracts that close successfully" |
| Avg Commission | Average commission per agent | $12,500 | "Average earnings per transaction per agent" |
```

### Pipeline & Forecasting (3 metrics)
```
| Metric | Description | Example | Tooltip |
|--------|-------------|---------|---------|
| Forecast (Next 30d) | Expected closings next month | $2.1M | "Projected revenue from pipelines maturing in 30 days" |
| Stage Distribution | Breakdown of deal stages | "8 new, 5 active, 4 contract" | "Count of deals in each pipeline stage" |
| At-Risk Deals | Deals needing attention | 3 | "Deals past expected timeline or client concern" |
```

### Alerts & Anomalies (2-3 metrics)
```
| Metric | Description | Example | Tooltip |
|--------|-------------|---------|---------|
| Overpriced Alerts | Listings above market comps | 4 | "Properties priced >10% above similar recent sales" |
| Stalled Negotiations | Stuck in negotiation >30d | 2 | "Deals not progressing toward contract" |
| Commission Pending | Commissions awaiting payment | $45K | "Earned commissions not yet disbursed" |
```

---

## Implementation Strategy

### Phase 1 (Complete ✅)
- 8 headline metrics (transaction volume, active listings)
- 4 additional metrics (conversion, days on market, pricing, growth)
- **Total: 12 metrics in 2 sections**

### Phase 2 (Proposed)
- Add 12-16 more metrics in 4-5 additional sections
- Group by business function (Sales, Market, Team, Pipeline, Alerts)
- Each with its own tooltip explanation
- Collapsible sections for UX flexibility

### Phase 3 (Future)
- Real-time data integration with Supabase
- Configurable metric display (drag-and-drop, hide/show)
- Trend indicators (sparklines, percentage change)
- Comparison views (vs last month, vs forecast)
- Alert badges on metrics needing attention

---

## Data Source Mapping

For implementation, these metrics would pull from:

| Data Source | Metrics |
|-------------|---------|
| **Listings Table** | Active listings, Days on Market, New Listings, Expiring Listings |
| **Transactions Table** | TCLV, Closed listings, Deal count, Average deal size |
| **Pipeline/Deals** | Under contract, Pipeline value, Stage distribution, At-risk deals |
| **Users/Agents** | Top agent, Commission tracking, Closing rate |
| **Market Comps** | Price per m², Price trends, Overpriced alerts |
| **Forecast** | Next 30d forecast, 60d forecast |

---

## UX Recommendations

1. **Dashboards by Role:**
   - Admin: All 24+ metrics
   - Agent: Top 8-10 (their deals, rankings, commission)
   - Team Lead: 12-15 (team performance, pipeline)

2. **Keyboard Shortcuts:** 
   - Double-click metric to drill down
   - Right-click for quick filters

3. **Mobile Optimizations:**
   - Collapse sections on small screens
   - Primary metrics always visible (top 4)

4. **Real-time Badges:**
   - 🔴 Red: Alert (stalled, overpriced)
   - 🟡 Yellow: Attention needed (expiring soon)
   - 🟢 Green: On track (good trends)

---

## Questions for Product Team

1. Should metrics be configurable per user/role?
2. Which 4-6 metrics should always be visible on load?
3. Should historical trends be visible (sparklines)?
4. Do we want predictive analytics (forecast confidence)?
5. Should metrics sync real-time or update every 15 minutes?
