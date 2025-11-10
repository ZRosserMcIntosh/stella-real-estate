import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Helper to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// Helper to set cookie
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Language selection - check cookie first, then localStorage, then default to Portuguese
const savedCookie = getCookie('stella_language')
const savedLocalStorage = typeof window !== 'undefined' ? localStorage.getItem('lang') : null
const saved = savedCookie || savedLocalStorage
const fallbackLng = 'pt'
// Default to Portuguese unless a saved language exists
const initialLng = saved || fallbackLng

// Sync cookie and localStorage
if (saved && typeof window !== 'undefined') {
  setCookie('stella_language', saved, 365)
  localStorage.setItem('lang', saved)
}

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

// Listen for language changes and persist to both cookie and localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    setCookie('stella_language', lng, 365)
    localStorage.setItem('lang', lng)
  }
})

export default i18n
export { setCookie, getCookie }
