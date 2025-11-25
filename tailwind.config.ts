import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdfbf7',
          100: '#f9f3e8',
          200: '#f2e5cc',
          300: '#e8d3a5',
          400: '#d4b875',
          500: '#c9a961',  // Main champagne gold - matches logo
          600: '#b8954d',
          700: '#9a7a3e',
          800: '#7d6335',
          900: '#66512d',
          950: '#3a2e1a',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2,6,23,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
