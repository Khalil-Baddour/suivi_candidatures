import { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations.json'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') ?? 'fr')

  const switchLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = (key) => {
    const parts = key.split('.')
    let value = translations[lang]
    for (const part of parts) {
      value = value?.[part]
    }
    return value ?? key
  }

  const dateLocale = lang === 'fr' ? 'fr-FR' : 'en-GB'

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, dateLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
