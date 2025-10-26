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
        // 🎨 Primär färgpalett
        'cream': '#F7F4F1',           // Basvit / Bakgrund
        'navy': '#1F3C58',            // Marinblå (kontrast) - rubriker, logotyp
        'sand': '#DCCBB6',            // Sandbeige - sektioner
        'rose': '#EBCDC3',            // Puderrosa - accent i knappar
        'sky': '#A9D2DA',             // Pastellblå - länkar, accenter
        'butter': '#F5E7A1',          // Mjukt gult - detaljer
        
        // 💡 Komplementfärger
        'mint': '#CBE3CF',            // Mintgrön - diagram, ikoner
        'coral': '#F3B6A8',           // Ljus korall - CTA hover
        'gray-soft': '#D9D9D9',       // Mjukt grå - linjer
        'graphite': '#3A3A3A',        // Grafitgrå - brödtext
        
        // Semantic colors
        'background': '#F7F4F1',
        'text': '#3A3A3A',
        'text-heading': '#1F3C58',
        'primary': '#1F3C58',
        'secondary': '#EBCDC3',
        'accent': '#A9D2DA',
        
        // Legacy compatibility (mapped to new colors)
        'primary-navy': '#1F3C58',
        'accent-pink': '#EBCDC3',
        'accent-orange': '#F3B6A8',
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

