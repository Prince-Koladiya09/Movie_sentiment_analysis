/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#ebe3d9',
          300: '#d9cdbf',
          400: '#b8a994',
          500: '#9a8b78',
          600: '#7a6d5e',
          700: '#5c524a',
          800: '#3d3632',
          900: '#1f1b19',
        },
        accent: {
          coral: '#e07a5f',
          sage: '#81b29a',
          blue: '#5b8fb9',
          amber: '#e6a54a',
          plum: '#8b5cf6',
          rose: '#e05c8c',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
        'soft': '0 2px 8px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
