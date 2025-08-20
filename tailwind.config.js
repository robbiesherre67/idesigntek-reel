// tailwind.config.js (ESM)
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#0b0b0c',
        mist: '#e7e7ec',
        accent: '#8affc1'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.25)'
      }
    }
  },
  plugins: []
}