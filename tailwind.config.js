/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2b2d2f",
        "secondary": "#cc5500"
      }
    },
  },
  plugins: [],
}

