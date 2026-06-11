import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/** Aparece con fade + desplazamiento + blur sutil al entrar en viewport. */
export default function Reveal({ children, delay = 0, y = 28, blur = true, className = '', as = 'div' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div

  return (
    <Tag
      className={className}
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y, filter: blur ? 'blur(10px)' : 'none' }
      }
      whileInView={
        reduce
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: blur ? 'blur(0px)' : 'none' }
      }
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}
