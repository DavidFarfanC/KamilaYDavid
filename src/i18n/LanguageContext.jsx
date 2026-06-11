import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'es'
    return localStorage.getItem('kd-lang') === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    localStorage.setItem('kd-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = { lang, setLang, t: translations[lang] }
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
