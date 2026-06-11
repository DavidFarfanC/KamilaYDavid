/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        palm: {
          DEFAULT: '#4F6B4A',
          soft: '#6B8465',
          mist: '#EEF2EC',
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
        ink: '#3D4438',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(79, 107, 74, 0.16)',
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
