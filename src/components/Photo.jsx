import { photoUrl } from '../photos'
import { useLang } from '../i18n/LanguageContext'

/**
 * Imagen con fallback elegante.
 * - name: nombre del archivo sin extensión (ej. "hero-1")
 * - alt: texto alternativo (obligatorio para fotos reales)
 */
export default function Photo({ name, alt = '', className = '', imgClassName = '', eager = false }) {
  const { t } = useLang()
  const url = photoUrl(name)

  if (!url) {
    return (
      <div
        role="img"
        aria-label={alt || t.placeholder}
        className={`flex items-center justify-center bg-gradient-to-br from-cream via-ivory to-chamomile-soft ${className}`}
      >
        <div className="text-center px-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mx-auto mb-2 h-7 w-7 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="m4 18 5-5 3 3 4-4 4 4" />
          </svg>
          <p className="font-serif italic text-stone text-sm">{t.placeholder}</p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">{name}.jpg</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={url}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
