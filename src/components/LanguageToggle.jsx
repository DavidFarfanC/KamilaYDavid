import { useLang } from '../i18n/LanguageContext'

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang()

  const btn = (code, label) => (
    <button
      type="button"
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      aria-label={code === 'es' ? 'Cambiar a español' : 'Switch to English'}
      className={`rounded-full px-2.5 py-1 text-xs font-medium tracking-wide transition-colors duration-300 ${
        lang === code
          ? 'bg-palm text-ivory'
          : 'text-palm hover:bg-palm-mist'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className={`flex items-center gap-0.5 rounded-full border border-palm/15 bg-ivory/60 p-0.5 ${className}`}>
      {btn('es', 'ES')}
      {btn('en', 'EN')}
    </div>
  )
}
