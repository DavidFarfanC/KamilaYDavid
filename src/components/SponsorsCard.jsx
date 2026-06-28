import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { SPONSORSHIP_GOALS, SPONSORSHIP_CONTRIBUTIONS, RSVP_ENDPOINT, BANK_TRANSFER } from '../config'
import { supabasePublicClient } from '../lib/supabasePublicClient'
import { buildSponsorshipPayload } from '../sponsorshipPayload'
import Photo from './Photo'
import Atmosphere from './Atmosphere'

const EASE = [0.22, 1, 0.36, 1]
const DATE_LOCALES = { es: 'es-MX', en: 'en-US', de: 'de-DE' }
const CATEGORIES = [
  'photography',
  'audio',
  'cake',
  'flowers',
  'aisle',
  'bride_presentation',
  'toast',
  'inflatable_bouncer',
  'gratitude',
]

const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-full border border-paper-line bg-transparent px-6 py-3 text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper/30 active:translate-y-0'
const imgTreat =
  'transition-transform duration-700 ease-editorial group-hover:scale-[1.02] [filter:sepia(0.16)_saturate(0.9)_brightness(1.02)]'
const inputCls =
  'w-full rounded-2xl border border-line bg-ivory px-4 py-3 text-sm text-ink placeholder:text-muted transition-all duration-300 ease-editorial focus:border-paper-line focus:outline-none focus:ring-4 focus:ring-paper/40'

const normalizeContributions = (contributions) =>
  (Array.isArray(contributions) ? contributions : []).map((contribution) => ({
    id: contribution.id,
    name: contribution.name,
    category: contribution.category,
    amount: Number(contribution.amount) || 0,
    date: contribution.date || '',
  }))

const totalForCategory = (contributions, category) =>
  contributions
    .filter((c) => c.category === category)
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0)

const formatContributionDate = (value, lang) => {
  if (!value) return ''

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value
  const parsedDate = new Date(normalizedValue)

  if (Number.isNaN(parsedDate.getTime())) return value

  const locale = DATE_LOCALES[lang] || 'es-MX'
  const optionsByLang = {
    es: { day: 'numeric', month: 'short', year: 'numeric' },
    en: { month: 'short', day: 'numeric', year: 'numeric' },
    de: { day: 'numeric', month: 'long', year: 'numeric' },
  }

  return new Intl.DateTimeFormat(locale, optionsByLang[lang] || optionsByLang.es).format(parsedDate)
}

const successItem = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
}

function ProgressBar({ category, contributions, label }) {
  const goal = SPONSORSHIP_GOALS[category] || 0
  const total = totalForCategory(contributions, category)
  const percentage = goal > 0 ? Math.min(100, Math.round((total / goal) * 100)) : 0

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs tabular-nums text-stone">{percentage}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream">
        <motion.span
          className="block h-full rounded-full"
          style={{ backgroundColor: '#A67C52' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </div>
    </div>
  )
}

/** Apertura tipo "página": altura + stagger del contenido. */
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
          <div className="space-y-8 pt-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Tarjeta destacada de padrinos con barras de progreso, formulario de
 * aportación y animación de agradecimiento.
 */
export default function SponsorsCard({ open, onToggle, pid }) {
  const { t, lang } = useLang()
  const sp = t.details.cards.sponsors
  const hasRealtimeClient = Boolean(supabasePublicClient)

  const [form, setForm] = useState({ name: '', category: '', amount: '', contact: '', message: '' })
  const [publicContributions, setPublicContributions] = useState(() => normalizeContributions(SPONSORSHIP_CONTRIBUTIONS))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))
  const [bankCopied, setBankCopied] = useState(false)
  const bankCopyTimerRef = useRef(null)
  const mountedRef = useRef(true)

  // Copia los datos bancarios al portapapeles (solo UI, no toca payload alguno).
  const copyBankDetails = useCallback(async () => {
    const b = sp.bank
    const text = `${b.name}: ${BANK_TRANSFER.name}\n${b.bank}: ${BANK_TRANSFER.bank}\n${b.clabe}: ${BANK_TRANSFER.clabe}`
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setBankCopied(true)
      if (bankCopyTimerRef.current) window.clearTimeout(bankCopyTimerRef.current)
      bankCopyTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setBankCopied(false)
      }, 2600)
    } catch {
      /* si el navegador bloquea el portapapeles, los datos siguen visibles */
    }
  }, [sp.bank])
  const openRef = useRef(open)
  const pollingIntervalRef = useRef(null)
  const realtimeChannelRef = useRef(null)
  const refreshInFlightRef = useRef(false)
  const pendingRefreshRef = useRef(false)

  const clearPollingInterval = useCallback(() => {
    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      openRef.current = false
      if (bankCopyTimerRef.current) window.clearTimeout(bankCopyTimerRef.current)
      clearPollingInterval()
      if (realtimeChannelRef.current && supabasePublicClient) {
        void supabasePublicClient.removeChannel(realtimeChannelRef.current)
        realtimeChannelRef.current = null
      }
    }
  }, [clearPollingInterval])

  useEffect(() => {
    openRef.current = open
  }, [open])

  const loadPublicContributions = useCallback(async () => {
    if (refreshInFlightRef.current) {
      pendingRefreshRef.current = true
      return
    }

    refreshInFlightRef.current = true
    pendingRefreshRef.current = false

    try {
      const res = await fetch('/api/sponsorships', { cache: 'no-store' })
      const result = await res.json().catch(() => null)

      if (res.ok && result?.ok && Array.isArray(result.contributions)) {
        if (mountedRef.current) setPublicContributions(normalizeContributions(result.contributions))
        return
      }

      if (mountedRef.current) setPublicContributions(normalizeContributions(SPONSORSHIP_CONTRIBUTIONS))
    } catch {
      if (mountedRef.current) setPublicContributions(normalizeContributions(SPONSORSHIP_CONTRIBUTIONS))
    } finally {
      refreshInFlightRef.current = false
      if (pendingRefreshRef.current && mountedRef.current) {
        pendingRefreshRef.current = false
        void loadPublicContributions()
      }
    }
  }, [])

  useEffect(() => {
    void loadPublicContributions()
  }, [loadPublicContributions])

  useEffect(() => {
    clearPollingInterval()

    if (!open) return

    void loadPublicContributions()
    pollingIntervalRef.current = window.setInterval(() => {
      if (!mountedRef.current || !openRef.current) return
      void loadPublicContributions()
    }, hasRealtimeClient ? 15000 : 3000)

    return () => {
      clearPollingInterval()
    }
  }, [clearPollingInterval, hasRealtimeClient, loadPublicContributions, open])

  useEffect(() => {
    if (!supabasePublicClient) return undefined

    if (realtimeChannelRef.current) {
      void supabasePublicClient.removeChannel(realtimeChannelRef.current)
      realtimeChannelRef.current = null
    }

    const channel = supabasePublicClient
      .channel('sponsorship-public-contributions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sponsorship_public_contributions',
        },
        () => {
          void loadPublicContributions()
        }
      )
      .subscribe()

    realtimeChannelRef.current = channel

    return () => {
      if (realtimeChannelRef.current === channel) {
        realtimeChannelRef.current = null
      }
      void supabasePublicClient.removeChannel(channel)
    }
  }, [loadPublicContributions])

  const amountNumber = Number(String(form.amount).replace(/[^\d.]/g, '')) || 0

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = sp.errorName
    if (!CATEGORIES.includes(form.category)) e.category = sp.errorCategory
    if (!(amountNumber > 0)) e.amount = sp.errorAmount
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitError('')
    setStatus('sending')

    try {
      if (!RSVP_ENDPOINT) {
        throw new Error('Missing RSVP endpoint.')
      }

      const res = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSponsorshipPayload(form, lang)),
      })
      const result = await res.json().catch(() => null)

      if (!res.ok || !result?.ok) {
        throw new Error(result?.error || `HTTP ${res.status}`)
      }

      await loadPublicContributions()

      if (mountedRef.current) {
        setStatus('thanks')
      }
    } catch {
      if (mountedRef.current) {
        setStatus('idle')
        setSubmitError(sp.submitError)
      }
    }
  }

  const resetForm = () => {
    setForm({ name: '', category: '', amount: '', contact: '', message: '' })
    setErrors({})
    setSubmitError('')
    setStatus('idle')
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-paper-line bg-ivory shadow-card transition-[box-shadow,border-color,transform] duration-500 ease-editorial hover:shadow-lift active:scale-[0.99] md:min-h-[22rem] md:flex-row md:active:scale-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={pid}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden md:order-2 md:aspect-auto md:w-[48%]"
      >
        <Photo
          name="details-sponsors"
          alt={sp.title}
          className="absolute inset-0 h-full w-full"
          imgClassName={`${imgTreat} ${open ? 'scale-[1.03]' : ''}`}
        />
      </button>

      <div className="relative flex flex-1 flex-col justify-center p-8 sm:p-10 md:order-1 md:p-12">
        {/* Monograma K & D muy sutil */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-2 select-none font-serif text-[6rem] leading-none text-ink opacity-[0.035] sm:text-[8rem]"
        >
          K&nbsp;&amp;&nbsp;D
        </span>

        <div className="relative cursor-pointer" onClick={onToggle}>
          <p className="text-[10px] font-medium uppercase tracking-widest2 text-stone">{sp.summary}</p>
          <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-ink sm:text-3xl">
            {sp.title}
          </h3>
          <p className="mt-4 text-sm leading-loose text-ink/70 sm:text-base">{sp.preview}</p>
        </div>

        <ExpandPanel open={open} id={pid}>
          <div className="space-y-4 text-sm leading-loose text-ink/70 sm:text-base">
            {sp.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              {sp.availableTitle}
            </p>
            <div className="mt-4 space-y-5">
              {CATEGORIES.map((cat) => (
                <ProgressBar
                  key={cat}
                  category={cat}
                  contributions={publicContributions}
                  label={sp.categoryLabels[cat]}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              {sp.contributorsTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{sp.contributorsSubtitle}</p>

            {publicContributions.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-line/80 bg-ivory/70 px-4 py-4">
                <p className="text-sm italic text-stone">{sp.empty}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{sp.emptyNote}</p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-2xl border border-line/80 bg-ivory/70">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-line/70 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-muted">
                  <span>{sp.contributorsNameCol}</span>
                  <span className="text-right">{sp.contributorsDateCol}</span>
                </div>

                <div className="divide-y divide-line/60">
                  {publicContributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{contribution.name}</p>
                      </div>
                      <p className="text-right text-xs text-stone sm:text-sm">
                        {formatContributionDate(contribution.date, lang)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {status !== 'thanks' ? (
              <motion.div
                key="form"
                exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease: EASE }}
                className="rounded-2xl border border-line bg-card p-5 sm:p-6"
              >
                <h4 className="font-serif text-xl font-medium text-ink">{sp.formTitle}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{sp.formIntro}</p>

                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
                  <div>
                    <label htmlFor="sp-name" className="mb-2 block text-sm font-medium text-ink/80">
                      {sp.nameLabel}
                    </label>
                    <input
                      id="sp-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set('name')(e.target.value)}
                      placeholder={sp.namePlaceholder}
                      className={inputCls}
                    />
                    {errors.name && (
                      <p role="alert" className="mt-2 text-xs font-medium text-stone">{errors.name}</p>
                    )}
                  </div>

                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-ink/80">
                      {sp.categoryLabel}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const selected = form.category === cat
                        return (
                          <label
                            key={cat}
                            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-editorial ${
                              selected
                                ? 'border-paper bg-paper text-ink shadow-soft'
                                : 'border-line bg-ivory text-ink/70 hover:border-paper-line'
                            }`}
                          >
                            <input
                              type="radio"
                              name="sp-category"
                              value={cat}
                              checked={selected}
                              onChange={() => set('category')(cat)}
                              className="sr-only"
                            />
                            {sp.categoryLabels[cat]}
                          </label>
                        )
                      })}
                    </div>
                    {errors.category && (
                      <p role="alert" className="mt-2 text-xs font-medium text-stone">{errors.category}</p>
                    )}
                  </fieldset>

                  <div>
                    <label htmlFor="sp-amount" className="mb-2 block text-sm font-medium text-ink/80">
                      {sp.amountLabel}
                    </label>
                    <div className="relative">
                      <input
                        id="sp-amount"
                        type="text"
                        inputMode="numeric"
                        value={form.amount}
                        onChange={(e) => set('amount')(e.target.value)}
                        placeholder={sp.amountPlaceholder}
                        className={`${inputCls} pr-14`}
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-muted">
                        MXN
                      </span>
                    </div>
                    {errors.amount && (
                      <p role="alert" className="mt-2 text-xs font-medium text-stone">{errors.amount}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sp-contact" className="mb-2 block text-sm font-medium text-ink/80">
                      {sp.contactLabel}
                    </label>
                    <input
                      id="sp-contact"
                      type="text"
                      value={form.contact}
                      onChange={(e) => set('contact')(e.target.value)}
                      placeholder={sp.contactPlaceholder}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="sp-message" className="mb-2 block text-sm font-medium text-ink/80">
                      {sp.messageLabel}
                    </label>
                    <textarea
                      id="sp-message"
                      rows={2}
                      value={form.message}
                      onChange={(e) => set('message')(e.target.value)}
                      placeholder={sp.messagePlaceholder}
                      className={inputCls}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-paper px-8 py-3.5 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === 'sending' ? (
                      <>
                        {sp.sending}
                        <span aria-hidden="true" className="loader-track">
                          <span className="loader-seg" />
                        </span>
                      </>
                    ) : (
                      sp.submit
                    )}
                  </button>

                  {submitError && (
                    <p role="alert" className="text-sm leading-relaxed text-stone">
                      {submitError}
                    </p>
                  )}

                  {/* Datos para transferencia (solo informativo, no se envía) */}
                  <div className="rounded-2xl border border-paper-line bg-ivory p-5 shadow-soft sm:p-6">
                    <h4 className="font-serif text-lg font-medium text-ink">{sp.bank.title}</h4>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <dt className="text-xs font-medium uppercase tracking-widest2 text-stone">
                          {sp.bank.name}
                        </dt>
                        <dd className="text-ink sm:text-right">{BANK_TRANSFER.name}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <dt className="text-xs font-medium uppercase tracking-widest2 text-stone">
                          {sp.bank.bank}
                        </dt>
                        <dd className="text-ink sm:text-right">{BANK_TRANSFER.bank}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 border-t border-line pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <dt className="text-xs font-medium uppercase tracking-widest2 text-stone">
                          {sp.bank.clabe}
                        </dt>
                        <dd className="break-all font-mono text-[13px] tracking-tight text-ink sm:text-right sm:text-sm">
                          {BANK_TRANSFER.clabe}
                        </dd>
                      </div>
                    </dl>
                    <button
                      type="button"
                      onClick={copyBankDetails}
                      aria-live="polite"
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-paper-line bg-paper px-6 py-3 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none"
                    >
                      {bankCopied ? sp.bank.copied : sp.bank.copy}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="thanks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden rounded-2xl border border-paper-line bg-ivory p-8 text-center shadow-soft sm:p-10"
              >
                <Atmosphere />
                <div className="relative">
                  <motion.p
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="font-serif text-5xl font-medium text-ink/90 sm:text-6xl"
                  >
                    K <span className="font-normal italic text-stone">&amp;</span> D
                  </motion.p>
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                    className="mx-auto mt-6 block h-px w-14 origin-left bg-stone/40"
                  />
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.55 } } }}
                  >
                    <motion.h4
                      variants={successItem}
                      className="mt-6 font-serif text-2xl font-medium text-ink sm:text-3xl"
                    >
                      {sp.thanksTitle}
                    </motion.h4>
                    <motion.p
                      variants={successItem}
                      className="mx-auto mt-4 max-w-sm text-balance text-sm leading-relaxed text-ink/70"
                    >
                      {sp.thanksBody}
                    </motion.p>
                    <motion.p
                      variants={successItem}
                      className="mx-auto mt-3 max-w-sm text-balance text-sm leading-relaxed text-ink/60"
                    >
                      {sp.thanksSecondary}
                    </motion.p>
                    <motion.p
                      variants={successItem}
                      className="mt-5 font-serif text-base italic tracking-[0.12em] text-stone"
                    >
                      {sp.signature}
                    </motion.p>
                    <motion.div variants={successItem} className="mt-7 flex justify-center">
                      <button type="button" onClick={resetForm} className={ghostBtn}>
                        {sp.registerAnother}
                      </button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ExpandPanel>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={pid}
          className="group/link -mb-2 mt-7 inline-flex w-fit items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-widest2 text-stone transition-colors duration-300 hover:text-ink"
        >
          <span className="relative pb-1">
            {open ? t.details.close : t.details.seeDetails}
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 bg-stone/40 transition-transform duration-300 ease-editorial group-hover/link:scale-x-0" />
            <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-stone transition-transform duration-300 ease-editorial group-hover/link:scale-x-100" />
          </span>
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ease-editorial ${open ? 'rotate-180' : ''} group-hover/link:translate-y-0.5`}
          >
            ↓
          </span>
        </button>
      </div>
    </article>
  )
}
