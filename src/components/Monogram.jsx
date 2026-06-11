/**
 * Sistema de monograma de papelería de lujo (sin flores).
 *
 * - SectionAtmosphere: marca de agua gigante "K & D" (opacidad 4%) detrás del
 *   contenido, con un lavado de acuarela cálido apenas perceptible. La sección
 *   contenedora debe ser `relative overflow-hidden` y el contenido `relative z-10`.
 * - Divider: separador editorial mínimo (línea fina · rombo · línea fina),
 *   monocromático, reemplaza a los separadores florales.
 */

export function SectionAtmosphere({ text = 'K & D', className = '' }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Lavado de acuarela cálido, casi imperceptible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 50% 32%, rgba(232,224,210,0.22), transparent 70%)',
        }}
      />
      {/* Monograma como marca de agua de papelería */}
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif font-medium leading-none text-ink opacity-[0.04] ${className}`}
        style={{ fontSize: 'clamp(11rem, 38vw, 32rem)' }}
      >
        {text}
      </span>
    </div>
  )
}

export function Divider({ className = '' }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-line" />
      <span className="h-1 w-1 rotate-45 bg-stone/40" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-line" />
    </div>
  )
}
