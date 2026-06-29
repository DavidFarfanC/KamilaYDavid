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
      </motion.div>

      {/* Indicador "Desliza": marcador editorial (sin caja ni borde) con HALO
          marfil radial detrás —luz suave, no tarjeta— para separarlo del fondo.
          Texto y flecha con más contraste, hairline fina y chevron que respira.
          El centrado vive en el contenedor (inset-x-0 + justify-center) para que
          la animación de `y` de Framer Motion no pise el centrado.
          Tappable: al tocarlo baja una pantalla. */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex justify-center px-6"
        style={{ bottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}
      >
        <motion.button
          type="button"
          onClick={handleScrollHint}
          aria-label={t.hero.scroll}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2, ease: EASE }}
          className="group pointer-events-auto relative flex flex-col items-center gap-2 rounded-md bg-transparent px-6 py-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-stone/40 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(74,67,61,0.16))' }}
        >
          {/* Halo marfil radial: luz difusa detrás, con un pulso muy sutil */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[160%] w-[210%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
            style={{
              background:
                'radial-gradient(closest-side, rgba(250,248,242,0.92), rgba(250,248,242,0.5) 55%, rgba(250,248,242,0) 76%)',
            }}
            animate={reduce ? undefined : { opacity: [0.75, 1, 0.75], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.6, ease: EASE, repeat: Infinity }}
          />

          <motion.span
            className="text-[11px] font-semibold uppercase tracking-[0.42em] text-ink sm:text-xs"
            animate={reduce ? undefined : { opacity: [0.82, 1, 0.82] }}
            transition={{ duration: 2.6, ease: EASE, repeat: Infinity }}
          >
            {t.hero.scroll}
          </motion.span>

          {/* Hairline + chevron: respiración editorial (no rebote) */}
          <span aria-hidden="true" className="relative flex h-[38px] w-5 items-start justify-center">
            <span className="absolute top-0 h-[18px] w-px bg-gradient-to-b from-stone/70 to-transparent" />
            <motion.span
              className="absolute top-[12px] text-ink/90 drop-shadow-[0_1px_2px_rgba(250,248,242,0.7)]"
              animate={reduce ? undefined : { y: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, ease: EASE, repeat: Infinity }}
            >
              <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
                <path
                  d="M1 1.5l8 8 8-8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </span>
        </motion.button>
      </div>
    </section>
  )
}
