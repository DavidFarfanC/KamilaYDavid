import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { useCountdown } from '../hooks/useCountdown'
import { WEDDING_DATE } from '../config'
import Reveal from './Reveal'
import Hourglass from './Hourglass'
import { SectionAtmosphere } from './Monogram'

const EASE = [0.22, 1, 0.36, 1]

function Unit({ value, label }) {
  const reduce = useReducedMotion()
  const text = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      {/* Las cifras entrante y saliente comparten celda para fundirse sin saltos */}
      <span className="grid font-serif text-5xl font-medium tabular-nums text-ink sm:text-7xl">
        <AnimatePresence initial={false}>
          <motion.span
            key={text}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: 'blur(3px)' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="col-start-1 row-start-1"
          >
            {text}
          </motion.span>
        </AnimatePresence>
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
    <section className="relative overflow-hidden bg-ivory px-6 py-32 sm:py-44">
      <SectionAtmosphere />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <Hourglass size={44} className="mx-auto mb-6 sm:h-12 sm:w-12" />
          <h2 className="text-balance font-serif text-3xl font-medium text-ink sm:text-4xl">
            {t.countdown.title}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          {total > 0 ? (
            <div
              role="timer"
              aria-live="off"
              className="mx-auto mt-12 grid max-w-xl grid-cols-2 items-start gap-x-2 gap-y-10 rounded-3xl border border-line bg-card px-4 py-10 shadow-soft min-[420px]:grid-cols-4 sm:gap-6 sm:px-10"
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
