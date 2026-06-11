import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { GOOGLE_MAPS_URL, REGISTRY_URL, LODGING_OPTIONS } from '../config'
import ExpandableInfoCard from './ExpandableInfoCard'
import Reveal from './Reveal'

const icon = (d) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
)

const ICONS = {
  location: icon('M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'),
  transport: icon('M5 17H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3m-12 7a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m0 0h6m4 0h1a1 1 0 0 0 1-1v-3.3a1 1 0 0 0-.2-.6l-2.2-2.7a1 1 0 0 0-.8-.4H17v6m2 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'),
  registry: icon('M20 12v9H4v-9m16-5H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-8 0v14m0-14S9.5 3 7.5 3A2.5 2.5 0 0 0 7.5 8M12 7s2.5-4 4.5-4a2.5 2.5 0 0 1 0 5'),
  lodging: icon('M3 21V8l9-5 9 5v13M9 21v-6h6v6M3 11h18'),
  dressCode: icon('M12 4a2 2 0 0 1-2-2H7l2 5-3.5 3L8 12v9h8v-9l2.5-2L15 7l2-5h-3a2 2 0 0 1-2 2Z'),
  kids: icon('M12 21.5S4 16 4 10.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 8 2.5c0 5.5-8 11-8 11ZM9 5l.8-2M15 5l-.8-2M12 4V2'),
}

const linkBtn =
  'mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper-hover'

export default function DetailsCardsSection() {
  const { t } = useLang()
  const [openCard, setOpenCard] = useState(null)
  const toggle = (key) => setOpenCard((cur) => (cur === key ? null : key))
  const c = t.details.cards

  return (
    <section id="detalles" className="relative overflow-hidden bg-ivory px-6 py-32 sm:py-44">
      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <Reveal>
            <h2 className="text-balance font-serif text-4xl font-medium text-ink sm:text-5xl">
              {t.details.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-sm text-ink/60 sm:text-base">{t.details.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-5">
          <Reveal>
            <ExpandableInfoCard
              title={c.location.title}
              summary={c.location.summary}
              icon={ICONS.location}
              open={openCard === 'location'}
              onToggle={() => toggle('location')}
            >
              <p className="font-medium text-ink/85">{c.location.address}</p>
              <p className="mt-3">{c.location.text}</p>
              <p className="mt-3">{c.location.extra}</p>
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                {t.details.openMaps}
                <span aria-hidden="true">↗</span>
              </a>
            </ExpandableInfoCard>
          </Reveal>

          <Reveal delay={0.05}>
            <ExpandableInfoCard
              title={c.transport.title}
              summary={c.transport.summary}
              icon={ICONS.transport}
              open={openCard === 'transport'}
              onToggle={() => toggle('transport')}
            >
              <p>{c.transport.text}</p>
            </ExpandableInfoCard>
          </Reveal>

          <Reveal delay={0.1}>
            <ExpandableInfoCard
              title={c.registry.title}
              summary={c.registry.summary}
              icon={ICONS.registry}
              open={openCard === 'registry'}
              onToggle={() => toggle('registry')}
            >
              <p>{c.registry.text}</p>
              <a href={REGISTRY_URL} target="_blank" rel="noopener noreferrer" className={linkBtn}>
                {t.details.seeRegistry}
                <span aria-hidden="true">↗</span>
              </a>
            </ExpandableInfoCard>
          </Reveal>

          <Reveal delay={0.15}>
            <ExpandableInfoCard
              title={c.lodging.title}
              summary={c.lodging.summary}
              icon={ICONS.lodging}
              open={openCard === 'lodging'}
              onToggle={() => toggle('lodging')}
            >
              <p>{c.lodging.text}</p>
              <ul className="mt-4 space-y-3">
                {LODGING_OPTIONS.map((opt) => (
                  <li key={opt.name} className="rounded-2xl bg-cream px-4 py-3">
                    <p className="font-medium text-ink/85">
                      {opt.url ? (
                        <a
                          href={opt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-line underline-offset-2 hover:text-ink"
                        >
                          {opt.name}
                        </a>
                      ) : (
                        opt.name
                      )}
                    </p>
                    <p className="text-xs text-ink/55">{opt.note}</p>
                  </li>
                ))}
              </ul>
            </ExpandableInfoCard>
          </Reveal>

          <Reveal delay={0.2}>
            <ExpandableInfoCard
              title={c.dressCode.title}
              summary={c.dressCode.summary}
              icon={ICONS.dressCode}
              open={openCard === 'dressCode'}
              onToggle={() => toggle('dressCode')}
            >
              <p>{c.dressCode.text}</p>
              <p className="mt-3 rounded-2xl bg-chamomile-soft px-4 py-3 font-medium text-ink/80">
                {c.dressCode.note}
              </p>
            </ExpandableInfoCard>
          </Reveal>

          <Reveal delay={0.25}>
            <ExpandableInfoCard
              title={c.kids.title}
              summary={c.kids.summary}
              icon={ICONS.kids}
              open={openCard === 'kids'}
              onToggle={() => toggle('kids')}
            >
              <p>{c.kids.text}</p>
            </ExpandableInfoCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
