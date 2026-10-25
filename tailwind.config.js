/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#F7DDE2',
        ivory: '#FFF9F5',
        petal: '#E9A5B5',
        burgundy: '#4B1728',
        champagne: '#D7B77A',
        plum: '#21131F',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        hand: ['Caveat', '"Segoe Print"', '"Bradley Hand"', 'cursive'],
      },
    },
  },
  plugins: [],
}
