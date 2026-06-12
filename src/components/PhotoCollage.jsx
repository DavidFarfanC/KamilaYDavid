import Photo from './Photo'
import Reveal from './Reveal'

/**
 * Galería editorial.
 * - Móvil: secuencia vertical cinematográfica — imágenes grandes a una columna,
 *   con anchos y alineaciones alternadas para dar ritmo de revista (no cuadrícula).
 * - Desktop (sm+): collage de tamaños mixtos con rotaciones sutiles y hover.
 */
const items = [
  { name: 'gallery-1', rotate: '-rotate-2', span: 'sm:col-span-3 sm:row-span-2', aspect: 'aspect-[4/5]', mobile: 'w-full' },
  { name: 'gallery-2', rotate: 'rotate-1', span: 'sm:col-span-2', aspect: 'aspect-[3/4]', mobile: 'w-[86%] ml-auto' },
  { name: 'gallery-3', rotate: '-rotate-1', span: 'sm:col-span-2', aspect: 'aspect-[3/4]', mobile: 'w-[86%] mr-auto' },
  { name: 'gallery-4', rotate: 'rotate-2', span: 'sm:col-span-2', aspect: 'aspect-[3/4]', mobile: 'w-[86%] ml-auto' },
  { name: 'gallery-5', rotate: '-rotate-1', span: 'sm:col-span-2', aspect: 'aspect-[3/4]', mobile: 'w-[86%] mr-auto' },
  { name: 'gallery-6', rotate: 'rotate-1', span: 'sm:col-span-3 sm:row-span-2', aspect: 'aspect-[4/5]', mobile: 'w-full' },
]

export default function PhotoCollage({ alts = [] }) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-7 sm:gap-6">
      {items.map((item, i) => (
        <Reveal
          key={item.name}
          delay={0.08 * i}
          className={`${item.span} ${i === 1 || i === 4 ? 'sm:mt-12' : ''}`}
        >
          <div
            className={`${item.rotate} ${item.mobile} group rounded-2xl bg-white p-2 pb-5 shadow-card transition-all duration-500 ease-editorial hover:rotate-0 hover:shadow-lift sm:w-full sm:rounded-3xl sm:p-3 sm:pb-8`}
          >
            <Photo
              name={item.name}
              alt={alts[i] || ''}
              className={`${item.aspect} rounded-xl sm:rounded-2xl`}
              imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Reveal>
      ))}
    </div>
  )
}
