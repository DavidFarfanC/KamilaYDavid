/**
 * Partículas atmosféricas: polvo flotando en luz cálida de tarde.
 * - CSS puro (transform/opacity), sin canvas, sin coste de layout.
 * - Opacidad bajísima: se perciben como aire, no como adorno.
 * - Se ocultan por completo con prefers-reduced-motion, y en móvil
 *   solo se muestra la mitad (las marcadas como `desktop` aparecen en sm+).
 */

const PARTICLES = [
  { left: '8%', top: '22%', size: 3, color: 'rgba(250,248,242,0.4)', dur: 19, delay: 0 },
  { left: '21%', top: '64%', size: 2, color: 'rgba(244,217,139,0.25)', dur: 23, delay: 4 },
  { left: '36%', top: '34%', size: 2, color: 'rgba(166,124,82,0.12)', dur: 27, delay: 9, desktop: true },
  { left: '49%', top: '76%', size: 3, color: 'rgba(250,248,242,0.4)', dur: 21, delay: 2, desktop: true },
  { left: '58%', top: '18%', size: 2, color: 'rgba(244,217,139,0.25)', dur: 25, delay: 12 },
  { left: '71%', top: '52%', size: 2, color: 'rgba(166,124,82,0.12)', dur: 18, delay: 6, desktop: true },
  { left: '83%', top: '30%', size: 3, color: 'rgba(250,248,242,0.4)', dur: 24, delay: 10 },
  { left: '91%', top: '68%', size: 2, color: 'rgba(244,217,139,0.25)', dur: 22, delay: 15, desktop: true },
]

export default function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`animate-drift absolute rounded-full blur-[1px] ${
            p.desktop ? 'hidden sm:block' : ''
          }`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.dur}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
