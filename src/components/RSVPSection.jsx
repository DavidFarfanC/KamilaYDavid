import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { WHATSAPP_NUMBER, RSVP_ENDPOINT } from '../config'
import Reveal from './Reveal'
import { Chamomile } from './FloatingBotanicalElements'

const inputCls =
  'w-full rounded-2xl border border-sand bg-ivory px-4 py-3 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-palm focus:outline-none'

function RadioGroup({ legend, name, value, onChange, options }) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-ink/80">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
              value === opt.value
                ? 'border-palm bg-palm text-ivory shadow-soft'
                : 'border-sand bg-ivory text-ink/70 hover:border-honey/50'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function RSVPSection() {
  const { t } = useLang()
  const r = t.rsvp

  const [form, setForm] = useState({
    name: '',
    guests: 1,
    attendance: '',
    transport: '',
    comments: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = r.errorName
    if (!form.attendance) e.attendance = r.errorAttendance
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const labels = {
    yes: r.attendanceYes,
    no: r.attendanceNo,
    tYes: r.transportYes,
    tNo: r.transportNo,
    tMaybe: r.transportMaybe,
  }

  const buildWhatsAppUrl = () => {
    const attendance = form.attendance === 'yes' ? labels.yes : labels.no
    const transport =
      form.transport === 'yes' ? labels.tYes : form.transport === 'no' ? labels.tNo : labels.tMaybe
    const msg = r.waBody(form.name.trim(), form.guests, attendance, transport, form.comments.trim())
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
  }

  const submitViaWhatsApp = () => {
    if (!validate()) return
    window.open(buildWhatsAppUrl(), '_blank', 'noopener')
    setStatus('success')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (!RSVP_ENDPOINT) {
      submitViaWhatsApp()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          guests: form.guests,
          attendance: form.attendance,
          transport: form.transport || 'n/a',
          comments: form.comments.trim(),
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="rsvp" className="bg-ivory px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <Chamomile size={48} className="mx-auto mb-6" />
          <p className="text-balance font-serif text-3xl font-medium italic leading-snug text-palm sm:text-4xl">
            {form.attendance === 'no' ? r.successNo : r.success}
          </p>
          <p className="mt-8 font-serif text-lg tracking-[0.2em] text-honey">K &amp; D</p>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="bg-ivory px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-xl">
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
            className="mt-12 space-y-7 rounded-3xl border border-sand/60 bg-sand-soft/40 p-6 shadow-soft sm:p-10"
          >
            <div>
              <label htmlFor="rsvp-name" className="mb-2 block text-sm font-medium text-ink/80">
                {r.nameLabel}
              </label>
              <input
                id="rsvp-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                placeholder={r.namePlaceholder}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                className={inputCls}
              />
              {errors.name && (
                <p id="rsvp-name-error" role="alert" className="mt-2 text-xs font-medium text-honey">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="rsvp-guests" className="mb-2 block text-sm font-medium text-ink/80">
                {r.guestsLabel}
              </label>
              <select
                id="rsvp-guests"
                value={form.guests}
                onChange={(e) => set('guests')(Number(e.target.value))}
                className={inputCls}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <RadioGroup
                legend={r.attendanceLabel}
                name="attendance"
                value={form.attendance}
                onChange={set('attendance')}
                options={[
                  { value: 'yes', label: r.attendanceYes },
                  { value: 'no', label: r.attendanceNo },
                ]}
              />
              {errors.attendance && (
                <p role="alert" className="mt-2 text-xs font-medium text-honey">
                  {errors.attendance}
                </p>
              )}
            </div>

            <RadioGroup
              legend={r.transportLabel}
              name="transport"
              value={form.transport}
              onChange={set('transport')}
              options={[
                { value: 'yes', label: r.transportYes },
                { value: 'no', label: r.transportNo },
                { value: 'maybe', label: r.transportMaybe },
              ]}
            />

            <div>
              <label htmlFor="rsvp-comments" className="mb-2 block text-sm font-medium text-ink/80">
                {r.commentsLabel}
              </label>
              <textarea
                id="rsvp-comments"
                rows={3}
                value={form.comments}
                onChange={(e) => set('comments')(e.target.value)}
                placeholder={r.commentsPlaceholder}
                className={inputCls}
              />
            </div>

            {status === 'error' && (
              <p role="alert" className="rounded-2xl bg-chamomile-soft px-4 py-3 text-sm text-ink/80">
                {r.errorSend}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full bg-palm px-8 py-4 text-sm font-medium text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-palm-soft hover:shadow-lift disabled:cursor-wait disabled:opacity-60"
              >
                {status === 'sending' ? r.sending : r.submit}
              </button>
              {RSVP_ENDPOINT && (
                <button
                  type="button"
                  onClick={submitViaWhatsApp}
                  className="w-full rounded-full border border-honey/40 px-8 py-4 text-sm font-medium text-honey transition-all duration-300 hover:border-honey hover:bg-chamomile-soft/40"
                >
                  {r.submitWhatsApp}
                </button>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
