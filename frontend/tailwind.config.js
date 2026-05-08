/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#161622',
        surfaceLight: '#242436',
        primary: '#7b2cbf',
        primaryLight: '#9d4edd',
        accent: '#00f5d4',
        textMain: '#ffffff',
        textMuted: '#9ca3af'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
