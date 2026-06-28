import { useId, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { GOOGLE_MAPS_URL, REGISTRY_URL, REGISTRY_EVENT_NUMBER, LODGING_OPTIONS } from '../config'
import Photo from './Photo'
import Reveal from './Reveal'
import SponsorsCard from './SponsorsCard'
import { Divider } from './Monogram'

const EASE = [0.22, 1, 0.36, 1]

const paperBtn =
  'group/btn inline-flex items-center gap-2 rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none active:bg-paper-hover'

const btnArrow =
  'transition-transform duration-300 ease-editorial group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5'

// Tratamiento cálido y uniforme para todas las fotos (misma luz de revista).
// Photo ya añade h-full w-full object-cover; aquí solo el zoom de hover y el grade.
const imgTreat =
  'transition-transform duration-700 ease-editorial group-hover:scale-[1.02] [filter:sepia(0.16)_saturate(0.9)_brightness(1.02)]'

// Paleta real de la boda para el moodboard del código de vestimenta.
const DRESS_TONES = ['#4F6B4A', '#DCCDB5', '#F4D98B', '#7EACCE', '#A67C52']

// Cada bloque del contenido expandido entra en secuencia (stagger).
const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
}

function Item({ children, className = '' }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

function Eyebrow({ children }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-widest2 text-stone">{children}</p>
  )
}

function Title({ children }) {
  return (
    <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl">
      {children}
    </h3>
  )
}

function PreviewText({ children }) {
  return <p className="mt-4 text-sm leading-loose text-ink/70 sm:text-base">{children}</p>
}

/** Link editorial "Ver detalles" / "Cerrar" con subrayado fino animado. */
function ToggleLink({ open, onToggle, controls }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className="group/link -mb-2 mt-7 inline-flex w-fit items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-widest2 text-stone transition-colors duration-300 hover:text-ink"
    >
      <span className="relative pb-1">
        {open ? t.details.close : t.details.seeDetails}
        <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 bg-stone/40 transition-transform duration-300 ease-editorial group-hover/link:scale-x-0" />
        <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-stone transition-transform duration-300 ease-editorial group-hover/link:scale-x-100" />
      </span>
      <span
        aria-hidden="true"
        className={`transition-transform duration-300 ease-editorial ${
          open ? 'rotate-180' : ''
        } group-hover/link:translate-y-0.5`}
      >
        ↓
      </span>
    </button>
  )
}

/** Apertura tipo "página de guía": expande la altura y revela el contenido con stagger. */
function ExpandPanel({ open, id, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="panel"
          id={id}
          role="region"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="overflow-hidden"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } } }}
            className="space-y-4 pt-6 text-sm leading-loose text-ink/70 sm:text-base"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Tarjeta editorial unificada: texto a la izquierda, imagen a la derecha en
 * desktop; imagen arriba, texto abajo en móvil. Toda la portada (imagen + título)
 * abre la tarjeta como una página; el contenido expandido entra en secuencia.
 */
function DetailCard({
  imageName,
  alt,
  eyebrow,
  title,
  preview,
  open,
  onToggle,
  pid,
  imageAspect = 'aspect-[16/10]',
  children,
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-editorial hover:border-paper-line hover:shadow-lift active:scale-[0.99] md:min-h-[22rem] md:flex-row md:active:scale-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={pid}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative ${imageAspect} w-full cursor-pointer overflow-hidden md:order-2 md:aspect-auto md:w-[48%]`}
      >
        <Photo
          name={imageName}
          alt={alt}
          className="absolute inset-0 h-full w-full"
          imgClassName={`${imgTreat} ${open ? 'scale-[1.03]' : ''}`}
        />
      </button>

      <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 md:order-1 md:p-12">
        <div className="cursor-pointer" onClick={onToggle}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Title>{title}</Title>
          <PreviewText>{preview}</PreviewText>
        </div>
        <ExpandPanel open={open} id={pid}>
          {children}
        </ExpandPanel>
        <ToggleLink open={open} onToggle={onToggle} controls={pid} />
      </div>
    </article>
  )
}

export default function DetailsCardsSection() {
  const { t } = useLang()
  const c = t.details.cards
  const uid = useId()
  const [open, setOpen] = useState({})
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }))
  const pid = (key) => `${uid}-${key}`

  return (
    <section id="detalles" className="relative overflow-hidden bg-ivory px-6 py-32 sm:py-44">
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <Reveal>
            <h2 className="text-balance font-serif text-4xl font-medium text-ink sm:text-5xl">
              {t.details.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 text-sm text-stone sm:text-base">{t.details.subtitle}</p>
            <Divider className="mt-10" />
          </Reveal>
        </div>

        <MotionConfig reducedMotion="user">
          <div className="mt-20 flex flex-col gap-6 sm:gap-8">
            {/* 1 · Información importante — el corazón del mensaje de los novios */}
            <Reveal>
              <DetailCard
                imageName="details-important"
                alt={c.important.title}
                eyebrow={c.important.summary}
                title={c.important.title}
                preview={c.important.preview}
                open={!!open.important}
                onToggle={() => toggle('important')}
                pid={pid('important')}
              >
                {c.important.paragraphs.map((p, i) => (
                  <Item key={i}>
                    <p>{p}</p>
                  </Item>
                ))}
              </DetailCard>
            </Reveal>

            {/* 2 · ¿Quieres ser nuestro padrino? — tarjeta destacada */}
            <Reveal delay={0.05}>
              <SponsorsCard
                open={!!open.sponsors}
                onToggle={() => toggle('sponsors')}
                pid={pid('sponsors')}
              />
            </Reveal>

            {/* 3 · Cómo llegar */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-location"
                alt={c.location.title}
                eyebrow={c.location.summary}
                title={c.location.title}
                preview={c.location.preview}
                open={!!open.location}
                onToggle={() => toggle('location')}
                pid={pid('location')}
              >
                <Item>
                  <p className="font-medium text-ink/85">{c.location.address}</p>
                </Item>
                <Item>
                  <p>{c.location.text}</p>
                </Item>
                <Item>
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className={paperBtn}>
                    {t.details.openMaps}
                    <span aria-hidden="true" className={btnArrow}>↗</span>
                  </a>
                </Item>
              </DetailCard>
            </Reveal>

            {/* 2 · Transporte */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-transport"
                alt={c.transport.title}
                eyebrow={c.transport.summary}
                title={c.transport.title}
                preview={c.transport.preview}
                open={!!open.transport}
                onToggle={() => toggle('transport')}
                pid={pid('transport')}
              >
                <Item>
                  <p>{c.transport.text}</p>
                </Item>
              </DetailCard>
            </Reveal>

            {/* 3 · Mesa de regalos */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-registry"
                alt={c.registry.title}
                eyebrow={c.registry.summary}
                title={c.registry.title}
                preview={c.registry.preview}
                open={!!open.registry}
                onToggle={() => toggle('registry')}
                pid={pid('registry')}
              >
                <Item>
                  <p>{c.registry.text}</p>
                </Item>
                {REGISTRY_EVENT_NUMBER && (
                  <Item>
                    <div className="flex flex-col items-start gap-1.5 rounded-2xl bg-paper px-5 py-4">
                      <span className="text-xs uppercase tracking-[0.18em] text-stone">
                        {c.registry.eventNumberLabel}
                      </span>
                      <span className="font-serif text-2xl tracking-wider text-ink">
                        {REGISTRY_EVENT_NUMBER}
                      </span>
                    </div>
                  </Item>
                )}
                <Item>
                  <a href={REGISTRY_URL} target="_blank" rel="noopener noreferrer" className={paperBtn}>
                    {t.details.seeRegistry}
                    <span aria-hidden="true" className={btnArrow}>↗</span>
                  </a>
                </Item>
              </DetailCard>
            </Reveal>

            {/* 4 · Dónde hospedarse */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-lodging"
                alt={c.lodging.title}
                eyebrow={c.lodging.summary}
                title={c.lodging.title}
                preview={c.lodging.preview}
                open={!!open.lodging}
                onToggle={() => toggle('lodging')}
                pid={pid('lodging')}
              >
                <Item>
                  <p>{c.lodging.intro}</p>
                </Item>
                <Item>
                  <div className="flex flex-col gap-3">
                    {LODGING_OPTIONS.map((h) => (
                      <a
                        key={h.name}
                        href={h.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-3.5 text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none"
                      >
                        <span>{c.lodging.hotelCta(h.name)}</span>
                        <span className="flex items-center gap-2 text-xs text-stone">
                          {h.tier}
                          <span aria-hidden="true" className={btnArrow}>↗</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </Item>
                <Item>
                  <p>{c.lodging.airbnb}</p>
                </Item>
              </DetailCard>
            </Reveal>

            {/* 5 · Código de vestimenta */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-dresscode"
                alt={c.dressCode.title}
                eyebrow={c.dressCode.summary}
                title={c.dressCode.title}
                preview={c.dressCode.preview}
                open={!!open.dressCode}
                onToggle={() => toggle('dressCode')}
                pid={pid('dressCode')}
              >
                <Item>
                  <p>{c.dressCode.text}</p>
                </Item>
                <Item>
                  <p className="border-l border-line pl-4 font-serif italic text-stone">
                    {c.dressCode.note}
                  </p>
                </Item>
                <Item>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                    {c.dressCode.palette}
                  </p>
                  <div className="mt-4 grid max-w-md grid-cols-2 gap-x-3 gap-y-4 min-[420px]:grid-cols-3 sm:grid-cols-5">
                    {DRESS_TONES.map((tone, i) => (
                      <div key={tone} className="text-center last:col-span-2 min-[420px]:last:col-span-1">
                        <span
                          aria-hidden="true"
                          className="block h-12 rounded-lg border border-line sm:h-14"
                          style={{ backgroundColor: tone }}
                        />
                        <span className="mt-2 block text-[9px] uppercase tracking-wide text-muted">
                          {c.dressCode.tones[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </Item>
              </DetailCard>
            </Reveal>

            {/* 6 · Sobre los pequeñitos */}
            <Reveal delay={0.05}>
              <DetailCard
                imageName="details-adults-only"
                alt={c.kids.title}
                eyebrow={c.kids.summary}
                title={c.kids.title}
                preview={c.kids.preview}
                open={!!open.kids}
                onToggle={() => toggle('kids')}
                pid={pid('kids')}
              >
                <Item>
                  <p>{c.kids.text}</p>
                </Item>
              </DetailCard>
            </Reveal>
          </div>
        </MotionConfig>
      </div>
    </section>
  )
}
