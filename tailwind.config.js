/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        500: '500px',
        1210: '1210px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
