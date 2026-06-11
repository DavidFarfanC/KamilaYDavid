import Photo from './Photo'
import Reveal from './Reveal'

/**
 * Collage editorial: tamaños mixtos, rotaciones sutiles y hover en desktop.
 * En mobile fluye como una secuencia vertical de dos columnas con ritmo.
 */
const items = [
  { name: 'gallery-1', rotate: '-rotate-2', span: 'col-span-2 sm:col-span-3 sm:row-span-2', aspect: 'aspect-[4/5]' },
  { name: 'gallery-2', rotate: 'rotate-1', span: 'col-span-1 sm:col-span-2', aspect: 'aspect-[3/4]' },
  { name: 'gallery-3', rotate: '-rotate-1', span: 'col-span-1 sm:col-span-2', aspect: 'aspect-[3/4]' },
  { name: 'gallery-4', rotate: 'rotate-2', span: 'col-span-1 sm:col-span-2', aspect: 'aspect-[3/4]' },
  { name: 'gallery-5', rotate: '-rotate-1', span: 'col-span-1 sm:col-span-2', aspect: 'aspect-[3/4]' },
  { name: 'gallery-6', rotate: 'rotate-1', span: 'col-span-2 sm:col-span-3 sm:row-span-2', aspect: 'aspect-[4/5]' },
]

export default function PhotoCollage({ alts = [] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-7 sm:gap-6">
      {items.map((item, i) => (
        <Reveal
          key={item.name}
          delay={0.08 * i}
          className={`${item.span} ${i === 1 || i === 4 ? 'sm:mt-12' : ''}`}
        >
          <div
            className={`${item.rotate} group rounded-2xl bg-white p-2 pb-5 shadow-card transition-all duration-500 hover:rotate-0 hover:shadow-lift sm:rounded-3xl sm:p-3 sm:pb-8`}
          >
            <Photo
              name={item.name}
              alt={alts[i] || ''}
              className={`${item.aspect} rounded-xl sm:rounded-2xl`}
              imgClassName="transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>
      ))}
    </div>
  )
}
