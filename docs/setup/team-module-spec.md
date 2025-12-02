## Team module (admin-only, permission-gated)

Summary: Org chart, directory, roles/permissions, seats/headcount, docs/compliance, equipment/access, and a unified Add Person flow. Viewable to users who have access to the Team tab via RBAC; admin-only for management features.

### Top bar
- Interactive Org Chart (full-width)
- Right: Global search, + Add Person, Export (PNG/PDF/SVG), Filters (Department, City, Role, Status)

### Tabs
- Directory • Roles & Permissions • Seats & Headcount • Docs & Compliance • Equipment & Access

### Org Chart
- Views: Tree, Matrix, Geographic, Vendor layer
- Node cards: photo, name, title/role, department, city, reports, current focus
- Quick actions: View Profile • Assign Manager • Start 1:1 • Message • Add Report
- Overlays: RACI, Capacity & Availability, Compliance
- Interactions: drag/drop reassign, multi-select, snapshot/versions, search highlight, zoom/pan
- Metrics: Headcount (Employees/Contractors), Open Seats, Avg Span of Control, % Compliant

### Directory
- Global search: name, email, phone/WhatsApp, role, department, city, skills, languages, CRECI/OAB/CPF, vendor name, tags
- Advanced filters: status, contract type, 2FA status, permission set, license expiry, last login, SLA breaches, territory
- Results: cards/table + bulk actions

### Add Person (Employee / Executive / Third-Party)
- One flow with type-specific fields; all labels PT/EN/ES
- Sections: Identity & Contact; Role & Org; Legal & Credentials; Access & Security; Finance & Compensation; Workload & Scheduling; Skills & Responsibilities; Equipment & Badges; Compliance & Expirations; Emergency & References; Attachments & E-Sign

### Gaps / TODOs
- <span style="color:#e11d48; font-weight:700">MISSING DB/API</span>: People master data (vendors/contractors, identities, addresses, skills, equipment) beyond `stella.employees`. We need tables: `stella.people`, `stella.vendors`, `stella.credentials`, `stella.assets`, `stella.compliance_items`, `stella.raci_assignments`, `stella.territories`, `stella.documents`.
- <span style="color:#e11d48; font-weight:700">MISSING DB/API</span>: Org chart relationships across employees and third-parties (current `employees.manager_id` covers employees only).
- <span style="color:#e11d48; font-weight:700">MISSING DB/API</span>: Audit logs for role/scope changes; versioned snapshots of org chart.
- <span style="color:#e11d48; font-weight:700">MISSING DB/API</span>: Exports for org chart (PNG/PDF/SVG) and directory (CSV) as endpoints or client-side renderers.
- <span style="color:#e11d48; font-weight:700">MISSING SERVICE</span>: CPF/CNPJ validation service (server-side) and credential verification (CRECI/OAB lookups).
- <span style="color:#e11d48; font-weight:700">MISSING INTEGRATION</span>: E-sign (Clicksign/ZapSign/DocuSign), Calendar sync for 1:1 and availability, Messaging (WhatsApp), Storage for document uploads.
- <span style="color:#e11d48; font-weight:700">MISSING METRICS</span>: Compliance score calculation, headcount/open seats, span of control computed from DB, utilization.

### Current implementation (scaffold)
- UI scaffolds for Org Chart, Directory, Roles & Permissions, Seats & Headcount, Docs & Compliance, Equipment & Access.
- In-memory data with filters and Add Person wizard (steps: identity → role → review).
- Input validation for required fields and CPF/CNPJ format (client-side regex only; server validation TBD).

### Data model alignment (Supabase)
- Existing: `stella.roles`, `stella.permissions`, `stella.role_permissions`, `stella.user_roles`, `stella.user_permissions`, `stella.user_scopes`, `stella.employees`.
- Proposed new tables (sketch):
  - `stella.people` (union: employees + third-parties, with `type`, `vendor_id`, and linkage to `auth.users` when applicable)
  - `stella.vendors` (companies for contractors)
  - `stella.credentials` (CRECI/OAB/certifications with issue/expiry and attachments)
  - `stella.assets` (issued devices, badges, keys)
  - `stella.documents` (uploads + e-sign status)
  - `stella.compliance_items` (required packs per role, completion %, expiries)
  - `stella.raci_assignments` (person × process × role R/A/C/I)
  - `stella.territories` (geographies & polygons)

### Acceptance criteria mapping
- Org chart render <1s ≤300 nodes: use virtualized canvas/SVG and memoized trees.
- Search ≤200ms: pre-index with fuse.js/lunr client-side or server RPC with trigram.
- Wizard blocks publish without required docs: enforce via `stella.compliance_items` + RLS checks.
- Role/scope changes instant + audited: trigger audit table and cache invalidation.
- Exports: client canvas/SVG export and CSV for directory.
