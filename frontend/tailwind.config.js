/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./index.html", "./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      spacing:{
        25: '6.25rem',
      },
    },
  },

  plugins: [],
}
