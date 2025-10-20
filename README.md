# Stella Real Estate

A clean, mobile-first React + Vite + Tailwind starter for a real estate site with routing and i18n (EN/PT).

## Quickstart

1. **Install Node.js 18+** (includes npm). On macOS, easiest via Homebrew:
   ```bash
   brew install node
   ```
2. Navigate to the project folder:
   ```bash
   cd stella-real-estate
   npm install
   npm run dev
   ```
3. Your site will open at `http://localhost:5173/`.

## Build & preview
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, "Add New Project" and import the repo.
3. Framework Preset: Vite. Build Command: `npm run build`. Output Directory: `dist`.
4. Environment Variables (required for Supabase):
   - `VITE_SUPABASE_URL` = https://YOUR-PROJECT.supabase.co
   - `VITE_SUPABASE_ANON_KEY` = YOUR_ANON_KEY
5. Create a `Production` and `Preview` environment containing those vars.
6. Click Deploy. SPA routes are handled by `vercel.json` rewrites.

Optional: set a custom domain in Vercel's Project Settings.

## Supabase RBAC bootstrap
SQL scripts live in `supabase/migrations`.

## Resend email (contact form)
- Add these env vars in Vercel (and optionally in a local `.env` for testing serverless locally):
   - `RESEND_API_KEY` = re_your_resend_api_key
   - `RESEND_FROM` = "Stella Imóveis <no-reply@yourdomain>"
   - `RESEND_TO` or `RESEND_DEFAULT_TO` = destination inbox
- Endpoint: `POST /api/send-email` with `{ name, email, message }`.

Apply in Supabase SQL Editor or CLI:
1. Open Supabase Dashboard → SQL → New query.
2. Paste the contents of `supabase/migrations/2025-10-13-rbac.sql` and run.
3. Add RLS policies based on your needs; examples are commented in the file.
4. Seed `role_permissions` per the spec’s default bundles.

## Notes
- Tailwind is configured with Inter as the default sans font.
- Routes: `/` (home), `/about`, `/contact`, `/listings`, `/projects`, `/privacy`, `/legal`, `/list-your-property`, `/login`, `/admin`.
- Language switcher (PT/EN) is in the header. Locales live in `src/locales/{pt|en}/common.json`.
- Edit `src/components/Header.tsx`, `src/App.tsx`, and pages under `src/pages/` to customize.
- Dark mode follows system preference.

## Translation audit / sync

Audit locale keys and optionally fill missing ones (using base language values by default):

```bash
npm run i18n:audit
```

Options:
- `BASE_LANG` (default `pt`) to change base language.
- `TRANSLATE_PROVIDER` can be set later to enable automatic translation.

Schedule this in CI or a cron job to keep locales in sync.
