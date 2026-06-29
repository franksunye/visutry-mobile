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
          bg: '#F7F7F7',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        btn: '24px',
        card: '16px',
        screen: '20px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
        float: '0 4px 12px rgba(0,0,0,0.06)',
        'float-lg': '0 8px 24px rgba(0,0,0,0.10)',
        brand: '0 8px 24px rgba(255,219,77,0.35)',
        pink: '0 4px 16px rgba(255,104,154,0.25)',
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
