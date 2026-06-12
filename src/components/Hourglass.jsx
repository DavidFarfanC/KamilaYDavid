import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Reloj de arena de trazo fino, estilo grabado en papelería fina.
 * Líneas taupe, sin relleno; un hilo de arena cae muy sutilmente en el cuello.
 * Decorativo (aria-hidden) y quieto con prefers-reduced-motion.
 */
export default function Hourglass({ size = 44, className = '' }) {
  const reduce = useReducedMotion()

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={{ opacity: 0.65 }}
    >
      <g stroke="#7D746B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {/* Las dos cámaras de cristal */}
        <path d="M13 7H35L24 24Z" />
        <path d="M13 41H35L24 24Z" />
        {/* Niveles de arena, muy tenues */}
        <path d="M17.5 13H30.5" strokeOpacity="0.45" />
        <path d="M19 41Q24 35 29 41" strokeOpacity="0.45" />
      </g>
      {/* Grano de arena que desciende por el cuello */}
      {!reduce && (
        <motion.circle
          cx="24"
          r="0.8"
          fill="#7D746B"
          initial={{ cy: 25, opacity: 0 }}
          animate={{ cy: [25, 34], opacity: [0, 0.7, 0] }}
          transition={{ duration: 2.6, ease: EASE, repeat: Infinity }}
        />
      )}
    </svg>
  )
}
