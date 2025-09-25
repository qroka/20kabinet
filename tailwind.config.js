/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'mono': ['var(--font-roboto-mono)', 'monospace'],
      },
      colors: {
        // Основная цветовая схема
        'primary': {
          'black': '#0A0A0A',
          'dark-gray': '#1A1A1A',
          'charcoal': '#2D2D2D',
          'light-gray': '#404040',
        },
        'text': {
          'white': '#FFFFFF',
          'gray': '#B3B3B3',
          'light-gray': '#E5E5E5',
        },
        'accent': {
          'orange': '#FF6B35',
          'orange-hover': '#E55A2B',
          'orange-light': '#FF8A65',
        },
        'status': {
          'success': '#00FF41',
          'warning': '#FFB800',
          'error': '#FF4444',
          'info': '#00BFFF',
        },
        // Статусы компьютеров
        'computer': {
          'free': '#00FF41',
          'occupied': '#FF6B35',
          'maintenance': '#FFB800',
          'offline': '#666666',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-green': '0 0 20px rgba(0, 255, 65, 0.3)',
        'glow-red': '0 0 20px rgba(255, 68, 68, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 191, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
