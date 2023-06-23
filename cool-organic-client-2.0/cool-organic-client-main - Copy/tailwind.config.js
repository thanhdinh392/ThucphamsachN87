/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryColor: '#91ad41',
        secondaryColor: '#ff8a6c',
        thirdColor: '#0d6efd',
        borderColor: '#ebebeb',
        textColor: '#707070',
      },
      screens: {
        lg: '1025px',
        desktop: '1440px',
        '3xl': '1700px',
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
};
