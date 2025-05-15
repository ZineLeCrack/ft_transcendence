/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./index.html", "./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      boxShadow: {
        'gradient': `
          0 0 5px rgba(255,0,122,0.8),
          0 0 10px rgba(255,0,122,0.6),
          0 0 15px rgba(0,255,255,0.5),
          0 0 20px rgba(0,255,255,0.3)
        `,
       },
    },
  },

  plugins: [],
}
