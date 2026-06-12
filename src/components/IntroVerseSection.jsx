import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import Atmosphere from './Atmosphere'
import { SectionAtmosphere, Divider } from './Monogram'

/** Divide el versículo en frases para revelarlas una a una, en cualquier idioma. */
function splitSentences(text) {
  const parts = []
  let buffer = ''
  for (const word of text.split(' ')) {
    buffer += (buffer ? ' ' : '') + word
    if (/[.;]["”“]?$/.test(word) && buffer.length > 40) {
      parts.push(buffer)
      buffer = ''
    }
  }
  if (buffer) parts.push(buffer)
  return parts
}

export default function IntroVerseSection() {
  const { t } = useLang()
  const lines = splitSentences(t.verse.text)

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-36 sm:py-48">
      <SectionAtmosphere />
      <Atmosphere />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <Divider className="mb-12" />
        </Reveal>

        <blockquote className="text-balance font-serif text-2xl font-normal italic leading-relaxed text-ink sm:text-[2.15rem] sm:leading-[1.65]">
          {lines.map((line, i) => (
            <Reveal key={line} as="span" delay={0.15 + i * 0.3} className="block">
              {line}
              {i < lines.length - 1 && <span className="block h-4" aria-hidden="true" />}
            </Reveal>
          ))}
        </blockquote>

        <Reveal delay={0.3}>
          <p className="mt-8 text-xs font-medium uppercase tracking-widest2 text-stone">
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
