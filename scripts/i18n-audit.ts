/*
 i18n-audit: Check locale JSON keys vs base language and optionally fill missing ones using a translation provider.

 Usage:
   - Base language is 'pt' by default. Override with BASE_LANG=xx
   - Provider options: OPENAI_API_KEY (or leave unset to just audit)
   - Run: npm run i18n:audit
*/
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const LOCALES_DIR = path.join(ROOT, 'src', 'locales')
const BASE_LANG = process.env.BASE_LANG || 'pt'
const PROVIDER = process.env.TRANSLATE_PROVIDER || '' // 'openai' in future

function loadJson(file: string) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

function flatten(obj: any, prefix = '', out: Record<string, any> = {}) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'object' && v && !Array.isArray(v)) flatten(v, key, out)
    else out[key] = v
  }
  return out
}

function setDeep(obj: any, dotKey: string, value: any) {
  const parts = dotKey.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}
    cur = cur[p]
  }
  cur[parts[parts.length - 1]] = value
}

async function maybeTranslate(text: string, targetLang: string): Promise<string> {
  if (!PROVIDER) return text // audit only
  // In this scaffold, we skip live calls. Hook up provider here if desired.
  return text
}

async function run() {
  const langs = fs.readdirSync(LOCALES_DIR).filter((d) => fs.existsSync(path.join(LOCALES_DIR, d, 'common.json')))
  if (!langs.includes(BASE_LANG)) {
    console.error(`Base language ${BASE_LANG} not found under src/locales`)
    process.exit(1)
  }
  const basePath = path.join(LOCALES_DIR, BASE_LANG, 'common.json')
  const base = loadJson(basePath)
  const baseFlat = flatten(base)

  const report: Array<{ lang: string; missing: string[] }> = []

  for (const lang of langs) {
    if (lang === BASE_LANG) continue
    const file = path.join(LOCALES_DIR, lang, 'common.json')
    const json = loadJson(file)
    const flat = flatten(json)
    const missing = Object.keys(baseFlat).filter((k) => !(k in flat))
    report.push({ lang, missing })

    if (missing.length > 0) {
      let changed = false
      for (const key of missing) {
        const src = baseFlat[key]
        const translated = await maybeTranslate(String(src), lang)
        setDeep(json, key, translated)
        changed = true
      }
      if (changed) {
        fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8')
        console.log(`Filled ${missing.length} keys for ${lang}`)
      }
    }
  }

  console.log('\nTranslation audit:')
  for (const { lang, missing } of report) {
    console.log(`- ${lang}: ${missing.length} missing`)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
