import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Traza una línea de luz cálida que recorre todo el contorno del formulario al
 * enviar, como una carta que se sella. SVG con stroke-dashoffset normalizado
 * (pathLength=1) para que funcione idéntico en cualquier tamaño/móvil.
 * Respeta el border-radius (rx) y se oculta con prefers-reduced-motion.
 *
 * @param {boolean} active - true durante el estado de envío
 * @param {number} radius - radio de las esquinas en px (debe igualar al del form)
 */
export default function RSVPBorderTrace({ active, radius = 24 }) {
  if (!active) return null
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full motion-reduce:hidden"
      fill="none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="rsvp-trace-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A67C52" stopOpacity="0" />
          <stop offset="0.45" stopColor="#A67C52" />
          <stop offset="0.75" stopColor="#F3E8D8" />
          <stop offset="1" stopColor="#F3E8D8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx={radius}
        ry={radius}
        stroke="url(#rsvp-trace-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        initial={{ strokeDashoffset: 1, opacity: 0 }}
        animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0.9] }}
        transition={{ duration: 1.5, ease: EASE }}
      />
    </svg>
  )
}
