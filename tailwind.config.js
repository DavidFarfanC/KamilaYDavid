/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Acento principal cálido (chocolate / luz de atardecer)
        palm: {
          DEFAULT: '#D2691E',
          hover: '#B85C1A',
          active: '#A0522D',
          soft: '#C4815B',
          mist: '#F6EBDD',
        },
        sand: {
          DEFAULT: '#DCCDB5',
          soft: '#EFE7D8',
        },
        chamomile: {
          DEFAULT: '#F4D98B',
          soft: '#FAF0D4',
        },
        ivory: '#FAF8F2',
        honey: {
          DEFAULT: '#A67C52',
          soft: '#C4A074',
        },
        // Verde botánico de apoyo — solo para hojas y detalles florales
        leaf: '#4F6B4A',
        ink: '#3D4438',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(160, 82, 45, 0.16)',
        card: '0 6px 24px -8px rgba(166, 124, 82, 0.18)',
        lift: '0 24px 60px -20px rgba(61, 68, 56, 0.25)',
      },
      letterSpacing: {
        widest2: '0.3em',
      },
    },
  },
  plugins: [],
}
