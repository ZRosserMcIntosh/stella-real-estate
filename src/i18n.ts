import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Language selection
// We want Portuguese as the default everywhere unless a user has explicitly chosen a language.
const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
const fallbackLng = 'pt'
// Default to Portuguese unless a saved language exists
const initialLng = saved || fallbackLng

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
