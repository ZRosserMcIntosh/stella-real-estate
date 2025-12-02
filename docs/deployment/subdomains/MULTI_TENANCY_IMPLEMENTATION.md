# Multi-Tenancy Architecture Implementation Guide

This document outlines the complete multi-tenancy architecture for Stella Real Estate, transforming it into a "Shopify for Realtors" platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Current Routes](#current-routes)
3. [Database Schema](#database-schema)
4. [Implementation Steps](#implementation-steps)
5. [Signup & Onboarding Flow](#signup--onboarding-flow)
6. [Domain Routing](#domain-routing)
7. [Access Control](#access-control)
8. [Retail Platform Integration](#retail-platform-integration)

---

## Overview

### Core Concept: Workspace-Based Multi-Tenancy

**Everything hangs off a single concept: `workspace` (tenant)**

- **Stella's workspace** = Internal marketing site + admin + listings
- **Each realtor/brokerage** = Their own workspace + site + admin + listings
- **Retail platform** = Aggregates published listings from all workspaces

### Current Structure

```
├── Main Site (/)                          → Stella's marketing site
├── /constellation                         → Public Constellation landing page
├── /sub/constellation                     → Constellation admin portal (temp)
├── /sub/stellareal                        → Retail platform (temp)
└── /admin/*                              → Current admin (to be workspace-scoped)
```

### Future Structure

```
├── stella-real-estate.vercel.app          → Stella's marketing site
├── constellation.stellareal.com.br        → Public Constellation landing
├── constellation.{tenant}.stellareal.com.br → Tenant admin portals
├── {tenant}.stellareal.com.br             → Tenant public sites
└── stellareal.stellareal.com.br           → Retail aggregator platform
```

---

## Current Routes

### Public Routes
- `/` - Main Stella marketing site
- `/constellation` - Constellation product landing page
- `/sub/stellareal` - Retail platform (temporary)
- `/sub/constellation` - Constellation admin login (temporary)

### Admin Routes
- `/admin/*` - Current admin dashboard (needs workspace scoping)
- `/login` - Authentication
- `/precos` - Pricing page

---

## Database Schema

### 1. Core Tenancy Tables

#### `workspaces`
Multi-tenant isolation layer - every realtor/brokerage is a workspace.

```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,                          -- e.g. "Imobiliária Santos"
  type TEXT NOT NULL CHECK (type IN ('single-agent', 'brokerage', 'developer', 'internal')),
  slug TEXT UNIQUE NOT NULL,                   -- URL-safe identifier
  default_site_id UUID REFERENCES sites(id),   -- Primary site for this workspace
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspaces_type ON workspaces(type);
```

#### `workspace_members`
Links users to workspaces with roles.

```sql
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'AGENT', 'STAFF')),
  invited_by_user_id UUID REFERENCES auth.users(id),
  invite_code TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_role ON workspace_members(role);

-- Ensure only one OWNER per workspace
CREATE UNIQUE INDEX idx_workspace_members_one_owner 
ON workspace_members(workspace_id) 
WHERE role = 'OWNER';
```

### 2. Site Management

#### `sites`
Each workspace can have one or more sites (usually one).

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                          -- User-facing site name
  slug TEXT NOT NULL,                          -- URL slug (unique per workspace)
  subdomain TEXT,                              -- e.g. "meu-site"
  custom_domain TEXT,                          -- e.g. "meuimovel.com.br"
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'suspended')),
  template_id UUID,                            -- Reference to site template
  onboarding_step TEXT DEFAULT 'name' CHECK (onboarding_step IN ('name', 'domain', 'template', 'done')),
  settings JSONB DEFAULT '{}',                 -- Site-specific settings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(subdomain),
  UNIQUE(custom_domain)
);

CREATE INDEX idx_sites_workspace ON sites(workspace_id);
CREATE INDEX idx_sites_subdomain ON sites(subdomain);
CREATE INDEX idx_sites_custom_domain ON sites(custom_domain);
CREATE INDEX idx_sites_status ON sites(status);
```

### 3. Subscription Management

#### `plans`
Available subscription plans.

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,                   -- 'Starter', 'Pro', 'Team', etc.
  slug TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  limits JSONB NOT NULL DEFAULT '{}',          -- { "listings": 10, "users": 1, "sites": 1 }
  features JSONB NOT NULL DEFAULT '[]',        -- Array of feature flags
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `subscriptions`
Links workspaces to plans and billing.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  billing_provider TEXT CHECK (billing_provider IN ('stripe', 'mercadopago')),
  billing_customer_id TEXT,
  billing_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_workspace ON subscriptions(workspace_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_billing_customer ON subscriptions(billing_customer_id);
```

### 4. Listings (Core Entity)

#### `listings`
Central table for all properties - workspace-scoped.

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('for-sale', 'for-rent', 'new-project')),
  
  -- Pricing
  price DECIMAL(12,2),
  currency TEXT DEFAULT 'BRL',
  price_per_m2 DECIMAL(10,2),
  
  -- Location
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT,
  neighborhood TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Property Details
  property_type TEXT CHECK (property_type IN ('apartment', 'house', 'condo', 'commercial', 'land', 'farm')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  garages INTEGER,
  area_m2 DECIMAL(10,2),
  
  -- Status & Visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'sold', 'rented')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  published_at TIMESTAMPTZ,
  
  -- Retail Integration
  publish_to_retail BOOLEAN DEFAULT false,     -- Include in retail aggregator
  featured BOOLEAN DEFAULT false,
  featured_until TIMESTAMPTZ,
  
  -- Additional Data
  features JSONB DEFAULT '{}',                 -- Property features, amenities
  metadata JSONB DEFAULT '{}',                 -- Extra data
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_listings_workspace ON listings(workspace_id);
CREATE INDEX idx_listings_site ON listings(site_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_visibility ON listings(visibility);
CREATE INDEX idx_listings_publish_to_retail ON listings(publish_to_retail);
CREATE INDEX idx_listings_listing_type ON listings(listing_type);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_city_state ON listings(city, state);
CREATE INDEX idx_listings_price ON listings(price);
```

#### `listing_media`
Photos, videos, 3D tours for listings.

```sql
CREATE TABLE listing_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', '3d_tour', 'floorplan', 'video_bg')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listing_media_listing ON listing_media(listing_id);
CREATE INDEX idx_listing_media_type ON listing_media(type);
```

### 5. Task Management (Balé)

#### `tasks`
Workspace-scoped task management.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'blocked', 'done', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id),
  
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_site ON tasks(site_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

#### `projects` (Optional - for Balé organization)
Group tasks into projects/lists.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_workspace ON projects(workspace_id);
```

### 6. Site Builder (Optional)

#### `pages`
Custom pages for sites.

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  path TEXT NOT NULL,                          -- '/', '/comprar', '/sobre'
  title TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(site_id, path)
);

CREATE INDEX idx_pages_site ON pages(site_id);
```

#### `page_sections`
Sections within pages (hero, listings grid, text blocks, etc.).

```sql
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                          -- 'hero', 'listings-grid', 'text-block', etc.
  config JSONB NOT NULL DEFAULT '{}',          -- All design data and content
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id);
CREATE INDEX idx_page_sections_sort ON page_sections(page_id, sort_order);
```

---

## Implementation Steps

### Phase 1: Database Setup ✓

1. Create migration files for all tables above
2. Run migrations against Supabase
3. Set up Row Level Security (RLS) policies

### Phase 2: Workspace Context

1. **Create Workspace Context** (`src/context/WorkspaceContext.tsx`)
   - Tracks current workspace
   - Provides workspace switching
   - Loads workspace data

2. **Update AuthContext**
   - Load user's workspaces on login
   - Set default workspace
   - Store workspace_id in session

3. **Middleware for Workspace Scoping**
   - All API calls include workspace_id
   - All queries filter by workspace_id

### Phase 3: Onboarding Flow

1. **Post-Payment Workspace Creation**
   - After Stripe checkout success
   - Create workspace
   - Create workspace_member (OWNER)
   - Create subscription

2. **Site Setup Wizard** (`/onboarding/site-setup`)
   - Step 1: Name your site
   - Step 2: Choose subdomain
   - Step 3: Select template
   - Create site record
   - Redirect to Constellation admin

### Phase 4: Domain Routing

1. **Subdomain Detection Middleware**
   - Extract subdomain from hostname
   - Lookup site by subdomain
   - Load workspace context
   - Scope all queries

2. **Route Resolution**
   ```
   meu-site.stellareal.com.br → Load site → Load workspace → Show tenant site
   constellation.stellareal.com.br → Show admin portal → Authenticate → Load workspace
   stellareal.stellareal.com.br → Show retail platform
   ```

### Phase 5: Update Existing Features

1. **Listings**
   - Add workspace_id to all queries
   - Filter by workspace in admin
   - Add publish_to_retail toggle

2. **Balé Tasks**
   - Scope by workspace_id
   - Link to sites (optional)

3. **Team Management**
   - Show workspace members
   - Invite system (workspace-scoped)

4. **Analytics**
   - Filter by workspace
   - Show workspace-level metrics

### Phase 6: Retail Platform

1. **Retail Listings Page**
   - Query: `WHERE publish_to_retail = true AND status = 'published' AND visibility = 'public'`
   - Show realtor/workspace info
   - Link to original site

2. **Search & Filters**
   - Location, price, property type
   - Cross-workspace search

---

## Signup & Onboarding Flow

### Current State
1. User signs up → Creates auth.users record
2. User logs in → Goes to /admin

### Target State

#### Step 0: Sign Up + Payment
1. User fills name, email, password
2. Chooses plan on /precos
3. Completes Stripe checkout
4. On payment success:
   - Create user (if not exists)
   - Create workspace (type based on plan)
   - Create workspace_member (OWNER role)
   - Create subscription

#### Step 1: Site Setup Wizard
On first login:
1. Check if user has default_site_id
2. If no → Redirect to `/onboarding/site-setup`
3. Wizard screens:
   - **Screen 1**: "What do you want to call your site?"
     - Input: site name
     - Generate slug: "Imóveis Premium" → "imoveis-premium"
   - **Screen 2**: "Choose your subdomain"
     - Show: `imoveis-premium.stellareal.com.br`
     - Option to customize
     - Note: "You can connect a custom domain later"
   - **Screen 3**: "Choose a template" (optional)
     - Gallery of templates
     - Store template_id
4. Create site record
5. Set workspace.default_site_id
6. Redirect to Constellation admin

#### Step 2: Constellation Admin
- Load workspace context
- Show dashboard with:
  - Quick start guide
  - Add your first listing
  - Customize your site
  - Balé task board

---

## Domain Routing

### Development
```
localhost:5173/                        → Main marketing site
localhost:5173/constellation           → Constellation landing
localhost:5173/sub/constellation       → Admin portal (temp)
localhost:5173/sub/stellareal          → Retail platform (temp)
```

### Production (Phase 1 - Vercel Subdomains)
```
stella-real-estate.vercel.app          → Main marketing site
constellation.stella-real-estate.vercel.app → Constellation landing
stellareal.stella-real-estate.vercel.app   → Retail platform
{tenant}.stella-real-estate.vercel.app     → Tenant sites
```

### Production (Phase 2 - Custom Domain)
```
stella.com.br                          → Main marketing site
constellation.stellareal.com.br        → Constellation landing
stellareal.stellareal.com.br          → Retail platform
{tenant}.stellareal.com.br            → Tenant sites
constellation.{tenant}.stellareal.com.br → Tenant admin (future)
```

### Resolution Logic

```typescript
// Middleware pseudocode
function resolveWorkspace(hostname: string) {
  const subdomain = extractSubdomain(hostname)
  
  if (subdomain === 'constellation') {
    // Admin portal - require auth
    return {
      type: 'admin',
      workspace: getCurrentUserWorkspace()
    }
  }
  
  if (subdomain === 'stellareal') {
    // Retail platform - no workspace
    return {
      type: 'retail',
      workspace: null
    }
  }
  
  if (subdomain) {
    // Tenant site
    const site = await db.sites.findBySubdomain(subdomain)
    return {
      type: 'tenant-site',
      workspace: site.workspace_id,
      site: site
    }
  }
  
  // Main marketing site
  return {
    type: 'marketing',
    workspace: STELLA_INTERNAL_WORKSPACE_ID
  }
}
```

---

## Access Control

### Row Level Security (RLS)

Enable RLS on all workspace-scoped tables:

```sql
-- Example for listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Users can read their workspace's listings
CREATE POLICY "Users can view workspace listings"
ON listings FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);

-- Users can insert into their workspace
CREATE POLICY "Users can create workspace listings"
ON listings FOR INSERT
WITH CHECK (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
    AND role IN ('OWNER', 'ADMIN', 'AGENT')
  )
);

-- Users can update their workspace's listings
CREATE POLICY "Users can update workspace listings"
ON listings FOR UPDATE
USING (
  workspace_id IN (
    SELECT workspace_id 
    FROM workspace_members 
    WHERE user_id = auth.uid()
    AND role IN ('OWNER', 'ADMIN', 'AGENT')
  )
);

-- Retail platform can read published listings
CREATE POLICY "Public can view retail listings"
ON listings FOR SELECT
USING (
  status = 'published' 
  AND visibility = 'public' 
  AND publish_to_retail = true
);
```

### Application Layer

```typescript
// All queries must include workspace filter
const listings = await supabase
  .from('listings')
  .select('*')
  .eq('workspace_id', currentWorkspace.id)
  
// Never accept workspace_id from client
// Always get from authenticated context
const workspaceId = getWorkspaceFromSession()
```

---

## Retail Platform Integration

### How Listings Reach Retail

1. **Realtor Creates Listing** (in Constellation)
   - Creates listing with their workspace_id
   - Sets status = 'draft' initially

2. **Realtor Publishes Listing**
   - Sets status = 'published'
   - Sets visibility = 'public'
   - **Toggles "Show on Stella Real"** → publish_to_retail = true

3. **Retail Platform Query**
```sql
SELECT 
  l.*,
  w.name as workspace_name,
  s.subdomain as workspace_site
FROM listings l
JOIN workspaces w ON l.workspace_id = w.id
JOIN sites s ON l.site_id = s.id
WHERE 
  l.status = 'published'
  AND l.visibility = 'public'
  AND l.publish_to_retail = true
ORDER BY l.published_at DESC
```

### No Duplication, No Sync
- Single source of truth: `listings` table
- Retail is just a filtered view
- Updates propagate instantly
- Realtor controls visibility with one toggle

---

## Next Steps

### Immediate Actions

1. **Create Database Migrations**
   ```bash
   # In prisma/ or supabase/migrations/
   - 001_create_workspaces.sql
   - 002_create_workspace_members.sql
   - 003_create_sites.sql
   - 004_create_plans_subscriptions.sql
   - 005_update_listings.sql
   - 006_create_tasks.sql
   ```

2. **Update Existing Tables**
   - Add workspace_id to listings
   - Migrate existing data to Stella internal workspace
   - Add publish_to_retail column

3. **Build Workspace Context**
   - Create WorkspaceContext provider
   - Update AuthContext
   - Add workspace switcher (for multi-workspace users)

4. **Implement Onboarding**
   - Post-payment webhook handler
   - Site setup wizard
   - First-time user flow

5. **Update Admin Dashboard**
   - Add workspace filter to all queries
   - Show workspace switcher in header
   - Update Balé to be workspace-scoped

### Future Enhancements

- Custom domains (DNS configuration)
- White-label branding
- Advanced team permissions
- Workspace analytics
- API access per workspace
- Multi-workspace user switching

---

## Questions for Copilot

When implementing, ask Copilot to:

1. "Generate SQL migrations for the multi-tenancy schema above"
2. "Create a WorkspaceContext in React with TypeScript"
3. "Update all listing queries to include workspace_id filtering"
4. "Build a site setup onboarding wizard with 3 steps"
5. "Implement subdomain-based routing with workspace resolution"
6. "Create RLS policies for all workspace-scoped tables"
7. "Build a retail platform listings page that aggregates from all workspaces"

---

## Summary

This architecture gives you:

✅ **Complete tenant isolation** - Each realtor/brokerage has their own data
✅ **Scalable structure** - Add unlimited workspaces without schema changes
✅ **Single codebase** - One app serves all tenants
✅ **Retail integration** - Listings can be published to marketplace
✅ **Flexible** - Supports solo agents to large brokerages
✅ **Secure** - RLS + app-layer enforcement
✅ **Clean** - No duplication, single source of truth

This is production-ready "Shopify for Realtors" architecture. 🚀
