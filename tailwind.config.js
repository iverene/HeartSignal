/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#ed5d55',
        ghostWhite: '#fffafa'
      },
      fontFamily: {
        inter: ['Inter_400Regular'], 
        sans: ['Inter_400Regular'], 
      }
    },
  },
  plugins: [],
}