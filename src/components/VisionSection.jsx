import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import { BranchDivider } from './FloatingBotanicalElements'

export default function VisionSection() {
  const { t } = useLang()

  return (
    <section className="bg-ivory px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <BranchDivider className="mx-auto mb-12" />
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
