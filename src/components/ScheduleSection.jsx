import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import { BranchDivider } from './FloatingBotanicalElements'

const icons = [
  // Ceremonia: anillos
  <path key="i" d="M9 14a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm6 5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM9.5 5 8 2.5h2.5L12 5" />,
  // Recepción: copas brindando
  <path key="i" d="M7 3 5 9a3 3 0 0 0 6 0L9 3H7Zm1 9v8m-3 0h6M17 3l-2 6a3 3 0 0 0 6 0l-2-6h-2Zm1 9v8m-3 0h6" />,
  // Comida: cubiertos
  <path key="i" d="M7 3v7a2 2 0 0 0 2 2v9M7 3v5m4-5v7a2 2 0 0 1-2 2M11 3v5m6-5c-1.5 1-2.5 3-2.5 5.5 0 2 1 3 2.5 3V21V3Z" />,
  // Fotos: cámara
  <path key="i" d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm8 9.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  // Celebración: nota musical
  <path key="i" d="M9 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0 0V5l11-2v13.5m0 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM9 9l11-2" />,
  // Cierre: corazón
  <path key="i" d="M12 20.5S4 15 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 5.5-8 11-8 11Z" />,
]

export default function ScheduleSection() {
  const { t } = useLang()

  return (
    <section className="relative bg-palm-mist/70 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium text-ink sm:text-5xl">{t.schedule.title}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-sm text-ink/60 sm:text-base">{t.schedule.subtitle}</p>
            <BranchDivider className="mx-auto mt-8" />
          </Reveal>
        </div>

        <ol className="relative mx-auto mt-16 max-w-2xl">
          {/* Línea vertical */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[27px] top-2 w-px bg-gradient-to-b from-palm/10 via-palm/35 to-palm/10 sm:left-1/2"
          />

          {t.schedule.items.map((item, i) => (
            <li key={item.time} className="relative">
              <Reveal delay={0.05 * i}>
                <div
                  className={`flex gap-5 py-7 sm:items-center sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Nodo con icono */}
                  <div className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full border border-palm/20 bg-ivory shadow-soft sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-palm"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {icons[i]}
                    </svg>
                  </div>

                  {/* Tarjeta */}
                  <div
                    className={`flex-1 sm:w-[calc(50%-3rem)] sm:flex-none ${
                      i % 2 === 0 ? 'sm:mr-auto sm:pr-2 sm:text-right' : 'sm:ml-auto sm:pl-2'
                    }`}
                  >
                    <div className="rounded-2xl border border-sand/50 bg-ivory/90 p-5 shadow-card">
                      <p className="font-serif text-lg italic text-honey">{item.time}</p>
                      <h3 className="mt-1 font-serif text-xl font-medium text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
