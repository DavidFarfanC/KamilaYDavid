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

      {/* Indicador "Desliza": texto en small caps + flecha fina con deriva vertical suave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2 }}
        className="absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-ink/70">
          {t.hero.scroll}
        </span>
        <motion.svg
          aria-hidden="true"
          width="14"
          height="22"
          viewBox="0 0 14 22"
          fill="none"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.1, ease: EASE, repeat: Infinity }}
        >
          <path d="M7 1v18" stroke="#4A433D" strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
          <path d="M2.5 14.5 7 19l4.5-4.5" stroke="#4A433D" strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  )
}
