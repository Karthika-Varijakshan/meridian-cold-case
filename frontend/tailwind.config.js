/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0D1016',
        card: '#161B22',
        cardHover: '#1C232D',
        surface: '#121720',
        borderDark: '#232B36',
        accentGold: {
          DEFAULT: '#C9902E',
          glow: 'rgba(201, 144, 46, 0.25)',
          hover: '#E0A33B',
        },
        accentBlue: {
          DEFAULT: '#3FA9A0',
          glow: 'rgba(63, 169, 160, 0.25)',
          hover: '#4EC4BA',
        },
        accentRed: {
          DEFAULT: '#D15B5B',
          glow: 'rgba(209, 91, 91, 0.25)',
          hover: '#E06C6C',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        goldGlow: '0 0 15px rgba(201, 144, 46, 0.3)',
        blueGlow: '0 0 15px rgba(63, 169, 160, 0.3)',
      }
    },
  },
  plugins: [],
}
