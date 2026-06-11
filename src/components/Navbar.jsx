import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link =
    'rounded-full px-3 py-1.5 text-sm text-ink/80 transition-colors duration-300 hover:bg-palm-mist hover:text-palm'

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
      <nav
        aria-label="Navegación principal"
        className={`flex w-full max-w-xl items-center justify-between gap-1 rounded-full border px-3 py-2 backdrop-blur-md transition-all duration-500 sm:px-4 ${
          scrolled
            ? 'border-sand/60 bg-ivory/80 shadow-soft'
            : 'border-white/30 bg-ivory/40'
        }`}
      >
        <a
          href="#inicio"
          className="font-serif text-lg font-medium tracking-[0.18em] text-palm"
          aria-label="Kamila y David — inicio"
        >
          K&nbsp;&amp;&nbsp;D
        </a>

        <div className="hidden items-center sm:flex">
          <a href="#historia" className={link}>{t.nav.story}</a>
          <a href="#detalles" className={link}>{t.nav.details}</a>
          <a href="#rsvp" className={link}>{t.nav.rsvp}</a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#rsvp"
            className="rounded-full bg-palm px-3 py-1.5 text-xs font-medium text-ivory transition-colors duration-300 hover:bg-palm-hover active:bg-palm-active sm:hidden"
          >
            {t.nav.rsvp}
          </a>
          <LanguageToggle />
        </div>
      </nav>
    </header>
  )
}
