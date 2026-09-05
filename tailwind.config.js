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
        'neo-yellow': '#FFE600',
        'neo-green': '#25D366',
        'neo-cream': '#FAF7EE',
        'neo-pink': '#FF80BF',
        'neo-purple': '#C084FC',
        bukka: {
          orange: '#FA6131',
          cyan: '#2CD6EB',
          'dark-surface': '#121620',
          'card-surface': '#1C2230',
          'soft-white': '#FAF7EE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
        'neo-white': '4px 4px 0px 0px #ffffff',
        'neo-cyan': '4px 4px 0px 0px #2CD6EB',
        'neo-orange': '4px 4px 0px 0px #FA6131',
      }
    },
  },
  plugins: [],
}