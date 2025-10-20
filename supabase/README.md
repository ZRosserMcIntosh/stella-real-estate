# Database schema and migrations

This project uses Supabase (Postgres) with SQL migrations as the source of truth. We do NOT use Prisma Migrate here.

- Remote project ref: `fxvxdvwiqgpypcqmljja`
- Schema: `stella`
- Migrations live in `supabase/migrations/*.sql` and are applied with `supabase db push`.

## Making changes
1. Create a new migration file with a timestamped name and your SQL.
   - Example filename: `YYYYMMDDHHMMSS_my_change.sql`
   - Place it in `supabase/migrations/`.
2. Apply to the remote DB:
   - Ensure you’re logged in and linked (`supabase login`, `supabase link`).
   - Run: `supabase db push`.

Tip: Prefer additive/idempotent SQL when possible (e.g., `if not exists`, `on conflict do nothing`).

## Schema snapshot (optional)
You can keep a read-only snapshot at `supabase/schema.sql` for code review and reference.

Option A — CLI (requires Docker Desktop running):
- `supabase db dump --schema stella --file supabase/schema.sql`

Option B — Supabase Dashboard:
- SQL Editor: verify objects with `select table_name from information_schema.tables where table_schema='stella';`.
- Tables > three-dots > Generate SQL to export DDL and save to `supabase/schema.sql`.

Note: Do not edit `schema.sql` directly; it’s a snapshot. Authoritative changes should go into a new migration file.

## About Prisma
Prisma is optional. If you want a Prisma schema for modeling/types only:
- You may generate `schema.prisma` locally via introspection (e.g., `prisma db pull`) to aid types/ERD.
- Keep migrations in `supabase/migrations` (don’t use Prisma Migrate in this repo).
- Do not commit secrets (DATABASE_URL).

## Troubleshooting
- CLI skipping migrations: filenames must match `<timestamp>_name.sql`.
- Need to adjust a deployed object: create a follow-up migration; avoid destructive edits in-place on production.
