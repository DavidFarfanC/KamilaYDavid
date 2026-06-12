import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { WHATSAPP_NUMBER, RSVP_ENDPOINT } from '../config'
import { buildRsvpPayload } from '../rsvpPayload'
import Reveal from './Reveal'
import Atmosphere from './Atmosphere'
import RSVPBorderTrace from './RSVPBorderTrace'
import { SectionAtmosphere } from './Monogram'

const EASE = [0.22, 1, 0.36, 1]

const inputCls =
  'w-full rounded-2xl border border-line bg-ivory px-4 py-3 text-sm text-ink placeholder:text-muted transition-all duration-300 ease-editorial focus:border-paper-line focus:outline-none focus:ring-4 focus:ring-paper/40'

const paperBtn =
  'group/btn inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none active:bg-paper-hover'

const btnArrow =
  'transition-transform duration-300 ease-editorial group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const successItem = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
}

function Field({ label, htmlFor, error, errorId, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink/80">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-stone">
          {error}
        </p>
      )}
    </div>
  )
}

/** Grupo de opciones. variant 'pills' (cortas) o 'stack' (filas, para textos largos). */
function ChoiceGroup({ legend, name, value, onChange, options, variant = 'pills', error }) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-ink/80">{legend}</legend>
      <div className={variant === 'stack' ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'}>
        {options.map((opt) => {
          const selected = value === opt.value
          return (
            <label
              key={opt.value}
              className={
                variant === 'stack'
                  ? `flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-300 ease-editorial ${
                      selected
                        ? 'border-paper bg-paper text-ink shadow-soft'
                        : 'border-line bg-ivory text-ink/70 hover:border-paper-line'
                    }`
                  : `cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ease-editorial ${
                      selected
                        ? 'border-paper bg-paper text-ink shadow-soft'
                        : 'border-line bg-ivory text-ink/70 hover:border-paper-line'
                    }`
              }
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {variant === 'stack' && (
                <span
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 flex-none rounded-full border transition-colors duration-300 ${
                    selected ? 'border-stone bg-stone' : 'border-line'
                  }`}
                />
              )}
              {opt.label}
            </label>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-stone">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export default function RSVPSection() {
  const { t, lang } = useLang()
  const r = t.rsvp

  const [form, setForm] = useState({
    names: '',
    attendance: '',
    shuttle: '',
    lodging: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.names.trim()) e.names = r.errorNames
    if (!form.attendance) e.attendance = r.errorAttendance
    if (!form.email.trim()) e.email = r.errorEmail
    else if (!EMAIL_RE.test(form.email.trim())) e.email = r.errorEmailInvalid
    // El teléfono es requerido solo cuando confirma asistencia
    if (form.attendance === 'yes' && !form.phone.trim()) e.phone = r.errorPhone
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Etiquetas legibles para el mensaje de WhatsApp; las opcionales sin responder usan "—"
  const resolved = () => ({
    names: form.names.trim(),
    attendance: form.attendance === 'yes' ? r.attendanceYes : r.attendanceNo,
    shuttle: { yes: r.shuttleYes, no: r.shuttleNo, maybe: r.shuttleMaybe }[form.shuttle] || r.none,
    lodging:
      { shared: r.lodgingShared, own: r.lodgingOwn, unsure: r.lodgingUnsure }[form.lodging] || r.none,
    email: form.email.trim(),
    phone: form.phone.trim() || r.none,
    message: form.message.trim() || r.none,
  })

  const buildWhatsAppUrl = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(r.waBody(resolved()))}`

  const openWhatsApp = () => window.open(buildWhatsAppUrl(), '_blank', 'noopener')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    // Duración mínima del sello: deja que la línea recorra todo el contorno
    const minTrace = new Promise((res) => setTimeout(res, 1500))
    try {
      const work = RSVP_ENDPOINT
        ? fetch(RSVP_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildRsvpPayload(form, lang)),
          }).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
          })
        : Promise.resolve()
      await Promise.all([work, minTrace])
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="rsvp" className="relative overflow-hidden bg-ivory px-6 py-32 sm:py-44">
      <SectionAtmosphere />
      {status === 'success' && <Atmosphere />}

      <div className="relative z-10 mx-auto max-w-xl">
        <AnimatePresence mode="wait">
          {status !== 'success' ? (
            <motion.div
              key="form"
              exit={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="text-center">
                <Reveal>
                  <h2 className="font-serif text-4xl font-medium text-ink sm:text-5xl">{r.title}</h2>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-ink/60 sm:text-base">
                    {r.subtitle}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.25}>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative mt-12 space-y-7 rounded-3xl border border-line bg-card p-6 shadow-soft sm:p-10"
                >
                  <RSVPBorderTrace active={status === 'sending'} radius={24} />
                  {/* 1 · Nombres de los asistentes */}
                  <Field
                    label={r.namesLabel}
                    htmlFor="rsvp-names"
                    error={errors.names}
                    errorId="rsvp-names-error"
                  >
                    <textarea
                      id="rsvp-names"
                      rows={2}
                      value={form.names}
                      onChange={(e) => set('names')(e.target.value)}
                      placeholder={r.namesPlaceholder}
                      aria-invalid={!!errors.names}
                      aria-describedby={errors.names ? 'rsvp-names-error' : undefined}
                      className={inputCls}
                    />
                  </Field>

                  {/* 2 · Confirmación de asistencia */}
                  <ChoiceGroup
                    legend={r.attendanceLabel}
                    name="attendance"
                    value={form.attendance}
                    onChange={set('attendance')}
                    error={errors.attendance}
                    options={[
                      { value: 'yes', label: r.attendanceYes },
                      { value: 'no', label: r.attendanceNo },
                    ]}
                  />

                  {/* 3 · Shuttle desde CDMX (opcional) */}
                  <ChoiceGroup
                    legend={r.shuttleLabel}
                    name="shuttle"
                    variant="stack"
                    value={form.shuttle}
                    onChange={set('shuttle')}
                    options={[
                      { value: 'yes', label: r.shuttleYes },
                      { value: 'no', label: r.shuttleNo },
                      { value: 'maybe', label: r.shuttleMaybe },
                    ]}
                  />

                  {/* 4 · Hospedaje / Airbnb (opcional) */}
                  <ChoiceGroup
                    legend={r.lodgingLabel}
                    name="lodging"
                    variant="stack"
                    value={form.lodging}
                    onChange={set('lodging')}
                    options={[
                      { value: 'shared', label: r.lodgingShared },
                      { value: 'own', label: r.lodgingOwn },
                      { value: 'unsure', label: r.lodgingUnsure },
                    ]}
                  />

                  {/* Nota discreta de coordinación */}
                  <p className="text-xs leading-relaxed text-muted">{r.coordinationNote}</p>

                  {/* 5 · Correo electrónico */}
                  <Field
                    label={r.emailLabel}
                    htmlFor="rsvp-email"
                    error={errors.email}
                    errorId="rsvp-email-error"
                  >
                    <input
                      id="rsvp-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set('email')(e.target.value)}
                      placeholder={r.emailPlaceholder}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'rsvp-email-error' : undefined}
                      className={inputCls}
                    />
                  </Field>

                  {/* 6 · WhatsApp */}
                  <Field
                    label={r.phoneLabel}
                    htmlFor="rsvp-phone"
                    error={errors.phone}
                    errorId="rsvp-phone-error"
                  >
                    <input
                      id="rsvp-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set('phone')(e.target.value)}
                      placeholder={r.phonePlaceholder}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'rsvp-phone-error' : undefined}
                      className={inputCls}
                    />
                  </Field>

                  {/* 7 · Mensaje para los novios (opcional) */}
                  <Field label={r.messageLabel} htmlFor="rsvp-message">
                    <textarea
                      id="rsvp-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => set('message')(e.target.value)}
                      placeholder={r.messagePlaceholder}
                      className={inputCls}
                    />
                  </Field>

                  {status === 'error' && (
                    <p role="alert" className="rounded-2xl bg-chamomile-soft px-4 py-3 text-sm text-ink/80">
                      {r.errorSend}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="flex w-full items-center justify-center gap-3 rounded-full bg-paper px-8 py-4 text-sm font-medium text-ink shadow-soft transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper-hover hover:shadow-card active:translate-y-0 active:shadow-none active:bg-paper-hover disabled:cursor-wait disabled:opacity-80"
                    >
                      {status === 'sending' ? (
                        <>
                          {r.sending}
                          <span aria-hidden="true" className="loader-track">
                            <span className="loader-seg" />
                          </span>
                        </>
                      ) : (
                        r.submit
                      )}
                    </button>
                  </div>
                </form>
              </Reveal>
            </motion.div>
          ) : (
            <MotionConfig reducedMotion="user">
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mx-auto max-w-xl text-center"
              >
                {/* Monograma grande y suave */}
                <motion.p
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="font-serif text-6xl font-medium text-ink/90 sm:text-7xl"
                >
                  K <span className="font-normal italic text-stone">&amp;</span> D
                </motion.p>

                {/* Divisor que se dibuja de izquierda a derecha */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                  className="mx-auto mt-8 block h-px w-16 origin-left bg-stone/40"
                />

                {/* Texto en secuencia */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.6 } } }}
                >
                  <motion.h2
                    variants={successItem}
                    className="mt-8 font-serif text-3xl font-medium text-ink sm:text-4xl"
                  >
                    {r.successTitle}
                  </motion.h2>
                  <motion.p
                    variants={successItem}
                    className="mx-auto mt-6 max-w-md text-balance text-sm leading-relaxed text-ink/70 sm:text-base"
                  >
                    {form.attendance === 'no' ? r.successBodyNo : r.successBody}
                  </motion.p>
                  <motion.p
                    variants={successItem}
                    className="mt-8 font-serif text-lg italic tracking-[0.12em] text-stone"
                  >
                    {r.signature}
                  </motion.p>

                  {/* Handoff de WhatsApp, sin abrir nada de golpe */}
                  <motion.div variants={successItem} className="mt-10">
                    <button type="button" onClick={openWhatsApp} className={paperBtn}>
                      {r.sendWhatsApp}
                      <span aria-hidden="true" className={btnArrow}>↗</span>
                    </button>
                    <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed text-muted">
                      {r.waHandoff}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </MotionConfig>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
