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
        'primary-blue': '#003366',
        'light-blue': '#e6f0ff',
        'text-dark': '#003366',
        'text-gray': '#6b7280',
        'success': '#10b981',
        'background-white': '#ffffff',
        'background-off-white': '#fbfbfa',
        'error': '#dc3545',
        'warning': '#ffc107',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 51, 102, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 51, 102, 0.12)',
        'dropdown': '0 4px 20px rgba(0, 51, 102, 0.15)',
        'soft': '0 1px 3px rgba(0, 51, 102, 0.05)',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'in': 'in 0.2s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' 
          },
          '50%': { 
            boxShadow: '0 10px 15px -3px rgb(59 130 246 / 0.2), 0 4px 6px -4px rgb(59 130 246 / 0.2)' 
          },
        },
        'in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
export default config

