# Investor Relations System

Complete implementation guide for the Stella Real Estate investor relations platform, including public-facing pages, gated portal, and equity management system.

## Overview

A Fortune 500-caliber investor relations system with:
- **Public investor page** (`/investidores`) - Calm, professional, metrics-driven
- **Investor portal** (gated) - Secure access for authorized investors
- **Equity management** (admin) - Internal cap table, agreements, voting, and transactions

---

## 1. Public Investor Page

**Route:** `/investidores` (Portuguese), `/investors` (redirect)

### Implemented Features

#### Hero Section
- **Headline:** "Operating system for modern real estate empires"
- **Subhead:** Investor materials, performance metrics, and governance portal access
- **Primary CTAs:**
  - Investor Portal Login → `/investors/login`
  - Request Access → `/investors/request-access`

#### Stats Strip (Latest Quarter Metrics)
- GMV: $12.4M
- ARR: $2.1M
- YoY Growth: 340%
- Take Rate: 2.8%
- Gross Margin: 87%
- NPS: 72

*Note: These are mock values. Replace with real data from API/database.*

#### Trust Bar
- Partner/customer logos (CRECI-SP, Supabase, Vercel, Stripe)
- Press mentions section (to be added)

#### Investment Thesis (5 Cards)
1. **Market Opportunity** - TAM $180B in Brazil, expanding to $450B+ LATAM
2. **Product Moat** - 3D pipeline, Constellation CRM, Ballet automation
3. **Business Model** - SaaS + payments (2.8%) + services (87% margin)
4. **Traction & Retention** - 94% logo retention, 127% NRR, 340+ brokerages
5. **Regulatory Posture** - CRECI aligned, LGPD compliant

#### Unit Economics
- LTV:CAC Ratio: 6.2:1
- CAC Payback: 8 months
- Contribution Margin: 74%
- Magic Number: 1.8

#### Platform Flywheel
Visual representation of network effects:
- Supply → Media → Conversion → Payments → Data → More Supply

#### Governance & Structure
- **CEO:** Stella Mary Barbosa
- **CTO:** Z. Rosser McIntosh
- Corporate structure note (Brazilian entity, planned holding)

#### ESG & Impact
- **Data Privacy:** LGPD compliant, fair housing policies
- **Sustainability:** Remote tours reduce carbon, efficient infrastructure
- **Social Impact:** Democratizing tools, CRECI education

#### Latest Updates
- Q3 2025 Investor Letter feed
- Link to portal updates section

#### IR Footer
- Contact: ir@stella.com.br
- Documents: Investor deck, press kit
- Legal: Forward-looking statements disclaimer

### Design System

**Aesthetic:**
- Restrained palette: slate/stone base, single brand accent
- Ample white space, 12-column grid
- Clean, professional typography (currently using system fonts)
- Fortune 500 calm and credible

**Components:**
- Stat tiles with large numbers (tabular numerals)
- Icon cards for thesis points
- Timeline-style activity feed
- Document lists with badges

---

## 2. Investor Login & Request Access

### Login Page (`/investors/login`)

**Authentication Options:**
1. **SSO Providers**
   - Google Workspace
   - Microsoft 365
   
2. **Magic Link**
   - Email-based passwordless auth
   - Sends secure one-time link

**Security Features:**
- Mandatory 2FA (TOTP) after login
- Session timeouts
- Device verification (to be implemented)
- IP allowlist (optional, to be implemented)

**Implementation Status:**
✅ UI complete
🔄 Auth integration pending (SSO + magic link)
🔄 2FA setup flow pending

### Request Access Page (`/investors/request-access`)

**Form Fields:**
- Full Name *
- Firm / Organization *
- Email Address *
- Reason for Access * (textarea)
- NDA Acceptance * (checkbox)

**Flow:**
1. User fills form
2. Clicks checkbox to accept NDA (with link to full document)
3. System logs: form data, NDA consent, IP, timestamp
4. Admin review (1-2 business days)
5. On approval: invite email → magic link → forced 2FA setup

**Implementation Status:**
✅ UI complete
🔄 Backend API pending
🔄 NDA document needs to be added
🔄 Admin approval workflow pending

---

## 3. Investor Portal (Gated)

**Base Route:** `/investors/portal/*`

### Planned Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/investors/portal/home` | Dashboard with tiles | 🔄 To build |
| `/investors/portal/cap-table` | Ownership & shares | 🔄 To build |
| `/investors/portal/kpis` | Financial metrics & charts | 🔄 To build |
| `/investors/portal/data-room` | Document repository | 🔄 To build |
| `/investors/portal/updates` | Investor letters & communications | 🔄 To build |
| `/investors/portal/board` | Board-only section | 🔄 To build |

### Access Control Model

**Roles:**
- **Viewer (LP)** - Read-only access to basics
- **Investor+** - Full investor access, can export data
- **Board** - Board-only sections + voting
- **Finance** - Financial detail access
- **Legal** - Document vault full access

**Implementation:**
- RBAC enforced server-side
- Folder-level permissions in data room
- Audit trail for all views/downloads

### Portal Home (Dashboard)

**Tile Layout:**
- Cap Table
- Financials & KPIs
- Data Room
- Investor Updates
- Board Portal
- Notices & Compliance

### Cap Table Module

**Views:**
- As-converted
- Fully diluted

**Breakdown:**
- Common shares
- Preferred (by round)
- SAFEs/convertibles
- Options (issued)
- Warrants
- ESOP remaining

**Features:**
- Ownership percentages
- Cost basis
- Pro-rata rights
- Vesting schedules (board-only detail)
- **Export:** CSV/PDF with dynamic watermark (name, email, timestamp)

### Financials & KPIs

**Core Metrics:**
- GMV, revenue by stream (SaaS, payments, services)
- MRR/ARR
- Gross margin

**Efficiency:**
- CAC, LTV, CAC payback
- Magic number

**Retention:**
- Logo retention
- Net revenue retention
- Cohort curves

**Pipeline:**
- Supply (listings, projects)
- Demand (MAUs, inquiries)
- Conversion rates

**Charts:**
- Monthly and QoQ
- Interactive tooltips
- Downloadable as PNG/PDF (watermarked)

### Data Room

**Structure:**
- Corporate (charter, bylaws, option plan, consents)
- Financial (audited/unaudited statements, tax docs)
- Commercial (contracts, partnerships)
- Product & Security (architecture, pen-test, SOC2, LGPD)
- HR/ESOP (headcount, ESOP policy - no PII)

**Security:**
- Folder-level permissions
- Watermarked PDFs
- No-copy on sensitive documents
- Secure viewer (no direct file URLs)

### Investor Updates

**Content:**
- Monthly letters
- Quarterly deep dives
- Board decks (board-only)

**Features:**
- Email subscriptions
- ICS calendar for meetings
- Q&A submission → searchable FAQ

### Board Portal

**Features:**
- Meeting calendar
- Agendas & pre-reads
- Minutes
- Resolution voting
- Action item tracking
- Secure note-taking

---

## 4. Equity Management (Admin)

**Route:** `/admin/equity`

### Overview Tab

**Key Metrics:**
- Company Valuation: $15.5M (post-money)
- Total Authorized: 10,000,000 shares
- Outstanding: 7,850,000 (78.5%)
- Option Pool: 1,500,000 (15%)

**Quick Actions:**
- Issue Shares
- New Agreement
- Create Vote
- Export Data

**Recent Activity Feed:**
- Option grants
- Vote completions
- Valuation updates
- Share transfers

### Cap Table Tab

**Table Columns:**
- Shareholder name
- Type (Common, Preferred, Options, etc.)
- Number of shares
- % Ownership
- Value (at current valuation)

**Views:**
- As-converted
- Fully diluted

**Export:**
- CSV with full detail
- PDF summary

**Current Mock Data:**
- Founders: 6M shares (60%) - $9.3M
- Series Seed: 1.5M shares (15%) - $2.3M
- Employee Options: 350K issued (3.5%) - $543K
- Option Pool: 1.15M remaining (11.5%) - $1.8M

### Agreements Tab (To Build)

**Features:**
- Generate share purchase agreements
- Option grant agreements
- Transfer agreements
- Custom terms & conditions
- Digital signature integration
- Document versioning

### Voting Tab (To Build)

**Features:**
- Create shareholder votes
- Board resolutions
- Voting weight calculation
- Real-time results
- Vote history & audit trail

**Vote Types:**
- Simple majority
- Super-majority
- Unanimous
- Board-only
- Weighted by shares

### Transactions Tab (To Build)

**Features:**
- Issue new shares
- Transfer shares
- Buy/sell orders
- Secondary market transactions
- Exercise options
- Vesting schedules

**Transaction Log:**
- Date & time
- Type
- Parties involved
- Number of shares
- Price per share
- Status (pending, completed, cancelled)

---

## 5. Security Implementation

### Authentication
- ✅ SSO (Google, Microsoft) - UI ready
- 🔄 Magic link - UI ready, backend pending
- 🔄 Mandatory TOTP 2FA
- 🔄 Device verification
- 🔄 IP allowlist (optional)

### Authorization
- 🔄 Server-side RBAC
- 🔄 Folder-level permissions
- 🔄 View/export restrictions

### Audit & Compliance
- 🔄 Immutable audit trail
- 🔄 Document watermarking
- 🔄 No-copy PDF protection
- 🔄 Session management

### Data Protection
- 🔄 Encryption at rest
- 🔄 Encryption in transit (HTTPS)
- 🔄 LGPD compliance
- 🔄 Data retention policies

---

## 6. Integration Points

### Cap Table Integration
- **Options:**
  - Carta API
  - Pulley API
  - Custom internal system
- **Sync Frequency:** Nightly read-model
- **Data:** Shareholders, shares, valuations, vesting

### Financial Data
- **Source:** Data warehouse (dbt views)
- **Metrics:** GMV, ARR, MRR, retention, etc.
- **Update Frequency:** Real-time or daily

### Document Storage
- **Options:**
  - Supabase Storage (current)
  - AWS S3
  - Azure Blob
- **Features:** Versioning, access control, watermarking

### Analytics
- **Public Page:** Standard analytics (Google Analytics, Plausible)
- **Portal:** Separate analytics, no marketing trackers
- **Privacy:** Respect investor confidentiality

---

## 7. Legal & Compliance

### Disclaimers

**Forward-Looking Statements:**
> This website contains forward-looking statements regarding the company's business, financial condition, and prospects. Actual results may differ materially from expectations. Past performance does not guarantee future results.

**Securities Notice:**
> The information on this website is not an offer to sell or a solicitation to buy any securities. Any offers will be made only through appropriate legal documentation and in compliance with applicable securities laws.

**Confidentiality:**
> Access to certain areas requires authorization and is subject to confidentiality obligations. Unauthorized access, use, or disclosure is prohibited.

### Required Documents
- ✅ Forward-looking statement disclaimer (on page)
- 🔄 Investor NDA (needs PDF)
- 🔄 Share purchase agreement templates
- 🔄 Option grant templates
- 🔄 Board resolutions templates

---

## 8. Implementation Checklist

### Phase 1: Public Page ✅
- [x] Hero section with CTAs
- [x] Stats strip
- [x] Investment thesis cards
- [x] Unit economics
- [x] Flywheel visualization
- [x] Governance section
- [x] ESG section
- [x] Updates feed
- [x] IR footer with disclaimer

### Phase 2: Auth & Access 🔄
- [x] Login page UI
- [x] Request access page UI
- [ ] SSO integration (Google, Microsoft)
- [ ] Magic link backend
- [ ] 2FA setup flow
- [ ] NDA document
- [ ] Admin approval workflow
- [ ] Invite email system

### Phase 3: Investor Portal 📋
- [ ] Portal layout & navigation
- [ ] Home dashboard
- [ ] Cap table module
- [ ] KPIs & financials module
- [ ] Data room
- [ ] Investor updates feed
- [ ] Board portal
- [ ] Document watermarking
- [ ] Export controls

### Phase 4: Equity Admin 🔄
- [x] Equity page UI
- [x] Overview tab
- [x] Cap table tab (basic)
- [ ] Cap table API integration
- [ ] Agreements generator
- [ ] Voting system
- [ ] Transaction management
- [ ] Vesting schedules
- [ ] Reporting & exports

### Phase 5: Security & Compliance 📋
- [ ] RBAC implementation
- [ ] Audit logging
- [ ] Document encryption
- [ ] Watermarking system
- [ ] Session management
- [ ] IP allowlist
- [ ] Legal document vault

---

## 9. API Endpoints (To Build)

### Public API
```
POST /api/investors/request-access
  - Body: { name, firm, email, reason, ndaAccepted, ipAddress }
  - Returns: { success, message }

POST /api/investors/send-magic-link
  - Body: { email }
  - Returns: { success }
```

### Protected API (Investor Portal)
```
GET /api/investors/portal/cap-table
  - Query: ?view=as-converted|fully-diluted
  - Returns: { shareholders[], totals, lastUpdated }

GET /api/investors/portal/kpis
  - Query: ?period=month|quarter|year
  - Returns: { metrics{}, charts{} }

GET /api/investors/portal/documents
  - Query: ?folder=corporate|financial|etc
  - Returns: { documents[] }

GET /api/investors/portal/updates
  - Returns: { updates[] }

POST /api/investors/portal/documents/:id/download
  - Returns: Watermarked PDF stream
```

### Admin API (Equity Management)
```
GET /api/admin/equity/overview
  - Returns: { valuation, shares, recent_activity[] }

GET /api/admin/equity/cap-table
  - Returns: { shareholders[], breakdown }

POST /api/admin/equity/shares/issue
  - Body: { recipient, type, quantity, price, terms }
  - Returns: { transaction_id, agreement_url }

POST /api/admin/equity/vote/create
  - Body: { title, description, options[], deadline }
  - Returns: { vote_id }

GET /api/admin/equity/transactions
  - Query: ?status=pending|completed
  - Returns: { transactions[] }
```

---

## 10. Next Steps

### Immediate (Week 1)
1. Set up authentication infrastructure (Supabase Auth or Auth0)
2. Implement SSO providers
3. Create NDA document (legal review)
4. Build admin approval workflow

### Short-term (Weeks 2-4)
1. Build investor portal layout
2. Implement cap table data model
3. Create KPI dashboard with charts
4. Set up document storage & watermarking
5. Build data room with folder structure

### Medium-term (Weeks 5-8)
1. Complete equity admin features
2. Build agreement generators
3. Implement voting system
4. Add transaction management
5. Create audit logging system

### Long-term (Weeks 9-12)
1. Board portal features
2. Advanced analytics
3. Secondary market features
4. Mobile responsiveness audit
5. Accessibility audit (WCAG AA)

---

## 11. Design Assets Needed

- [ ] High-res partner/customer logos
- [ ] Press mention screenshots/logos
- [ ] Professional headshots (CEO, CTO, board)
- [ ] Company logo variations
- [ ] Chart/graph templates
- [ ] PDF watermark design
- [ ] Email templates (magic link, invite, notifications)
- [ ] NDA legal document

---

## 12. Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router 7
- TailwindCSS
- lucide-react (icons)
- i18next (internationalization)

**Backend:**
- Supabase (auth, database, storage)
- Prisma ORM
- Vercel Edge Functions

**Charts & Visualization:**
- Chart.js or Recharts (to be added)
- D3.js for complex visualizations (optional)

**Document Processing:**
- PDF.js for rendering
- PDFKit or similar for watermarking
- DocuSign or HelloSign for signatures (optional)

**Email:**
- Resend API (already installed)

---

## Contact

For questions about implementation:
- **Technical:** engineering@stella.com.br
- **Product:** product@stella.com.br
- **Investor Relations:** ir@stella.com.br

---

**Last Updated:** November 5, 2025
**Version:** 1.0.0
**Status:** Phase 1 Complete, Phases 2-5 In Progress
