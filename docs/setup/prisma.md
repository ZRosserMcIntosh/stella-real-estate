## Prisma setup (Supabase Postgres)

Goal: use Prisma locally for modeling/types and quick queries, while keeping RLS/triggers/functions in SQL migrations under `supabase/migrations`.

### 1) Configure DATABASE_URL
Create `.env` at the repo root (copy `.env.example`) and set:

DATABASE_URL="postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres?schema=stella&pgbouncer=true&connect_timeout=15&sslmode=require"

Note the `?schema=stella` suffix so Prisma targets only the `stella` schema.

### 2) Introspect and generate
Option A — pull models from Supabase:

```bash
npm run prisma:pull
npm run prisma:generate
```

Option B — paste SQL DDL to me here, and I’ll translate to Prisma models with `@@map`, `@map` and correct scalar types, then you can `npm run prisma:generate`.

### 3) Using the client (server-side only)
- Import from `src/lib/prisma.ts` in API routes or serverless functions only.
- Do not import Prisma in browser code.

### 4) Migrations policy
- Keep RLS, triggers, functions, and seed data in `supabase/migrations`.
- Use `prisma db push` only for local prototyping; prefer SQL migrations for production changes.
