import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const EASE = [0.22, 1, 0.36, 1]

const LANGS = [
  { code: 'es', label: 'ES', aria: 'Cambiar a español' },
  { code: 'en', label: 'EN', aria: 'Switch to English' },
  { code: 'de', label: 'DE', aria: 'Zu Deutsch wechseln' },
]

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang } = useLang()

  return (
    <div className={`flex items-center gap-0.5 rounded-full border border-line bg-ivory/60 p-0.5 ${className}`}>
      {LANGS.map(({ code, label, aria }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          aria-label={aria}
          className={`relative rounded-full px-2 py-1 text-[11px] font-medium tracking-wide transition-colors duration-300 sm:px-2.5 sm:text-xs ${
            lang === code ? 'text-ink' : 'text-stone hover:bg-cream'
          }`}
        >
          {lang === code && (
            <motion.span
              layoutId="lang-active"
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-paper"
              transition={{ duration: 0.4, ease: EASE }}
            />
          )}
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  )
}
