import { useId, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { GOOGLE_MAPS_URL, REGISTRY_URL, LODGING_OPTIONS } from '../config'
import Photo from './Photo'
import Reveal from './Reveal'
import { Divider } from './Monogram'

const EASE = [0.22, 1, 0.36, 1]

const paperBtn =
  'group/btn inline-flex items-center gap-2 rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none active:bg-paper-hover'

const btnArrow =
  'transition-transform duration-300 ease-editorial group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5'

// Zoom apenas perceptible de la fotografía al pasar el cursor sobre la tarjeta,
// más una gradación cálida uniforme para que todas las fotos respiren la misma luz
const imgHover = 'transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]'
const imgGrade = '[filter:sepia(0.16)_saturate(0.9)_brightness(1.02)]'
const imgTreat = `${imgHover} ${imgGrade}`

// Moodboard del código de vestimenta: la paleta real de la boda
// (verde palma, beige arena, amarillo manzanilla, café miel).
const DRESS_TONES = ['#4F6B4A', '#DCCDB5', '#F4D98B', '#A67C52']

function Eyebrow({ children, className = '' }) {
  return (
    <p className={`text-[10px] font-medium uppercase tracking-widest2 text-stone ${className}`}>
      {children}
    </p>
  )
}

function Title({ children, className = '' }) {
  return (
    <h3 className={`mt-3 font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl ${className}`}>
      {children}
    </h3>
  )
}

function PreviewText({ children, className = '' }) {
  return (
    <p className={`mt-4 text-sm leading-loose text-ink/70 sm:text-base ${className}`}>{children}</p>
  )
}

/** Link discreto "Ver detalles" / "Cerrar" — papelería, no botón de app. */
function ToggleLink({ open, onToggle, controls, className = '' }) {
  const { t } = useLang()
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      className={`group/link -mb-2 mt-7 inline-flex items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-widest2 text-stone transition-colors duration-300 hover:text-ink ${className}`}
    >
      <span className="border-b border-line pb-1 transition-colors duration-300 group-hover/link:border-stone">
        {open ? t.details.close : t.details.seeDetails}
      </span>
    </button>
  )
}

/** Expansión tipo "página que se abre": altura + desenfoque suave. */
function ExpandPanel({ open, id, children }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          role="region"
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0, filter: 'blur(5px)' }}
          animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="overflow-hidden"
        >
          {/* El texto se asienta un instante después de abrirse la página */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="pt-6 text-sm leading-loose text-ink/70 sm:text-base"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function DetailsCardsSection() {
  const { t } = useLang()
  const c = t.details.cards
  const uid = useId()
  const [open, setOpen] = useState({})
  const toggle = (key) => setOpen((o) => ({ ...o, [key]: !o[key] }))
  const panelId = (key) => `${uid}-${key}`

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

        <div className="mt-20 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-12">
          {/* 1 · Cómo llegar — imagen panorámica arriba, texto editorial abajo */}
          <Reveal className="md:col-span-12">
            <article className="group overflow-hidden rounded-3xl border border-line bg-card shadow-card">
              <Photo
                name="details-location"
                alt={c.location.title}
                className="aspect-[16/9] w-full sm:aspect-[21/8]"
                imgClassName={imgTreat}
              />
              <div className="p-8 sm:p-12">
                <Eyebrow>{c.location.summary}</Eyebrow>
                <Title>{c.location.title}</Title>
                <PreviewText className="max-w-2xl">{c.location.preview}</PreviewText>
                <ExpandPanel open={!!open.location} id={panelId('location')}>
                  <p className="font-medium text-ink/85">{c.location.address}</p>
                  <p className="mt-4 max-w-2xl">{c.location.text}</p>
                  <p className="mt-3 max-w-2xl">{c.location.extra}</p>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${paperBtn} mt-7`}
                  >
                    {t.details.openMaps}
                    <span aria-hidden="true" className={btnArrow}>↗</span>
                  </a>
                </ExpandPanel>
                <ToggleLink
                  open={!!open.location}
                  onToggle={() => toggle('location')}
                  controls={panelId('location')}
                />
              </div>
            </article>
          </Reveal>

          {/* 2 · Transporte — texto a la izquierda, fotografía a la derecha */}
          <Reveal delay={0.05} className="md:col-span-7">
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card md:flex-row">
              <Photo
                name="details-transport"
                alt={c.transport.title}
                className="aspect-[16/9] w-full md:order-2 md:aspect-auto md:w-[42%]"
                imgClassName={imgTreat}
              />
              <div className="flex-1 p-8 sm:p-10 md:order-1">
                <Eyebrow>{c.transport.summary}</Eyebrow>
                <Title>{c.transport.title}</Title>
                <PreviewText>{c.transport.preview}</PreviewText>
                <ExpandPanel open={!!open.transport} id={panelId('transport')}>
                  <p>{c.transport.text}</p>
                </ExpandPanel>
                <ToggleLink
                  open={!!open.transport}
                  onToggle={() => toggle('transport')}
                  controls={panelId('transport')}
                />
              </div>
            </article>
          </Reveal>

          {/* 3 · Mesa de regalos — fotografía de fondo bajo un velo marfil */}
          <Reveal delay={0.1} className="md:col-span-5">
            <article className="group relative h-full overflow-hidden rounded-3xl border border-line shadow-card">
              <Photo
                name="details-registry"
                alt=""
                className="absolute inset-0 h-full w-full"
                imgClassName={imgTreat}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-ivory/85" />
              <div className="relative flex h-full flex-col p-8 sm:p-10">
                <Eyebrow>{c.registry.summary}</Eyebrow>
                <Title>{c.registry.title}</Title>
                <PreviewText>{c.registry.preview}</PreviewText>
                <ExpandPanel open={!!open.registry} id={panelId('registry')}>
                  <p>{c.registry.text}</p>
                  <a
                    href={REGISTRY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${paperBtn} mt-7`}
                  >
                    {t.details.seeRegistry}
                    <span aria-hidden="true" className={btnArrow}>↗</span>
                  </a>
                </ExpandPanel>
                <ToggleLink
                  open={!!open.registry}
                  onToggle={() => toggle('registry')}
                  controls={panelId('registry')}
                  className="mt-auto pt-7"
                />
              </div>
            </article>
          </Reveal>

          {/* 4 · Dónde hospedarse — fotografía tipo polaroid superpuesta */}
          <Reveal delay={0.05} className="md:col-span-5">
            <article className="relative h-full rounded-3xl border border-line bg-card p-8 shadow-card sm:p-10">
              <div className="mx-auto mb-8 w-36 rotate-[4deg] rounded-lg bg-white p-2 pb-8 shadow-lift sm:absolute sm:-top-5 sm:right-8 sm:mb-0 sm:w-40 sm:rotate-[6deg]">
                <Photo
                  name="details-lodging"
                  alt=""
                  className="aspect-[3/4] w-full rounded-[4px]"
                  imgClassName={imgGrade}
                />
              </div>
              <div className="sm:pr-36">
                <Eyebrow>{c.lodging.summary}</Eyebrow>
                <Title>{c.lodging.title}</Title>
                <PreviewText>{c.lodging.preview}</PreviewText>
              </div>
              <ExpandPanel open={!!open.lodging} id={panelId('lodging')}>
                <p>{c.lodging.text}</p>
                <ul className="mt-5 space-y-3">
                  {LODGING_OPTIONS.map((opt) => (
                    <li key={opt.name} className="border-l border-line pl-4">
                      <p className="font-medium text-ink/85">
                        {opt.url ? (
                          <a
                            href={opt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-line underline-offset-2 transition-colors hover:text-ink"
                          >
                            {opt.name}
                          </a>
                        ) : (
                          opt.name
                        )}
                      </p>
                      <p className="text-xs text-stone">{opt.note}</p>
                    </li>
                  ))}
                </ul>
              </ExpandPanel>
              <ToggleLink
                open={!!open.lodging}
                onToggle={() => toggle('lodging')}
                controls={panelId('lodging')}
              />
            </article>
          </Reveal>

          {/* 5 · Código de vestimenta — moodboard con fotografía y tonos claros */}
          <Reveal delay={0.1} className="md:col-span-7">
            <article className="group h-full overflow-hidden rounded-3xl border border-line bg-card shadow-card">
              <Photo
                name="details-dresscode"
                alt={c.dressCode.title}
                className="aspect-[16/9] w-full sm:aspect-[16/6]"
                imgClassName={imgTreat}
              />
              <div className="p-8 sm:p-10">
                <Eyebrow>{c.dressCode.summary}</Eyebrow>
                <Title>{c.dressCode.title}</Title>
                <PreviewText>{c.dressCode.preview}</PreviewText>
                <div className="mt-8">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                    {c.dressCode.palette}
                  </p>
                  <div className="mt-4 grid max-w-md grid-cols-2 gap-x-3 gap-y-4 min-[420px]:grid-cols-4">
                    {DRESS_TONES.map((tone, i) => (
                      <div key={tone} className="text-center">
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
                </div>
                <ExpandPanel open={!!open.dressCode} id={panelId('dressCode')}>
                  <p>{c.dressCode.text}</p>
                  <p className="mt-4 border-l border-line pl-4 font-serif italic text-stone">
                    {c.dressCode.note}
                  </p>
                </ExpandPanel>
                <ToggleLink
                  open={!!open.dressCode}
                  onToggle={() => toggle('dressCode')}
                  controls={panelId('dressCode')}
                />
              </div>
            </article>
          </Reveal>

          {/* 6 · Sobre los pequeñitos — sobria, delicada, mucho espacio en blanco */}
          <Reveal delay={0.05} className="md:col-span-12">
            <article className="group rounded-3xl border border-line bg-ivory px-8 py-16 text-center shadow-card sm:px-12 sm:py-20">
              <div className="mx-auto max-w-xl">
                <div className="mx-auto mb-10 max-w-[240px] overflow-hidden rounded-2xl shadow-card sm:max-w-[280px]">
                  <Photo
                    name="details-adults-only"
                    alt=""
                    className="aspect-[4/5] w-full"
                    imgClassName={imgTreat}
                  />
                </div>
                <Eyebrow>{c.kids.summary}</Eyebrow>
                <Title>{c.kids.title}</Title>
                <PreviewText className="text-balance">{c.kids.preview}</PreviewText>
                <ExpandPanel open={!!open.kids} id={panelId('kids')}>
                  <p className="text-balance">{c.kids.text}</p>
                </ExpandPanel>
                <ToggleLink
                  open={!!open.kids}
                  onToggle={() => toggle('kids')}
                  controls={panelId('kids')}
                />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
