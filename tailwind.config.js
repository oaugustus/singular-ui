'use strict';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,html}', './demo/**/*.{js,html}'],
  darkMode: 'class',
  safelist: require('./tailwind.safelist.json'),
  theme: {
    extend: {},
  },
  plugins: [],
};
