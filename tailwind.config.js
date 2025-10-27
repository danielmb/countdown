/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backroundImage: {
        'snow-pattern': "url('/art/snowpattern.png')",
      },
    },
  },
  plugins: [],
};
