/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#ff8a00',
          light: '#fff4eb',
          dark: '#1a1a1a',
          gray: '#f5f5f5',
          text: '#666666'
        }
      },
      borderRadius: {
        'blob': '40% 60% 70% 30% / 40% 50% 60% 50%',
      }
    }
  },
  plugins: [],
}
