/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── 品牌色 ──
        brand: {
          DEFAULT: '#FFDB4D',
          50: '#FFFBEA',
          100: '#FFF7D6',
          200: '#FFEFAD',
          300: '#FFE484',
          400: '#FFDB4D',
          500: '#FFD11A',
          600: '#E6B800',
          700: '#B39200',
          800: '#806B00',
          900: '#4D4000',
        },
        // ── 辅助色 ──
        lime: {
          DEFAULT: '#8BF44B',
        },
        pink: {
          DEFAULT: '#FF689A',
          light: '#FFB3CC',
          dark: '#E54E85',
        },
        // ── 中性色 ──
        ink: {
          DEFAULT: '#1A1A1A',
          primary: '#2B2B2B',
          secondary: '#666666',
          tertiary: '#ABABAB',
          border: '#EDEDED',
          bg: '#FFF7D6',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        btn: '12px',
        card: '16px',
        screen: '20px',
      },
      screens: {
        xs: '375px',
      },
      fontSize: {
        caption: ['11px', '1.4'],
      },
    },
  },
  plugins: [],
}
