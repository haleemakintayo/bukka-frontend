/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tells Tailwind to scan your React components
  ],
  theme: {
    extend: {
      colors: {
        'bukka-green': '#128C7E', // WhatsApp native, Trust
        'bukka-orange': '#E65100', // Appetite, Speed, CTAs
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, modern sans-serif
      }
    },
  },
  plugins: [],
}