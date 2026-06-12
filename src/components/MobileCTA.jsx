import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const EASE = [0.22, 1, 0.36, 1]

/**
 * CTA flotante de confirmación, solo en móvil.
 * Aparece al dejar atrás el hero y se retira al llegar al RSVP,
 * para no interrumpir ni el formulario ni el cierre espiritual.
 * Respeta el safe-area inferior del iPhone.
 */
export default function MobileCTA() {
  const { t } = useLang()
  const [pastHero, setPastHero] = useState(false)
  const [beforeRsvp, setBeforeRsvp] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('inicio')
    const rsvp = document.getElementById('rsvp')

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.12 }
    )
    const rsvpObserver = new IntersectionObserver(
      ([entry]) =>
        setBeforeRsvp(!entry.isIntersecting && entry.boundingClientRect.top > 0),
      { rootMargin: '0px 0px -25% 0px' }
    )

    if (hero) heroObserver.observe(hero)
    if (rsvp) rsvpObserver.observe(rsvp)
    return () => {
      heroObserver.disconnect()
      rsvpObserver.disconnect()
    }
  }, [])

  return (
    <AnimatePresence>
      {pastHero && beforeRsvp && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="fixed inset-x-0 z-40 flex justify-end pl-2 pr-[max(0.75rem,env(safe-area-inset-right))] sm:hidden"
          style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        >
          <a
            href="#rsvp"
            className="w-full max-w-[14.5rem] rounded-full border border-paper-line/60 bg-paper/95 px-6 py-3.5 text-center text-sm font-medium text-ink shadow-lift backdrop-blur-md transition-all duration-300 ease-editorial active:scale-[0.98]"
          >
            {t.hero.ctaPrimary}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
