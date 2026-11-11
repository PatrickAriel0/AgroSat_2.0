/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#050c05',
          'bg-alt': '#0a150a',
          'bg-card': '#0d1f0d',
          'bg-elevated': '#122613',
          border: 'rgba(74, 222, 128, 0.14)',
          'border-light': 'rgba(74, 222, 128, 0.28)',
          primary: '#4ade80',
          'primary-hover': '#22c55e',
          'primary-dark': '#16a34a',
          'text-title': '#e8f5e8',
          'text-body': '#b8d4b8',
          'text-muted': '#5c8a5c',
          danger: '#ef4444',
          accent: '#f59e0b',
        },
        agro: {
          bg: '#050c05',
          card: '#0d1f0d',
          border: 'rgba(74, 222, 128, 0.18)',
          primary: '#4ade80',
          'primary-light': '#86efac',
          secondary: '#052e16',
          text: '#b8d4b8',
          white: '#e8f5e8',
          muted: '#8fb98f',
          accent: '#f59e0b',
        }
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
