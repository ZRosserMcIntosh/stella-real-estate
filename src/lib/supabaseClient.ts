import { createClient } from '@supabase/supabase-js'

// Trim to avoid stray whitespace/newlines causing header mismatch
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || ''
// Support aliases: prefer VITE_SUPABASE_ANON_KEY; allow VITE_SUPABASE_PUBLISHABLE_KEY and legacy VITE_SUPABASE_KEY
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
	?? (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY
	?? (import.meta.env as any).VITE_SUPABASE_KEY
const supabaseAnon = (rawKey as string | undefined)?.trim() || ''

if (import.meta.env.DEV) {
	if (!supabaseUrl || !supabaseAnon) {
		// eslint-disable-next-line no-console
		console.error('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Update .env.local and restart dev server.')
	}
	// Detect common mistake: using a Supabase Access Token (sbp_...) instead of anon/publishable key
	if (supabaseAnon.startsWith('sbp_')) {
		// eslint-disable-next-line no-console
		console.error('[Supabase] It looks like you provided a Supabase Access Token (starts with sbp_). The app needs the project\'s anon or publishable key from Settings → API. Put it in VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY.')
	}
	// Light heuristic: anon key is a JWT (three dot-separated segments) OR new publishable key starts with sb_publishable_
	if (supabaseAnon && !(supabaseAnon.startsWith('sb_publishable_') || supabaseAnon.split('.').length >= 3)) {
		// eslint-disable-next-line no-console
		console.warn('[Supabase] Supplied key does not look like a JWT or publishable key. Double-check you pasted the project anon or publishable key, not another token.')
	}
	// Masked debug output
	// eslint-disable-next-line no-console
	console.debug('[Supabase] URL:', supabaseUrl, 'Key:', supabaseAnon ? supabaseAnon.slice(0, 8) + '...' : '(empty)')
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
	auth: {
		// Use localStorage instead of cookies for better Safari compatibility
		storage: typeof window !== 'undefined' ? window.localStorage : undefined,
		storageKey: 'stella-supabase-auth',
		// Automatically refresh tokens before they expire
		autoRefreshToken: true,
		// Persist the session
		persistSession: true,
		// Detect session from URL (for OAuth callbacks and magic links)
		detectSessionInUrl: true,
		// Flow type for better Safari compatibility
		flowType: 'pkce'
	}
})
