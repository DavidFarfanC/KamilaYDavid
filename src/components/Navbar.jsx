import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'

const SECTION_IDS = ['historia', 'detalles', 'rsvp']

export default function Navbar() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Sección activa: la que cruza la franja media del viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const link = (id) =>
    `rounded-full px-3 py-1.5 text-sm transition-colors duration-300 ease-editorial ${
      active === id ? 'bg-cream text-ink' : 'text-ink/80 hover:bg-cream hover:text-ink'
    }`

  return (
    <header className="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 flex justify-center px-3 sm:top-5">
      <nav
        aria-label="Navegación principal"
        className={`flex w-full items-center justify-between gap-1 rounded-full border px-3 transition-all duration-500 ease-editorial sm:px-4 ${
          scrolled
            ? 'max-w-lg border-line bg-ivory/85 py-1.5 shadow-soft backdrop-blur-lg'
            : 'max-w-xl border-white/40 bg-ivory/50 py-2 backdrop-blur-md'
        }`}
      >
        <a
          href="#inicio"
          className="font-serif text-lg font-medium tracking-[0.18em] text-ink"
          aria-label="Kamila y David — inicio"
        >
          K&nbsp;&amp;&nbsp;D
        </a>

        <div className="hidden items-center sm:flex">
          <a href="#historia" className={link('historia')}>{t.nav.story}</a>
          <a href="#detalles" className={link('detalles')}>{t.nav.details}</a>
          <a href="#rsvp" className={link('rsvp')}>{t.nav.rsvp}</a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#rsvp"
            className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover active:translate-y-0 active:bg-paper-hover sm:hidden"
          >
            {t.nav.rsvp}
          </a>
          <LanguageToggle />
        </div>
      </nav>
    </header>
  )
}
