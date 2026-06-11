import { useId } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/**
 * Tarjeta desplegable accesible (acordeón animado).
 * children = contenido expandido.
 */
export default function ExpandableInfoCard({ title, summary, icon, open, onToggle, children }) {
  const panelId = useId()
  const buttonId = useId()
  const reduce = useReducedMotion()

  return (
    <div
      className={`overflow-hidden rounded-3xl border bg-ivory transition-all duration-500 ${
        open ? 'border-palm/30 shadow-lift' : 'border-sand/60 shadow-card hover:border-honey/40'
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-full transition-colors duration-300 ${
            open ? 'bg-palm text-ivory' : 'bg-palm-mist text-palm'
          }`}
        >
          {icon}
        </span>
        <span className="flex-1">
          <span className="block font-serif text-xl font-medium text-ink">{title}</span>
          <span className="mt-0.5 block text-xs uppercase tracking-widest text-honey/80">{summary}</span>
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
          className="text-2xl font-light text-palm"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-7 text-sm leading-loose text-ink/70 sm:pl-[5.25rem] sm:pr-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
