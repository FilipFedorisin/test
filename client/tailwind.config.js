/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '400px',
        // => @media (min-width: 992px) { ... }
      },
    },
    colors: {
      ...colors,
      main: {
        light: '#04d1e0',
        weak: '#04d1e02f',
        DEFAULT: '#00afb9',
        dark: '#107d85',
        easy: '#b4e1e4',
      },
      dark: {
        DEFAULT: '#292F36',
      },
      blur: {
        light: '#04d1e0',
        DEFAULT: 'rgba(128, 128, 128, 0.422)',
        dark: '#b4e1e4',
      },
    },
  },
  plugins: [],
}
