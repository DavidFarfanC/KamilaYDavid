import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Photo from './Photo'
import Reveal from './Reveal'
import FloatingBotanicalElements from './FloatingBotanicalElements'

/** Foto con parallax vertical muy ligero dentro de su contenedor. */
function ParallaxPhoto({ name, alt, className, imgClassName, strength = 30 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength])

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      <Photo name={name} alt={alt} className="h-full w-full rounded-3xl shadow-lift" imgClassName={imgClassName} />
    </motion.div>
  )
}

function Chapter({ index, chapter, mainPhoto, detailPhoto, layout }) {
  // Tres composiciones distintas para evitar monotonía
  const layouts = {
    // Foto grande a la izquierda, detalle cruzado
    a: (
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative">
          <ParallaxPhoto
            name={mainPhoto}
            alt={chapter.mainAlt}
            className="aspect-[3/4] w-full max-w-md"
          />
          <Reveal delay={0.25} className="absolute -bottom-10 -right-2 w-36 sm:-right-8 sm:w-44">
            <div className="rotate-[4deg] rounded-2xl bg-white p-2 pb-6 shadow-card">
              <Photo name={detailPhoto} alt={chapter.detailAlt} className="aspect-[3/4] rounded-xl" />
            </div>
          </Reveal>
        </div>
        <ChapterText chapter={chapter} index={index} />
      </div>
    ),
    // Texto a la izquierda, fotos a la derecha
    b: (
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <ChapterText chapter={chapter} index={index} className="md:order-1" />
        <div className="relative md:order-2">
          <ParallaxPhoto
            name={mainPhoto}
            alt={chapter.mainAlt}
            className="ml-auto aspect-[3/4] w-full max-w-md"
            strength={40}
          />
          <Reveal delay={0.25} className="absolute -bottom-10 left-0 w-36 sm:-left-6 sm:w-44">
            <div className="-rotate-[5deg] rounded-2xl bg-white p-2 pb-6 shadow-card">
              <Photo name={detailPhoto} alt={chapter.detailAlt} className="aspect-[3/4] rounded-xl" />
            </div>
          </Reveal>
        </div>
      </div>
    ),
    // Composición centrada y amplia: foto panorámica + detalle
    c: (
      <div className="text-center">
        <ChapterText chapter={chapter} index={index} center className="mx-auto max-w-2xl" />
        <div className="relative mx-auto mt-12 max-w-3xl">
          <ParallaxPhoto
            name={mainPhoto}
            alt={chapter.mainAlt}
            className="aspect-[3/2] w-full"
            strength={24}
          />
          <Reveal delay={0.3} className="absolute -bottom-12 right-2 w-32 sm:-right-10 sm:w-48">
            <div className="rotate-[6deg] rounded-2xl bg-white p-2 pb-6 shadow-card">
              <Photo name={detailPhoto} alt={chapter.detailAlt} className="aspect-[3/4] rounded-xl" />
            </div>
          </Reveal>
        </div>
      </div>
    ),
  }

  return <div className="relative">{layouts[layout]}</div>
}

function ChapterText({ chapter, index, center = false, className = '' }) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest2 text-honey">
          {!center && <span aria-hidden="true" className="h-px w-8 bg-honey/40" />}
          <span className={center ? 'mx-auto' : ''}>{chapter.label}</span>
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h3 className="mt-4 font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
          {chapter.title}
        </h3>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-5 max-w-md text-balance text-sm leading-loose text-ink/70 sm:text-base">
          {chapter.text}
        </p>
      </Reveal>
    </div>
  )
}

export default function OurStorySection() {
  const { t } = useLang()
  const chapters = t.story.chapters

  return (
    <section id="historia" className="relative overflow-hidden bg-sand-soft/60 px-6 py-24 sm:py-32">
      <FloatingBotanicalElements />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium text-ink sm:text-5xl">{t.story.title}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-ink/60 sm:text-base">
              {t.story.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="mt-20 space-y-32 sm:mt-28 sm:space-y-44">
          <Chapter index={0} chapter={chapters[0]} mainPhoto="story-1" detailPhoto="story-1b" layout="a" />
          <Chapter index={1} chapter={chapters[1]} mainPhoto="story-2" detailPhoto="story-2b" layout="b" />
          <Chapter index={2} chapter={chapters[2]} mainPhoto="story-3" detailPhoto="story-3b" layout="c" />
        </div>
      </div>
    </section>
  )
}
