import { useId, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'

function FAQItem({ item, open, onToggle }) {
  const panelId = useId()
  const reduce = useReducedMotion()

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-serif text-lg font-medium text-ink sm:text-xl">{item.q}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          className="flex-none text-xl font-light text-stone"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-8 text-sm leading-loose text-ink/65">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const { t } = useLang()
  const [open, setOpen] = useState(null)

  return (
    <section className="bg-cream px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
            {t.faq.title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-12 rounded-3xl border border-line bg-ivory px-6 py-2 shadow-soft sm:px-10">
            {t.faq.items.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                open={open === i}
                onToggle={() => setOpen((cur) => (cur === i ? null : i))}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
