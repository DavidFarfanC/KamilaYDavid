import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import PhotoCollage from './PhotoCollage'

export default function GallerySection() {
  const { t } = useLang()

  return (
    <section className="relative overflow-hidden bg-cream px-6 py-32 sm:py-44">
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
            {t.gallery.title}
          </h2>
        </Reveal>
        <div className="mt-20">
          <PhotoCollage alts={t.gallery.alts} />
        </div>
      </div>
    </section>
  )
}
