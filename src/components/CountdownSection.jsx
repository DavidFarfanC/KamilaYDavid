import { useLang } from '../i18n/LanguageContext'
import { useCountdown } from '../hooks/useCountdown'
import { WEDDING_DATE } from '../config'
import Reveal from './Reveal'
import { Chamomile } from './FloatingBotanicalElements'

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-5xl font-medium tabular-nums text-ink sm:text-7xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.18em] text-stone sm:text-xs sm:tracking-widest2">
        {label}
      </span>
    </div>
  )
}

export default function CountdownSection() {
  const { t } = useLang()
  const { total, days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  return (
    <section className="relative bg-ivory px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Chamomile size={36} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-balance font-serif text-3xl font-medium text-ink sm:text-4xl">
            {t.countdown.title}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          {total > 0 ? (
            <div
              role="timer"
              aria-live="off"
              className="mx-auto mt-12 grid max-w-xl grid-cols-4 items-start gap-2 rounded-3xl border border-line bg-card px-4 py-10 shadow-soft sm:gap-6 sm:px-10"
            >
              <Unit value={days} label={t.countdown.days} />
              <Unit value={hours} label={t.countdown.hours} />
              <Unit value={minutes} label={t.countdown.minutes} />
              <Unit value={seconds} label={t.countdown.seconds} />
            </div>
          ) : (
            <p className="mt-12 font-serif text-3xl italic text-ink">{t.countdown.arrived}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
