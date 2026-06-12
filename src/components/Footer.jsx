import { useLang } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="border-t border-line bg-cream px-6 py-16 text-center text-ink">
      <p className="font-serif text-3xl font-medium">Kamila &amp; David</p>
      <p className="mt-3 text-sm text-stone">
        {t.footer.date} · {t.footer.place}
      </p>

      <a
        href="#rsvp"
        className="mt-8 inline-block rounded-full border border-paper-line bg-transparent px-8 py-3 text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:-translate-y-px hover:bg-paper/30 active:translate-y-0 active:bg-paper/40"
      >
        {t.footer.cta}
      </a>

      <p className="mx-auto mt-10 max-w-sm text-balance font-serif text-base italic leading-relaxed text-stone">
        {t.footer.note}
      </p>

      <p aria-hidden="true" className="mt-8 font-serif text-sm tracking-[0.35em] text-muted">
        K &amp; D
      </p>
    </footer>
  )
}
