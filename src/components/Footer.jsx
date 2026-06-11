import { useLang } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-palm px-6 py-16 text-center text-ivory">
      <p className="font-serif text-3xl font-medium">Kamila &amp; David</p>
      <p className="mt-3 text-sm text-ivory/80">
        {t.footer.date} · {t.footer.place}
      </p>

      <a
        href="#rsvp"
        className="mt-8 inline-block rounded-full border border-ivory/40 bg-ivory/10 px-8 py-3 text-sm font-medium text-ivory backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-ivory hover:text-palm"
      >
        {t.footer.cta}
      </a>

      <p className="mx-auto mt-10 max-w-sm text-balance font-serif text-base italic leading-relaxed text-ivory/70">
        {t.footer.note}
      </p>

      <p aria-hidden="true" className="mt-8 font-serif text-sm tracking-[0.35em] text-chamomile">
        K &amp; D
      </p>
    </footer>
  )
}
