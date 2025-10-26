import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from design manual
        'primary-navy': '#0B214A',
        'accent-pink': '#e8903d',
        'accent-orange': '#F68B1F',
        'neutral-white': '#FFFFFF',
        'neutral-off-white': '#F9F8F5',
        
        // Legacy colors for backward compatibility
        'primary-blue': '#0B214A',
        'light-blue': '#e6f0ff',
        'text-dark': '#0B214A',
        'text-gray': '#6b7280',
        'success': '#10b981',
        'background-white': '#ffffff',
        'background-off-white': '#F9F8F5',
        'error': '#dc3545',
        'warning': '#ffc107',
      },
      fontSize: {
        // Heading scale - per design manual
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        // Body text
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(11, 33, 74, 0.12)',
        'dropdown': '0 4px 20px rgba(11, 33, 74, 0.15)',
        'soft': '0 1px 3px rgba(11, 33, 74, 0.05)',
      },
      borderRadius: {
        'card': '8px',
        'button': '8px',
        'input': '8px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      spacing: {
        // 8px increment spacing per design system
        'section': '64px',
        'section-sm': '32px',
      },
      animation: {
        'pulse-soft': 'pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'in': 'in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
          },
          '50%': { 
            boxShadow: '0 10px 15px -3px rgb(11 33 74 / 0.2), 0 4px 6px -4px rgb(11 33 74 / 0.2)' 
          },
        },
        'in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
export default config

