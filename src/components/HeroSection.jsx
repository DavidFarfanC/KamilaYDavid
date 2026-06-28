import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Photo from './Photo'
import Atmosphere from './Atmosphere'

const EASE = [0.22, 1, 0.36, 1]

export default function HeroSection() {
  const { t } = useLang()
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])

  const fadeUp = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  })

  // Al tocar el indicador, baja ~una pantalla (refuerza la invitación a deslizar
  // para quienes intentan picarle en vez de hacer scroll).
  const handleScrollHint = () => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    window.scrollTo({ top: Math.round(h * 0.92), behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="inicio" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Foto de fondo: zoom cinematográfico de apertura + parallax sutil al hacer scroll */}
      <motion.div style={{ scale: imgScale }} className="absolute inset-0">
        <motion.div
          initial={{ scale: reduce ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 16, ease: 'easeOut' }}
          className="h-full w-full"
        >
          <Photo
            name="hero-1"
            alt={t.hero.photoAlt}
            eager
            className="h-full w-full"
          />
        </motion.div>
      </motion.div>

      {/* Velo marfil tenue: la fotografía es la protagonista */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-ivory/15 to-ivory"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ivory/20" />

      {/* Luz que recorre el papel una sola vez al abrir */}
      <div
        aria-hidden="true"
        className="animate-sheen absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-ivory/40 to-transparent motion-reduce:hidden"
      />

      <Atmosphere />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-28 text-center"
      >
        <motion.p
          {...fadeUp(0.1)}
          className="font-serif text-base tracking-[0.45em] text-stone"
        >
          {t.hero.monogram}
        </motion.p>

        <motion.p
          {...fadeUp(0.25)}
          className="mt-6 text-[11px] font-medium uppercase tracking-widest2 text-stone"
        >
          {t.hero.eyebrow}
        </motion.p>

        <motion.h1
          {...fadeUp(0.4)}
          className="mt-4 font-serif text-[15vw] font-medium leading-[1.02] tracking-[-0.015em] text-ink sm:text-7xl md:text-8xl"
        >
          Kamila <span className="font-normal italic text-stone">&amp;</span> David
        </motion.h1>

        <motion.p
          {...fadeUp(0.6)}
          className="mx-auto mt-6 max-w-md text-balance text-sm leading-relaxed text-ink/80 sm:text-base"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          {...fadeUp(0.75)}
          className="mt-8 flex items-center gap-3 font-serif text-base text-ink/90 sm:text-lg"
        >
          <span>{t.hero.date}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone/40" />
          <span>{t.hero.place}</span>
        </motion.div>

        <motion.div {...fadeUp(0.9)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#rsvp"
            className="rounded-full bg-paper px-8 py-3.5 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none active:bg-paper-hover"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#detalles"
            className="rounded-full border border-paper-line bg-transparent px-8 py-3.5 text-sm font-medium text-ink backdrop-blur-sm transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper/30 active:translate-y-0 active:bg-paper/40"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador "Desliza": pieza editorial centrada (marfil + blur + glow
          cálido muy discreto) con flecha animada. El centrado vive en el
          contenedor (inset-x-0 + justify-center) para que la animación de
          Framer Motion sobre `y` NO pise el translateX y se mantenga centrado.
          Tappable: al tocarlo baja una pantalla. */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-6"
        style={{ bottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        <motion.button
          type="button"
          onClick={handleScrollHint}
          aria-label={t.hero.scroll}
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.1, ease: EASE }}
          whileHover={reduce ? undefined : { y: -2 }}
          className="group pointer-events-auto flex flex-col items-center gap-2 rounded-2xl border border-paper-line bg-ivory/75 px-6 py-3.5 backdrop-blur-md transition-colors duration-300 ease-editorial hover:bg-ivory/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-paper-line/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory/40"
          style={{
            boxShadow:
              '0 12px 32px -16px rgba(74,67,61,0.22), 0 0 26px -6px rgba(244,217,139,0.28)',
          }}
        >
          {/* Pulso muy sutil del conjunto */}
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: 2.4, ease: EASE, repeat: Infinity }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-ink sm:text-[13px]">
              {t.hero.scroll}
            </span>
            <motion.span
              aria-hidden="true"
              className="text-ink/90 drop-shadow-[0_1px_2px_rgba(74,67,61,0.2)]"
              animate={reduce ? undefined : { y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.1, ease: EASE, repeat: Infinity }}
            >
              <svg width="26" height="28" viewBox="0 0 24 26" fill="none">
                <path
                  d="M5 5l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 13l7 7 7-7"
                  stroke="currentColor"
                  strokeOpacity="0.45"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
