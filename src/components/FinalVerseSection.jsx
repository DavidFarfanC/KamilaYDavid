import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import Photo from './Photo'

export default function FinalVerseSection() {
  const { t } = useLang()

  return (
    <section className="bg-ivory">
      {/* Versículo sobre marfil, reverente y amplio */}
      <div className="px-6 pb-20 pt-28 text-center sm:pb-28 sm:pt-40">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-balance font-serif text-3xl font-medium italic leading-snug text-ink sm:text-5xl sm:leading-[1.35]">
              {t.finalVerse.text}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-xs font-medium uppercase tracking-widest2 text-stone">
              {t.finalVerse.reference}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Foto B/N corriendo hacia el mar, con la firma sobre el agua */}
      <div className="relative">
        <Photo
          name="final-verse"
          alt={t.finalVerse.photoAlt}
          className="h-[55vh] min-h-[360px] w-full sm:h-[70vh]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ivory via-transparent to-ink/45"
        />
        <div className="absolute inset-x-0 bottom-0 pb-14 text-center sm:pb-20">
          <Reveal delay={0.15}>
            <p className="px-6 font-serif text-xl italic text-ivory drop-shadow-[0_1px_8px_rgba(61,68,56,0.45)] sm:text-2xl">
              {t.finalVerse.signature}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
