import { supabase } from './supabaseClient'

export type SiteSettingKey =
  | 'video_home_id'
  | 'video_login_id'
  | 'featured_projects'
  | 'video_home_fallback_image'
  | 'video_home_uploaded_url'
  | 'watermark_enabled'
  | 'watermark_text'
  | 'watermark_opacity'
  | 'watermark_position'
  | 'watermark_type'
  | 'watermark_image_url'
  | 'watermark_size'
  | 'hero_logo_url'
  | 'header_logo_url'
  | 'header_logo_size'
  | 'footer_logo_url'
  | 'favicon_url'
  | 'disable_right_click'
  | 'disable_text_selection'
  | 'disable_image_dragging'

const TABLE = 'site_settings'

export async function getSiteSettings(keys: SiteSettingKey[]): Promise<Record<SiteSettingKey, string | null>> {
  const result = {} as Record<SiteSettingKey, string | null>
  // default nulls
  keys.forEach(k => { result[k] = null })

  try {
    if ((import.meta as any).env?.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.from(TABLE).select('*').in('key', keys)
      if (!error && data) {
        for (const row of data as any[]) {
          result[row.key as SiteSettingKey] = row.value as string
        }
        return result
      }
    }
  } catch { /* fall back */ }

  // Fallback to localStorage
  for (const k of keys) {
    const v = localStorage.getItem(`site:${k}`)
    result[k] = v ?? null
  }
  return result
}

export async function setSiteSetting(key: SiteSettingKey, value: string): Promise<void> {
  let saved = false
  try {
    if ((import.meta as any).env?.VITE_SUPABASE_URL) {
      const { error } = await supabase.from(TABLE).upsert({ key, value }, { onConflict: 'key' })
      if (!error) saved = true
    }
  } catch { /* fall back */ }

  if (!saved) {
    localStorage.setItem(`site:${key}`, value)
  }
}

// --- History helpers ---
const HISTORY_TABLE = 'site_settings_history'
const LS_HISTORY_PREFIX = 'site:history:'

export async function addSiteSettingToHistory(key: SiteSettingKey, value: string, max: number = 10): Promise<void> {
  const val = value.trim()
  if (!val) return
  let wrote = false
  try {
    if ((import.meta as any).env?.VITE_SUPABASE_URL) {
      // Try insert; ignore if table missing
      const { error } = await supabase.from(HISTORY_TABLE).insert({ key, value: val, used_at: new Date().toISOString() })
      if (!error) wrote = true
    }
  } catch { /* ignore */ }

  if (!wrote) {
    const k = `${LS_HISTORY_PREFIX}${key}`
    const arr: string[] = JSON.parse(localStorage.getItem(k) || '[]')
    const next = [val, ...arr.filter(v => v !== val)].slice(0, max)
    localStorage.setItem(k, JSON.stringify(next))
  }
}

export async function getSiteSettingHistory(key: SiteSettingKey, limit: number = 10): Promise<string[]> {
  try {
    if ((import.meta as any).env?.VITE_SUPABASE_URL) {
      const { data, error } = await supabase
        .from(HISTORY_TABLE)
        .select('value, used_at')
        .eq('key', key)
        .order('used_at', { ascending: false })
        .limit(limit * 3) // fetch extra to dedupe client-side
      if (!error && data) {
        const seen = new Set<string>()
        const deduped: string[] = []
        for (const row of data as any[]) {
          if (!seen.has(row.value)) {
            seen.add(row.value)
            deduped.push(row.value)
            if (deduped.length >= limit) break
          }
        }
        return deduped
      }
    }
  } catch { /* fall back */ }
  const k = `${LS_HISTORY_PREFIX}${key}`
  const arr: string[] = JSON.parse(localStorage.getItem(k) || '[]')
  return arr.slice(0, limit)
}
