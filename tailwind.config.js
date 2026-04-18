/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Support element-level dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tells Tailwind to scan your React components
  ],
  theme: {
    extend: {
      colors: {
        'bukka-green': '#128C7E', // WhatsApp native, Trust
        'bukka-orange': '#E65100', // Appetite, Speed, CTAs
        bukka: {
          orange: '#FA6131',
          cyan: '#2CD6EB',
          'dark-surface': '#171B26',
          'card-surface': '#262C3A',
          'soft-white': '#E9ECF1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, modern sans-serif
      }
    },
  },
  plugins: [],
}