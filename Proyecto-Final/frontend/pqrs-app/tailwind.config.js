/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D81B60',
        secondary: '#CDDC39',
        tertiary: '#4DB6AC',
        accent: '#6A1B9A',
        danger: '#C62828'
      }
    },
  },
  plugins: [],
}
