import { useLanguage } from '../context/LanguageContext'
import 'flag-icons/css/flag-icons.min.css'

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLanguage()

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn${lang === 'fr' ? ' lang-btn--active' : ''}`}
        onClick={() => switchLang('fr')}
        title="Français"
        aria-label="Passer en français"
      >
        <span className="fi fi-fr" />
      </button>
      <button
        className={`lang-btn${lang === 'en' ? ' lang-btn--active' : ''}`}
        onClick={() => switchLang('en')}
        title="English"
        aria-label="Switch to English"
      >
        <span className="fi fi-gb" />
      </button>
    </div>
  )
}
