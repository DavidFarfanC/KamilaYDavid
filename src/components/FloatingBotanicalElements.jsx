/**
 * Flores de manzanilla y hojas decorativas que flotan suavemente.
 * Decorativas: aria-hidden y sin interacción. La animación se desactiva
 * automáticamente con prefers-reduced-motion (ver index.css).
 */

export function Chamomile({ className = '', size = 44 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="11"
          rx="4.2"
          ry="9"
          fill="#FBF9F3"
          stroke="#EAE2D2"
          strokeWidth="0.6"
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="6.5" fill="#F4D98B" />
      <circle cx="24" cy="24" r="6.5" fill="none" stroke="#E3C46F" strokeWidth="0.8" />
    </svg>
  )
}

export function Leaf({ className = '', size = 40, color = '#4F6B4A' }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      <path
        d="M20 36C8 28 6 14 20 4c14 10 12 24 0 32Z"
        fill={color}
        opacity="0.16"
      />
      <path d="M20 7v26" stroke={color} strokeWidth="0.9" opacity="0.35" />
      <path
        d="M20 13c-3 1-5 3-6 6M20 13c3 1 5 3 6 6M20 21c-3 1-5 3-6 6M20 21c3 1 5 3 6 6"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.3"
      />
    </svg>
  )
}

export function BranchDivider({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 24"
      fill="none"
      className={className}
      width="160"
      height="24"
    >
      <path d="M8 12h54M98 12h54" stroke="#A67C52" strokeWidth="0.8" opacity="0.5" />
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx="80"
            cy="6.5"
            rx="2"
            ry="4.5"
            fill="#FBF9F3"
            stroke="#E3D8C2"
            strokeWidth="0.5"
            transform={`rotate(${deg} 80 12)`}
          />
        ))}
        <circle cx="80" cy="12" r="3" fill="#F4D98B" />
      </g>
    </svg>
  )
}

/** Capa de elementos flotantes para una sección. variant: 'hero' | 'soft' */
export default function FloatingBotanicalElements({ variant = 'soft' }) {
  if (variant === 'hero') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Chamomile size={52} className="absolute left-[6%] top-[16%] opacity-70 animate-float-slow" />
        <Chamomile size={34} className="absolute right-[10%] top-[24%] opacity-60 animate-float-slower" />
        <Chamomile size={28} className="absolute left-[14%] bottom-[20%] opacity-50 animate-float-slower" />
        <Leaf size={46} color="#FAF8F2" className="absolute right-[6%] bottom-[26%] opacity-70 animate-sway" />
        <Leaf size={34} color="#FAF8F2" className="absolute left-[40%] top-[10%] opacity-50 animate-float-slow" />
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Chamomile size={40} className="absolute -left-2 top-[12%] opacity-50 animate-float-slow" />
      <Chamomile size={26} className="absolute right-[4%] top-[40%] opacity-40 animate-float-slower" />
      <Leaf size={44} className="absolute right-[2%] bottom-[14%] animate-sway" />
      <Leaf size={30} className="absolute left-[3%] bottom-[30%] animate-float-slower" />
    </div>
  )
}
