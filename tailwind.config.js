/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './pages/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#f0f4f8', // Light slate grey/blue tint
        'dark-paper': '#1a1a1a', // Dark theme background
        'ink': '#333333', // Text color
        'light-ink': '#777777', // Lighter text color
        'highlight': '#4361ee', // Highlight/accent color
        'success': '#4ade80', // Success color
        'warning': '#fbbf24', // Warning color
        'danger': '#f87171', // Danger/error color
        'shadow': 'rgba(0, 0, 0, 0.1)', // Shadow color
      },
      fontFamily: {
        'typewriter': ['"Special Elite"', 'cursive'],
        'sans': ['Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 2px 5px rgba(0, 0, 0, 0.16), 0 2px 4px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
      },
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
      backgroundImage: {
        'paper-texture': "url('/img/paper-texture.png')",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
} 