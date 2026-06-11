import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import { Divider } from './Monogram'

export default function VisionSection() {
  const { t } = useLang()

  return (
    <section className="bg-ivory px-6 py-32 sm:py-48">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Divider className="mb-12" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-balance font-serif text-2xl font-normal leading-relaxed text-ink sm:text-4xl sm:leading-[1.5]">
            {t.vision.text}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
