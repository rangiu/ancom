/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#F5F5F7',
          darkBg: '#0A0A0C',
          card: 'rgba(255, 255, 255, 0.82)',
          darkCard: 'rgba(24, 24, 27, 0.82)',
          text: '#1D1D1F',
          darkText: '#F5F5F7',
          secondary: '#86868B',
          accent: '#0071E3',
          accentHover: '#0077ED',
          rice: '#FF9F0A',
          riceLight: '#FFF6E5',
          notYet: '#FF453A',
          notYetLight: '#FFECEB',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        appleCard: '0 12px 32px 0 rgba(0, 0, 0, 0.04), 0 2px 6px 0 rgba(0, 0, 0, 0.02)',
        appleCardDark: '0 12px 32px 0 rgba(0, 0, 0, 0.4), 0 2px 6px 0 rgba(255, 255, 255, 0.02)',
        glowRice: '0 8px 24px -4px rgba(255, 159, 10, 0.35)',
        glowNotYet: '0 8px 24px -4px rgba(255, 69, 58, 0.35)',
      },
      backdropBlur: {
        apple: '20px',
      },
    },
  },
  plugins: [],
};
