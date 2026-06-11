import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Photo from './Photo'
import FloatingBotanicalElements from './FloatingBotanicalElements'

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
      {/* Foto de fondo con parallax sutil */}
      <motion.div style={{ scale: imgScale }} className="absolute inset-0">
        <Photo
          name="hero-1"
          alt={t.hero.photoAlt}
          eager
          className="h-full w-full"
        />
      </motion.div>

      {/* Velo marfil tenue: la fotografía es la protagonista */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ivory/35 via-transparent to-ivory"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ivory/20" />

      <FloatingBotanicalElements variant="hero" />

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
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-chamomile" />
          <span>{t.hero.place}</span>
        </motion.div>

        <motion.div {...fadeUp(0.9)} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#rsvp"
            className="rounded-full bg-paper px-8 py-3.5 text-sm font-medium text-ink shadow-soft transition-colors duration-300 hover:bg-paper-hover"
          >
            {t.hero.ctaPrimary}
          </a>
          <a
            href="#detalles"
            className="rounded-full border border-paper-line bg-transparent px-8 py-3.5 text-sm font-medium text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-paper/30"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-stone/30 to-stone/50 animate-pulse" />
      </motion.div>
    </section>
  )
}
