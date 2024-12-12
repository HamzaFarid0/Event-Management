/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '335px',
        'xs' : '420px',
        'xs2' :'542px',
      },
    },
  },
  plugins: [],
}

