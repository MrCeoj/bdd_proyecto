/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
      'back': '#0A0A14',
      'front': '#141427',
      'text': '#EBF4FF',
      'detail': '#9635F1',
      'accent': '#F6CD82',
      'secondary': '#0B4DA2',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        inria: ['Inria Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}