import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Photo from './Photo'
import Reveal from './Reveal'
import { SectionAtmosphere } from './Monogram'

/** Color editorial por tipo de línea de la terminal (nada neón). */
function terminalLineClass(line) {
  if (line.startsWith('[ok]')) return 'text-leaf'
  if (line.startsWith('[info]')) return 'text-muted'
  if (line.startsWith('output:')) return 'italic text-ink/80'
  return 'text-ink/90' // línea de comando (prompt)
}

/**
 * Pequeña terminal/cmd elegante con efecto typewriter. Se anima una sola vez
 * al entrar en viewport, respeta prefers-reduced-motion y se reescribe si
 * cambia el idioma (las líneas cambian).
 */
function StoryTerminal({ lines, center = false }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const total = lines.reduce((sum, l) => sum + l.length, 0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduce) {
      setCount(total)
      return undefined
    }
    setCount(0)
    let n = 0
    const id = setInterval(() => {
      n += 1
      setCount(n)
      if (n >= total) clearInterval(id)
    }, 24)
    return () => clearInterval(id)
    // Reiniciar al entrar en vista o al cambiar el idioma (lines cambia).
  }, [inView, reduce, total, lines])

  // Reparte el contador de caracteres entre las líneas y ubica el cursor.
  let remaining = count
  let activeLine = lines.length - 1
  const shown = lines.map((line, i) => {
    const chars = Math.max(0, Math.min(line.length, remaining))
    if (remaining < line.length && activeLine === lines.length - 1) activeLine = i
    remaining -= line.length
    return line.slice(0, chars)
  })
  if (count >= total) activeLine = lines.length - 1

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mt-7 w-full max-w-md overflow-hidden rounded-2xl border border-line bg-ivory shadow-soft ${
        center ? 'mx-auto' : ''
      }`}
    >
      {/* Barra superior tipo ventana, en tonos papel (sin colores fuertes) */}
      <div className="flex items-center gap-1.5 border-b border-line/70 bg-cream px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-paper-line" />
        <span className="h-2 w-2 rounded-full bg-paper-line" />
        <span className="h-2 w-2 rounded-full bg-paper-line" />
        <span className="ml-2 text-[10px] uppercase tracking-widest2 text-muted">historia.exe</span>
      </div>

      <div className="px-4 py-4 font-mono text-[11px] leading-relaxed sm:text-xs">
        {shown.map((text, i) => (
          <p key={i} className={`whitespace-pre-wrap break-words ${terminalLineClass(lines[i])}`}>
            {text || ' '}
            {i === activeLine && <span aria-hidden="true" className="terminal-cursor" />}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

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
            className="aspect-[3/4] w-full max-w-lg"
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
            className="ml-auto aspect-[3/4] w-full max-w-lg"
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
        <div className="relative mx-auto mt-12 max-w-4xl">
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

  // En móvil cada capítulo respira como una escena casi a pantalla completa
  return (
    <div className="relative flex min-h-[82svh] flex-col justify-center md:block md:min-h-0">
      {layouts[layout]}
    </div>
  )
}

function ChapterText({ chapter, index, center = false, className = '' }) {
  return (
    <div className={`${center ? 'text-center' : ''} ${className}`}>
      <Reveal>
        <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest2 text-stone">
          {!center && <span aria-hidden="true" className="h-px w-8 bg-line" />}
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
      {chapter.text2 && (
        <Reveal delay={0.28}>
          <p className="mt-4 max-w-md text-balance text-sm leading-loose text-ink/70 sm:text-base">
            {chapter.text2}
          </p>
        </Reveal>
      )}
      {chapter.terminal && (
        <div className={center ? 'flex justify-center' : ''}>
          <StoryTerminal lines={chapter.terminal} center={center} />
        </div>
      )}
    </div>
  )
}

export default function OurStorySection() {
  const { t } = useLang()
  const chapters = t.story.chapters

  return (
    <section id="historia" className="relative overflow-hidden bg-cream px-6 py-32 sm:py-44">
      <SectionAtmosphere />

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

        <div className="mt-24 space-y-40 sm:mt-36 sm:space-y-56">
          <Chapter index={0} chapter={chapters[0]} mainPhoto="story-1" detailPhoto="story-1b" layout="a" />
          <Chapter index={1} chapter={chapters[1]} mainPhoto="story-2" detailPhoto="story-2b" layout="b" />
          <Chapter index={2} chapter={chapters[2]} mainPhoto="story-3" detailPhoto="story-3b" layout="c" />
        </div>
      </div>
    </section>
  )
}
