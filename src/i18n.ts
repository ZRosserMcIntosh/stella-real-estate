import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Basic language detection from localStorage or navigator
const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
const fallbackLng = 'pt'
// Default to Portuguese explicitly if nothing saved; otherwise browser language
const browserBase = (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : fallbackLng)
const initialLng = saved || (browserBase || fallbackLng)

// We will import JSON resources at runtime via Vite import.meta.glob
const resources: Record<string, { translation: Record<string, any> }> = {}

// Vite dynamic import for locale files
const modules = import.meta.glob('./locales/*/common.json', { eager: true, import: 'default' }) as Record<string, any>
for (const path in modules) {
  const match = path.match(/\.\/locales\/(.*?)\/common\.json$/)
  if (match) {
    const lng = match[1]
    resources[lng] = { translation: modules[path] }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng in resources ? initialLng : fallbackLng,
    fallbackLng,
    interpolation: { escapeValue: false },
    defaultNS: 'translation',
  })

export default i18n
