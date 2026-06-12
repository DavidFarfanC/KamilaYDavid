/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fondos — 70% marfil, 20% neutros cálidos
        ivory: '#FAF8F2', // fondo primario
        cream: '#F5F0E8', // fondo secundario
        card: '#F8F5EF', // fondo de tarjeta
        line: '#E5DDD2', // bordes finos

        // Texto — 8% gris-marrones suaves
        ink: '#4A433D', // texto primario
        stone: '#7D746B', // texto secundario
        muted: '#9C948B', // texto atenuado

        // Botones de papel de lujo
        paper: {
          DEFAULT: '#E8E0D2',
          hover: '#DDD2C1',
          line: '#D7CEC2',
        },

        // Acentos — 2% (manzanilla cálida + verde botánico muy limitado)
        chamomile: {
          DEFAULT: '#F4D98B',
          soft: '#FAF0D4',
        },
        leaf: '#4F6B4A', // verde botánico — solo hojas y detalles florales
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -16px rgba(74, 67, 61, 0.10)',
        card: '0 6px 24px -10px rgba(74, 67, 61, 0.08)',
        lift: '0 24px 60px -24px rgba(74, 67, 61, 0.14)',
      },
      letterSpacing: {
        widest2: '0.3em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
