import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import { BranchDivider } from './FloatingBotanicalElements'

export default function IntroVerseSection() {
  const { t } = useLang()

  return (
    <section className="relative bg-ivory px-6 py-24 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <BranchDivider className="mx-auto mb-10" />
        </Reveal>

        <Reveal delay={0.15}>
          <blockquote className="text-balance font-serif text-2xl font-normal italic leading-relaxed text-ink sm:text-[2rem] sm:leading-[1.6]">
            {t.verse.text}
          </blockquote>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-8 text-xs font-medium uppercase tracking-widest2 text-palm">
            {t.verse.reference}
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mx-auto mt-14 max-w-xl text-balance text-sm leading-loose text-ink/70 sm:text-base">
            {t.verse.closing}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
